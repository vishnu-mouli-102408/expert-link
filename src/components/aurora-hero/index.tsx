"use client";

import { useEffect } from "react";
import { ArrowRight, ArrowRightIcon } from "lucide-react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "motion/react";

import AnimationContainer from "../global/animation-container";
import { GridBeam } from "../ui/grid-beam";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

export const AuroraHero = () => {
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, [color]);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  return (
    <motion.section
      style={{
        backgroundImage,
      }}
      className="relative grid min-h-screen  overflow-hidden bg-gray-950 px-4 py-24 text-gray-200"
    >
      <GridBeam className="place-content-center">
        <div className="relative z-10 flex flex-col items-center">
          <AnimationContainer className="mb-2" delay={0.0}>
            <div className="pl-2 pr-1 py-1 rounded-full border border-foreground/10 hover:border-foreground/15 backdrop-blur-lg cursor-pointer flex items-center gap-2.5 select-none w-max mx-auto">
              <div className="w-3.5 h-3.5 rounded-full bg-primary/40 flex items-center justify-center relative">
                <div className="w-2.5 h-2.5 rounded-full bg-primary/60 flex items-center justify-center animate-ping">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/60 flex items-center justify-center animate-ping"></div>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              <span className="inline-flex items-center justify-center gap-2 animate-text-gradient animate-background-shine bg-gradient-to-r from-[#b2a8fd] via-[#8678f9] to-[#c7d2fe] bg-[200%_auto] bg-clip-text text-sm text-transparent">
                Talk to Experts, Instantly!
                <span className="text-xs text-secondary-foreground px-1.5 py-0.5 rounded-full bg-gradient-to-b from-foreground/20 to-foreground/10 flex items-center justify-center">
                  What&apos;s new
                  <ArrowRightIcon className="w-3.5 h-3.5 ml-1 text-foreground/50" />
                </span>
              </span>
            </div>
          </AnimationContainer>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            viewport={{ amount: 0.5 }}
            className="max-w-3xl bg-gradient-to-br from-gray-200 to-gray-500 bg-clip-text text-center text-3xl font-medium leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight"
          >
            Instant Expert Calls for Smarter Decisions!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            viewport={{ amount: 0.5 }}
            className="my-6 max-w-xl text-center text-base leading-relaxed md:text-lg md:leading-relaxed"
          >
            Skip the hassle of endless searching—find the right expert, schedule
            a call, and get personalized, real-time solutions through seamless
            consultations.
          </motion.p>
          <motion.button
            style={{
              border,
              boxShadow,
            }}
            whileHover={{
              scale: 1.015,
            }}
            whileTap={{
              scale: 0.985,
            }}
            className="group cursor-pointer relative flex w-fit items-center gap-1.5 rounded-full bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50"
          >
            Get Started
            <ArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
          </motion.button>
        </div>
      </GridBeam>
    </motion.section>
  );
};
