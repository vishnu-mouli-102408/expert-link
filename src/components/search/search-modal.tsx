"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDebounce, useIsMobile } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { Filter, Search, X } from "lucide-react";
import { motion } from "motion/react";
import { Controller, useForm } from "react-hook-form";

import { client } from "@/lib/client";
import { fadeInUp, staggerContainer } from "@/lib/framer-animations";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface SearchModalProps {
  onClose: () => void;
}

// Form values interface
interface SearchFormValues {
  searchTerm: string;
  category: string;
  priceRange: [number, number];
}

// Categories
const categories = [
  "All",
  "Engineering",
  "Development",
  "Design",
  "Legal",
  "Finance",
  "Healthcare",
  "Marketing",
  "Education",
];

const SearchModal = ({ onClose }: SearchModalProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const router = useRouter();

  // React Hook Form setup
  const { control, watch } = useForm<SearchFormValues>({
    defaultValues: {
      searchTerm: "",
      category: "All",
      priceRange: [0, 300],
    },
  });

  // Watch form values
  const watchSearchTerm = watch("searchTerm");
  const watchCategory = watch("category");
  const watchPriceRange = watch("priceRange");

  const debouncedSearchText = useDebounce(watchSearchTerm, 500);
  const debouncedPriceRange = useDebounce(watchPriceRange, 500);

  const { data: searchResults, isPending } = useQuery({
    queryKey: [
      "expert-search",
      debouncedSearchText,
      watchCategory,
      debouncedPriceRange,
    ],
    queryFn: async () => {
      const response = await client.user.searchExperts.$get({
        limit: 10,
        expertise: watchCategory,
        page: 1,
        maxRate: debouncedPriceRange[1],
        minRate: debouncedPriceRange[0],
        query: debouncedSearchText,
      });
      return await response.json();
    },
  });

  console.log("SEARCH RESULTS", searchResults);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Close on ESC key press
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [onClose]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const modalVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      y: -30,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        ref={modalRef}
        className="w-full max-w-3xl bg-gradient-to-br from-[#161616] to-[#161b25] rounded-xl border border-white/10 shadow-2xl overflow-hidden"
        variants={modalVariants}
      >
        <div className="md:p-4 p-3 border-b border-white/10">
          <div className="flex items-center">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <Controller
              name="searchTerm"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  placeholder={
                    isMobile
                      ? "Search experts..."
                      : "Search for experts by name, skill, or specialty..."
                  }
                  className="bg-transparent border-none text-white flex-grow outline-none placeholder:text-gray-400"
                  autoFocus
                />
              )}
            />
            <Button
              variant="ghost"
              size="icon"
              className={`${showFilters ? "bg-white/10 text-white" : ""} ml-2 text-gray-400 transition-all duration-300 ease-in-out rounded-full cursor-pointer hover:text-white hover:bg-white/10`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 transition-all duration-300 ease-in-out rounded-full text-gray-400 cursor-pointer hover:text-white hover:bg-white/10"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {showFilters && (
            <motion.div
              className="mt-4 grid grid-cols-1 md:grid-cols-3 items-center gap-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="col-span-2">
                <p className="text-sm text-gray-400 mb-2">Category</p>
                <div className="flex flex-wrap gap-2">
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <>
                        {categories.map((category) => (
                          <Button
                            key={category}
                            variant={
                              field.value === category ? "default" : "outline"
                            }
                            size="sm"
                            className={`text-xs cursor-pointer transition-all duration-300 ease-in-out ${
                              field.value === category
                                ? "bg-primary text-primary-foreground"
                                : "bg-[#221F26] border-white/10 text-gray-300 hover:bg-[#403E43]/50"
                            }`}
                            onClick={() => field.onChange(category)}
                          >
                            {category}
                          </Button>
                        ))}
                      </>
                    )}
                  />
                </div>
              </div>

              <div className="md:justify-self-end pr-4">
                <Controller
                  name="priceRange"
                  control={control}
                  render={({ field }) => (
                    <>
                      <p className="text-sm text-gray-400 mb-2">
                        Hourly Rate: ${field.value[0]} - ${field.value[1]}
                      </p>
                      <Slider
                        value={field.value}
                        max={500}
                        step={10}
                        onValueChange={(value) => {
                          if (
                            value[0] !== undefined &&
                            value[1] !== undefined
                          ) {
                            field.onChange([value[0], value[1]]);
                          }
                        }}
                        className="mb-2 cursor-pointer bg-gray-500 rounded-lg"
                      />
                    </>
                  )}
                />
              </div>
            </motion.div>
          )}
        </div>

        <div
          className={`${
            showFilters
              ? isMobile
                ? "max-h-[40vh]"
                : "max-h-[50vh]"
              : isMobile
                ? "max-h-[50vh]"
                : "max-h-[60vh]"
          } overflow-y-auto`}
        >
          {isPending ? (
            <div className="flex items-center h-max py-12 justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              </div>
            </div>
          ) : searchResults?.data?.totalCount === 0 || !searchResults?.data ? (
            <div className="p-6 text-center text-gray-300">
              <p>No experts found matching your criteria.</p>
              <p className="text-sm mt-2">Try adjusting your search filters.</p>
            </div>
          ) : (
            <motion.div
              className="p-2 py-3 grid grid-cols-1 md:grid-cols-2 gap-3"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {searchResults?.data?.experts?.map((expert) => (
                <motion.div
                  key={expert.id}
                  className="bg-[#FFFFFF02] hover:shadow-[inset_0px_0px_20px_0px_#FFFFFF33] backdrop-blur-[34px] shadow-[inset_0px_0px_55.5px_0px_#C5B9F626] hover:bg-[#FFFFFF0D] rounded-lg p-3 border border-white/5 hover:border-[#FFFFFF26] flex items-center gap-3 cursor-pointer"
                  variants={fadeInUp}
                  whileHover={{ y: -1, transition: { duration: 0.2 } }}
                  onClick={() => {
                    router.push(`/user/expert-profile/${expert.id}`);
                    onClose();
                  }}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={
                        expert?.profilePic ||
                        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
                      }
                      alt={expert?.firstName || "Expert Name"}
                      className="w-full h-full object-cover"
                      width={48}
                      height={48}
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-white text-sm font-medium">
                      {expert?.firstName && expert?.lastName
                        ? `${expert?.firstName} ${expert?.lastName}`
                        : "No Name"}
                    </h4>
                    <p className="text-gray-400 text-xs">{expert?.expertise}</p>
                    <div className="flex items-center mt-1">
                      <div className="flex text-amber-400 text-xs">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < Math.floor(expert?.averageRating || 0)
                                ? "text-amber-400"
                                : "text-gray-600"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-gray-500 text-xs ml-1">
                        ({expert?.reviewCount || 0})
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-primary-foreground bg-primary/80 px-2 py-1 rounded text-xs font-medium">
                      ${expert.hourlyRate}/hr
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <div className="p-3 border-t border-white/10 text-xs text-gray-500 flex justify-between items-center">
          <div>
            Press{" "}
            <kbd className="bg-[#403E43] px-2 py-1 rounded text-xs text-gray-300">
              ESC
            </kbd>{" "}
            to close
          </div>
          <div>{searchResults?.data?.totalCount || 0} results</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SearchModal;
