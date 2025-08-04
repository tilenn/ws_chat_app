import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";

interface Message {
  author: string;
  content: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Connect to the server with the token
    const socket = io("http://localhost:3000", {
      auth: {
        token,
      },
    });
    socketRef.current = socket;

    // --- Socket Event Handlers ---
    socket.on("connect", () => {
      console.log("Connected to chat server!");
    });

    socket.on("chat_message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
      // If auth fails, token is likely invalid, so log out
      if (err.message.includes("Authentication error")) {
        handleLogout();
      }
    });

    // Cleanup on component unmount
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
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">General Chat</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className="flex">
              <div className="p-3 rounded-lg bg-white shadow max-w-lg">
                <p className="font-bold text-indigo-600">{msg.author}</p>
                <p className="text-gray-800">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="p-4 bg-white border-t">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-r-md hover:bg-indigo-700"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatPage;
