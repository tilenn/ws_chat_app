import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import RoomSidebar from "../components/RoomSidebar";
import MessageBubble from "../components/MessageBubble"; // We need this now
import OnlineUserPanel from "../components/OnlineUserPanel";

interface Message {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

interface DecodedToken {
  username: string;
}

const ChatPage: React.FC = () => {
  // Restore state for messages and the input
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<DecodedToken | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for auto-scrolling
  const navigate = useNavigate();

  // Restore the full useEffect for socket logic
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

    socket.on("message_history", (history: Message[]) => setMessages(history));
    socket.on("chat_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });
    socket.on("connect_error", (err) => {
      if (err.message.includes("Authentication error")) handleLogout();
    });

    return () => {
      socket.disconnect();
    };
  }, [navigate]);

  // Effect for auto-scrolling
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  if (!currentUser) return null;

  return (
    <div className="flex h-screen bg-white font-sans">
      <RoomSidebar username={currentUser.username} />

      {/* Middle Chat Panel */}
      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900"># General</h2>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-gray-600 hover:text-gray-900"
          >
            Logout
          </button>
        </header>

        {/* Message List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwnMessage={msg.author === currentUser.username}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <footer className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message #General`}
              className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </form>
        </footer>
      </main>

      {/* Right User Panel (Placeholder) */}
      <OnlineUserPanel />
    </div>
  );
};

export default ChatPage;
