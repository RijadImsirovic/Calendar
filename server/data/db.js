const Pool = require('pg').Pool
require('dotenv').config()

const pool = new Pool({
    user: 'Ricky',
    password: 'svjetlost123',
    host: 'localhost',
    port: '5432',
    database: 'calendar'
})

module.exports = pool