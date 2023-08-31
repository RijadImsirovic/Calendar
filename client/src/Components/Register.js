import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import Form from 'react-bootstrap/Form'
import './Register.css';
import {useCookies} from 'react-cookie'
import {Navigate, useNavigate} from 'react-router-dom'


const Register = ({ flipEffect }) => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [error, setError] = useState(null)
  const [name, setName] = useState(null)
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const navigate = useNavigate();
  const authSubmit = async (e) => {
    e.preventDefault()
    
    const response = await fetch('http://localhost:8000/register', {
      method: 'POST',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify({name, email, password})
    })

    const data = await response.json()
    if (data.detail) {
      setError(data.detail)
    } else {
      setCookie('Name', data.name)
      setCookie('Email', data.email)
      setCookie('AuthToken', data.token)

      navigate('/home');
    }
  }


  return (
    <div className={`register-container`}>
      <h2 className='reg-title'>Create Account</h2>
      <p className='reg-subtitle'>Enter you personal information below</p>
      <form className='form-container'>
        <Form.Control className='name' type='text' placeholder='Name' onChange={(e) => setName(e.target.value)}/>
        <Form.Control className='email' type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)}/>
        <Form.Control className='password' type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)}/>
        <Button className='submit' variant="outlined" onClick={(e) => authSubmit(e)}>Sign up</Button>
        {error && <p>{error}</p>}
      </form>
    </div>
  )
}

export default Register
