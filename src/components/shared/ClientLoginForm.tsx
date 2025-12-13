// components/auth/ClientLoginForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../auth.store";
import LoginForm from "../form/LoginForm";

const ClientLoginForm = ({ redirect }: { redirect?: string }) => {
  const router = useRouter();
  const { setIsAuthenticated, setUserRole } = useAuthStore();

  const handleLoginSuccess = () => {
    // Update Zustand store on successful login
    setIsAuthenticated(true);
    // You might need to fetch user role from an API or decode the token
    // For now, we'll set a default role or fetch it separately
    setUserRole("user"); // You can adjust this based on your needs

    // Refresh the page to update all components
    router.refresh();
  };

  return <LoginForm redirect={redirect} onSuccess={handleLoginSuccess} />;
};

export default ClientLoginForm;
