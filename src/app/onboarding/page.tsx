"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimationContainer, MaxWidthWrapper } from "@/components";
import { useUser } from "@clerk/nextjs";
import { motion } from "motion/react";
import { toast } from "sonner";

import type { Roles } from "@/types/global";
import { setRole } from "@/lib/user";

export default function OnboardingComponent() {
  const { user } = useUser();
  const router = useRouter();

  console.info("USER", user);

  const [selectedRole, setSelectedRole] = React.useState<
    "USER" | "EXPERT" | null
  >(null);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!user) {
    router.push("/sign-in");
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = setRole(
        user?.id || "",
        (selectedRole?.toLowerCase() as Roles) || "user"
      );
      const response = await res;
      console.info("RESPONSE", response);
      if (response?.success) {
        await user?.reload();
        toast.success("User Setup Done Successfully.", {
          duration: 3000,
          position: "bottom-center",
          closeButton: true,
        });
        if (user?.publicMetadata?.role === "user") {
          router.push("/user");
        }
        if (user?.publicMetadata?.role === "expert") {
          router.push("/expert");
        }
      } else {
        toast.error("Error Setting Up User", {
          duration: 3000,
          position: "bottom-center",
          description: "Please try again later.",
          closeButton: true,
        });
      }
    } catch (error) {
      console.info("ERROR", error);
      toast.error("Error Setting Up User", {
        duration: 3000,
        position: "bottom-center",
        description: "Please try again later.",
        closeButton: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      viewport={{ amount: 0.5 }}
      className="bg-gradient-to-r from-black/70 to-gray-950"
    >
      <MaxWidthWrapper className="w-screen h-screen flex  justify-center items-center ">
        <AnimationContainer className="flex flex-col space-y-6">
          <h1 className="text-5xl font-semibold text-center bg-gradient-to-r from-[#b3abd4] to-[#7c77a2] bg-clip-text text-transparent">
            Welcome! Select Role
          </h1>

          <p className="text-center bg-gradient-to-r from-[#d9d8dd] to-[#b5b3c6] bg-clip-text text-transparent text-xl font-normal">
            Choose the option that best describes you
          </p>
          <div className="mt-4 flex md:flex-row flex-col gap-4">
            <button
              onClick={() => setSelectedRole("USER")}
              className={`w-full py-8 text-2xl font-semibold rounded-xl cursor-pointer  transition-all duration-300 ease-in-out hover:scale-[1.02] p-2 ${selectedRole === "USER" ? " bg-[#FFFFFF1A] border border-[#FFFFFF66] shadow-[inset_0px_0px_30px_0px_#FFFFFF4D]" : "bg-[#FFFFFF0D] border shadow-[inset_0px_0px_20px_0px_#FFFFFF33] border-[#FFFFFF26]"}`}
            >
              User
            </button>
            <button
              onClick={() => setSelectedRole("EXPERT")}
              className={`w-full py-8 text-2xl font-semibold rounded-xl cursor-pointer  transition-all duration-300 ease-in-out hover:scale-[1.02] p-2 ${selectedRole === "EXPERT" ? " bg-[#FFFFFF1A] border border-[#FFFFFF66] shadow-[inset_0px_0px_30px_0px_#FFFFFF4D]" : "bg-[#FFFFFF0D] border shadow-[inset_0px_0px_20px_0px_#FFFFFF33] border-[#FFFFFF26]"}`}
            >
              Expert
            </button>
          </div>

          <div className="w-full flex justify-center items-center">
            <button
              onClick={() => {
                if (!selectedRole) {
                  toast.error("Please select a role", {
                    duration: 3000,
                    position: "bottom-center",
                    closeButton: true,
                  });
                  return;
                }
                handleSubmit();
              }}
              className="relative h-12 w-max mt-6 cursor-pointer px-8 rounded-lg overflow-hidden transition-all duration-500 group"
            >
              <div className="absolute inset-0 rounded-lg p-[2px] bg-gradient-to-b from-[#654358] via-[#17092A] to-[#2F0D64]">
                <div className="absolute inset-0 bg-[#170928] rounded-lg opacity-90"></div>
              </div>
              <div className="absolute inset-[2px] bg-[#170928] rounded-lg opacity-95"></div>
              <div className="absolute inset-[2px] bg-gradient-to-r from-[#170928] via-[#1d0d33] to-[#170928] rounded-lg opacity-90"></div>
              <div className="absolute inset-[2px] bg-gradient-to-b from-[#654358]/40 via-[#1d0d33] to-[#2F0D64]/30 rounded-lg opacity-80"></div>
              <div className="absolute inset-[2px] bg-gradient-to-br from-[#C787F6]/10 via-[#1d0d33] to-[#2A1736]/50 rounded-lg"></div>
              <div className="absolute inset-[2px] shadow-[inset_0_0_15px_rgba(199,135,246,0.15)] rounded-lg"></div>
              <div className="relative flex items-center justify-center gap-2">
                <span className="text-lg font-normal bg-gradient-to-b from-[#D69DDE] to-[#B873F8] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(199,135,246,0.4)] tracking-tighter">
                  {isSubmitting ? "Please wait..." : "Continue"}
                </span>
              </div>
              <div className="absolute inset-[2px] opacity-0 transition-opacity duration-300 bg-gradient-to-r from-[#2A1736]/20 via-[#C787F6]/10 to-[#2A1736]/20 group-hover:opacity-100 rounded-lg"></div>
            </button>
          </div>
        </AnimationContainer>
      </MaxWidthWrapper>
    </motion.div>
  );
}
