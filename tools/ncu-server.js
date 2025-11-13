#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.NCU_UI_PORT || 6060;
const ROOT = path.join(__dirname, 'ncu-ui');
const REPORT = path.join(__dirname, 'ncu-report.json');

function sendFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  if (url === '/' || url === '/index.html') {
    return sendFile(res, path.join(ROOT, 'index.html'), 'text/html');
  }
  if (url === '/app.js') return sendFile(res, path.join(ROOT, 'app.js'), 'application/javascript');
  if (url === '/style.css') return sendFile(res, path.join(ROOT, 'style.css'), 'text/css');
  if (url === '/report.json') {
    if (fs.existsSync(REPORT)) return sendFile(res, REPORT, 'application/json');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ generated: null, results: {} }));
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`NCU UI server running at http://localhost:${PORT}`);
  console.log('Endpoints: / -> UI, /report.json -> report');
});
