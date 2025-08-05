import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { fetcher } from "../utils/api";
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

interface Room {
  id: string;
  name: string;
}
interface User {
  id: string;
  username: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<DecodedToken | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]); // Add rooms state
  const [activeRoom, setActiveRoom] = useState<Room | null>(null); // Add activeRoom state
  const [allUsers, setAllUsers] = useState<User[]>([]); // State for ALL users
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]); // State for ONLINE usernames
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for auto-scrolling
  const navigate = useNavigate();

  // Effect to fetch initial data (rooms and all users)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    const decoded = jwtDecode<DecodedToken>(token);
    setCurrentUser(decoded);

    const getRooms = async () => {
      try {
        const roomData = await fetcher("/rooms");
        setRooms(roomData);
        if (roomData.length > 0) {
          setActiveRoom(roomData[0]);
        }
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    };

    const getAllUsers = async () => {
      try {
        const userData = await fetcher("/users");
        setAllUsers(userData);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    getRooms();
    getAllUsers();
  }, [navigate]);

  // Effect to establish and manage the persistent socket connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = io("http://localhost:3000", { auth: { token } });
    socketRef.current = socket;

    socket.on("connect", () => console.log("Socket connected!"));
    socket.on("update_user_list", (users: string[]) => setOnlineUsers(users));
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

  // Effect to join a room whenever the activeRoom changes
  useEffect(() => {
    if (activeRoom && socketRef.current) {
      setMessages([]);
      socketRef.current.emit("join_room", activeRoom.id);
    }
  }, [activeRoom]);

  // Effect for auto-scrolling
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleRoomSelect = (room: Room) => {
    setActiveRoom(room);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && activeRoom && socketRef.current) {
      socketRef.current.emit("chat_message", {
        roomId: activeRoom.id,
        content: newMessage,
      });
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
      <RoomSidebar
        username={currentUser.username}
        rooms={rooms}
        activeRoomId={activeRoom?.id}
        onRoomSelect={handleRoomSelect}
      />

      {/* Middle Chat Panel */}
      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {activeRoom ? `# ${activeRoom.name}` : "Select a room"}
          </h2>
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
              placeholder={
                activeRoom
                  ? `Message #${activeRoom.name}`
                  : "Select a room to start chatting"
              }
              className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={!activeRoom}
            />
          </form>
        </footer>
      </main>

      <OnlineUserPanel allUsers={allUsers} onlineUsernames={onlineUsers} />
    </div>
  );
};

export default ChatPage;
