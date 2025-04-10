import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ChatsPage = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState({});
  const [names, setNames] = useState({});
  const [loading, setLoading] = useState(true);
  const carrierEmail = localStorage.getItem("email");

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await axios.get(
        "https://samaan-pooling.onrender.com/api/chat/all",
        {
          params: { carrierEmail },
        }
      );
      setChats(response.data);

      const uniqueEmails = [...new Set(Object.keys(response.data))];
      await fetchNames(uniqueEmails);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNames = async (emails) => {
    const updatedNames = { ...names };
    await Promise.all(
      emails.map(async (email) => {
        if (!updatedNames[email]) {
          try {
            const res = await axios.get(
              "https://samaan-pooling.onrender.com/api/users/name",
              { params: { email } }
            );
            updatedNames[email] = res.data;
          } catch (error) {
            console.error(`Error fetching name for ${email}:`, error);
            updatedNames[email] = email;
          }
        }
      })
    );
    setNames(updatedNames);
  };

  const renderSkeleton = () => (
    <ul className="space-y-4">
      {[...Array(4)].map((_, idx) => (
        <li
          key={idx}
          className="p-5 bg-gray-200 animate-pulse rounded-xl shadow-sm"
        >
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-2" />
          <div className="h-3 bg-gray-300 rounded w-2/3" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-4 sm:p-6">
      <div className="max-w-5xl mx-auto bg-white p-4 sm:p-6 rounded-2xl shadow-lg animate-fadeIn">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center sm:text-left">
          Your Chats
        </h2>

        {loading ? (
          renderSkeleton()
        ) : Object.keys(chats).length > 0 ? (
          <ul className="space-y-4">
            {Object.keys(chats).map((senderEmail) => (
              <li
                key={senderEmail}
                onClick={() =>
                  navigate(`/join-chat?roomId=${senderEmail}_${carrierEmail}`)
                }
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-100 cursor-pointer transition-all duration-200"
              >
                <div>
                  <div className="text-lg sm:text-xl font-semibold text-indigo-700 truncate">
                    {names[senderEmail] || senderEmail}
                  </div>
                  <div className="text-sm text-gray-600 mt-1 truncate max-w-full">
                    Last message:{" "}
                    <span className="italic">
                      {chats[senderEmail][chats[senderEmail].length - 1]
                        ?.content || "No message"}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-400 sm:text-sm hidden sm:block">
                  Tap to open chat →
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-8">No chats available.</p>
        )}
      </div>
    </div>
  );
};

export default ChatsPage;
