import React from "react";
import { getColorForUser } from "../utils/colors";

interface UserListProps {
  users: string[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  return (
    <div className="flex flex-col h-full bg-gray-50 p-4 border-r border-gray-200">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
        Online ({users.length})
      </h2>
      <ul className="space-y-3">
        {users.map((username) => (
          <li key={username} className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 ${getColorForUser(
                username
              )}`}
            >
              {username.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-gray-700 truncate">
              {username}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
