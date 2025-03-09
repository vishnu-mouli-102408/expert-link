"use client";

import React from "react";
import { useIsMobile } from "@/hooks";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  BarChart3,
  LayoutDashboard,
  Mail,
  Menu,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

import Sidebar from "@/components/sidebar/sidebar";
import {
  SidebarProvider,
  useSidebar,
} from "@/components/sidebar/sidebar-context";

interface AppLayoutProps {
  children: React.ReactNode;
}

// The main layout that includes the sidebar and content
const AppLayoutContent: React.FC<AppLayoutProps> = ({ children }) => {
  const { isOpen, toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const { user } = useUser();

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
    <div className="flex  bg-background dark">
      <Sidebar navItems={navItems} />

      <motion.div
        initial={false}
        animate="main"
        variants={contentVariants}
        className="flex-1 overflow-auto"
      >
        {/* Mobile header */}
        <div className="flex justify-between md:hidden shadow-[0_1px_1px_rgba(0,0,0,0.05), 0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] px-5 items-center h-16 border-b bg-gradient-to-r from-black via-gray-950 to-black border-b-gray-400/30">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="p-2 rounded-md bg-gray-700 hover:bg-secondary"
          >
            <Menu size={20} />
          </motion.button>
          <UserButton />
        </div>

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

// Export the layout with SidebarProvider
const Layout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
};

export default Layout;
