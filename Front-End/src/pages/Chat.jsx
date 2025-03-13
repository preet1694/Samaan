import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import axios from "axios";

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const roomId =
    localStorage.getItem("roomId") || queryParams.get("roomId") || "";

  const loggedInUserEmail = localStorage.getItem("email");
  const userRole = localStorage.getItem("userRole");

  const getReceiverEmail = () => {
    if (!roomId || !loggedInUserEmail) return null;
    const emails = roomId.split("_");
    return emails[0] === loggedInUserEmail ? emails[1] : emails[0];
  };
  const receiverEmail =
    localStorage.getItem("carrierEmail") || getReceiverEmail();

  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [notification, setNotification] = useState("");
  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!roomId || !loggedInUserEmail || !receiverEmail) {
      alert("Error: Missing chat details. Redirecting...");
      navigate("/chats");
      return;
    }

    fetchUserName(loggedInUserEmail, setSenderName);
    fetchUserName(receiverEmail, setReceiverName);
  }, [roomId, loggedInUserEmail, receiverEmail, navigate]);

  const fetchUserName = async (email, setName) => {
    try {
      const response = await axios.get(
        "https://samaan-pooling.onrender.com/api/users/name",
        { params: { email } }
      );
      setName(response.data);
    } catch (error) {
      setName(email);
    }
  };

  useEffect(() => {
    if (!roomId) return;

    const stompClient = new Client({
      brokerURL: "ws://samaan.onrender.com/ws",
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (msg) => console.log(msg),
      onConnect: () => {
        console.log("✅ Connected to WebSocket");

        stompClient.subscribe(`/topic/chat/${roomId}`, (msg) => {
          const receivedMessage = JSON.parse(msg.body);
          setMessages((prev) => [...prev, receivedMessage]);
        });
      },
      onStompError: (frame) => {
        console.error("❌ STOMP Error:", frame);
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      if (stompClient.active) {
        stompClient.deactivate();
      }
    };
  }, [roomId]);

  const sendMessage = () => {
    if (
      !roomId ||
      !message.trim() ||
      !stompClientRef.current ||
      !stompClientRef.current.active
    ) {
      console.error("❌ WebSocket is not connected. Message not sent.");
      return;
    }

    const chatMessage = {
      roomId,
      senderEmail: loggedInUserEmail,
      receiverEmail,
      message,
      senderRole: userRole,
      timestamp: new Date().toISOString(),
    };

    stompClientRef.current.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(chatMessage),
    });

    setMessages((prevMessages) => [...prevMessages, chatMessage]);
    setMessage("");
  };

  return (
    <div className="p-4 max-w-lg mt-14 mb-20 mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        Chat with: {receiverName || receiverEmail}
      </h2>

      {notification && <p className="text-red-500">{notification}</p>}

      <div className="border p-3 rounded min-h-96 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-1 rounded-lg ${
              msg.senderEmail === loggedInUserEmail
                ? "ml-auto bg-blue-100"
                : "mr-auto bg-gray-200"
            }`}
          >
            <strong>
              {msg.senderEmail === loggedInUserEmail ? "You" : receiverName}:
            </strong>{" "}
            {msg.message}
          </div>
        ))}
      </div>

      <div className="mt-3 flex">
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
