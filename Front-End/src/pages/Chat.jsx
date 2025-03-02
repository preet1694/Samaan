import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const Chat = () => {
    const location = useLocation();
    const { senderEmail, carrierEmail } = location.state || {};
    const roomId = senderEmail && carrierEmail ? `${senderEmail}_${carrierEmail}` : null;

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [notification, setNotification] = useState("");
    const stompClientRef = useRef(null);

    // Connect to WebSocket
    useEffect(() => {
        if (!roomId) return;

        const socket = new SockJS("http://localhost:8080/ws");
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, () => {
            stompClient.subscribe(`/topic/chat/${roomId}`, (message) => {
                setMessages((prev) => [...prev, JSON.parse(message.body)]);
            });
        });

        stompClientRef.current = stompClient;

        return () => {
            if (stompClientRef.current) stompClientRef.current.disconnect();
        };
    }, [roomId]);

    // Listen for notifications
    useEffect(() => {
        if (!carrierEmail) return;

        const socket = new SockJS("http://localhost:8080/ws");
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, () => {
            stompClient.subscribe(`/topic/notifications/${carrierEmail}`, (message) => {
                setNotification(message.body);
            });
        });

        return () => {
            stompClient.disconnect();
        };
    }, [carrierEmail]);

    // Handle sending messages
    const sendMessage = () => {
        if (!roomId || !message.trim() || !stompClientRef.current) return;

        const chatMessage = { roomId, sender: senderEmail, receiver: carrierEmail, message };
        stompClientRef.current.send("/app/sendMessage", {}, JSON.stringify(chatMessage));

        setMessage("");
    };

    return (
        <div className="p-4 max-w-lg mx-auto bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Chat Room</h2>

            {notification && <p className="text-red-500">{notification}</p>}

            <div className="border border-gray-300 p-3 rounded h-64 overflow-y-auto">
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <p key={index} className={`p-2 ${msg.sender === senderEmail ? "text-blue-600" : "text-gray-800"}`}>
                            <strong>{msg.sender}:</strong> {msg.message}
                        </p>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No messages yet</p>
                )}
            </div>

            <div className="mt-3 flex">
                <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button className="ml-2 bg-blue-500 text-white px-4 py-2 rounded" onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
