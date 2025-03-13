import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs"; // ✅ Corrected STOMP import
import axios from "axios";

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get("roomId") || "";

  const loggedInUserEmail = localStorage.getItem("email"); // The actual chat sender's email
  const userRole = localStorage.getItem("userRole"); // Can be "sender" or "carrier"

  // Function to determine the receiver's email
  const getReceiverEmail = () => {
    if (!roomId || !loggedInUserEmail) return null;
    const emails = roomId.split("_");
    return emails[0] === loggedInUserEmail ? emails[1] : emails[0];
  };
  const receiverEmail =
    localStorage.getItem("carrierEmail") || getReceiverEmail();

  // State variables
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [notification, setNotification] = useState("");
  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!roomId || !loggedInUserEmail || !receiverEmail) {
      console.log("Room Id : ", roomId);
      console.log("loggedInUserEmail : ", loggedInUserEmail);
      console.log("receiverEmail : ", receiverEmail);
      alert("Error: Missing chat details. Redirecting...");
      navigate("/chats");
      return;
    }

    // Fetch sender's and receiver's names
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
      setName(email); // Fallback to email
    }
  };

  useEffect(() => {
    if (!roomId) return;

    const stompClient = new Client({
      brokerURL: "wss://samaan-pooling.onrender.com/ws", // ✅ Using 'wss://' for production
      reconnectDelay: 5000, // Auto-reconnect after 5 sec
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (msg) => console.log(msg), // Enable debug logs
      onConnect: () => {
        console.log("✅ Connected to WebSocket");

        stompClient.subscribe(`/topic/chat/${roomId}`, (msg) => {
          const receivedMessage = JSON.parse(msg.body);
          setMessages((prev) => [...prev, receivedMessage]);
        });

        stompClient.publish({
          destination: "/app/chat.history",
          body: JSON.stringify({ roomId }),
        });
      },
      onStompError: (frame) => {
        console.error("❌ STOMP Error:", frame);
      },
    });

    stompClient.activate(); // ✅ Start WebSocket connection
    stompClientRef.current = stompClient;

    return () => {
      if (stompClient.active) {
        stompClient.deactivate();
      }
    };
  }, [roomId]);

  useEffect(() => {
    if (!receiverEmail) return;

    const notificationClient = new Client({
      brokerURL: "wss://samaan-pooling.onrender.com/ws",
      reconnectDelay: 5000,
      onConnect: () => {
        notificationClient.subscribe(
          `/topic/notifications/${receiverEmail}`,
          (msg) => {
            setNotification(msg.body);
          }
        );
      },
    });

    notificationClient.activate();

    return () => {
      if (notificationClient.active) {
        notificationClient.deactivate();
      }
    };
  }, [receiverEmail]);

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
      receiverEmail: receiverEmail,
      message,
      senderRole: userRole,
      timestamp: new Date().toISOString(),
    };

    // console.log(
    //   `📨 Sending Message | Sender: ${loggedInUserEmail}, Receiver: ${receiverEmail}, Role: ${userRole}`
    // );

    stompClientRef.current.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(chatMessage),
    });

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
