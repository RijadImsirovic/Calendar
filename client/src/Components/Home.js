import React from 'react'
import Button from '@mui/material/Button'
import { useCookies } from 'react-cookie'
import { useLocation } from 'react-router-dom'
import Nav from './Nav'
import { Paper } from '@mui/material'
import './Home.css';

const Home = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const location = useLocation();
  console.log(location)
  const signOut = () => {
    removeCookie('Name')
    removeCookie('Email')
    removeCookie('AuthToken')
    window.location.reload()
  }

  return (
    <section className='home-container'>
      <Nav signOut={signOut}/>
      <div className="home-content-container">
        <div className="top-section">
          <Paper className='mario box-1' elevation={7}>Box 1</Paper>
        </div>
        <div className="middle-section">
          <Paper className='mario box-2' elevation={7}>Box 2</Paper>
          <div className="right-middle-section">
            <Paper className='mario box-3' elevation={7}>Box 3</Paper>
            <Paper className='mario box-4' elevation={7}>Box 4</Paper>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home
