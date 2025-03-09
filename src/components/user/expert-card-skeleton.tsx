import * as motion from "motion/react-client";

import { Skeleton } from "@/components/ui/skeleton";

const SkeletonExpertCard = () => {
  return (
    <motion.div
      className="bg-gradient-to-br from-[#191919] to-[#12161e] rounded-xl border border-border/20 overflow-hidden shadow-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image skeleton */}
      <div className="overflow-hidden h-48 relative">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-3 left-3">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>

      <div className="p-5 space-y-3">
        {/* Rating skeleton */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-4 h-4" />
            ))}
          </div>
          <Skeleton className="h-4 w-12" />
        </div>

        {/* Name and title skeleton */}
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-2/3" />

        {/* Specialties skeleton */}
        <div className="flex flex-wrap gap-1 py-1">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-6 w-20 rounded-full" />
          ))}
        </div>

        {/* Availability and price skeleton */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-6 w-16 rounded-md" />
        </div>

        {/* Action buttons skeleton */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-9 rounded-md" />
          ))}
        </div>

        {/* View profile button skeleton */}
        <Skeleton className="h-10 w-full mt-2 rounded-lg" />
      </div>
    </motion.div>
  );
};

export default SkeletonExpertCard;
