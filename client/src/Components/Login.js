import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from '@mui/material/Button'
import {useCookies} from 'react-cookie'
import {useNavigate} from 'react-router-dom'
import axios from '../api/axios'
import './Login.css';

const Login = ({flipEffect }) => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [error, setError] = useState(null)
  const [name, setName] = useState(null)
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const navigate = useNavigate();
  

  const handleLogin = async (e) => {
    e.preventDefault()

    const response = await axios.post('/login', {
      email: email,
      password: password
    })

    if (response.data.detail) {
      setError(response.data.detail)
    } else {
      setCookie('Name', response.data.name)
      setCookie('Email', response.data.email)
      setCookie('AuthToken', response.data.token)

      navigate('/home');
    }
  }
  // ${flipEffect ? 'flipAuth-container' : 'unflipAuth-container'}
  return (
      <div className={`login-container`}>
        <h2 className='log-title'>Sign in</h2>
        <p className='log-subtitle'>Enter you personal information below</p>
        <form className='form-container'>
          <Form.Control className='email' type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)}/>
          <Form.Control className='password' type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)}/>
          <Button className='submit' variant="outlined" onClick={(e) => handleLogin(e)}>Sign in</Button>
        </form>
      </div>
  )
}

export default Login
