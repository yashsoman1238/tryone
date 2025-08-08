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
  } else if (req.url === '/register.html') {
    const filePath = path.join(__dirname, 'public', 'register.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading register.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content, 'utf-8');
      }
    });
  } else if (req.url === '/login.html') {
    const filePath = path.join(__dirname, 'public', 'login.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading login.html');
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
  } else if (req.url === '/api/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        try {
            const { email, password } = JSON.parse(body);

            if (!email || !password) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Email and password are required' }));
                return;
            }

            const usersDbPath = path.join(__dirname, 'users.json');
            fs.readFile(usersDbPath, 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Error reading user database' }));
                    return;
                }

                const usersData = JSON.parse(data);
                const existingUser = usersData.users.find(user => user.email === email);

                if (existingUser) {
                    res.writeHead(409, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'User with this email already exists' }));
                    return;
                }

                // NOTE: Passwords are stored in plaintext. This is not secure and should
                // be replaced with a hashing mechanism (e.g., bcrypt) in a real application.
                const newUser = {
                    id: Date.now(),
                    email,
                    password
                };

                usersData.users.push(newUser);

                fs.writeFile(usersDbPath, JSON.stringify(usersData, null, 2), (err) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Error saving new user' }));
                        return;
                    }

                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'User registered successfully' }));
                });
            });
        } catch (e) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid JSON' }));
        }
    });
  } else if (req.url === '/api/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        try {
            const { email, password } = JSON.parse(body);

            if (!email || !password) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Email and password are required' }));
                return;
            }

            const usersDbPath = path.join(__dirname, 'users.json');
            fs.readFile(usersDbPath, 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Error reading user database' }));
                    return;
                }

                const usersData = JSON.parse(data);

                // NOTE: This is a plaintext password comparison. This is not secure.
                const user = usersData.users.find(u => u.email === email && u.password === password);

                if (user) {
                    // In a real app, generate a secure JWT. For now, a simple token.
                    const token = `fake-token-${user.id}-${Date.now()}`;
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        message: 'Login successful',
                        token: token,
                        user: { id: user.id, email: user.email }
                    }));
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Invalid email or password' }));
                }
            });
        } catch (e) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid JSON' }));
        }
    });
  } else if (req.url === '/login.html') {
    const filePath = path.join(__dirname, 'public', 'login.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading login.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content, 'utf-8');
      }
    });
  } else if (req.url === '/register.html') {
    const filePath = path.join(__dirname, 'public', 'register.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading register.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
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
