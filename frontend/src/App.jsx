import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LogIn from './pages/LogIn.jsx'
import SignUp from './pages/SignUp.jsx'
import Profile from './pages/Profile.jsx'
import Home from './pages/Home.jsx'
import getCurrentUser from './customHooks/getCurrentUser.jsx'
import { useSelector } from 'react-redux'

function App() {
  getCurrentUser();
  let {userData} = useSelector((state)=>state.user);
  return (
    <Routes>
      <Route path="/login" element={!userData?<LogIn/> : <Navigate to="/"/>} />
      <Route path="/signup" element={!userData?<SignUp/> : <Navigate to="/profile"/>} />
      <Route path="/" element={userData? <Home /> : < Navigate to="/login"/>}/>
      <Route path='/profile' element={userData? <Profile /> : < Navigate to="/signup"/>}/>
    </Routes>
  )
}

export default App
