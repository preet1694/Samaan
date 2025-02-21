import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";

const Chat = ({ carrierId }) => {
    const [stompClient, setStompClient] = useState(null);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        connectWebSocket();
        return () => {
            disconnectWebSocket();
        };
    }, []);

    const connectWebSocket = () => {
        const socket = new SockJS("http://localhost:8080/ws");
        const client = over(socket);

        client.connect({}, () => {
            console.log("Connected to WebSocket");
            setStompClient(client);

            client.subscribe(`/topic/chat/${carrierId}`, (message) => {
                const receivedMessage = JSON.parse(message.body);
                setChatHistory((prevHistory) => [...prevHistory, receivedMessage]);
            });

            fetchChatHistory();
        });

        client.debug = () => {}; // Disable logs
    };

    const fetchChatHistory = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/chat/${carrierId}`);
            const data = await response.json();
            setChatHistory(data);
        } catch (error) {
            console.error("Failed to fetch chat history:", error);
        }
    };

    const sendMessage = () => {
        if (!stompClient || !stompClient.connected) {
            console.error("WebSocket is not connected.");
            return;
        }
        if (message.trim() === "") return;

        const chatMessage = {
            senderId: userId,
            carrierId: carrierId,
            content: message,
            timestamp: new Date().toISOString(),
        };

        stompClient.send(`/app/chat/${carrierId}`, {}, JSON.stringify(chatMessage));
        setMessage("");
    };

    const disconnectWebSocket = () => {
        if (stompClient && stompClient.connected) {
            stompClient.disconnect(() => {
                console.log("Disconnected from WebSocket");
            });
        }
    };

    return (
        <div className="chat-container">
            <h2>Chat with Carrier {carrierId}</h2>
            <div className="chat-box">
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`message ${msg.senderId === userId ? "sent" : "received"}`}>
                        <p>{msg.content}</p>
                        <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat; // ✅ Make sure to export correctly
