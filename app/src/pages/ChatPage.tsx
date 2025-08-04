import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import UserList from "../components/UserList";
import MessageBubble from "../components/MessageBubble";

interface Message {
  author: string;
  content: string;
}

interface DecodedToken {
  username: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<DecodedToken | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    const decoded = jwtDecode<DecodedToken>(token);
    setCurrentUser(decoded);

    const socket = io("http://localhost:3000", { auth: { token } });
    socketRef.current = socket;

    socket.on("connect", () => console.log("Connected to chat server!"));
    socket.on("chat_message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    socket.on("connect_error", (err) => {
      if (err.message.includes("Authentication error")) handleLogout();
    });

    return () => {
      socket.disconnect();
    };
  }, [navigate]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && socketRef.current) {
      socketRef.current.emit("chat_message", newMessage);
      setNewMessage("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-80">
        <UserList />
      </aside>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between p-4 bg-white shadow-md">
          <h1 className="text-2xl font-bold text-gray-800">
            The Justice League
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </header>

        {/* Message List */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <MessageBubble
                key={index}
                message={msg}
                isOwnMessage={msg.author === currentUser?.username}
              />
            ))}
          </div>
        </main>

        {/* Message Input */}
        <footer className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="ml-4 px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Send
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default ChatPage;
