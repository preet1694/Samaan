import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ChatsPage = () => {
    const navigate = useNavigate();
    const [chats, setChats] = useState({});
    const [names, setNames] = useState({}); // Stores email-to-name mapping
    const carrierEmail = localStorage.getItem("email");

    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            const response = await axios.get("https://samaan-pooling.onrender.com/api/chat/all", { params: { carrierEmail } });
            setChats(response.data);

            // Fetch names for each sender email
            const uniqueEmails = [...new Set(Object.keys(response.data))];
            fetchNames(uniqueEmails);
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    };

    const fetchNames = async (emails) => {
        const updatedNames = { ...names };
        await Promise.all(
            emails.map(async (email) => {
                if (!updatedNames[email]) {
                    try {
                        const res = await axios.get("https://samaan-pooling.onrender.com/api/users/name", { params: { email } });
                        updatedNames[email] = res.data;
                    } catch (error) {
                        console.error(`Error fetching name for ${email}:`, error);
                        updatedNames[email] = email; // Fallback to email
                    }
                }
            })
        );
        setNames(updatedNames);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Chats</h2>
                <ul>
                    {Object.keys(chats).length > 0 ? (
                        Object.keys(chats).map((senderEmail) => (
                            <li
                                key={senderEmail}
                                className="p-4 border-b cursor-pointer hover:bg-gray-100"
                                onClick={() => navigate(`/join-chat?roomId=${senderEmail}_${carrierEmail}`)}
                            >
                                <span className="font-medium text-indigo-600">{names[senderEmail] || senderEmail}</span>
                                <p className="text-sm text-gray-500">
                                    Last message: {chats[senderEmail][chats[senderEmail].length - 1]?.content}
                                </p>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500">No chats available.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ChatsPage;
