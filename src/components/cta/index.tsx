"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import AnimationContainer from "../global/animation-container";
import MaxWidthWrapper from "../global/max-width-wrapper";
import Particles from "../magicui/particles";
import { HoverButton } from "../ui/hover-button";

const CTA = () => {
  return (
    <div className="relative flex flex-col items-center bg-gradient-to-r from-[#00000070] to-[#000000] justify-center w-full py-20">
      <MaxWidthWrapper>
        <AnimationContainer
          animation="fadeUp"
          className="md:py-20 py-8  mx-auto"
        >
          <div className="relative flex flex-col items-center justify-center py-8 md:py-20 px-0 rounded-2xl lg:rounded-3xl shadow-[inset_0px_0px_55.5px_0px_#C5B9F626] bg-background/20 text-center border border-foreground/20 overflow-hidden">
            <Particles
              refresh
              ease={80}
              quantity={80}
              color="#d4d4d4"
              className="hidden md:block absolute inset-0 z-0"
            />
            <Particles
              refresh
              ease={80}
              quantity={35}
              color="#d4d4d4"
              className="block md:hidden absolute inset-0 z-0"
            />

            <motion.div
              className="absolute -bottom-1/8 left-1/3 -translate-x-1/2 w-44 h-32 lg:h-52 lg:w-1/3 rounded-full blur-[5rem] lg:blur-[10rem] -z-10"
              style={{
                background:
                  "conic-gradient(from 0deg at 50% 50%, #a855f7 0deg, #3b82f6 180deg, #06b6d4 360deg)",
              }}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              viewport={{ amount: 0.5 }}
              className="text-3xl md:text-5xl lg:text-6xl font-heading font-medium !leading-snug"
            >
              Get Expert Advice <br />{" "}
              <span className="font-subheading italic">Anytime, Anywhere</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              viewport={{ amount: 0.5 }}
              className="text-sm md:text-lg text-center text-accent-foreground/80 max-w-2xl mx-auto mt-4"
            >
              Connect with top professionals for real-time consultations. Book
              sessions, chat instantly, and get expert guidance on-demand{" "}
              <span className="hidden lg:inline">
                — all from one seamless platform.
              </span>
            </motion.p>

            <Link href="#" className="mt-8">
              <HoverButton className="rounded-lg">
                Let&apos;s get started
              </HoverButton>
            </Link>
          </div>
        </AnimationContainer>
      </MaxWidthWrapper>
    </div>
  );
};

export default CTA;
