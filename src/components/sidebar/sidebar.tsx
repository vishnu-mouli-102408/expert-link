"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/clerk-react";
import { useUser } from "@clerk/nextjs";
import { ChevronLeft, Menu, X } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

import { useSidebar } from "./sidebar-context";

interface SidebarProps {
  className?: string;
  navItems: {
    icon: React.JSX.Element;
    label: string;
    href: string;
  }[];
}

const Sidebar: React.FC<SidebarProps> = ({ className, navItems }) => {
  const { user } = useUser();
  const { isOpen, toggleSidebar, closeSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const [activeItemIndex, setActiveItemIndex] = React.useState(
    `/${user?.publicMetadata?.role === "user" ? "user" : "expert"}`
  );

  const pathname = usePathname();
  //   console.log("pathname", pathname);

  useEffect(() => {
    setActiveItemIndex(pathname);
  }, [pathname]);

  return (
    <>
      {/* Main Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isMobile ? (isOpen ? "70%" : "0") : isOpen ? "240px" : "66px",
          x: isMobile && !isOpen ? "-100%" : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className={cn(
          "fixed top-0 left-0 z-[999] h-screen overflow-hidden bg-black border-r border-white/10",
          isMobile && !isOpen ? "w-0" : "",
          className
        )}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
            <div className="flex items-center gap-2">
              {isOpen && (
                <motion.div className="flex justify-center items-center gap-2">
                  <Link href={"/"}>
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="text-lg ml-2 font-semibold cursor-pointer hover:scale-[1.04] transitio duration-300 ease-in-out text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
                    >
                      Expert Link
                    </motion.span>
                  </Link>
                </motion.div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleSidebar}
              className="flex items-center  cursor-pointer justify-center h-8 w-8 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
              title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isMobile ? (
                <motion.span
                  key={isOpen ? "close-mobile" : "open-mobile"}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? <X size={16} /> : <Menu size={16} />}
                </motion.span>
              ) : (
                <motion.span
                  key={isOpen ? "collapse-desktop" : "expand-desktop"}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronLeft
                    size={16}
                    className={!isOpen ? "rotate-180 cursor-pointer" : ""}
                  />
                </motion.span>
              )}
            </motion.button>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-3 py-4  overflow-y-auto scrollbar-none">
            <nav className="space-y-2 transition-all duration-300 ease-in-out">
              {navItems.map((item, index) => (
                <div
                  key={index}
                  className={!isOpen ? "flex justify-center" : ""}
                >
                  <Link href={item.href}>
                    <motion.div
                      className={cn(
                        "flex items-center gap-3 rounded-md cursor-pointer",
                        isOpen ? "px-3 py-2" : "h-10 w-10 justify-center",
                        activeItemIndex === item.href
                          ? "bg-white/20 text-white"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      )}
                      whileHover={{ scale: isOpen ? 1.02 : 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setActiveItemIndex(item.href);
                        if (isMobile) {
                          closeSidebar();
                        }
                      }}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center",
                          isOpen ? "h-5 w-5" : "",
                          activeItemIndex === item.href
                            ? "text-white"
                            : "text-white/70"
                        )}
                      >
                        {item.icon}
                      </div>
                      {isOpen && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-sm font-medium"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </motion.div>
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* User section */}
          <div className="p-4 border-t border-white/10">
            {isOpen ? (
              <div className="flex items-center gap-2 text-sm text-white/70">
                <UserButton />
                <span>{user?.fullName || "User"}</span>
              </div>
            ) : (
              <UserButton />
            )}
          </div>
        </div>
      </motion.aside>

      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black z-30"
        />
      )}
    </>
  );
};

export default Sidebar;
