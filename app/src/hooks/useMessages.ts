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
      // Check if the message is for the active room to avoid displaying messages from other rooms
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("message_history");
      socket.off("chat_message");
    };
  }, [socket]);

  useEffect(() => {
    if (socket && activeRoom) {
      setMessages([]); // Clear messages when room changes
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

  return { messages, newMessage, setNewMessage, sendMessage, messagesEndRef };
};
