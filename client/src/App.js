import Landing from './Components/Landing'
import Layout from './Components/Layout'
import Home from './Components/Home'
import Missing from './Components/Missing'
import Unauthorized from './Components/Unauthorized'
import RequireAuth from './Components/RequireAuth'
import Profile from './Components/Profile'
import {Routes, Route} from 'react-router-dom'
import { useCookies } from 'react-cookie'
import ConnectionsPage from './Components/Connections'
import UserProfile from './Components/UserProfile'

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const authToken = cookies.AuthToken
  const userEmail = cookies.Email

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* Public */}
        <Route path='/' element={<Landing />} />
        <Route path='unauthorized' element={<Unauthorized />} />

        {/* Protected */}
        
        <Route element={<RequireAuth />}>
          <Route path='/home' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/:username' element={<UserProfile />} />
          <Route path='/connections' element={<ConnectionsPage />} />
        </Route>
        {/* 404 Page */}
        <Route path='*' element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
