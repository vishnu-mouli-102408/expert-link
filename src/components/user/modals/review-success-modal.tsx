import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Star, X } from "lucide-react";

interface ReviewSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  expertName: string;
  onCloseReviewModal: () => void;
}

const ReviewSuccessModal = ({
  isOpen,
  onClose,
  expertName,
  onCloseReviewModal,
}: ReviewSuccessModalProps) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    onCloseReviewModal();
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 500); // Wait for exit animation to complete
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0, y: 20 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        delay: 0.1,
      },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      y: 20,
      transition: { duration: 0.3 },
    },
  };

  const checkmarkVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.5,
        type: "spring",
        damping: 15,
        stiffness: 200,
      },
    },
  };

  const starVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (index: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.6 + index * 0.1,
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    }),
  };

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.1,
        duration: 0.5,
      },
    },
  };

  if (!isOpen && !isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4"
      variants={backdropVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "exit"}
      exit="exit"
    >
      <motion.div
        className="max-w-sm w-full rounded-xl bg-gradient-to-b from-[#1c1c24] to-[#12151c] p-8 shadow-lg border border-white/10 relative"
        variants={modalVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "exit"}
        exit="exit"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center">
          <motion.div
            className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center mb-6"
            variants={checkmarkVariants}
            initial="hidden"
            animate="visible"
          >
            <Check className="text-white" size={32} />
          </motion.div>

          <div className="flex space-x-2 mb-4">
            {[0, 1, 2, 3, 4].map((index) => (
              <motion.div
                key={index}
                custom={index}
                variants={starVariants}
                initial="hidden"
                animate="visible"
              >
                <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
              </motion.div>
            ))}
          </div>

          <motion.h2
            className="text-2xl font-semibold text-white mb-2"
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            Thank You!
          </motion.h2>

          <motion.p
            className="text-gray-300 text-center mb-4"
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            Your review for {expertName} has been submitted successfully.
          </motion.p>

          <motion.p
            className="text-gray-400 text-sm text-center"
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            Your feedback helps others find great experts on our platform.
          </motion.p>

          <motion.button
            className="mt-6 px-8 py-2 bg-gradient-to-r cursor-pointer from-[#403E43] to-[#221F26] text-white rounded-md border border-white/10 hover:opacity-90 transition-opacity"
            onClick={handleClose}
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            Continue
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReviewSuccessModal;
