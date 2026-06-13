---
name: webcafe-login
description: >-
  Log in to Web.Cafe (new.web.cafe, "哥飞的朋友们") via personal-WeChat QR scan and save a
  reusable session, then read member/paid (VIP) articles. Use when the user wants to log
  into new.web.cafe / web.cafe, "扫码登录" there, or read its paid / VIP / member-only content.
---

# Web.Cafe WeChat-QR Login

Logs into `new.web.cafe` using the **个人微信登录** (personal-WeChat) QR flow and saves a
reusable session. Pure `curl` + Node — **no browser / Chromium needed**, so it is fast to
set up in a fresh container.

Let `SKILL` = the directory containing this `SKILL.md`. Runtime files are written to
`WEBCAFE_WORKDIR` (default `/tmp/webcafe`); call it `WORKDIR` below.

## When to use
- The user asks to log into new.web.cafe / web.cafe, or to "扫码登录".
- The user wants to read paid / VIP / member-only articles there.

## How it works (reverse-engineered Auth.js / NextAuth flow)
1. `GET /api/auth/csrf` → `csrfToken` (+ csrf cookie saved in the jar)
2. `GET /api/auth/generatePersonalWechatLoginQRCode?callbackUrl=%2F&origin=https://new.web.cafe`
   → `{ token, qrcode_url }`  (qrcode_url is a PNG encoding `…/auth/personalWechatLogin/<token>`)
3. User scans `qrcode_url` with WeChat and taps **确认登录**
4. Poll `GET /api/auth/checkPersonalWechatLogin?token=<token>` → `{ loggedIn, openid, msg }`
5. `POST /api/auth/callback/personal-wechat`  (form: `csrfToken`, `callbackUrl`,
   **`code=<openid>`**, `json=true`) → sets `__Secure-authjs.session-token`
6. `GET /api/auth/session` → user object incl. `is_vip`

> KEY GOTCHAS (learned the hard way — don't rediscover them):
> - The credential field is **`code`**, and its value is the **`openid`** from step 4.
>   The site's frontend literally does `signIn("personal-wechat", { code: decodeURIComponent(openid) })`.
>   Sending `token`/`openid` instead → `error=CredentialsSignin`.
> - The container egresses through a **TLS-intercepting proxy**, so `curl` needs `-k`
>   (and a real browser would need `ignoreHTTPSErrors` / `--ignore-certificate-errors`).
> - The displayed QR can client-side-expire before the user scans. The script
>   auto-regenerates it and remembers **every** token it issued, so a QR already shown
>   to the user still completes login.

## Agent steps to drive it
1. Start the login in the **background** (it blocks while polling for the scan):
   ```bash
   node "$SKILL/scripts/wechat_login.js"          # WEBCAFE_WORKDIR / WEBCAFE_TIMEOUT (sec) optional
   ```
2. Poll `"$WORKDIR/status.json"` until `state == "waiting"` and `"$WORKDIR/qr.png"` exists.
3. **Send the QR to the user**: `SendUserFile "$WORKDIR/qr.png"`, and tell them:
   微信 →「扫一扫」→ 扫码 → 点「确认登录」(scan promptly).
4. Keep polling `status.json`:
   - if `qr_version` increased → the QR refreshed, re-send `qr.png`;
   - when `state == "ok"` → success; `status.json.user` has `name` + `is_vip`;
   - `state == "timeout" | "error"` → report and offer to re-run.
5. The reusable session is saved at `"$WORKDIR/session.jar"` (and the user object at
   `"$WORKDIR/session.json"`).

## Reading content after login
```bash
node "$SKILL/scripts/wc_fetch.js" /experience/<id>      # → clean readable text
node "$SKILL/scripts/wc_fetch.js" <full-url> --html      # → raw HTML
```
Member/paid article bodies are server-rendered into the authenticated HTML, so the saved
cookie jar is all that's required to read them.

## Notes
- Session lives **only** in this ephemeral container under `WORKDIR`; it expires
  (~30 days server-side) and is **never committed**. Add `/tmp/webcafe` is outside the repo.
- Next time: invoke this skill and scan once — that's it.
