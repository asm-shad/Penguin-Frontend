// components/shared/LogoutButton.tsx
"use client";

import { logoutUser } from "@/services/auth/logoutUser";
import { Button } from "../ui/button";
import { useAuthStore } from "../../../auth.store";

const LogoutButton = () => {
  const logoutStore = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    logoutStore(); // Clear Zustand state immediately for better UX
    await logoutUser(); // Then clear cookies and redirect
  };

  return (
    <Button variant={"destructive"} onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
