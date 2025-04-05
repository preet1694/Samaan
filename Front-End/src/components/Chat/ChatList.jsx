import React from "react";
import { User } from "lucide-react";

export const ChatList = ({ onSelectChat }) => {
  return (
    <div className="w-80 border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Messages</h2>
      </div>
      <div className="overflow-y-auto">
        {chats.map((chat) => (
          <button
            key={chat.id}
            className="w-full p-4 border-b border-gray-200 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
            onClick={() => onSelectChat(chat)}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-10 w-10 text-gray-400 bg-gray-100 rounded-full p-2" />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {chat.name}
                  </p>
                  <p className="text-xs text-gray-500">{chat.timestamp}</p>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage}
                  </p>
                  {chat.unread > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-indigo-600 rounded-full">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
