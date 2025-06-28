import React, { useState, useRef, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  HiArrowLeft,
  HiChatAlt2,
  HiPaperAirplane,
  HiEmojiHappy,
  HiPhotograph,
} from "react-icons/hi";
import dp from "../assets/dp.png";
import { setSelectedUser } from "../redux/userSlice";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import { serverUrl } from "../main";
import useGetMessage from "../customHooks/useGetMessage";
import { setMessages } from "../redux/messageSlice";

function MessageArea() {
  const dispatch = useDispatch();
  const { selectedUser, userData, socket, onlineUsers} = useSelector((state) => state.user);
  const messages = useSelector((state) => state.message.messages) || [];

  const [showPicker, setShowPicker] = useState(false);
  const [message, setMessage] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useLayoutEffect(() => {
    if (messagesEndRef.current) {
      requestAnimationFrame(() => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [messages]);

  useGetMessage(selectedUser);

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedUser?._id) return;
    if (message.trim() === "" && !backendImage) return;

    const formData = new FormData();
    formData.append("message", message);
    if (backendImage) {
      formData.append("image", backendImage);
    }

    try {
      await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );

      setMessage("");
      setBackendImage(null);
      setFrontendImage(null);

      const res = await axios.get(
        `${serverUrl}/api/message/get/${selectedUser._id}`,
        { withCredentials: true }
      );
      dispatch(setMessages(res.data));
    } catch (error) {
      console.error("Send error:", error);
    }
  };

  useLayoutEffect(() => {
    if (!socket) return;
    const handleNewMessage = (data) => {
      dispatch(setMessages([...messages, data]));
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, dispatch, messages]);

  return (
    <div className="lg:w-[70%] w-full h-full flex flex-col bg-gray-50">
      {selectedUser ? (
        <>
          <div className="flex items-center gap-3 p-4 shadow bg-white">
            <button
              onClick={() => dispatch(setSelectedUser(null))}
              className="text-2xl text-gray-700 hover:text-black transition"
            >
              <HiArrowLeft />
            </button>
            <img
              src={selectedUser?.image || dp}
              alt="User DP"
              className="w-10 h-10 rounded-full object-cover shadow border"
            />
            <span className="font-semibold text-gray-800">
              {selectedUser?.name || selectedUser?.userName || "User"}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto py-2 space-y-3 px-3">
            {Array.isArray(messages) && messages.length > 0 ? (
              messages.map((msg, idx) => {
                const hasImage = msg.image && msg.image.trim() !== "";
                const hasMessage = msg.message && msg.message.trim() !== "";
                if (!hasImage && !hasMessage) return null;

                const isMe = msg.sender === userData?._id;
                const bubbleClasses = isMe
                  ? "bg-[#20c7ff] text-white ml-auto"
                  : "bg-white text-gray-800 mr-auto";

                return (
                  <div
                    key={msg._id || idx}
                    className={`max-w-[65%] p-2 rounded-2xl border flex flex-col gap-1 text-sm ${bubbleClasses} shadow-sm`}
                  >
                    {hasImage && (
                      <img
                        src={msg.image}
                        alt="attachment"
                        className="w-40 h-auto rounded border"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    {hasMessage && <p className="break-words">{msg.message}</p>}
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-400 p-4">
                <p>No messages yet</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {showPicker && (
            <div className="bg-white shadow-2xl rounded-t-xl border-t max-h-[60vh] overflow-y-auto animate-slide-up transition-all duration-300">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width="100%"
                height={400}
              />
            </div>
          )}

          {frontendImage && (
            <div className="p-2 bg-white shadow-inner border-t flex items-center gap-3">
              <img
                src={frontendImage}
                alt="Selected Preview"
                className="w-20 h-20 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => {
                  setFrontendImage(null);
                  setBackendImage(null);
                }}
                className="text-sm text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          )}

          <form
            onSubmit={handleSend}
            className="p-3 bg-white shadow-lg flex items-center gap-3 rounded-t-xl"
          >
            <button
              type="button"
              onClick={() => setShowPicker(!showPicker)}
              className={`text-2xl transition ${
                showPicker
                  ? "text-[#20c7ff]"
                  : "text-gray-600 hover:text-[#20c7ff]"
              }`}
            >
              <HiEmojiHappy />
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="text-2xl text-gray-600 hover:text-[#20c7ff]"
            >
              <HiPhotograph />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-full outline-none focus:ring-2 focus:ring-[#20c7ff]"
            />

            <button
              type="submit"
              className="text-2xl text-white bg-[#20c7ff] p-2 rounded-full hover:bg-[#1ab8eb] transition"
            >
              <HiPaperAirplane />
            </button>
          </form>
        </>
      ) : (
        <div className="flex flex-col flex-1 items-center justify-center text-center p-8">
          <HiChatAlt2 className="text-6xl text-[#20c7ff] mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Welcome to V-Chat!
          </h2>
          <p className="text-gray-500 max-w-md">
            Select a user from the left panel to start a conversation. Your
            messages will appear here.
          </p>
        </div>
      )}
    </div>
  );
}

export default MessageArea;


