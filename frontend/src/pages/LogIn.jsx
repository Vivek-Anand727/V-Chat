import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../main.jsx'

function LogIn() {
  const navigate = useNavigate();
  let [show, setShow] = useState(false);
  let[email,setEmail] = useState("");
  let[password,setPassword] = useState("");
  let[loading,setLoading] = useState(false);
  let[err,setErr] = useState("");

  const handleLogin = async(e)=>{
    e.preventDefault();
    setLoading(true);
    try {
        let result = await axios.post(`${serverUrl}/api/auth/login`,
            {
                email,
                password
            },{withCredentials:true}
        )
        console.log(result);
        setLoading(false);
        setEmail("");
        setPassword("");
        setErr("");
    } catch (error) {
        console.log(error);
        setLoading(false);
        setErr(error.response.data.message);
    }
  }


  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg flex flex-col items-center p-6 gap-6">
        <div className="w-full h-40 bg-[#20c7ff] rounded-b-[40%] flex items-center justify-center shadow-md">
          <h1 className="text-3xl font-bold text-gray-700">
            Login to <span className="text-white">V-Chat</span>
          </h1>
        </div>

        <form className="w-full flex flex-col gap-4 items-center mt-4" onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            value={email} onChange={(e)=>setEmail(e.target.value)}
            className="w-11/12 h-14 px-4 border border-[#20c7ff] rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#20c7ff] text-lg text-gray-800"
          />

          <div className="w-11/12 h-14 border border-[#20c7ff] rounded-lg shadow relative">
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              value={password} onChange={(e)=>setPassword(e.target.value)}
              className="w-full h-full px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c7ff] text-lg text-gray-800"
            />
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#20c7ff] cursor-pointer select-none"
              onClick={() => setShow(!show)}
            >
              {show ? "Hide" : "Show"}
            </span>
          </div>

          {err && <p className="text-red-500 text-sm">{err}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-11/12 h-14 bg-[#20c7ff] hover:bg-[#1ab0e6] text-white font-semibold text-lg rounded-lg shadow transition-all"
          >
            Log In
          </button>
        </form>

        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-[#20c7ff] font-medium cursor-pointer hover:underline"
          >
            {loading ? "Loading..." : "Log In"}
            </span>
        </p>
      </div>
    </div>
  )
}

export default LogIn
