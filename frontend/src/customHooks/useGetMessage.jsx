import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setMessages } from "../redux/messageSlice";
import { serverUrl } from "../main";

export default function useGetMessage(selectedUser) {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages);

  useEffect(() => {
    if (!selectedUser || !selectedUser._id) return;
    if (messages && messages.length > 0) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/message/get/${selectedUser._id}`, {
          withCredentials: true,
        });
        dispatch(setMessages(res.data));
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [selectedUser, dispatch, messages]);
}
