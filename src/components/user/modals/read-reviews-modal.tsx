/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Quote, Star, X } from "lucide-react";
import { motion } from "motion/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface AllReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: any;
  reviews?: any[];
}

const AllReviewsModal = ({
  isOpen,
  onClose,
  expert,
  reviews = [],
}: AllReviewsModalProps) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 3;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 500); // Wait for exit animation to complete
  };

  // Get current page reviews
  const currentReviews = reviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );

  // Go to next/previous page
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const modalVariants = {
    hidden: { scale: 0.9, opacity: 0, y: 20 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300,
        delay: 0.1,
      },
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      y: 20,
      transition: { duration: 0.3 },
    },
  };

  const reviewCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2 + index * 0.1,
        duration: 0.5,
      },
    }),
  };

  // Helper function to render stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`}
          />
        ))}
      </div>
    );
  };

  if (!isOpen && !isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/70 z-[1000] p-4 backdrop-blur-sm overflow-hidden"
      variants={backdropVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "exit"}
      exit="exit"
    >
      <motion.div
        className="max-w-2xl w-full rounded-xl bg-gradient-to-b from-[#1c1c24] to-[#12151c] shadow-xl border border-white/10 relative max-h-[90vh] flex flex-col"
        variants={modalVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "exit"}
        exit="exit"
      >
        {/* Decorative backdrop elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-purple-700/10 blur-2xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-blue-700/10 blur-2xl"></div>

        <button
          onClick={handleClose}
          className="absolute top-4 cursor-pointer right-4 text-gray-400 hover:text-white transition-colors bg-black/20 rounded-full p-1 z-10"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col p-8 overflow-hidden h-full">
          <div className="flex items-center space-x-4 mb-6 flex-shrink-0">
            <div className="flex-shrink-0">
              <Avatar className="h-14 w-14 border-2 border-white/10">
                <AvatarImage
                  src={expert?.profileImage}
                  alt={expert?.firstName}
                />
                <AvatarFallback className="bg-gradient-to-br from-[#403E43] to-[#221F26] text-white">
                  {expert?.firstName?.[0]}
                  {expert?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">
                {expert?.firstName} {expert?.lastName}
              </h2>
              <div className="flex items-center mt-1 space-x-2">
                <div className="flex">
                  {renderStars(
                    reviews.length > 0
                      ? reviews.reduce((acc, rev) => acc + rev.rating, 0) /
                          reviews.length
                      : 0
                  )}
                </div>
                <span className="text-gray-300 text-sm">
                  ({reviews.length}{" "}
                  {reviews.length === 1 ? "review" : "reviews"})
                </span>
              </div>
            </div>
          </div>

          <div className="flex-grow flex flex-col overflow-hidden">
            <h3 className="text-white text-lg mb-4 font-medium flex items-center flex-shrink-0">
              <Quote
                size={18}
                className="mr-2 text-purple-400"
                strokeWidth={2.5}
              />
              Client Reviews
            </h3>

            {reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No reviews yet. Be the first to leave a review!
              </div>
            ) : (
              <div className="space-y-4 overflow-y-auto pr-2 flex-grow">
                {currentReviews.map((review, idx) => (
                  <motion.div
                    key={review.id}
                    className="bg-[#222222]/70 border border-white/5 rounded-lg p-4"
                    variants={reviewCardVariants}
                    custom={idx}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={review.user?.profileImage} />
                          <AvatarFallback className="bg-[#403E43]/60 text-white text-xs">
                            {review.user?.firstName?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {review.user?.firstName} {review.user?.lastName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {review.createdAt
                              ? format(
                                  new Date(review.createdAt),
                                  "MMM dd, yyyy"
                                )
                              : "Recent"}
                          </p>
                        </div>
                      </div>
                      <div className="flex">{renderStars(review.rating)}</div>
                    </div>
                    <p className="text-gray-300 text-sm">{review?.comment}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination controls */}
          {reviews.length > reviewsPerPage && (
            <div className="flex justify-between items-center mt-4 flex-shrink-0">
              <div className="text-sm text-gray-400">
                Page {currentPage + 1} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className={`bg-[#222222]/80 border-white/10 ${currentPage === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#403E43]/50"}`}
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  disabled={currentPage >= totalPages - 1}
                  className={`bg-[#222222]/80 border-white/10 ${currentPage >= totalPages - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#403E43]/50"}`}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AllReviewsModal;
