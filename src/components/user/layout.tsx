"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BarChart3,
  Bell,
  Clock,
  Command,
  Menu,
  Phone,
  Search,
  Settings,
  User,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";

import SearchModal from "../search/search-modal";

const UserLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Navigation items
  const navItems = [
    { path: "/dashboard", label: "Overview", icon: BarChart3 },
    { path: "/dashboard/explore", label: "Explore Experts", icon: Users },
    { path: "/dashboard/calls", label: "Calls", icon: Phone },
    { path: "/dashboard/history", label: "History", icon: Clock },
    { path: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  // Handle CMD+K shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f13] flex">
      {/* Sidebar for desktop */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1A1F2C] border-r border-white/10 shadow-lg transition-all duration-300 ease-smooth ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } hidden md:block`}
        initial={false}
        animate={{ width: isSidebarOpen ? 240 : 80 }}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">EC</span>
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-white">ExpertConnect</span>
            )}
          </Link>
          <Button
            variant="ghost"
            className="p-1 text-gray-400 hover:text-white"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <div className="py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? "bg-[#403E43] text-white"
                    : "text-gray-400 hover:bg-[#403E43]/50 hover:text-white"
                } ${!isSidebarOpen ? "justify-center" : ""}`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {isSidebarOpen && (
                  <span className="ml-3 text-sm">{item.label}</span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </motion.aside>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <motion.aside
            className="fixed inset-y-0 left-0 w-64 bg-[#1A1F2C] border-r border-white/10 shadow-lg"
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            exit={{ x: -240 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">EC</span>
                </div>
                <span className="font-bold text-white">ExpertConnect</span>
              </Link>
              <Button
                variant="ghost"
                className="p-1 text-gray-400 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="py-4">
              <nav className="space-y-1 px-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                      location.pathname === item.path
                        ? "bg-[#403E43] text-white"
                        : "text-gray-400 hover:bg-[#403E43]/50 hover:text-white"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="ml-3 text-sm">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </motion.aside>
        </motion.div>
      )}

      {/* Main content */}
      <div
        className={`flex-1 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} transition-all duration-300`}
      >
        {/* Top navbar */}
        <header className="sticky top-0 z-40 bg-[#1A1F2C] border-b border-white/10 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                className="p-1 mr-4 text-gray-400 hover:text-white md:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div
                className="flex items-center bg-[#222222] border border-white/10 rounded-lg py-2 px-4 cursor-pointer"
                onClick={() => setIsSearchModalOpen(true)}
              >
                <Search className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-400 text-sm hidden sm:inline">
                  Search for experts...
                </span>
                <div className="flex items-center gap-1 bg-[#403E43] px-2 py-1 rounded text-xs text-gray-300 ml-2 sm:ml-4">
                  <Command className="h-3 w-3" />
                  <span>K</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-400 hover:text-white"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center overflow-hidden">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium text-white hidden md:inline">
                  John Doe
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6">{children}</main>
      </div>

      {/* Search Modal */}
      {isSearchModalOpen && (
        <SearchModal onClose={() => setIsSearchModalOpen(false)} />
      )}
    </div>
  );
};

export default UserLayout;
