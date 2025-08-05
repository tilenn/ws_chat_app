import React from "react";
import RoomSidebar from "../components/RoomSidebar";
import MessageBubble from "../components/MessageBubble";
import OnlineUserPanel from "../components/OnlineUserPanel";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";
import { useRooms } from "../hooks/useRooms";
import { useUsers } from "../hooks/useUsers";
import { useMessages } from "../hooks/useMessages";

const ChatPage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const socket = useSocket();
  const { rooms, activeRoom, setActiveRoom } = useRooms();
  const { allUsers, onlineUsers } = useUsers(socket);
  const { messages, newMessage, setNewMessage, sendMessage, messagesEndRef } =
    useMessages(socket, activeRoom);

  if (!currentUser) return null;

  return (
    <div className="flex h-screen bg-white font-sans">
      <RoomSidebar
        username={currentUser.username}
        rooms={rooms}
        activeRoomId={activeRoom?.id}
        onRoomSelect={setActiveRoom}
      />

      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {activeRoom ? `# ${activeRoom.name}` : "Select a room"}
          </h2>
          <button
            onClick={logout}
            className="text-sm font-semibold text-gray-600 hover:text-gray-900"
          >
            Logout
          </button>
        </header>

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

        <footer className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={sendMessage} className="relative">
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
