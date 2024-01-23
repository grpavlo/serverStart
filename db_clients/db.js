const  Pool = require('pg').Pool
const  pool = new Pool({
    user: "start",
    password: "TLnGe5CvRXXKsS",
    host: "127.0.0.1",
    port: 5432,
    database:"start"
})

module.exports = pool
