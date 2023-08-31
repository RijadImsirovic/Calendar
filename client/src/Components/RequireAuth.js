import React from 'react'
import {useLocation, Navigate, Outlet} from 'react-router-dom'
import { useCookies } from 'react-cookie'

const RequireAuth = () => {
    const [cookies, setCookie, removeCookie] = useCookies(null)
    const authToken = cookies.AuthToken
    const userEmail = cookies.Email
    return (
        authToken? <Outlet /> : <Navigate to={'/'} />
    )
}

export default RequireAuth
