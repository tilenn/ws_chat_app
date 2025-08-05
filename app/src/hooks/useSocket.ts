import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Or handle this case appropriately
      return;
    }

    const socket = io("http://localhost:3000", {
      auth: { token },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected!");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      if (err.message.includes("Authentication error")) {
        // This might be better handled by a dedicated auth hook or context
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    });

    return () => {
      if (socketRef.current) {
        console.log("Disconnecting socket...");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return socketRef.current;
};
