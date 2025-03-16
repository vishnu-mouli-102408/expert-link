"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { client } from "@/lib/client";
import { getQueryClient } from "@/lib/get-query-client";

import { Button } from "../../ui/button";
import { LoadingSpinner } from "../../ui/loading-spinner";
import ReviewSuccessModal from "./review-success-modal";

// import { Modal } from "../ui/modal";
const Modal = dynamic(() => import("../../ui/modal").then((mod) => mod.Modal), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex justify-center items-center">
      <LoadingSpinner />
    </div>
  ),
});

interface ReviewModalProps {
  isWriteReviewOpen: boolean;
  setIsWriteReviewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  expertName: string;
  expertId: string;
}

const reviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, { message: "Select rating is Mandatory" })
    .max(5),
  reviewText: z.string().max(500),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const ReviewModal = ({
  isWriteReviewOpen,
  setIsWriteReviewOpen,
  expertId,
  expertName,
}: ReviewModalProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      reviewText: "",
    },
  });

  const queryClient = getQueryClient();

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const onSubmitReview = async (data: ReviewFormData) => {
    try {
      console.log("Form data:", data);
      onSubmitForm(data);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("There was a problem.", {
        duration: 3000,
        position: "bottom-center",
        closeButton: true,
        description:
          "Seems like there was an issue on our end. Please try again later.",
      });
    }
  };

  const { mutateAsync: onSubmitForm, isPending } = useMutation({
    mutationFn: async (data: ReviewFormData) => {
      const response = await client.user.writeReviewForExpert.$post({
        expertId,
        rating: data.rating,
        reviewText: data.reviewText,
      });
      const result = await response.json();
      return result;
    },
    onSuccess: (data) => {
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: ["expert", expertId] });
        setShowSuccessModal(true);
      } else {
        toast.error("There was a problem.", {
          description:
            data?.message ||
            "Seems like there was an issue on our end. Please try again later.",
          duration: 3000,
          position: "bottom-center",
          closeButton: true,
        });
      }
    },
    onError: (error) => {
      console.log("Error:", error);
      toast.error("There was a problem.", {
        description:
          error?.message ||
          "Seems like there was an issue on our end. Please try again later.",
        duration: 3000,
        position: "bottom-center",
        closeButton: true,
      });
    },
  });

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
      transition: { duration: 0.2 },
    },
  };

  return (
    <Modal
      className="max-w-md p-8 bg-[#12151c] text-white border border-white/10 border-none"
      showModal={isWriteReviewOpen}
      setShowModal={setIsWriteReviewOpen}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div>
          <h1 className="text-lg">Write a Review for {expertName}</h1>
          <p className="text-gray-400 text-sm text-pretty">
            Share your experience with {expertName} to help others.
          </p>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmitReview)}
          className="space-y-6 my-4"
        >
          <div className="bg-[#222222]/70 rounded-lg p-4 border border-white/5">
            <h3 className="text-sm font-medium mb-3 text-gray-300">Rating</h3>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-8 w-8 cursor-pointer transition-all duration-200 ${
                    watch("rating") >= star
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-500 hover:text-gray-400"
                  }`}
                  onClick={() => setValue("rating", star)}
                />
              ))}
            </div>
            <p className="text-xs text-center mt-2 text-gray-400">
              {!watch("rating")
                ? "Select a rating"
                : watch("rating") === 5
                  ? "Excellent"
                  : watch("rating") === 4
                    ? "Very Good"
                    : watch("rating") === 3
                      ? "Good"
                      : watch("rating") === 2
                        ? "Fair"
                        : "Poor"}
            </p>
            {errors.rating && (
              <p className="text-red-400 text-xs text-center mt-1">
                {errors.rating.message}
              </p>
            )}
          </div>

          <div className="bg-[#222222]/70 rounded-lg p-4 border border-white/5">
            <h3 className="text-sm font-medium mb-3 text-gray-300">
              Your Review
            </h3>
            <textarea
              className="w-full min-h-24 p-3 text-sm bg-[#1a1a1a] rounded-md border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-primary/50"
              placeholder="Share your experience..."
              {...register("reviewText", {
                maxLength: {
                  value: 500,
                  message: "Review cannot exceed 500 characters",
                },
              })}
            />
            <div className="flex justify-between mt-1">
              {errors.reviewText && (
                <p className="text-red-400 text-xs">
                  {errors.reviewText.message}
                </p>
              )}
              <p className="text-xs text-right text-gray-500">
                {watch("reviewText")?.length || 0}/500
              </p>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              className="bg-[#221F26] border-white/10 cursor-pointer text-gray-300"
              onClick={() => setIsWriteReviewOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r cursor-pointer text-white from-[#403E43] to-[#221F26] hover:opacity-90 border border-white/10"
              disabled={isPending}
            >
              {isPending ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2 h-4 w-4 border-2 border-zinc-400 border-t-white rounded-full"
                />
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>
        </form>
      </motion.div>

      <AnimatePresence>
        {showSuccessModal && (
          <ReviewSuccessModal
            isOpen={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            expertName={expertName}
            onCloseReviewModal={() => setIsWriteReviewOpen(false)}
          />
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default ReviewModal;
