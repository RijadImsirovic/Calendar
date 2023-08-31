import React from 'react'
import Button from '@mui/material/Button'
import { useCookies } from 'react-cookie'

const Home = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null)

  const signOut = () => {
    removeCookie('Name')
    removeCookie('Email')
    removeCookie('AuthToken')
    window.location.reload()
  }

  return (
    <article>
       <h2>Home Page</h2> 
       <Button className='sign-out' variant="outlined" onClick={signOut}>Sign out</Button>
    </article>
  )
}

export default Home
