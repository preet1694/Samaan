import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChatsPage = () => {
  const [chats, setChats] = useState({});
  const [names, setNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [unreadMap, setUnreadMap] = useState({});
  const carrierEmail = localStorage.getItem("email");
  const navigate = useNavigate();

  useEffect(() => {
    if (!carrierEmail) return;

    const fetchChats = async () => {
      try {
        const response = await axios.get(
          "https://samaan-pooling.onrender.com/api/chat/all",
          {
            params: { carrierEmail },
          }
        );

        setChats(response.data);

        const unread = {};
        for (const email in response.data) {
          const msgs = response.data[email];
          const hasUnread = msgs.some(
            (msg) => msg.senderEmail === email && msg.read === false
          );
          unread[email] = hasUnread;
        }
        setUnreadMap(unread);

        const uniqueEmails = [...new Set(Object.keys(response.data))];
        await fetchNames(uniqueEmails);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [carrierEmail]);

  const fetchNames = async (emails) => {
    const updatedNames = { ...names };
    for (const email of emails) {
      try {
        const res = await axios.get(
          "https://samaan-pooling.onrender.com/api/users/name",
          {
            params: { email },
          }
        );
        updatedNames[email] = res.data;
      } catch {
        updatedNames[email] = email;
      }
    }
    setNames(updatedNames);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-pulse text-lg text-gray-600">
          Loading chats...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">
        Chats with Senders
      </h1>
      <ul className="space-y-4">
        {Object.keys(chats).map((senderEmail) => {
          const isUnread = unreadMap[senderEmail];

          return (
            <li
              key={senderEmail}
              onClick={() =>
                navigate(`/join-chat?roomId=${senderEmail}_${carrierEmail}`)
              }
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-5 rounded-xl shadow-sm transition-all duration-200 cursor-pointer ${
                isUnread
                  ? "bg-indigo-100 border-l-4 border-indigo-500 animate-pulse-fast"
                  : "bg-gray-50 hover:shadow-md hover:bg-gray-100"
              }`}
            >
              <div>
                <div className="text-lg sm:text-xl font-semibold text-indigo-700 truncate">
                  {names[senderEmail] || senderEmail}
                </div>
                <div className="text-sm text-gray-600 mt-1 truncate max-w-full">
                  Last message:{" "}
                  <span className={`italic ${isUnread ? "font-bold" : ""}`}>
                    {chats[senderEmail][chats[senderEmail].length - 1]
                      ?.message || "No message"}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-400 sm:text-sm hidden sm:block">
                Tap to open chat →
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatsPage;
