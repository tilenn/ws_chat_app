import { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import type { Message, Room } from "../types/chat";

export const useMessages = (socket: Socket | null, activeRoom: Room | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on("message_history", (history: Message[]) => {
      setMessages(history);
    });

    socket.on("chat_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("message_updated", (updatedMessage: Message) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === updatedMessage.id ? updatedMessage : msg
        )
      );
    });

    return () => {
      socket.off("message_history");
      socket.off("chat_message");
      socket.off("message_updated");
    };
  }, [socket]);

  useEffect(() => {
    if (socket && activeRoom) {
      setMessages([]);
      socket.emit("join_room", activeRoom.id);
    }
  }, [activeRoom, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && activeRoom && socket) {
      socket.emit("chat_message", {
        roomId: activeRoom.id,
        content: newMessage,
      });
      setNewMessage("");
    }
  };

  const likeMessage = (messageId: string) => {
    if (socket) {
      socket.emit("like_message", { messageId });
    }
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    likeMessage,
    messagesEndRef,
  };
};
