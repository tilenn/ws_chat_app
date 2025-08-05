import { useState, useEffect } from "react";
import { fetcher } from "../utils/api";
import type { Room } from "../types/chat";

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);

  useEffect(() => {
    const getRooms = async () => {
      try {
        const roomData = await fetcher("/rooms");
        setRooms(roomData);
        if (roomData.length > 0 && !activeRoom) {
          setActiveRoom(roomData[0]);
        }
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    };

    getRooms();
  }, [activeRoom]);

  return { rooms, activeRoom, setActiveRoom };
};
