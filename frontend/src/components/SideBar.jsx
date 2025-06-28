import React, { useState } from "react";
import dp from "../assets/dp.png";
import { useSelector, useDispatch } from "react-redux";
import { BsSearch } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";
import { setUserData, setOtherUsers, setSelectedUser } from "../redux/userSlice";
import axios from "axios";
import { serverUrl } from "../main";
import { useNavigate } from "react-router-dom";
import { setMessages } from "../redux/messageSlice";

function SideBar() {
  const { userData, otherUsers, onlineUsers } = useSelector((state) => state.user);
  const [search, setSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${serverUrl}/api/auth/logout`, null, { withCredentials: true });
      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));
      navigate("/login");
    } catch (error) {}
  };

  const handleSelectUser = async (user) => {
    const selected = { ...user, _id: user._id || user.id };
    dispatch(setSelectedUser(selected));
    try {
      const res = await axios.get(`${serverUrl}/api/message/get/${selected._id}`, { withCredentials: true });
      dispatch(setMessages(res.data));
    } catch (err) {}
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const res = await axios.get(`${serverUrl}/api/user/search?q=${encodeURIComponent(searchQuery)}`, {
        withCredentials: true
      });
      dispatch(setOtherUsers(res.data));
    } catch (error) {}
  };

  const resetSearch = async () => {
    setSearch(false);
    setSearchQuery("");
    try {
      const res = await axios.get(`${serverUrl}/api/user/others`, { withCredentials: true });
      dispatch(setOtherUsers(res.data));
    } catch (error) {}
  };

  return (
    <div className="w-[30%] h-screen flex flex-col justify-between shadow-md bg-white rounded-br-[100px] overflow-hidden">
      <div className="bg-[#20c7ff] p-6 flex flex-col gap-6 rounded-br-[100px]">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white">V-Chat</h1>
            <p className="text-lg font-semibold text-white mt-1">
              Hii, <span>{userData?.name || "User"}</span>
            </p>
          </div>
          <div className="cursor-pointer" onClick={() => navigate("/profile")}>
            <img
              src={userData?.image || dp}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-md"
            />
          </div>
        </div>

        {!search ? (
          <div
            className="text-xl bg-white/30 p-3 rounded-full cursor-pointer hover:bg-white/50 w-fit text-white"
            onClick={() => setSearch(true)}
          >
            <BsSearch />
          </div>
        ) : (
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow w-full min-w-0"
          >
            <BsSearch className="text-[#20c7ff] text-xl" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full outline-none text-gray-800 bg-transparent"
            />
            <RxCross2 onClick={resetSearch} className="text-[#20c7ff] text-2xl cursor-pointer" />
          </form>
        )}

        <div className="flex gap-3 mt-2">
          {otherUsers
            ?.filter(u => onlineUsers?.includes(u._id))
            .slice(0, 3)
            .map((user, index) => (
              <div key={index} className="relative w-10 h-10">
                <img
                  src={user.image || dp}
                  alt={user.userName}
                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
            ))}
        </div>
      </div>

      <div className="bg-white shadow-lg p-4 flex flex-col gap-4 overflow-y-auto">
        {otherUsers?.map((user, index) => (
          <div
            key={index}
            onClick={() => handleSelectUser(user)}
            className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition"
          >
            <div className="relative">
              <img
                src={user.image || dp}
                alt={user.userName}
                className="w-10 h-10 rounded-full border object-cover shadow"
              />
              {onlineUsers?.includes(user._id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              )}
            </div>
            <span className="font-semibold text-gray-800">
              {user.name || user.userName}
            </span>
          </div>
        ))}
      </div>

      <div className="p-4">
        <div
          onClick={handleLogout}
          className="p-3 bg-[#20c7ff] rounded-full cursor-pointer text-white shadow hover:scale-110 transition-transform w-fit"
        >
          <FiLogOut className="text-xl" />
        </div>
      </div>
    </div>
  );
}

export default SideBar;
