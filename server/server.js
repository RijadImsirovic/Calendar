const express = require('express')
const app = express()
const port = 8000
const pool = require('./data/db')

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))