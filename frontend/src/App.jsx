import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LogIn from './pages/LogIn.jsx'
import SignUp from './pages/SignUp.jsx'
import Profile from './pages/Profile.jsx'
import Home from './pages/Home.jsx'
import getCurrentUser from './customHooks/getCurrentUser.jsx'
import { useDispatch, useSelector } from 'react-redux'
import getOtherUsers from './customHooks/getOtherUser.jsx'
import {io} from 'socket.io-client' 
import { serverUrl } from './main.jsx'
import { setOnlineUsers, setSocket } from './redux/userSlice.js'

function App() {
  getCurrentUser();
  let {userData,socket,onlineUsers} = useSelector((state)=>state.user);
  let dispatch = useDispatch();
  getOtherUsers();

  useEffect(()=>{
    if(userData){
      const socketio = io(`${serverUrl}`,{
        query: {
          userId: userData?._id
        }
      });
      dispatch(setSocket(socketio));
  
      socketio.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });
  
      return ()=>{
        socketio.close();
      }
    }else{
      if(socket){
        socket.close();
        dispatch(setSocket(null));
      }
    }

  },[userData])

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
