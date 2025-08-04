import React from "react";

interface UserListProps {
  users: string[];
}

const COLORS = [
  "bg-cyan-500",
  "bg-green-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-yellow-500",
  "bg-pink-500",
  "bg-blue-500",
  "bg-orange-500",
];

// This helper function creates a consistent color based on the username,
// so a user's color doesn't change when others join or leave.
const getColorForUser = (username: string) => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
};

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
