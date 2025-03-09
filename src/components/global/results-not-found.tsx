import { redirect } from "next/navigation";
import { HomeIcon, Search } from "lucide-react";
import * as motion from "motion/react-client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ResultsNotFoundProps {
  className?: string;
  description?: string;
  title?: string;
}

export default function ResultsNotFound({
  className,
  description,
  title,
}: ResultsNotFoundProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "max-w-md w-full bg-black/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center border border-white/20",
        className
      )}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-24 h-24 bg-gray-800/50 rounded-full mx-auto mb-6 flex items-center justify-center relative overflow-hidden"
      >
        <motion.div
          animate={{
            y: [-4, 4, -4],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative z-10"
        >
          <Search
            className="w-12 h-12 text-gray-400 dark:text-gray-300"
            strokeWidth={1.5}
          />
        </motion.div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r dark:from-purple-900/20 dark:via-blue-900/20 dark:to-cyan-900/20"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
      >
        {title || "No Results Found"}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 dark:text-gray-300 mb-8"
      >
        {description || "We couldn't find any results matching your query."}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          variant="default"
          className="group relative overflow-hidden cursor-pointer bg-gradient-to-r text-white duration-200 transition-all ease-in-out from-gray-900 to-gray-700 dark:from-gray-800 dark:to-gray-700 hover:from-gray-800 hover:to-gray-600 dark:hover:from-gray-700 dark:hover:to-gray-600"
          onClick={() => redirect("/")}
        >
          <span className="flex items-center gap-2">
            <HomeIcon className="w-4 h-4" />
            Go Home
          </span>
        </Button>
      </motion.div>
    </motion.div>
  );
}
