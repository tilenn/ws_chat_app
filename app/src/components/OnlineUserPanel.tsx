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
    <aside className="w-64 bg-gray-50 border-l border-gray-200 p-4">
      <h3 className="text-sm font-bold uppercase text-gray-500 mb-4">
        All members
      </h3>
      <ul className="space-y-3">
        {DUMMY_ONLINE_USERS.map((username) => (
          <li key={username} className="flex items-center space-x-3">
            <div className="relative">
              <div
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
    </aside>
  );
};

export default OnlineUserPanel;
