import React, { useState, useEffect } from "react";
import { fetcher } from "../utils/api";

interface Room {
  id: string;
  name: string;
}

interface RoomSidebarProps {
  username: string;
}

const RoomSidebar: React.FC<RoomSidebarProps> = ({ username }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState<string | null>(null);

  // We'll make this dynamic in the next steps
  const activeRoom = "General";

  useEffect(() => {
    const getRooms = async () => {
      try {
        const roomData = await fetcher("/rooms");
        setRooms(roomData);
      } catch (err: any) {
        setError(err.message);
      }
    };
    getRooms();
  }, []);

  return (
    <aside className="flex flex-col h-full w-72 bg-gray-50 text-gray-800 shrink-0 border-r border-gray-200">
      <header className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">ChatRooms</h1>
      </header>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {error && <p className="text-red-500">Error: {error}</p>}
        <div>
          <h2 className="text-xs font-bold uppercase text-gray-500 mb-2 px-2">
            My Chatrooms
          </h2>
          <ul>
            {rooms.map((room) => (
              <li key={room.id}>
                <a
                  href="#"
                  className={`flex items-center p-2 rounded-md font-medium ${
                    room.name === activeRoom
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                >
                  <span className="mr-2 text-gray-400">#</span>
                  {room.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <footer className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold mr-3 shrink-0">
            {username.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-gray-900 truncate">{username}</span>
        </div>
      </footer>
    </aside>
  );
};

export default RoomSidebar;
