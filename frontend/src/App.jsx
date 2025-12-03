import { useState } from 'react'
import HomePage from './pages/HomePage/HomePage'
import LandingPage from './pages/LandingPage/LandingPage'
import LoginPage from './pages/LoginPage/LoginPage'
import SignupPage from './pages/SignupPage/SignupPage'
import './App.css'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'


function App() {

  const navigate = useNavigate();

  function toSignup() {
      navigate("/signup");
  }

  function toLogin() {
    navigate("/login");
  }


  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage toSignup={toSignup} toLogin={toLogin}/>}/>
        <Route path="/dashboard" element={<HomePage />}/>
        <Route path="/login" element={<LoginPage toSignup={toSignup}/>}/>
        <Route path="/signup" element={<SignupPage toLogin={toLogin}/>}/>
      </Routes>
    </>
  )
}

export default App
