import React from 'react';
import { MessageInput } from './MessageInput';

export const ChatBox = ({ selectedChat }) => {
  const messages = [
    { id: 1, text: 'Hi, I\'m interested in carrying your package', sender: 'carrier', timestamp: '10:30 AM' },
    { id: 2, text: 'Great! When are you traveling?', sender: 'user', timestamp: '10:31 AM' },
    { id: 3, text: 'I\'ll be traveling on March 25th', sender: 'carrier', timestamp: '10:32 AM' },
  ];

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-lg font-medium text-gray-900">{selectedChat.name}</h2>
        <p className="text-sm text-gray-500">{selectedChat.status}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs mt-1 opacity-75">{message.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      <MessageInput onSend={(message) => console.log('Sending message:', message)} />
    </div>
  );
};