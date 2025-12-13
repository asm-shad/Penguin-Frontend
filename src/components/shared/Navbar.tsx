"use client";

import Link from "next/link";
import { Logs, LayoutDashboard } from "lucide-react";
import { useEffect } from "react";
import MobileMenu from "./MobileMenu";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import Container from "./Container";
import { Button } from "../ui/button";
import LogoutButton from "./LogoutButton";
import FavoriteButton from "../modules/SingleProduct/FavoriteButton";
import useStore from "../../../store";

const Navbar = () => {
  // Zustand store for auth
  const accessToken = useStore((state) => state.accessToken);

  // Optional: re-sync accessToken from cookie on mount
  const setAccessToken = useStore((state) => state.setAccessToken);
  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];
    if (token) setAccessToken(token);
  }, [setAccessToken]);

  return (
    <header className="sticky top-0 z-50 py-5 bg-white/70 backdrop-blur-md">
      <Container className="flex items-center justify-between text-lightColor">
        {/* Left */}
        <div className="w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0">
          <MobileMenu />
          <Logo />
        </div>

        {/* Center */}
        <HeaderMenu />

        {/* Right */}
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          <SearchBar />
          <CartIcon />
          <FavoriteButton />

          {/* Dashboard */}
          {accessToken && (
            <Link
              href="/dashboard"
              className="group relative hover:text-shop_light_green hoverEffect"
              title="Dashboard"
            >
              <LayoutDashboard className="h-5 w-5" />
            </Link>
          )}

          {/* Orders */}
          {accessToken && (
            <Link
              href="/orders"
              className="group relative hover:text-shop_light_green hoverEffect"
              title="My Orders"
            >
              <Logs className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-shop_btn_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
                {/* Optional: orders count */}
              </span>
            </Link>
          )}

          {/* Login / Logout */}
          <div className="hidden md:flex items-center space-x-2">
            {accessToken ? (
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

export default Navbar;
