import './App.css'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Home from './pages/Home'
import UserDetails from './components/UserDetails'


function App() {
  const { user, login, logout } = UserDetails();

  return (
    <div>
      <Routes>
       <Route path='/' element={<LoginPage/>}/>
       <Route path='/Login' element={<LoginPage/>}/>
       <Route path='/Home' element={user == null ? (<LoginPage />) : (<Home />)}/>
      </Routes>
    </div>
  )
}

export default App
