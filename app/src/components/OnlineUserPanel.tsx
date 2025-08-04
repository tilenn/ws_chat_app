import React from "react";
import { getColorForUser } from "../utils/colors";

// We'll replace this with real data later
const DUMMY_ONLINE_USERS = [
  "Clark Kent",
  "John Stewart",
  "Diana Prince",
  "Bruce Wayne",
];

const OnlineUserPanel: React.FC = () => {
  return (
    // 1. Make the container a flex column and remove padding
    <aside className="w-64 bg-gray-50 border-l border-gray-200 flex flex-col">
      {/* 2. Create a header that mirrors the chat panel's header */}
      <header className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-bold uppercase text-gray-500">Members</h3>
      </header>

      {/* 3. Create a scrollable content area with its own padding */}
      <div className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-3">
          {DUMMY_ONLINE_USERS.map((username) => (
            <li key={username} className="flex items-center space-x-3">
              <div className="relative">
                <div
                  // 4. Change avatar from circle (rounded-full) to rounded square (rounded-lg)
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shrink-0 ${getColorForUser(
                    username
                  )}`}
                >
                  {username.charAt(0).toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
              </div>
              <span className="font-medium text-gray-700 truncate">
                {username}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default OnlineUserPanel;
