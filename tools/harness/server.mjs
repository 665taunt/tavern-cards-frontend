// 本地验证用静态服务器。
// 必须带 CORS 头：应用是 `$('body').load(...)` 跨端口拉进来的，没有 CORS 会静默拦截。
// 全程统一用 localhost（不要混用 127.0.0.1）—— 两者是跨源对，会莫名其妙失败。
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const PORT = Number(process.env.PORT ?? 5500);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
};

http
  .createServer((req, res) => {
    const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
    const file = path.join(ROOT, url);
    // 防目录穿越
    if (!file.startsWith(ROOT)) {
      res.writeHead(403).end('403');
      return;
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404).end('404');
        return;
      }
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      });
      res.end(data);
    });
  })
  .listen(PORT, () => console.log(`harness server → http://localhost:${PORT}/tools/harness/smoke.html`));
