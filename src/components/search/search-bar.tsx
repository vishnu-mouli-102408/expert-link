"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Command, Search } from "lucide-react";

import SearchModal from "./search-modal";

const SearchBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  // Don't show searchbar on dashboard pages
  const isDashboardPage = pathname.includes("/dashboard");

  if (isDashboardPage) {
    return null;
  }

  // Handle CMD+K shortcut
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsModalOpen(true);
      }
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-[80px] left-1/2 z-30 w-full max-w-3xl transform -translate-x-1/2 px-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="flex items-center bg-[#1A1F2C] border border-white/10 rounded-lg shadow-lg py-2 px-4 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <Search className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-400 flex-grow">Search for experts...</span>
          <div className="flex items-center gap-1 bg-[#403E43] px-2 py-1 rounded text-xs text-gray-300">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && <SearchModal onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default SearchBar;
