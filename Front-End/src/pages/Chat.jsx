import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import { FaSmile } from "react-icons/fa";

const Chat = () => {
  const location = useLocation();
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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!roomId || !loggedInUserEmail || !receiverEmail) {
      setNotification("⚠️ Chat setup issue. Please restart chat.");
      return;
    }

    fetchUserName(loggedInUserEmail, setSenderName);
    fetchUserName(receiverEmail, setReceiverName);
  }, [roomId, loggedInUserEmail, receiverEmail]);

  const fetchUserName = async (email, setName) => {
    try {
      const res = await axios.get(
        "https://samaan-pooling.onrender.com/api/users/name",
        { params: { email } }
      );
      setName(res.data);
    } catch {
      setName(email);
    }
  };

  useEffect(() => {
    if (!roomId) return;

    const stompClient = Stomp.over(
      new SockJS("https://samaan-pooling.onrender.com/ws")
    );

    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/chat/${roomId}`, (msg) => {
        const receivedMessage = JSON.parse(msg.body);
        setMessages((prev) =>
          prev.some(
            (m) =>
              m.message === receivedMessage.message &&
              m.senderEmail === receivedMessage.senderEmail
          )
            ? prev
            : [...prev, receivedMessage]
        );
      });

      fetch(
        `https://samaan-pooling.onrender.com/api/chat/history?roomId=${roomId}`
      )
        .then((res) => res.json())
        .then((data) => {
          setMessages(data);
          axios.post(
            "https://samaan-pooling.onrender.com/api/chat/mark-read",
            {},
            {
              params: {
                roomId: roomId,
                email: loggedInUserEmail,
              },
            }
          );
        })

        .catch(console.error);
    });

    stompClientRef.current = stompClient;

    return () => {
      stompClientRef.current?.connected && stompClientRef.current.disconnect();
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
      stompClient.connected && stompClient.disconnect();
    };
  }, [receiverEmail]);

  const sendMessage = () => {
    if (!roomId || !message.trim() || !receiverEmail) return;
    if (!stompClientRef.current?.connected) return;

    const chatMessage = {
      roomId,
      senderEmail: loggedInUserEmail,
      carrierEmail: receiverEmail,
      message: message.trim(),
      senderRole: userRole,
      timestamp: new Date().toISOString(),
    };

    stompClientRef.current.send(
      "/app/chat.sendMessage",
      {},
      JSON.stringify(chatMessage)
    );

    setMessages((prev) => [...prev, chatMessage]);
    setMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="flex justify-center items-center h-[80vh] min-h-[500px] bg-gradient-to-br from-purple-00 via-white to-green-200 px-4 py-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col h-full min-h-[500px] p-4 sm:p-6 transition-all duration-300">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center text-indigo-700">
          Chat with: {receiverName || receiverEmail}
        </h2>

        {notification && (
          <p className="text-red-500 text-sm mb-2 text-center">
            {notification}
          </p>
        )}

        <div className="flex-1 overflow-y-auto bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex flex-col gap-3 mb-4 shadow-inner">
          {messages.length === 0 ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`self-${
                    i % 2 === 0 ? "end" : "start"
                  } bg-gray-300 rounded-2xl px-4 py-2 animate-pulse`}
                  style={{
                    width: "60%",
                    height: "50px",
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`px-4 py-2 rounded-2xl shadow-md text-sm animate-fadeIn break-words ${
                  msg.senderEmail === loggedInUserEmail
                    ? "self-end bg-indigo-100 text-indigo-900"
                    : "self-start bg-gray-200 text-gray-800"
                }`}
                style={{ maxWidth: "75%" }}
              >
                <p className="font-semibold mb-1 text-xs">
                  {msg.senderEmail === loggedInUserEmail ? "You" : receiverName}
                </p>
                <p className="whitespace-pre-wrap">{msg.message}</p>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="relative mt-2">
          {showEmojiPicker && (
            <div className="absolute bottom-14 z-10 max-h-60 overflow-y-auto">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="text-yellow-500 text-xl hover:text-yellow-600"
              title="Emoji"
            >
              <FaSmile />
            </button>

            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 min-w-[60%] px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
