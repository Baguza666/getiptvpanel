import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const port = Number(process.env.PREVIEW_PORT || 4322);
const contentTypes = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json' };

const server = http.createServer((request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host}`);
  const cleanPath = url.pathname.replace(/\/$/, '') || '/';
  const redirect = config.redirects.find((item) => item.source === cleanPath);
  if (redirect) {
    response.writeHead(308, { Location: redirect.destination });
    response.end();
    return;
  }
  if (config.routes.some((route) => new RegExp(`^${route.src}$`).test(url.pathname))) {
    response.writeHead(410, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Gone');
    return;
  }
  const candidates = cleanPath === '/'
    ? [path.join(dist, 'index.html')]
    : [path.join(dist, cleanPath, 'index.html'), path.join(dist, cleanPath)];
  const file = candidates.find((candidate) => candidate.startsWith(dist) && fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  const status = file ? 200 : 404;
  const output = file || path.join(dist, '404.html');
  response.writeHead(status, { 'Content-Type': contentTypes[path.extname(output)] || 'application/octet-stream' });
  fs.createReadStream(output).pipe(response);
});

server.listen(port, '127.0.0.1', () => console.log(`Route-aware preview at http://127.0.0.1:${port}`));
