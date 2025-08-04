import React from "react";

interface Message {
  author: string;
  content: string;
}

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
}) => {
  const alignment = isOwnMessage ? "justify-end" : "justify-start";
  const bubbleColor = isOwnMessage ? "bg-indigo-500 text-white" : "bg-white";
  //   const authorInitial = message.author.charAt(0).toUpperCase();

  return (
    <div className={`flex items-end ${alignment}`}>
      <div className="flex flex-col space-y-1 max-w-lg mx-2">
        {!isOwnMessage && (
          <span className="text-xs text-gray-500 ml-3">{message.author}</span>
        )}
        <div className={`px-4 py-2 rounded-2xl inline-block ${bubbleColor}`}>
          <p>{message.content}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
