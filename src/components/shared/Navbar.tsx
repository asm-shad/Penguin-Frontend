// components/shared/Navbar.tsx
"use client";

import Link from "next/link";
import { Logs, LayoutDashboard } from "lucide-react";
import MobileMenu from "./MobileMenu";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import Container from "./Container";
import { Button } from "../ui/button";
import LogoutButton from "./LogoutButton";
import FavoriteButton from "../modules/SingleProduct/FavoriteButton";
import { useEffect, useState } from "react";
import { getCookie } from "@/services/auth/tokenHandlers";
import { useAuthStore } from "../../../auth.store";

const Navbar = () => {
  const [isClient, setIsClient] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);

    // Check for token on client side
    const checkAuth = async () => {
      try {
        const token = await getCookie("accessToken");
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setIsAuthenticated]);

  // Listen for auth state changes (optional - for better UX)
  useEffect(() => {
    const handleStorageChange = () => {
      // Sync with localStorage changes
      const checkAuth = async () => {
        const token = await getCookie("accessToken");
        setIsAuthenticated(!!token);
      };
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [setIsAuthenticated]);

  // Only render after we're on the client
  if (!isClient || isLoading) {
    return <SkeletonNavbar />;
  }

  return (
    <header className="sticky top-0 z-50 py-5 bg-white/70 backdrop-blur-md">
      <Container className="flex items-center justify-between text-lightColor">
        <div className="w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0">
          <MobileMenu />
          <Logo />
        </div>
        <HeaderMenu />
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          <SearchBar />
          <CartIcon />
          <FavoriteButton />

          {/* Dashboard button for logged-in users */}
          {isAuthenticated && (
            <Link
              href="/dashboard"
              className="group relative hover:text-shop_light_green hoverEffect"
              title="Dashboard"
            >
              <LayoutDashboard className="h-5 w-5" />
            </Link>
          )}

          {/* Orders link (only for logged-in) */}
          {isAuthenticated && (
            <Link
              href={"/orders"}
              className="group relative hover:text-shop_light_green hoverEffect"
              title="My Orders"
            >
              <Logs />
              <span className="absolute -top-1 -right-1 bg-shop_btn_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
                {/* {orders?.length ? orders?.length : 0} */}
              </span>
            </Link>
          )}

          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <LogoutButton />
            ) : (
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};

const SkeletonNavbar = () => (
  <header className="sticky top-0 z-50 py-5 bg-white/70 backdrop-blur-md animate-pulse">
    <Container className="flex items-center justify-between">
      <div className="w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0">
        <div className="w-8 h-8 bg-gray-300 rounded-md"></div>
        <div className="w-32 h-8 bg-gray-300 rounded-md"></div>
      </div>
      <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
        <div className="w-24 h-8 bg-gray-300 rounded-md"></div>
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        <div className="w-20 h-8 bg-gray-300 rounded-md"></div>
      </div>
    </Container>
  </header>
);

export default Navbar;
