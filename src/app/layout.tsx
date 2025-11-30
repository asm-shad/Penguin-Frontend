import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: {
    template: "%s - Penguin Online Store",
    default: "Penguin Online Store",
  },
  description: "Penguin online store, Your one stop shop for all your needs.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="font-poppins antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#000000",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
};
export default RootLayout;
