#!/usr/bin/env node
/*
 * Fetch any new.web.cafe URL using the session saved by wechat_login.js and print it.
 * Member/paid article bodies are server-rendered into the authenticated HTML, so the
 * saved cookie jar is enough to read them.
 *
 * Usage:
 *   node wc_fetch.js /experience/<id>        # -> clean readable text (default)
 *   node wc_fetch.js <full-url>              # path or absolute URL both work
 *   node wc_fetch.js <url> --html            # -> raw HTML
 *
 * Env: WEBCAFE_WORKDIR (default /tmp/webcafe) — where session.jar lives.
 */
'use strict';
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BASE = 'https://new.web.cafe';
const WORKDIR = process.env.WEBCAFE_WORKDIR || '/tmp/webcafe';
const JAR = path.join(WORKDIR, 'session.jar');

const arg = process.argv[2];
if (!arg) { console.error('usage: node wc_fetch.js <url-or-path> [--html]'); process.exit(2); }
if (!fs.existsSync(JAR)) { console.error('No session jar at ' + JAR + ' — run wechat_login.js first.'); process.exit(3); }

const url = /^https?:\/\//.test(arg) ? arg : BASE + (arg.startsWith('/') ? arg : '/' + arg);
const wantHtml = process.argv.includes('--html');

const html = execFileSync('curl', ['-sS', '-k', '-m', '25', '-b', JAR, url], {
  encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
});

if (wantHtml) { process.stdout.write(html); process.exit(0); }

let h = html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')   // drop scripts (also the duplicated RSC flight JSON)
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<\/(p|div|li|h[1-6]|tr|section|article|ul|ol|blockquote)>/gi, '\n')
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'")
  .replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
  .replace(/[ \t]+/g, ' ')
  .replace(/[ \t]*\n[ \t]*/g, '\n')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

process.stdout.write(h + '\n');
