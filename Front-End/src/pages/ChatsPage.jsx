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
      console.log(response.data);
      setChats(response.data);

      // Extract unique sender emails correctly
     const uniqueEmails = response.data
      .filter((roomId) => roomId && roomId.includes("_")) // Remove nulls and invalid data
      .map((roomId) => roomId.split("_")[0]); // Extract sender's email

    console.log("Extracted Emails:", uniqueEmails); // Debugging

    setChats(response.data);

      console.log("Extracted Emails:", uniqueEmails); // Debugging

      if (uniqueEmails.length > 0) {
        fetchNames(uniqueEmails);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const fetchNames = async (emails) => {
    try {
      const updatedNames = { ...names };

      await Promise.all(
        emails.map(async (senderEmail) => {
          if (!updatedNames[senderEmail]) {
            try {
              console.log(`Fetching name for: ${senderEmail}`); // Debugging
              const res = await axios.get(
                "https://samaan-pooling.onrender.com/api/users/name",
                { params: { email: senderEmail } } // ✅ Corrected param
              );

              updatedNames[senderEmail] =
                res.data !== "User not found" ? res.data : senderEmail; // Fallback to email if user not found
            } catch (error) {
              console.error(`Error fetching name for ${senderEmail}:`, error.message);
              updatedNames[senderEmail] = senderEmail; // Fallback to email
            }
          }
        })
      );

      setNames(updatedNames);
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
