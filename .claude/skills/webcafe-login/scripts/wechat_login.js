#!/usr/bin/env node
/*
 * Web.Cafe (new.web.cafe) — personal-WeChat QR login -> saves a reusable session.
 * Pure curl + Node, no browser.
 *
 * Flow (Auth.js / NextAuth):
 *   GET  /api/auth/csrf                                   -> csrfToken (+ csrf cookie)
 *   GET  /api/auth/generatePersonalWechatLoginQRCode      -> { token, qrcode_url }
 *        ?callbackUrl=%2F&origin=https://new.web.cafe
 *   (user scans qrcode_url with WeChat, taps 确认登录)
 *   GET  /api/auth/checkPersonalWechatLogin?token=TOKEN   -> { loggedIn, openid, msg }
 *   POST /api/auth/callback/personal-wechat               -> sets session cookie
 *        form: csrfToken, callbackUrl, code=<openid>, json=true     (field is `code`)
 *   GET  /api/auth/session                                -> { user: { ..., is_vip } }
 *
 * Output files in WORKDIR (default /tmp/webcafe):
 *   qr.png         the QR image to send to the user
 *   status.json    { state: starting|waiting|completing|ok|timeout|error, qr_version, token, user, msg }
 *   session.jar    curl cookie jar with the session   (use: curl -b session.jar ...)
 *   session.json   the logged-in user object
 */
'use strict';
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BASE = 'https://new.web.cafe';
const WORKDIR = process.env.WEBCAFE_WORKDIR || '/tmp/webcafe';
const JAR = path.join(WORKDIR, 'session.jar');
const QR = path.join(WORKDIR, 'qr.png');
const STATUS = path.join(WORKDIR, 'status.json');
const SESSION = path.join(WORKDIR, 'session.json');
const TIMEOUT_MS = (Number(process.env.WEBCAFE_TIMEOUT) || 300) * 1000;
const REFRESH_MS = 110 * 1000; // regenerate QR if still waiting this long

fs.mkdirSync(WORKDIR, { recursive: true });

// curl wrapper. -k tolerates this environment's TLS-intercepting egress proxy.
function curl(args) {
  return execFileSync('curl', ['-sS', '-k', '-m', '25', ...args], {
    encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
  });
}
function curlJSON(args) {
  const out = curl(args);
  try { return JSON.parse(out); } catch (e) { return { __raw: out, __parseError: true }; }
}

let status = { state: 'starting', qr_version: 0, token: null, msg: '', ts: Date.now() };
function writeStatus(extra) {
  status = { ...status, ...extra, ts: Date.now() };
  fs.writeFileSync(STATUS + '.tmp', JSON.stringify(status, null, 2));
  fs.renameSync(STATUS + '.tmp', STATUS);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let csrfToken = null;
function getCsrf() {
  const j = curlJSON(['-c', JAR, `${BASE}/api/auth/csrf`]);
  csrfToken = j && j.csrfToken;
  if (!csrfToken) throw new Error('failed to get csrfToken: ' + JSON.stringify(j).slice(0, 200));
}
function genQR() {
  const url = `${BASE}/api/auth/generatePersonalWechatLoginQRCode?callbackUrl=%2F&origin=${encodeURIComponent(BASE)}`;
  const j = curlJSON(['-b', JAR, '-c', JAR, url]);
  if (!j || !j.qrcode_url || !j.token) throw new Error('generate QR failed: ' + JSON.stringify(j).slice(0, 200));
  curl(['-b', JAR, '-o', QR, j.qrcode_url]); // download the PNG
  status.qr_version = (status.qr_version || 0) + 1;
  return j.token;
}
function check(token) {
  return curlJSON(['-b', JAR, `${BASE}/api/auth/checkPersonalWechatLogin?token=${encodeURIComponent(token)}`]);
}
function complete(openid) {
  let code = openid;
  try { code = decodeURIComponent(openid); } catch (e) { /* openid is raw base64; keep as-is */ }
  curl([
    '-b', JAR, '-c', JAR, '-o', path.join(WORKDIR, 'callback.out'),
    '-X', 'POST', `${BASE}/api/auth/callback/personal-wechat`,
    '-H', 'Content-Type: application/x-www-form-urlencoded',
    '--data-urlencode', `csrfToken=${csrfToken}`,
    '--data-urlencode', `callbackUrl=${BASE}/`,
    '--data-urlencode', `code=${code}`,
    '--data-urlencode', 'json=true',
  ]);
  return curlJSON(['-b', JAR, `${BASE}/api/auth/session`]);
}

(async () => {
  try {
    fs.rmSync(JAR, { force: true });
    writeStatus({ state: 'starting', msg: '初始化' });
    getCsrf();

    const tokens = [genQR()];           // remember every token we issue (handles QR refresh races)
    let qrBornAt = Date.now();
    writeStatus({ state: 'waiting', token: tokens[tokens.length - 1], qr: QR, msg: '等待扫码' });

    const deadline = Date.now() + TIMEOUT_MS;
    while (Date.now() < deadline) {
      for (const t of tokens) {
        const r = check(t);
        if (r && r.loggedIn === true && r.openid) {
          writeStatus({ state: 'completing', msg: '扫码成功，正在换取会话' });
          const sess = complete(r.openid);
          if (sess && sess.user) {
            fs.writeFileSync(SESSION, JSON.stringify(sess, null, 2));
            writeStatus({ state: 'ok', user: sess.user, msg: '登录成功' });
            console.log('OK: logged in as', sess.user.name, '| vip=', sess.user.is_vip);
            return;
          }
          writeStatus({ state: 'error', msg: 'callback 未换到会话(检查 code 字段/ token 是否过期)' });
          return;
        }
      }
      if (Date.now() - qrBornAt > REFRESH_MS) {
        tokens.push(genQR());
        if (tokens.length > 4) tokens.shift();
        qrBornAt = Date.now();
        writeStatus({ state: 'waiting', token: tokens[tokens.length - 1], qr: QR, msg: '二维码已刷新，请重扫' });
      }
      await sleep(2500);
    }
    writeStatus({ state: 'timeout', msg: '超时未完成扫码' });
    process.exitCode = 1;
  } catch (e) {
    writeStatus({ state: 'error', msg: String(e && e.message) });
    process.exitCode = 1;
  }
})();
