"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { mockExperts } from "@/constants/mock-data";
import { useIsMobile } from "@/hooks";
import { Filter, Search, X } from "lucide-react";
import { motion } from "motion/react";

import { fadeInUp, staggerContainer } from "@/lib/framer-animations";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import type { ExpertProps } from "../cards/card";

interface SearchModalProps {
  onClose: () => void;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  const [filteredExperts, setFilteredExperts] =
    useState<ExpertProps[]>(mockExperts);
  const [showFilters, setShowFilters] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Filter experts based on search term, category, and price range
    const filtered = mockExperts.filter((expert) => {
      const matchesSearch =
        searchTerm === "" ||
        expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.specialties.some((s) =>
          s.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "All" || expert.category === selectedCategory;

      const matchesPrice =
        expert.hourlyRate >= priceRange[0] &&
        expert.hourlyRate <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });

    setFilteredExperts(filtered);
  }, [searchTerm, selectedCategory, priceRange]);

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
      className="fixed inset-0  z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
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
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                isMobile
                  ? "Search experts..."
                  : "Search for experts by name, skill, or specialty..."
              }
              className="bg-transparent border-none text-white flex-grow outline-none placeholder:text-gray-400"
              autoFocus
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
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={
                        selectedCategory === category ? "default" : "outline"
                      }
                      size="sm"
                      className={`text-xs cursor-pointer transition-all duration-300 ease-in-out ${
                        selectedCategory === category
                          ? "bg-primary text-primary-foreground"
                          : "bg-[#221F26] border-white/10 text-gray-300 hover:bg-[#403E43]/50"
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="md:justify-self-end pr-4">
                <p className="text-sm text-gray-400 mb-2">
                  Hourly Rate: ${priceRange[0]} - ${priceRange[1]}
                </p>
                <Slider
                  defaultValue={[0, 300]}
                  max={500}
                  step={10}
                  value={priceRange}
                  onValueChange={(value) => {
                    if (value[0] !== undefined && value[1] !== undefined) {
                      setPriceRange([value[0], value[1]]);
                    }
                  }}
                  className="mb-2 cursor-pointer"
                />
              </div>
            </motion.div>
          )}
        </div>

        <div
          className={`${showFilters ? (isMobile ? "max-h-[40vh]" : "max-h-[50vh]") : isMobile ? "max-h-[50vh]" : "max-h-[60vh]"} overflow-y-auto`}
        >
          {filteredExperts.length === 0 ? (
            <div className="p-6 text-center text-gray-300">
              <p>No experts found matching your criteria.</p>
              <p className="text-sm mt-2">Try adjusting your search filters.</p>
            </div>
          ) : (
            <motion.div
              className="p-2 grid grid-cols-1 md:grid-cols-2 gap-3"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {filteredExperts.map((expert) => (
                <motion.div
                  key={expert.id}
                  className="bg-[#FFFFFF02] hover:shadow-[inset_0px_0px_20px_0px_#FFFFFF33] backdrop-blur-[34px] shadow-[inset_0px_0px_55.5px_0px_#C5B9F626] hover:bg-[#FFFFFF0D] rounded-lg p-3 border border-white/5 hover:border-[#FFFFFF26] flex items-center gap-3 cursor-pointer"
                  variants={fadeInUp}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={expert.imageUrl}
                      alt={expert.name}
                      className="w-full h-full object-cover"
                      width={48}
                      height={48}
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-white text-sm font-medium">
                      {expert.name}
                    </h4>
                    <p className="text-gray-400 text-xs">{expert.title}</p>
                    <div className="flex items-center mt-1">
                      <div className="flex text-amber-400 text-xs">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < Math.floor(expert.rating)
                                ? "text-amber-400"
                                : "text-gray-600"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-gray-500 text-xs ml-1">
                        ({expert.reviews})
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
          <div>{filteredExperts.length} results</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SearchModal;
