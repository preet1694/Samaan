import React, { useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import { useChatContext } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { baseURL } from "../config/AxiosHelper.jsx";
import { getMessages } from "../services/RoomService";
import { timeAgo } from "../config/helper";

const ChatPage = () => {
  const { roomId, currentUser, connected, setConnected, setRoomId, setCurrentUser } =
      useChatContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, navigate]);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  // Load previous messages
  useEffect(() => {
    async function loadMessages() {
      try {
        const messages = await getMessages(roomId);
        setMessages(messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }
    if (connected) {
      loadMessages();
    }
  }, [connected, roomId]);

  // WebSocket Connection
  useEffect(() => {
    const connectWebSocket = () => {
      const sock = new SockJS(`${baseURL}/chat`);
      const client = Stomp.over(sock);

      client.connect({}, () => {
        setStompClient(client);
        toast.success("Connected");

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        });
      });
    };

    if (connected) {
      connectWebSocket();
    }
  }, [roomId, connected]);

  // Send Message
  const sendMessage = () => {
    if (stompClient && connected && input.trim()) {
      const message = {
        sender: currentUser,
        content: input,
        roomId: roomId,
      };

      stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
      setInput("");
    }
  };

  return (
      <div className="dark:bg-gray-900 min-h-screen">
        <header className="fixed w-full bg-gray-800 py-5 shadow flex justify-around items-center text-white">
          <h1 className="text-xl font-semibold">Room: {roomId}</h1>
          <h1 className="text-xl font-semibold">User: {currentUser}</h1>
        </header>

        <main ref={chatBoxRef} className="py-20 px-10 w-2/3 mx-auto h-screen overflow-auto">
          {messages.map((message, index) => (
              <div key={index} className="flex my-2">
                <div className="p-3 max-w-xs rounded-lg shadow bg-gray-700 text-white">
                  <p className="text-sm font-bold">{message.sender}</p>
                  <p className="mt-1">{message.content}</p>
                  <p className="text-xs text-gray-300 mt-1">{timeAgo(message.timestamp)}</p>
                </div>
              </div>
          ))}
        </main>

        <div className="fixed bottom-4 w-full">
          <div className="h-16 pr-10 gap-4 flex items-center justify-between w-1/2 mx-auto bg-gray-800 rounded-full shadow-lg">
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                type="text"
                placeholder="Type your message..."
                className="w-full text-white bg-gray-900 border border-gray-700 px-5 py-2 rounded-full h-full focus:outline-none"
            />
            <button onClick={sendMessage} className="bg-green-600 hover:bg-green-800 h-10 w-10 flex justify-center items-center rounded-full">
              <MdSend size={20} color="white" />
            </button>
          </div>
        </div>
      </div>
  );
};

export default ChatPage;
