import React, { useEffect, useState } from 'react'
import Login from './Login'
import Register from './Register'
import './Landing.css';
import bootstrap from 'bootstrap'
import Button from '@mui/material/Button'

const Landing = () => {
  const [authState, setAuthState] = useState('register')
  const [flipEffect, setFlipEffect] = useState(false)

  const toggleFlip = () => {
    setFlipEffect(!flipEffect);
  }

  return (
    <div className="landing-container">
      <section className={`welcome-container ${flipEffect ? 'flip-container' : 'unflip-container'}`}>
        {authState == 'register' ?
          <article className={`welcome-back`}>
            <h1>Welcome back!</h1>
            <h3>To be connected with us please login with your personal info</h3>
            <Button className='welcome-button' variant="outlined" onClick={(e) => {
              toggleFlip();
              authState === 'register' ? setAuthState('login') : setAuthState('register');
            }}>Sign in</Button>
          </article>
          :
          <article className={`welcome-new-user ${flipEffect ? 'transform: translateX(100%)' : ''}`}>
            <h1>Hi Buddy!</h1>
            <h3>Enter your personal information to start your journey using Calendar</h3>
            <Button className='welcome-button' variant="outlined" onClick={(e) => {
              toggleFlip();
              authState === 'register' ? setAuthState('login') : setAuthState('register');
            }}>Sign up</Button>
          </article>
        }
      </section>
      <section className={`authentication-container ${flipEffect ? 'flipAuth-container' : 'unflipAuth-container'}`}>
        {authState == 'register' ? <Register flipEffect={flipEffect} /> : <Login flipEffect={flipEffect} />}
      </section>
    </div>
  )
}

export default Landing
