import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const Chat = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Fetch sender email from localStorage
    const senderEmail = localStorage.getItem("email");
    const carrierEmail = location.state?.carrierEmail;

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [notification, setNotification] = useState("");
    const stompClientRef = useRef(null);
    const messagesEndRef = useRef(null); // For auto-scrolling

    // Ensure sender and carrier emails exist
    useEffect(() => {
        if (!senderEmail || !carrierEmail) {
            alert("Error: Missing sender or carrier email. Redirecting...");
            navigate("/");
        }
    }, [senderEmail, carrierEmail, navigate]);

    const roomId = senderEmail && carrierEmail ? `${senderEmail}_${carrierEmail}` : null;

    useEffect(() => {
        if (!roomId) return;

        const stompClient = Stomp.over(new SockJS("http://localhost:8080/ws"));

        stompClient.connect({}, () => {
            console.log("✅ Connected to WebSocket");

            stompClient.subscribe(`/topic/chat/${roomId}`, (msg) => {
                const receivedMessage = JSON.parse(msg.body);
                setMessages((prev) => [...prev, receivedMessage]);
            });

            // Fetch chat history from database
            fetch(`http://localhost:8080/api/chat/history?roomId=${roomId}`)
                .then((res) => res.json())
                .then((data) => setMessages(data))
                .catch((err) => console.error("Error fetching chat history:", err));
        });

        stompClientRef.current = stompClient;

        return () => {
            if (stompClientRef.current && stompClientRef.current.connected) {
                console.log("🔴 Disconnecting WebSocket...");
                stompClientRef.current.disconnect();
            }
        };
    }, [roomId]);

    useEffect(() => {
        if (!carrierEmail) return;

        const socket = new SockJS("http://localhost:8080/ws");
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            stompClient.subscribe(`/topic/notifications/${carrierEmail}`, (msg) => {
                setNotification(msg.body);
            });
        });

        return () => {
            if (stompClient.connected) {
                stompClient.disconnect();
            }
        };
    }, [carrierEmail]);

    const sendMessage = () => {
        if (!roomId || !message.trim() || !stompClientRef.current || !stompClientRef.current.connected) {
            console.error("❌ WebSocket is not connected. Message not sent.");
            return;
        }

        const chatMessage = { roomId, sender: senderEmail, receiver: carrierEmail, message };

        // Send message via WebSocket - Backend will store it
        stompClientRef.current.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));

        // Directly update local state to reflect the new message immediately
        setMessages(prevMessages => [...prevMessages, chatMessage]);

        setMessage("");
    };


    // Auto-scroll to the last message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="p-4 max-w-lg mx-auto bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Chat Room</h2>

            {/* Show Notification */}
            {notification && <p className="text-red-500">{notification}</p>}

            {/* Messages Display */}
            <div className="border border-gray-300 p-3 rounded h-64 overflow-y-auto flex flex-col">
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-2 my-1 max-w-[70%] rounded-lg ${
                                msg.sender === senderEmail
                                    ? "ml-auto bg-blue-100 text-blue-800 text-right" // Sender (Right side)
                                    : "mr-auto bg-gray-200 text-gray-800 text-left" // Receiver (Left side)
                            }`}
                        >
                            <strong>{msg.sender === senderEmail ? "You" : msg.sender}:</strong> {msg.message}
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No messages yet</p>
                )}

                {/* Invisible div to track last message and scroll into view */}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="mt-3 flex">
                <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button className="ml-2 bg-blue-500 text-white px-4 py-2 rounded" onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
