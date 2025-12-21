"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Menu, Search, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import UserDropdown from "./UserDropdown";
import { NavSection } from "@/types/dashboard.interface";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DashboardMobileSidebar from "./DashboardMobileSidebar";
import { IUser } from "@/types/user.interface";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

interface DashboardNavbarContentProps {
  userInfo: IUser;
  navItems?: NavSection[];
  dashboardHome?: string;
}

const DashboardNavbarContent = ({
  userInfo,
  navItems,
  dashboardHome,
}: DashboardNavbarContentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get initial query from URL - use 'searchTerm' parameter to match your product page
  const urlQuery = searchParams.get("searchTerm") || "";
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [showClear, setShowClear] = useState(urlQuery.length > 0);

  // Use your custom debounce hook
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Refs to track previous values
  const prevPathnameRef = useRef(pathname);
  const prevSearchQueryRef = useRef(searchQuery);

  // Check screen size for mobile
  useEffect(() => {
    const checkSmallerScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkSmallerScreen();
    window.addEventListener("resize", checkSmallerScreen);

    return () => {
      window.removeEventListener("resize", checkSmallerScreen);
    };
  }, []);

  // Effect to handle debounced search
  useEffect(() => {
    if (debouncedSearchQuery === urlQuery) return;

    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearchQuery.trim()) {
      params.set("searchTerm", debouncedSearchQuery.trim());
    } else {
      params.delete("searchTerm");
    }

    // Always reset to page 1 when searching
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedSearchQuery, pathname, router, searchParams, urlQuery]);

  // Clear search when navigating to a different page
  useEffect(() => {
    // Store current values
    const prevPathname = prevPathnameRef.current;
    const prevSearchQuery = prevSearchQueryRef.current;

    // Update refs for next render
    prevPathnameRef.current = pathname;
    prevSearchQueryRef.current = searchQuery;

    // Only clear if we have a search query and pathname has changed
    if (prevPathname !== pathname && prevSearchQuery.trim()) {
      // Use setTimeout to avoid synchronous state update in effect
      const timeoutId = setTimeout(() => {
        setSearchQuery("");
        setShowClear(false);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [pathname, searchQuery]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowClear(value.length > 0);
  };

  // Clear search - clears both local state and URL
  const handleClearSearch = () => {
    setSearchQuery("");
    setShowClear(false);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("searchTerm");
    params.set("page", "1"); // Reset to first page
    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle search submission (on Enter key)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery.trim()) {
        params.set("searchTerm", searchQuery.trim());
      } else {
        params.delete("searchTerm");
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        {/* Mobile Menu Toggle */}
        <Sheet open={isMobile && isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <DashboardMobileSidebar
              userInfo={userInfo}
              navItems={navItems || []}
              dashboardHome={dashboardHome || ""}
            />
          </SheetContent>
        </Sheet>

        {/* Search Bar - Original design preserved */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search across dashboard..."
              className="pl-9 pr-9"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
            {showClear && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 hover:bg-transparent"
                onClick={handleClearSearch}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
          </Button>

          <UserDropdown userInfo={userInfo} />
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbarContent;
