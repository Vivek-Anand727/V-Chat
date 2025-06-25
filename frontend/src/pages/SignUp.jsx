import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../main.jsx'

function SignUp() {
  const navigate = useNavigate();
  let [show, setShow] = useState(false);
  let[userName,setUsername] = useState("");
  let[email,setEmail] = useState("");
  let[password,setPassword] = useState("");
  let[loading,setLoading] = useState(false);
  let[err,setErr] = useState("");

  const handleSignUp = async(e)=>{
    e.preventDefault();
    setLoading(true);
    try {
        let result = await axios.post(`${serverUrl}/api/auth/signup`,
            {
                userName,
                email,
                password
            },{withCredentials:true}
        )
        setLoading(false);
        console.log(result);
        setEmail("");
        setUsername("");
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
            Welcome to <span className="text-white">V-Chat</span>
          </h1>
        </div>

        <form className="w-full flex flex-col gap-4 items-center mt-4" onSubmit = {handleSignUp}>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)} value={userName}
            className="w-11/12 h-14 px-4 border border-[#20c7ff] rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#20c7ff] text-lg text-gray-800"
          />
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)} value={email}
            className="w-11/12 h-14 px-4 border border-[#20c7ff] rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#20c7ff] text-lg text-gray-800"
          />

          <div className="w-11/12 h-14 border border-[#20c7ff] rounded-lg shadow relative">
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)} value={password}
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
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#20c7ff] font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  )
}

export default SignUp
