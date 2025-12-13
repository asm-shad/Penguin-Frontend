"use client";

import Link from "next/link";
import { Logs, LayoutDashboard } from "lucide-react";
import Cookies from "js-cookie";
import { useState } from "react";

import MobileMenu from "./MobileMenu";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import Container from "./Container";
import { Button } from "../ui/button";
import LogoutButton from "./LogoutButton";
import FavoriteButton from "../modules/SingleProduct/FavoriteButton";

const Navbar = () => {
  // ✅ Read cookie during initial render
  const [accessToken] = useState<string | null>(
    () => Cookies.get("accessToken") || null
  );

  return (
    <header className="sticky top-0 z-50 py-5 bg-white/70 backdrop-blur-md">
      <Container className="flex items-center justify-between text-lightColor">
        <div className="w-auto md:w-1/3 flex items-center gap-2.5">
          <MobileMenu />
          <Logo />
        </div>

        <HeaderMenu />

        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          <SearchBar />
          <CartIcon />
          <FavoriteButton />

          {accessToken && (
            <Link
              href="/user"
              title="Dashboard"
              className="hover:text-shop_light_green"
            >
              <LayoutDashboard className="h-5 w-5" />
            </Link>
          )}

          {accessToken && (
            <Link
              href="/orders"
              title="My Orders"
              className="hover:text-shop_light_green"
            >
              <Logs className="h-5 w-5" />
            </Link>
          )}

          <div className="hidden md:flex items-center">
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
