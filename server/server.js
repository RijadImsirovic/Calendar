const express = require('express')
const app = express()
const port = 8000
const pool = require('./data/db')
const cors = require('cors')
const {v4: uuidv4} = require('uuid')
const bcrypt  = require('bcrypt')
const jwt = require('jsonwebtoken')


app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send('Hello World!'))

// Authentication

app.post('/register', async function (req, res) {
    const {name, email, password } = req.body
    const id = uuidv4()
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)
    
    try{
        const signUp = await pool.query(`INSERT INTO users (id, name, email, hashed_password) VALUES($1, $2, $3, $4)`, [id, name, email, hashedPassword])
        
        const token = jwt.sign({ email }, 'secret', {expiresIn: '1hr'})

        res.json({name, email, token})
    } catch(err) {
        console.error(err)
        if (err) {
            res.json({detail: err.detail})
        }
    }
})

app.post('/login', async function (req, res) {
  const { email, password } = req.body
  try{
    const users = await pool.query('SELECT * FROM users where email = $1', [email])

    if(!users.rows.length) return res.json({detail: 'User does not exist!'})

    const authCheck  = await bcrypt.compare(password, users.rows[0].hashed_password)
    const token = jwt.sign({ email }, 'secret', {expiresIn: '1hr'})

    if (authCheck) {
        res.json({'name': users.rows[0].name , 'email': users.rows[0].email, token})
    } else {
        res.json({detail: 'Login failed'})
    }
  }catch(err) {
    console.error(err)
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))