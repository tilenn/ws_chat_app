import React from "react";
import { getColorForUser } from "../utils/colors";

interface Message {
  author: string;
  content: string;
  createdAt?: string;
}

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
}) => {
  const authorInitial = message.author.charAt(0).toUpperCase();

  const formattedTime = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "00:00:00";

  // --- Render path for YOUR messages (aligned right) ---
  if (isOwnMessage) {
    return (
      <div className="flex justify-end">
        <div className="px-4 py-2 rounded-lg inline-block bg-indigo-500 text-white max-w-lg">
          <p className="break-all">{message.content}</p>
        </div>
      </div>
    );
  }

  // --- Render path for OTHER people's messages (aligned left) ---
  return (
    <div className="flex items-start space-x-4">
      {/* Avatar */}
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0 ${getColorForUser(
          message.author
        )}`}
      >
        {authorInitial}
      </div>

      {/* Content: Author + Message Bubble */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-baseline space-x-2">
          <span className="font-bold text-gray-900">{message.author}</span>
          <span className="text-xs text-gray-500">{formattedTime}</span>
        </div>
        <div className="mt-1 px-4 py-2 rounded-lg inline-block bg-gray-200 text-gray-800 max-w-lg">
          {/* 2. Use break-all here as well for consistency */}
          <p className="break-all">{message.content}</p>
        </div>{" "}
      </div>
    </div>
  );
};

export default MessageBubble;
