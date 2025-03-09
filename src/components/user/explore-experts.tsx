"use client";

import { useRouter } from "next/navigation";
import { mockExperts } from "@/constants/mock-data";
import { motion } from "motion/react";

import { fadeInUp, staggerContainer } from "@/lib/framer-animations";

import ExpertCard from "../cards/card";
import { Button } from "../ui/button";

const ExploreExperts = () => {
  // Filter experts based on category and price range
  const router = useRouter();

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <motion.h1
          variants={fadeInUp}
          className="text-2xl font-bold text-white"
        >
          Explore Experts
        </motion.h1>
      </div>

      {/* Expert Cards Grid */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {mockExperts.map((expert) => (
          <ExpertCard key={expert.id} expert={expert} />
        ))}
      </motion.div>

      {mockExperts.length === 0 && (
        <motion.div variants={fadeInUp} className="text-center py-12">
          <p className="text-gray-300 text-xl">
            There are no experts available at the moment. Please Stay tuned!
          </p>
          <Button
            className="mt-4 cursor-pointer"
            onClick={() => {
              router.push("/user");
            }}
          >
            Go Home
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExploreExperts;
