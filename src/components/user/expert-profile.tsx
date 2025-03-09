"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { mockExperts } from "@/constants/mock-data";
import {
  BadgeCheck,
  Calendar,
  Clock,
  Headphones,
  MessageCircle,
  Phone,
  Star,
  Video,
} from "lucide-react";
import { motion } from "motion/react";

import {
  fadeInLeft,
  fadeInUp,
  staggerContainer,
} from "@/lib/framer-animations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { Button } from "../ui/button";
import { HoverButton } from "../ui/hover-button";

const ExpertProfile = () => {
  const { expertId } = useParams<{ expertId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const router = useRouter();

  console.log("expertId", expertId);

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Find expert by ID
  const expert = mockExperts.find((expert) => expert.id === expertId);

  if (!expert && !isLoading) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Expert not found</h1>
        <p className="text-muted-foreground">
          The expert you're looking for doesn't exist or has been removed.
        </p>
        <Button
          className="mt-4 cursor-pointer"
          onClick={() => {
            router.push("/user");
          }}
        >
          Go Home
        </Button>
      </div>
    );
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left column skeleton */}
            <div className="w-full md:w-1/3">
              <Skeleton className="h-72 w-full rounded-xl mb-4" />
              <Skeleton className="h-12 w-full rounded-lg mb-3" />
              <div className="grid grid-cols-3 gap-2 mb-4">
                <Skeleton className="h-10 rounded-md" />
                <Skeleton className="h-10 rounded-md" />
                <Skeleton className="h-10 rounded-md" />
              </div>
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>

            {/* Right column skeleton */}
            <div className="w-full md:w-2/3">
              <Skeleton className="h-10 w-48 rounded-md mb-2" />
              <Skeleton className="h-6 w-36 rounded-md mb-6" />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-lg" />
                ))}
              </div>

              <Skeleton className="h-8 w-32 rounded-md mb-3" />
              <Skeleton className="h-24 w-full rounded-lg mb-6" />

              <Skeleton className="h-8 w-32 rounded-md mb-3" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-12 rounded-lg" />
                ))}
              </div>

              <Skeleton className="h-8 w-32 rounded-md mb-3" />
              <Skeleton className="h-36 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container py-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="flex flex-col md:flex-row gap-8"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {/* Left Column: Profile Info */}
            <motion.div
              className="w-full md:w-1/3 space-y-6"
              variants={fadeInLeft}
            >
              {/* Profile Image */}
              <motion.div
                className="relative rounded-xl cursor-pointer overflow-hidden bg-gradient-to-br from-[#1A1F2C] to-[#0f0f13] shadow-xl border border-white/5"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute top-3 left-3 z-10">
                  <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium border border-white/10">
                    <BadgeCheck className="w-3.5 h-3.5 text-[#5858e8]" />
                    Verified Expert
                  </span>
                </div>
                <motion.img
                  src={expert?.imageUrl}
                  alt={expert?.name}
                  className="w-full h-72 object-cover"
                  initial={{ scale: 1.1, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center">
                    <div className="flex text-amber-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(expert?.rating ?? 0)
                              ? "fill-current"
                              : "opacity-30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-300">
                      ({expert?.reviews} reviews)
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Call to Action Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {/* <Button
                  className="w-full py-6 text-white cursor-pointer text-lg rounded-xl bg-gradient-to-r from-[#403E43] to-[#221F26] hover:opacity-90 border border-white/10 shadow-xl"
                  onClick={() => setIsScheduleOpen(true)}
                >
                  Schedule a Call
                </Button> */}
                <HoverButton
                  onClick={() => setIsScheduleOpen(true)}
                  className="w-full flex justify-center text-lg items-center rounded-xl"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  <span>Schedule a Call</span>
                </HoverButton>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                className="grid grid-cols-3 gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Button
                  variant="outline"
                  className="flex flex-col gap-1 py-3 h-auto cursor-pointer hover:scale-[1.005] transition-all duration-200 ease-in-out bg-[#221F26] shadow-[inset_0px_0px_20px_0px_#FFFFFF33] border-[#FFFFFF26] text-gray-300 hover:bg-[#403E43]/50 hover:text-white"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-xs">Message</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col gap-1 py-3 h-auto cursor-pointer hover:scale-[1.005] transition-all duration-200 ease-in-out bg-[#221F26] shadow-[inset_0px_0px_20px_0px_#FFFFFF33] border-[#FFFFFF26] text-gray-300 hover:bg-[#403E43]/50 hover:text-white"
                >
                  <Phone className="h-5 w-5" />
                  <span className="text-xs">Call</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col gap-1 py-3 h-auto cursor-pointer hover:scale-[1.005] transition-all duration-200 ease-in-out bg-[#221F26] shadow-[inset_0px_0px_20px_0px_#FFFFFF33] border-[#FFFFFF26] text-gray-300 hover:bg-[#403E43]/50 hover:text-white"
                >
                  <Video className="h-5 w-5" />
                  <span className="text-xs">Video</span>
                </Button>
              </motion.div>

              {/* Availability Card */}

              <motion.div
                className="p-4 rounded-xl bg-gradient-to-br transition-all duration-200 ease-in-out hover:shadow-[inset_0px_0px_30px_0px_#FFFFFF2D] from-[#222222] to-[#1A1F2C] border border-[#FFFFFF36] cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <h3 className="font-medium text-gray-200 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-primary" /> Availability
                </h3>
                <p className="text-gray-400 text-sm mb-2">
                  Available:{" "}
                  <span className="text-white">{expert?.availability}</span>
                </p>
                <p className="text-gray-400 text-sm mb-3">
                  Response time:{" "}
                  <span className="text-white">Usually within 2 hours</span>
                </p>
                <div className="grid grid-cols-7 gap-1">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                    <div
                      key={i}
                      className={`rounded p-1.5 text-xs text-center ${
                        i < 5
                          ? "bg-[#403E43]/40 text-white"
                          : "bg-[#221F26]/50 text-gray-500"
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Main Content */}
            <motion.div
              className="w-full md:w-2/3 space-y-8"
              variants={fadeInUp}
            >
              {/* Expert Header */}
              <div>
                <motion.h1
                  className="text-3xl font-bold text-white mb-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {expert?.name}
                </motion.h1>
                <motion.p
                  className="text-xl text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  {expert?.title}
                </motion.p>
              </div>

              {/* Stats Cards */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
                initial="initial"
                animate="animate"
                variants={staggerContainer}
              >
                <motion.div
                  className="p-4 rounded-xl bg-[#222222] border cursor-pointer hover:shadow-[inset_0px_0px_20px_0px_#FFFFFF1D] border-[#FFFFFF16] shadow-md"
                  variants={fadeInUp}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <h3 className="text-sm text-gray-400 mb-1">Hourly Rate</h3>
                  <p className="text-2xl font-semibold text-white">
                    ${expert?.hourlyRate}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">USD per hour</p>
                </motion.div>
                <motion.div
                  className="p-4 rounded-xl bg-[#222222] border cursor-pointer hover:shadow-[inset_0px_0px_20px_0px_#FFFFFF1D] border-[#FFFFFF16] shadow-md"
                  variants={fadeInUp}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <h3 className="text-sm text-gray-400 mb-1">Experience</h3>
                  <p className="text-2xl font-semibold text-white">8+ Years</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Professional experience
                  </p>
                </motion.div>
                <motion.div
                  className="p-4 rounded-xl bg-[#222222] border cursor-pointer hover:shadow-[inset_0px_0px_20px_0px_#FFFFFF1D] border-[#FFFFFF16] shadow-md col-span-2 md:col-span-1"
                  variants={fadeInUp}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <h3 className="text-sm text-gray-400 mb-1">Expertise</h3>
                  <p className="text-lg font-semibold text-white">
                    {expert?.category}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {expert?.specialties.slice(0, 2).map((specialty, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 bg-[#403E43]/40 rounded-full text-gray-300"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* About Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center">
                  <BadgeCheck className="w-5 h-5 mr-2 text-primary" /> About Me
                </h2>
                <div className="p-5 rounded-xl bg-gradient-to-br from-[#222222] to-[#1A1F2C] border border-white/5 shadow-lg">
                  <p className="text-gray-300 leading-relaxed">
                    As a {expert?.title.toLowerCase()} with over 8 years of
                    experience, I've helped hundreds of clients solve complex
                    problems in {expert?.category.toLowerCase()}. My approach is
                    centered on practical solutions that drive real results.
                  </p>
                  <br />
                  <p className="text-gray-300 leading-relaxed">
                    I specialize in {expert?.specialties.join(", ")}, and I'm
                    passionate about sharing my knowledge to help others
                    succeed. Looking forward to connecting!
                  </p>
                </div>
              </motion.div>

              {/* Specialties Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <h2 className="text-xl font-semibold text-white mb-3">
                  Specialties
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {expert?.specialties.map((specialty, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center transition-all duration-100 ease-in-out cursor-pointer p-3 rounded-lg bg-[#222222] border border-white/5"
                      whileHover={{
                        x: 2,
                        backgroundColor: "rgba(64, 62, 67, 0.3)",
                        transition: { duration: 0.2 },
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#403E43] to-[#221F26] flex items-center justify-center mr-3">
                        <BadgeCheck className="w-4 h-4 text-gray-200" />
                      </div>
                      <span className="text-gray-200">{specialty}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Reviews Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <h2 className="text-xl font-semibold text-white mb-3">
                  Reviews
                </h2>
                <div className="p-5 rounded-xl bg-gradient-to-br from-[#222222] to-[#1A1F2C] border border-white/5 shadow-lg">
                  <div className="flex items-start mb-5">
                    <div className="flex flex-col items-center mr-4">
                      <div className="text-4xl font-bold text-white">
                        {expert?.rating}
                      </div>
                      <div className="flex text-amber-400 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(expert?.rating ?? 0)
                                ? "fill-current"
                                : "opacity-30"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400 mt-1">
                        {expert?.reviews} reviews
                      </span>
                    </div>
                    <Separator orientation="vertical" className="mx-4 h-20" />
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const percentage =
                          rating === 5
                            ? 65
                            : rating === 4
                              ? 25
                              : rating === 3
                                ? 7
                                : rating === 2
                                  ? 2
                                  : 1;
                        return (
                          <div key={rating} className="flex items-center mb-1">
                            <div className="w-10 flex justify-end">
                              <span className="text-xs text-gray-400">
                                {rating}
                              </span>
                            </div>
                            <Star className="w-3 h-3 text-amber-400 mx-1 fill-current" />
                            <div className="flex-1 h-2 bg-[#1A1F2C] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-400"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-400 ml-2 w-8">
                              {percentage}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full bg-[#221F26] cursor-pointer transition-all duration-300 ease-in-out border-white/10 text-gray-300 hover:bg-[#403E43]/50 hover:text-white"
                  >
                    Read all reviews
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Schedule Dialog */}
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="bg-[#12151c] border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Schedule a Call with {expert?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-wrap">
              Choose a date and time that works for you to connect with{" "}
              {expert?.name.split(" ")[0]}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div className="grid grid-cols-3  gap-2">
              <Button
                variant="outline"
                className="bg-[#222222]/80 transition-all duration-200 ease-in-out cursor-pointer border-white/10 hover:bg-[#403E43]/50"
              >
                Today
              </Button>
              <Button
                variant="outline"
                className="bg-[#222222]/80 transition-all duration-200 ease-in-out cursor-pointer border-white/10 hover:bg-[#403E43]/50"
              >
                Tomorrow
              </Button>
              <Button
                variant="outline"
                className="bg-[#222222]/80 transition-all duration-200 ease-in-out cursor-pointer border-white/10 hover:bg-[#403E43]/50"
              >
                Next Week
              </Button>
            </div>

            <div className="bg-[#222222]/70 rounded-lg p-4 border border-white/5">
              <h3 className="text-sm font-medium mb-3 text-gray-300">
                Select Format
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  className="flex flex-col cursor-pointer items-center py-3 h-auto bg-[#403E43]/40 border-primary/50 text-white"
                >
                  <Phone className="h-5 w-5 mb-1" />
                  <span className="text-xs">Phone</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center cursor-pointer py-3 h-auto bg-[#221F26] border-white/10 text-gray-400"
                >
                  <Video className="h-5 w-5 mb-1" />
                  <span className="text-xs">Video</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center py-3 cursor-pointer h-auto bg-[#221F26] border-white/10 text-gray-400"
                >
                  <Headphones className="h-5 w-5 mb-1" />
                  <span className="text-xs">Audio</span>
                </Button>
              </div>
            </div>

            <div className="bg-[#222222]/70 cursor-pointer rounded-lg p-4 border border-white/5">
              <h3 className="text-sm font-medium mb-3 text-gray-300">
                Duration & Rate
              </h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-300">30 minutes</p>
                  <p className="text-xs text-gray-500">Standard consultation</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">
                    ${expert?.hourlyRate ? expert.hourlyRate / 2 : 0}
                  </p>
                  <p className="text-xs text-gray-500">USD total</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className="bg-[#221F26] border-white/10 cursor-pointer text-gray-300"
              onClick={() => setIsScheduleOpen(false)}
            >
              Cancel
            </Button>
            <Button className="bg-gradient-to-r cursor-pointer text-white from-[#403E43] to-[#221F26] hover:opacity-90 border border-white/10">
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExpertProfile;
