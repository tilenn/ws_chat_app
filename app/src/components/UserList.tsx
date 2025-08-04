import React from "react";

// We'll replace this with real data from the server later
const DUMMY_USERS = [
  { username: "Clark Kent", initial: "C", color: "bg-cyan-500" },
  { username: "John Stewart", initial: "J", color: "bg-green-500" },
  { username: "Diana Prince", initial: "D", color: "bg-red-500" },
];

const UserList: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-gray-50 p-4 border-r border-gray-200">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
        Online Users
      </h2>
      <ul className="space-y-3">
        {DUMMY_USERS.map((user) => (
          <li key={user.username} className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${user.color}`}
            >
              {user.initial}
            </div>
            <span className="font-medium text-gray-700">{user.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
