import React from 'react'
import logo from '../Assets/Images/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import './Nav.css';
import { Paper } from '@mui/material'
import { useLocation } from 'react-router-dom'

const Nav = ({ signOut }) => {
    const location = useLocation();
  return (
    
    <aside className='side-nav'>
        <div className="toggle">
            <div className="logo">
                <img className='img-logo' src={logo} />
                <h2 className='company-name'>CalendarCo</h2>
            </div>
            <div className="close">
                <FontAwesomeIcon icon={faXmark} />
            </div>
        </div>
        <Paper className="sidebar" elevation={7}>
        {/* <div className="sidebar"> */}
            <Link to='/home' className={`${location.pathname == '/home' ? 'active' : ''}`}>
                <span><HomeOutlinedIcon />Home</span>
            </Link>
            <Link to='/home'>
                <span><PeopleAltOutlinedIcon />Connections</span>
            </Link>
            <Link to='/home'>
                <span><CalendarMonthOutlinedIcon />Calendar</span>
            </Link>
            <Link to='/profile' className={`${location.pathname == '/profile' ? 'active' : ''}`}>
                <span><ManageAccountsOutlinedIcon />Profile</span>
            </Link>
            <Link to='/home'>
                <span><BugReportOutlinedIcon />Report</span>
            </Link>
            <a className='sidebar-signout'>
                <span onClick={signOut}><LogoutOutlinedIcon />Sign out</span>
            </a>
        {/* </div> */}
        </Paper>
        
    </aside>
  )
}

export default Nav
