import React, { useRef } from 'react'
import dp from '../assets/dp.png'
import { FcOldTimeCamera } from "react-icons/fc"
import { useDispatch, useSelector } from 'react-redux'
import { IoArrowBackCircle } from "react-icons/io5"
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { serverUrl } from '../main'
import { setUserData } from '../redux/userSlice'

function Profile() {
  const { userData } = useSelector((state) => state.user)
  const navigate = useNavigate()

  let[name,setName] = useState( userData.name || "");
  let[frontendImage,setFrontendImage] = useState( userData.image || dp);
  let[backendImage,setBackendImage] = useState(null);
  let image = useRef();
  const dispatch = useDispatch();
  const[saving,setSaving] = useState(false);

  const handleImage =(e)=>{
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  }

  const handleProfile = async (e)=>{
    e.preventDefault();
    setSaving(true);
    try {
      let formData = new FormData();
      formData.append("name",name);
      if(backendImage){
        formData.append("image",backendImage);
      }
      const result = await axios.put(`${serverUrl}/api/user/profile`,formData,{withCredentials:true});
      setSaving(false);
      dispatch(setUserData(result.data));
      navigate("/");
    } catch (error) {
      console.log(error);
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center relative">
      <IoArrowBackCircle
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-5xl text-[#20c7ff] cursor-pointer hover:scale-110 transition-transform"
      />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg flex flex-col items-center p-6 gap-6 relative">

        <div className="w-full h-48 bg-[#20c7ff] rounded-b-[40%] flex flex-col items-center justify-center shadow-md">
          <div className="relative cursor-pointer">
            <img
              src={frontendImage}
              alt="profile"
              onClick={()=>image.current.click()}
              className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
            />
            <FcOldTimeCamera 
              onClick={()=>image.current.click()}
            className="absolute bottom-0 right-0 text-5xl bg-white rounded-full p-1 shadow cursor-pointer" />
          </div>
          <h2 className="mt-2 text-lg font-semibold text-white">Your Profile</h2>
        </div>

        <form onSubmit={handleProfile} className="w-full flex flex-col gap-4 items-center mt-4">
          <input type='file' accept='image/*' ref={image} onChange={handleImage} hidden/>
          <input
            type="text"
            placeholder="Enter Your Name"
            onChange={(e)=>setName(e.target.value)} value = {name}
            className="w-11/12 h-14 px-4 border border-[#20c7ff] rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#20c7ff] text-lg text-gray-800"
          />
          <input
            type="text"
            readOnly
            value={userData.userName}
            className="w-11/12 h-14 px-4 bg-gray-100 border border-gray-300 rounded-lg shadow text-lg text-gray-500 cursor-not-allowed"
          />
          <input
            type="email"
            readOnly
            value={userData.email}
            className="w-11/12 h-14 px-4 bg-gray-100 border border-gray-300 rounded-lg shadow text-lg text-gray-500 cursor-not-allowed"
          />
          <button
            type="submit"
            className="w-11/12 h-14 bg-[#20c7ff] hover:bg-[#1ab0e6] text-white font-semibold text-lg rounded-lg shadow transition-all"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile
