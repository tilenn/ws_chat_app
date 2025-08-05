import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "../types/chat";

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<DecodedToken | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setCurrentUser(decoded);
    } catch (error) {
      console.error("Failed to decode token:", error);
      navigate("/login");
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return { currentUser, logout };
};
