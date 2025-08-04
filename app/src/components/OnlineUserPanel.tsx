import React from "react";
import { getColorForUser } from "../utils/colors";

interface OnlineUserPanelProps {
  users: string[];
}

const OnlineUserPanel: React.FC<OnlineUserPanelProps> = ({ users }) => {
  return (
    <aside className="w-64 bg-gray-50 border-l border-gray-200 flex flex-col">
      <header className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-bold uppercase text-gray-500">
          All members ({users.length})
        </h3>
      </header>

      <div className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-3">
          {users.map((username) => (
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
      </div>
    </aside>
  );
};

export default OnlineUserPanel;
