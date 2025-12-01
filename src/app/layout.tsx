import LogoutSuccessToast from "@/components/shared/LogoutSuccessToast";
import "./globals.css";
import { Toaster as HotToaster } from "react-hot-toast";
import { Toaster } from "sonner";
import LoginSuccessToast from "@/components/shared/LoginSuccessToast";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="font-poppins antialiased">
        <Toaster position="bottom-right" richColors />
        {children}
        <HotToaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#000000",
              color: "#fff",
            },
          }}
        />
        <LogoutSuccessToast />
        <LoginSuccessToast />
      </body>
    </html>
  );
};
export default RootLayout;
