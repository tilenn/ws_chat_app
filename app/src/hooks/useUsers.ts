import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { fetcher } from "../utils/api";
import type { User } from "../types/chat";

export const useUsers = (socket: Socket | null) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const userData = await fetcher("/users");
        setAllUsers(userData);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    getAllUsers();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("update_user_list", (users: string[]) => {
      setOnlineUsers(users);
    });

    socket.on("user_registered", (newUser: User) => {
      setAllUsers((prevUsers) =>
        [...prevUsers, newUser].sort((a, b) =>
          a.username.localeCompare(b.username)
        )
      );
    });

    return () => {
      socket.off("update_user_list");
      socket.off("user_registered");
    };
  }, [socket]);

  return { allUsers, onlineUsers };
};
