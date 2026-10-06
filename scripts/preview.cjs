const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../build');
const base = '/Demo-Smart-Operation-Digital-Dashboard/';
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const relative = pathname.startsWith(base) ? pathname.slice(base.length) : pathname.slice(1);
  const target = path.resolve(root, relative || 'index.html');
  if (!target.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
  fs.readFile(target, (error, contents) => {
    if (error) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream' });
    res.end(contents);
  });
}).listen(4173, '127.0.0.1', () => console.log(`Demo preview: http://127.0.0.1:4173${base}`));
