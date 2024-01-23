const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const userRouter = require('./routes/user.routes');
const app = express();
const server = require("https").createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/ip-93-115-16-220-94683.vps.hosted-by-mvps.net/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/ip-93-115-16-220-94683.vps.hosted-by-mvps.net/cert.pem')
}, app);

const PORT = 3001;

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
});

app.use('/api', userRouter);

app.get('/hello', (req, res) => {
    res.send('Hello, world!');
});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

