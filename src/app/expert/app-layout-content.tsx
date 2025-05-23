"use client";

import { type FC, type ReactNode } from "react";
import { useDbUser, useIsMobile } from "@/hooks";
import { UserButton } from "@clerk/nextjs";
import {
  BarChart3,
  Bell,
  LayoutDashboard,
  Mail,
  Menu,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Sidebar from "@/components/sidebar/sidebar";
import { useSidebar } from "@/components/sidebar/sidebar-context";

export interface AppLayoutProps {
  children: ReactNode;
}

// The main layout that includes the sidebar and content
export const AppLayoutContent: FC<AppLayoutProps> = ({ children }) => {
  const { isOpen, toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const { data: userData, isPending } = useDbUser();

  const contentVariants = {
    open: {
      marginLeft: "240px",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    closed: {
      marginLeft: "66px",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    mobile: {
      marginLeft: "0px",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  const navItems = [
    {
      icon: <BarChart3 size={18} />,
      label: "Overview",
      href: "/expert",
    },
    { icon: <LayoutDashboard size={18} />, label: "Dashboard", href: "/" },
    { icon: <Users size={18} />, label: "Users", href: "/" },
    { icon: <Mail size={18} />, label: "Messages", href: "/" },
    { icon: <Search size={18} />, label: "Search", href: "/" },
    {
      icon: <Settings size={18} />,
      label: "Settings",
      href: "/expert/settings",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background dark">
      <Sidebar navItems={navItems} />

      <motion.div
        initial={false}
        animate="main"
        variants={contentVariants}
        className="w-full"
      >
        {/* Mobile header */}
        <div className="flex sticky top-0 z-[100] justify-between md:hidden shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] px-5 items-center h-16 border-b bg-transparent border-b-gray-500/30 backdrop-blur-lg bg-opacity-80">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleSidebar}
              className="p-2 rounded-lg border border-white/10 bg-[#222222] hover:bg-secondary"
            >
              <Menu size={22} />
            </motion.button>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-400 cursor-pointer hover:scale-[1.05] transition-all duration-300 ease-in-out hover:text-white"
            >
              <Bell className="h-5 w-5 " />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <UserButton />
          </div>
        </div>

        <motion.header
          initial={false}
          animate={isOpen ? "open" : "closed"}
          variants={isMobile ? undefined : contentVariants}
          className="hidden md:flex items-center sticky justify-between z-[100] top-0  bg-black shadow-sm px-4 h-16 border-b border-white/10"
        >
          <div className="flex w-full items-center justify-between h-14 px-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                className="p-1 mr-4 text-gray-400 hover:text-white md:hidden"
                onClick={() => toggleSidebar()}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-400 cursor-pointer hover:scale-[1.05] transition-all duration-300 ease-in-out hover:text-white"
              >
                <Bell className="h-5 w-5 " />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <div className="flex items-center space-x-3">
                {/* <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center overflow-hidden"> */}
                <UserButton />
                {/* </div> */}
                {isPending ? (
                  <span className="text-sm font-medium text-white hidden md:inline">
                    <Spinner variant="ring" />
                  </span>
                ) : (
                  <span className="text-sm cursor-pointer font-medium text-white hidden md:inline">
                    {`${userData?.data?.firstName} ${userData?.data?.lastName}`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main content */}
        <motion.main
          variants={isMobile ? undefined : contentVariants}
          animate={isOpen ? "open" : "closed"}
          className="flex-1"
        >
          {children}
        </motion.main>
      </motion.div>
    </div>
  );
};
