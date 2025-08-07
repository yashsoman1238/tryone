const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content, 'utf-8');
      }
    });
  } else if (req.url === '/api/products') {
    const dbPath = path.join(__dirname, 'db.json');
    fs.readFile(dbPath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading database');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(content, 'utf-8');
      }
    });
  } else if (req.url === '/checkout.html') {
    const filePath = path.join(__dirname, 'public', 'checkout.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading checkout.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content, 'utf-8');
      }
    });
  } else if (req.url === '/confirmation.html') {
    const filePath = path.join(__dirname, 'public', 'confirmation.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading confirmation.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content, 'utf-8');
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
