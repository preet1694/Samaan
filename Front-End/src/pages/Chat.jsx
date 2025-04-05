import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import axios from "axios";

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const urlRoomId = queryParams.get("roomId") || "";
  const storedRoomId = localStorage.getItem("roomId");
  const roomId = urlRoomId || storedRoomId;

  const loggedInUserEmail = localStorage.getItem("email");
  const userRole = localStorage.getItem("userRole");

  const getReceiverEmail = () => {
    if (!roomId || !loggedInUserEmail) return null;
    const emails = roomId.split("_");
    return emails.find((email) => email !== loggedInUserEmail) || null;
  };
  const receiverEmail = getReceiverEmail();

  useEffect(() => {
    if (roomId) {
      localStorage.setItem("roomId", roomId);
    }
  }, [roomId]);

  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [notification, setNotification] = useState("");
  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!roomId) {
      setNotification("⚠️ Chat room not found. Please start a new chat.");
      return;
    }
    if (!loggedInUserEmail) {
      setNotification("⚠️ You are not logged in. Please log in again.");
      return;
    }
    if (!receiverEmail) {
      setNotification("⚠️ Chat recipient not found. Please try again.");
      return;
    }

    fetchUserName(loggedInUserEmail, setSenderName);
    fetchUserName(receiverEmail, setReceiverName);
  }, [roomId, loggedInUserEmail, receiverEmail]);

  const fetchUserName = async (email, setName) => {
    try {
      const response = await axios.get(
        "https://samaan-pooling.onrender.com/api/users/name",
        {
          params: { email },
        }
      );
      setName(response.data);
    } catch (error) {
      setName(email);
    }
  };

  useEffect(() => {
    if (!roomId) return;

    const stompClient = Stomp.over(
      new SockJS("https://samaan-pooling.onrender.com/ws")
    );

    stompClient.connect({}, () => {
      stompClient.unsubscribe(`/topic/chat/${roomId}`);
      stompClient.subscribe(`/topic/chat/${roomId}`, (msg) => {
        const receivedMessage = JSON.parse(msg.body);

        setMessages((prev) => {
          if (
            prev.some(
              (m) =>
                m.message === receivedMessage.message &&
                m.senderEmail === receivedMessage.senderEmail
            )
          ) {
            return prev;
          }
          return [...prev, receivedMessage];
        });
      });

      fetch(
        `https://samaan-pooling.onrender.com/api/chat/history?roomId=${roomId}`
      )
        .then((res) => res.json())
        .then((data) => setMessages(data))
        .catch((err) => console.error("Error fetching chat history:", err));
    });

    stompClientRef.current = stompClient;

    return () => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.disconnect();
      }
    };
  }, [roomId]);

  useEffect(() => {
    if (!receiverEmail) return;

    const socket = new SockJS("https://samaan-pooling.onrender.com/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/notifications/${receiverEmail}`, (msg) => {
        setNotification(msg.body);
      });
    });

    return () => {
      if (stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, [receiverEmail]);

  const sendMessage = () => {
    if (!roomId || !message.trim() || !receiverEmail) {
      console.error(
        "Error: Missing required fields (roomId, message, receiverEmail)."
      );
      return;
    }

    if (!stompClientRef.current || !stompClientRef.current.connected) {
      console.error("WebSocket is not connected.");
      return;
    }

    const chatMessage = {
      roomId: roomId,
      senderEmail: loggedInUserEmail,
      carrierEmail: receiverEmail,
      message: message.trim(),
      senderRole: userRole,
      timestamp: new Date().toISOString(),
    };

    console.log("Sending message:", chatMessage);

    stompClientRef.current.send(
      "/app/chat.sendMessage",
      {},
      JSON.stringify(chatMessage)
    );

    setMessages((prevMessages) => [...prevMessages, chatMessage]);
    setMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="p-4 max-w-lg mt-14 mb-20 mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        Chat with: {receiverName || receiverEmail}
      </h2>

      {notification && <p className="text-red-500">{notification}</p>}

      <div className="border border-gray-300 p-3 rounded min-h-96 overflow-y-auto flex flex-col">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 my-1 max-w-[90%] rounded-lg ${
                msg.senderEmail === loggedInUserEmail
                  ? "ml-auto bg-blue-100 text-blue-800 text-right"
                  : "mr-auto bg-gray-200 text-gray-800 text-left"
              }`}
            >
              <strong>
                {msg.senderEmail === loggedInUserEmail ? "You" : receiverName}:
              </strong>{" "}
              {msg.message}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages yet</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-3 flex">
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
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
