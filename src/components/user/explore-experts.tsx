"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { mockExperts } from "@/constants/mock-data";
import { useInfiniteQuery } from "@tanstack/react-query";
import { motion } from "motion/react";

import { client } from "@/lib/client";
import { fadeInUp, staggerContainer } from "@/lib/framer-animations";

import ExpertCard from "../cards/card";
import ResultsNotFound from "../global/results-not-found";
import { Button } from "../ui/button";
import SkeletonExpertCard from "./expert-card-skeleton";

const ExploreExperts = () => {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const { data, status, error, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["experts"],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await client.user.getAllExperts.$get({
          page: pageParam,
        });
        const data = await response.json();
        return data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const currentPage = lastPage?.data?.currentPage;
        const totalPages = lastPage?.data?.totalPages;
        if (currentPage == null || totalPages == null) {
          return undefined;
        }
        return currentPage < totalPages ? currentPage + 1 : undefined;
      },
    });

  useEffect(() => {
    const handleScroll = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;

      if (scrolled >= scrollableHeight - 10 && !isFetchingNextPage) {
        console.log("User reached the bottom of the page!");
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchNextPage, isFetchingNextPage]);

  console.log("DATA", data);
  console.log("STATUS", status);
  console.log("ERROR", error);
  console.log("IS FETCHING NEXT PAGE", isFetchingNextPage);

  if (status === "pending") {
    return (
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {[...Array(6)].map((_, index) => (
          <SkeletonExpertCard key={index} />
        ))}
      </motion.div>
    );
  } else if (
    status === "error" ||
    data?.pages.length === 0 ||
    data?.pages[0]?.data?.experts.length === 0
  ) {
    return (
      <div className="h-[calc(100vh-115px)] w-full flex flex-col items-center justify-center">
        <ResultsNotFound
          description={error?.message}
          title="No Experts Found"
        />
      </div>
    );
  } else if (status === "success") {
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

        <div id="infinite-paginate" ref={bottomRef}>
          {isFetchingNextPage && (
            <motion.div
              //   variants={fadeInUp}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[...Array(3)].map((_, index) => (
                <SkeletonExpertCard key={index} />
              ))}
            </motion.div>
          )}
        </div>

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
  }
};

export default ExploreExperts;
