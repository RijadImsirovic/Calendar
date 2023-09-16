import React from 'react'
import { Outlet,  useLocation } from 'react-router-dom'

const Layout = () => {
  const location = useLocation();
  return (
    <main className={`App ${location.pathname == '/' ? 'App-auth' : ''}`}>
      <Outlet />
    </main>
  )
}

export default Layout
