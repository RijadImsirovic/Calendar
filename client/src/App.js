import Landing from './Components/Landing'
import Layout from './Components/Layout'
import Home from './Components/Home'
import Missing from './Components/Missing'
import Unauthorized from './Components/Unauthorized'
import RequireAuth from './Components/RequireAuth'
import {Routes, Route} from 'react-router-dom'
import { useCookies } from 'react-cookie'

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
        </Route>
        {/* 404 Page */}
        <Route path='*' element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
