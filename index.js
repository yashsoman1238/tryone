const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

const server = http.createServer((req, res) => {
    console.log(`Request for ${req.url} with method ${req.method}`);

    // Handle API routes
    if (req.url === '/api/products' && req.method === 'GET') {
        const dbPath = path.join(__dirname, 'db.json');
        fs.readFile(dbPath, (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error loading database' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(content, 'utf-8');
            }
        });
    } else if (req.url === '/api/register' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const { email, password } = JSON.parse(body);
                if (!email || !password) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: 'Email and password are required' }));
                }
                const usersDbPath = path.join(__dirname, 'users.json');
                fs.readFile(usersDbPath, 'utf8', (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ message: 'Error reading user database' }));
                    }
                    const usersData = JSON.parse(data);
                    if (usersData.users.find(user => user.email === email)) {
                        res.writeHead(409, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ message: 'User with this email already exists' }));
                    }
                    const newUser = { id: Date.now(), email, password };
                    usersData.users.push(newUser);
                    fs.writeFile(usersDbPath, JSON.stringify(usersData, null, 2), (err) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            return res.end(JSON.stringify({ message: 'Error saving new user' }));
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
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const { email, password } = JSON.parse(body);
                if (!email || !password) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: 'Email and password are required' }));
                }
                const usersDbPath = path.join(__dirname, 'users.json');
                fs.readFile(usersDbPath, 'utf8', (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ message: 'Error reading user database' }));
                    }
                    const usersData = JSON.parse(data);
                    const user = usersData.users.find(u => u.email === email && u.password === password);
                    if (user) {
                        const token = `fake-token-${user.id}-${Date.now()}`;
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Login successful', token, user: { id: user.id, email: user.email } }));
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
    } else { // Handle static file serving
        const publicDir = path.join(__dirname, 'public');
        let filePath = path.join(publicDir, req.url === '/' ? 'index.html' : req.url);

        const extname = String(path.extname(filePath)).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
        };
        const contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code == 'ENOENT') {
                    fs.readFile(path.join(publicDir, '404.html'), (err404, content404) => {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(content404 || '404 Not Found');
                    });
                } else {
                    res.writeHead(500);
                    res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
