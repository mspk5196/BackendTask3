import { React, useState } from 'react'
import UserDetails from '../components/UserDetails'
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';
import AddMarks from './AddMarks';

export default function Home() {
  const { user, login, logout } = UserDetails();
  const navigate = useNavigate();

  const verifyLogout = () => {
    logout();
    navigate('/');
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <p>USERNAME : {user.username}</p>
        <button onClick={verifyLogout} id='logoutBtn'>Logut</button>
      </div>

      <div>
        <AddMarks />
      </div>
    </div>
  )
}
