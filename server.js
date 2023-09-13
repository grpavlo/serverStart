const express = require('express');
const app = express()
const server = require("http").createServer(app)
const userRouter = require('./routes/user.routes')
const bodyParser = require('body-parser');

const PORT  = 3001

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
})



app.use('/api', userRouter)


server.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
})
