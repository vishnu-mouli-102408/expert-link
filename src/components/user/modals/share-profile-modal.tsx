/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { useClickOutside } from "@/hooks";
import { Check, CircleSlash2, Copy, X } from "lucide-react";
import { motion } from "motion/react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import SocialButton from "@/components/footer/social-button";
import Icons from "@/components/global/icons";

interface ShareProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: any;
  url: string;
}

const ShareProfileModal = ({
  isOpen,
  onClose,
  expert,
  url,
}: ShareProfileModalProps) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url);

  useEffect(() => {
    setCurrentUrl(url || window.location.href);
  }, [url]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  console.log("URL", currentUrl);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 500); // Wait for exit animation to complete
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
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

  const mobileMenuRef = useClickOutside(() => {
    setTimeout(() => {
      if (isOpen) onClose();
    }, 0);
  });

  if (!isOpen && !isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center mb-0 bg-black/70 z-[1000] p-4 backdrop-blur-sm overflow-hidden"
      variants={backdropVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "exit"}
      exit="exit"
    >
      <motion.div
        ref={(el) => {
          if (el) mobileMenuRef.current = el;
        }}
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

        <div className="flex flex-col p-6 md:p-8 overflow-hidden h-full">
          <div className="flex items-center space-x-4 mb-10 flex-shrink-0">
            <div className="flex-shrink-0">
              <Avatar className="h-14 w-14 border-2 border-white/10">
                <AvatarFallback className="bg-gradient-to-br from-[#403E43] to-[#221F26] text-white">
                  {expert?.firstName?.[0]}
                  {expert?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Share Profile
              </h2>
              <div className="flex items-center mt-1 space-x-2">
                {expert?.firstName} {expert?.lastName}
              </div>
            </div>
          </div>

          <div className="flex-grow gap-4 flex flex-col overflow-hidden">
            <div>
              <h3 className="text-white text-lg mb-4 font-medium flex items-center flex-shrink-0">
                <CircleSlash2
                  size={18}
                  className="mr-2 text-purple-400"
                  strokeWidth={2.5}
                />
                Share this link via
              </h3>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="flex flex-row gap-4 mb-4 ml-6"
              >
                <SocialButton
                  icon={<Icons.linkedin />}
                  buttonClassName="group flex cursor-pointer justify-center p-2 rounded-md drop-shadow-xl bg-[#0077b5] from-gray-800 text-white font-semibold  hover:rounded-[50%] transition-all duration-500 hover:from-[#331029] hover:to-[#310413] relative"
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                />
                <SocialButton
                  icon={<Icons.facebook />}
                  buttonClassName="group flex justify-center cursor-pointer p-2 rounded-md drop-shadow-xl bg-[#316FF6] text-white font-semibold hover:rounded-[50%] transition-all duration-500 hover:from-[#331029] hover:to-[#310413]"
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                />
                <SocialButton
                  icon={<Icons.whatsapp />}
                  buttonClassName="group flex justify-center cursor-pointer p-2 rounded-md drop-shadow-xl bg-[#25D366] text-white font-semibold hover:rounded-[50%] transition-all duration-500 hover:from-[#331029] hover:to-[#310413]"
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${"Check out this expert profile:"} ${currentUrl}`)}`}
                />
                <SocialButton
                  icon={<Icons.telegram />}
                  buttonClassName="group flex justify-center cursor-pointer p-2 rounded-md drop-shadow-xl bg-[#0088CC] text-white font-semibold hover:rounded-[50%] transition-all duration-500 hover:from-[#331029] hover:to-[#310413]"
                  href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent("Check out this expert profile!")}`}
                />
                <SocialButton
                  icon={<Icons.x />}
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent("Check out this expert profile")}&hashtags=Profile,Networking`}
                  buttonClassName="group flex justify-center cursor-pointer p-2 rounded-md drop-shadow-xl bg-gradient-to-r from-gray-800 to-black text-white font-semibold  hover:rounded-[50%] transition-all duration-500 hover:from-[#331029] hover:to-[#310413]"
                />
              </motion.div>
            </div>
            <div>
              <h3 className="text-white text-lg mb-4 font-medium flex items-center flex-shrink-0">
                Or Copy the link
              </h3>
              <div className="flex items-center mb-3 gap-2">
                <div className="flex-1 bg-zinc-800 rounded-lg overflow-hidden flex items-center">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="w-full px-4 py-2.5 bg-transparent text-white focus:outline-none text-sm"
                  />
                </div>
                <motion.button
                  onClick={copyToClipboard}
                  className={`px-4 py-2.5 rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-colors ${
                    copied
                      ? "bg-green-600 text-white"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-sm font-medium">Copy</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShareProfileModal;
