import React, { useEffect } from "react";
import chatIcon from "../assets/chat.png";
import toast from "react-hot-toast";
import { useChatContext } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext.jsx";
import { findOrCreateRoom } from "../services/RoomService";
import { useNavigate } from "react-router-dom";

const JoinCreateChat = () => {
  const { setRoomId, setCurrentUser, setConnected } = useChatContext();
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.email) {
      toast.error("Please log in first!");
      navigate("/login");
      return;
    }

    async function initializeChat() {
      try {
        const { roomId } = await findOrCreateRoom(auth.email);
        setRoomId(roomId);
        setCurrentUser(auth.email);
        setConnected(true);
        toast.success("Chat initialized successfully!");
        navigate("/chat");
      } catch (error) {
        toast.error("Error initializing chat!");
      }
    }

    initializeChat();
  }, [auth.email, navigate, setConnected, setCurrentUser, setRoomId]);

  return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-10 border w-full flex flex-col gap-5 max-w-md rounded bg-gray-900 shadow">
          <div>
            <img src={chatIcon} className="w-24 mx-auto" />
          </div>
          <h1 className="text-2xl font-semibold text-center text-white">Initializing Chat...</h1>
        </div>
      </div>
  );
};

export default JoinCreateChat;
