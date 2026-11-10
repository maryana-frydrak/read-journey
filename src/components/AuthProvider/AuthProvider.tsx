"use client";

import { useEffect, useState, ReactNode } from "react";
import { getCurrentUser, setAuthToken } from "@/redux/api";

type Props = {
  children: ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

        if (token) {
          setAuthToken(token);
          await getCurrentUser();
        }
      } catch (error) {
        console.error("Session expired or invalid token:", error);

        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();
  }, []);

  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
}
