import React, { useState } from "react";
import { getColorForUser } from "../utils/colors";
import type { Message } from "../types/chat";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  onLike: (messageId: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  onLike,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const authorInitial = message.author.charAt(0).toUpperCase();

  const formattedTime = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const handleDoubleClick = () => {
    onLike(message.id);
    setIsLiked(true);
    setTimeout(() => setIsLiked(false), 600); // Duration of the animation
  };

  const bubbleStyle = isOwnMessage
    ? "bg-indigo-500 text-white"
    : "bg-gray-200 text-gray-800";

  return (
    <div
      className={`flex ${
        isOwnMessage ? "justify-end" : "items-start space-x-4"
      }`}
      onDoubleClick={handleDoubleClick}
    >
      {!isOwnMessage && (
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shrink-0 ${getColorForUser(
            message.author
          )}`}
        >
          {authorInitial}
        </div>
      )}

      <div className="flex flex-col min-w-0">
        {!isOwnMessage && (
          <div className="flex items-baseline space-x-2">
            <span className="font-bold text-gray-900">{message.author}</span>
            <span className="text-xs text-gray-500">{formattedTime}</span>
          </div>
        )}

        <div
          className={`relative mt-1 px-4 py-2 rounded-lg inline-block max-w-lg ${bubbleStyle}`}
        >
          <p className="break-all">{message.content}</p>
          {isLiked && <div className="like-animation">❤️</div>}
          {message.likes > 0 && (
            <div
              className={`absolute -bottom-2.5 right-2 text-xs px-1.5 py-0.5 rounded-full ${
                isOwnMessage
                  ? "bg-white text-indigo-500"
                  : "bg-white text-gray-600"
              }`}
            >
              ❤️ {message.likes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
