import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LogIn from './pages/LogIn.jsx'
import SignUp from './pages/SignUp.jsx'


function App() {
  return (
    <Routes>
      <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  )
}

export default App
