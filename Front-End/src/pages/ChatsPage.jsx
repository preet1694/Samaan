import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ChatsPage = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState({}); // Stores chats
  const [names, setNames] = useState({}); // Stores email-to-name mapping
  const email = localStorage.getItem("email"); // Carrier's email

  useEffect(() => {
    if (email) {
      fetchChats();
    }
  }, [email]);

  const fetchChats = async () => {
    try {
      const response = await axios.get(
        "https://samaan-pooling.onrender.com/api/chat/rooms",
        { params: { email } }
      );
      setChats(response.data);

      // Extract unique sender emails
      const uniqueEmails = [...new Set(Object.keys(response.data))];
      if (uniqueEmails.length > 0) {
        fetchNames(uniqueEmails);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const fetchNames = async (emails) => {
    try {
      const nameMapping = { ...names }; // Clone existing names

      await Promise.all(
        emails.map(async (senderEmail) => {
          if (!nameMapping[senderEmail]) {
            try {
              const res = await axios.get(
                "https://samaan-pooling.onrender.com/api/users/name",
                { params: { email: senderEmail } }
              );
              nameMapping[senderEmail] = res.data || senderEmail; // Fallback to email
            } catch (error) {
              console.error(`Error fetching name for ${senderEmail}:`, error);
              nameMapping[senderEmail] = senderEmail;
            }
          }
        })
      );

      setNames(nameMapping); // Update state once all names are fetched
    } catch (error) {
      console.error("Error in fetchNames:", error);
    }
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
                onClick={() =>
                  navigate(`/join-chat?roomId=${senderEmail}_${email}`)
                }
              >
                <span className="font-medium text-indigo-600">
                  {names[senderEmail] || senderEmail}
                </span>
                <p className="text-sm text-gray-500">
                  Last message:{" "}
                  {chats[senderEmail]?.[chats[senderEmail].length - 1]?.content || "No messages"}
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
