"use client";

import { useRef, useState, type RefObject } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/constants";
import { useClickOutside } from "@/hooks";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";

import { cn } from "@/lib/utils";

import AnimationContainer from "../global/animation-container";
import Icons from "../global/icons";
import MaxWidthWrapper from "../global/max-width-wrapper";
import AnimatedHamburgerButton from "../ui/animated-hamburget-button";
import { Button } from "../ui/button";
import { HoverButton } from "../ui/hover-button";

const Navbar = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const { user, isSignedIn } = useUser();

  console.info("User:", user, isSignedIn);

  const { signOut } = useClerk();

  const mobileMenuRef = useClickOutside(() => {
    setTimeout(() => {
      if (open) setOpen(false);
    }, 0);
  });

  const { scrollY } = useScroll({
    target: ref as RefObject<HTMLDivElement>,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut({ redirectUrl: "/" });
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className="fixed w-full top-0 inset-x-0 z-50">
      {/* Desktop */}
      <motion.div
        animate={{
          width: visible ? "60%" : "100%",
          y: visible ? 20 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 40,
        }}
        style={{
          minWidth: "800px",
        }}
        className={cn(
          "hidden lg:flex bg-transparent self-start items-center justify-between py-4 rounded-xl relative z-[50] mx-auto w-full backdrop-blur-[10px]",
          visible &&
            "bg-background/60 py-2 border border-t-foreground/20 border-b-foreground/10 border-x-foreground/15 w-full"
        )}
      >
        <MaxWidthWrapper className="flex items-center justify-between lg:px-3">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="border shadow-[0_3px_10px_rgb(0,0,0,0.2)] h-[50px] w-[50px] rounded-lg border-white/15 inline-flex items-center justify-center">
              <Link href="/">
                <Icons.logo className="w-max h-8" />
              </Link>
            </div>
          </motion.div>

          <div className="hidden lg:flex flex-row flex-1 absolute inset-0 items-center justify-center w-max mx-auto gap-x-2 text-sm text-muted-foreground font-medium">
            <AnimatePresence>
              {NAV_LINKS.map((link, index) => (
                <AnimationContainer
                  key={index}
                  animation="fadeDown"
                  delay={0.1 * index}
                >
                  <div className="relative">
                    <Link
                      href={link.link}
                      className="transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:text-foreground hover:bg-accent rounded-md px-4 py-2"
                    >
                      <Button
                        className="py-2 cursor-pointer bg-transparent text-[#FFFFFF] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
                         hover:scale-105 hover:bg-[#FFFFFF0D]
                         hover:shadow-[0px_0px_20px_0px_#FFFFFF33_inset]
                         hover:border hover:border-[#FFFFFF26]"
                      >
                        {link.name}
                      </Button>
                    </Link>
                  </div>
                </AnimationContainer>
              ))}
            </AnimatePresence>
          </div>

          <AnimationContainer animation="fadeLeft" delay={0.1}>
            <div className="flex items-center gap-x-4">
              {isSignedIn ? (
                <div className="flex flex-row gap-4">
                  <Link href="#" className="w-full flex justify-center">
                    <HoverButton className="rounded-lg py-2 shadow-[0_1px_1px_rgba(0,0,0,0.05), 0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]">
                      Explore
                    </HoverButton>
                  </Link>
                  <UserButton
                    appearance={{
                      elements: {
                        footer: {
                          display: "none",
                        },
                      },
                      layout: {
                        unsafe_disableDevelopmentModeWarnings: true,
                      },
                    }}
                    userProfileMode="navigation"
                    userProfileUrl="/profile"
                  />
                </div>
              ) : (
                <Link href="/sign-in" className="w-full flex justify-center">
                  <HoverButton className="rounded-lg py-2 shadow-[0_1px_1px_rgba(0,0,0,0.05), 0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]">
                    User Login
                  </HoverButton>
                </Link>
              )}
            </div>
          </AnimationContainer>
        </MaxWidthWrapper>
      </motion.div>

      {/* Mobile */}
      <motion.div
        animate={{
          y: visible ? 20 : 0,
          borderTopLeftRadius: open ? "0.75rem" : "1rem",
          borderTopRightRadius: open ? "0.75rem" : "1rem",
          borderBottomLeftRadius: open ? "0rem" : "1rem",
          borderBottomRightRadius: open ? "0rem" : "1rem",
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 50,
        }}
        className={cn(
          "flex relative flex-col lg:hidden w-full justify-between items-center mx-auto py-4 z-50",
          visible && "bg-neutral-950 w-11/12 border ",
          open && "border-transparent ",
          visible &&
            !open &&
            "backdrop-blur-[30px] shadow-[inset_0px_0px_10px_0px_#ffffff0d] bg-transparent bg-[radial-gradient(38.55%_36.76%_at_65.67%_53.56%,rgba(255,255,255,0.02)_0%,rgba(38,216,255,0.02)_48.65%,rgba(14,3,28,0)_100%)]"
        )}
      >
        <MaxWidthWrapper className="flex items-center justify-between lg:px-4">
          <div className="flex items-center justify-between gap-x-4 w-full">
            <AnimationContainer animation="fadeRight" delay={0.1}>
              <div className="border shadow-[0_10px_20px_rgba(0,_11,_88,_0.7)] h-[50px] w-[50px] rounded-lg border-white/15 inline-flex items-center justify-center">
                <Link href="/">
                  <Icons.logo className="w-max h-8" />
                </Link>
              </div>
            </AnimationContainer>

            <AnimationContainer animation="fadeLeft" delay={0.1}>
              <div className="flex shadow-[0_3px_10px_rgb(0,0,0,0.2)] items-center justify-center gap-x-4">
                <AnimatedHamburgerButton active={open} setActive={setOpen} />
              </div>
            </AnimationContainer>
          </div>
        </MaxWidthWrapper>

        <AnimatePresence>
          {open && (
            <motion.div
              ref={(el) => {
                if (el) mobileMenuRef.current = el;
              }}
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              transition={{ duration: 0.3, delay: 0.1, ease: "easeInOut" }}
              className="flex rounded-b-xl absolute mx-auto top-[82px] bg-neutral-950 inset-x-0 z-50 flex-col items-start justify-start gap-2 w-full px-4 py-8 shadow-xl shadow-neutral-950"
            >
              <AnimationContainer
                animation="fadeUp"
                delay={0.5}
                className="w-full"
              >
                {isSignedIn ? (
                  <div className="flex flex-col md:flex-row gap-4">
                    <Link href="/sign-in" className="w-full">
                      <HoverButton className="rounded-lg block lg:hidden w-full">
                        Explore
                      </HoverButton>
                    </Link>
                    <Link href="/sign-up" className="w-full">
                      <HoverButton
                        onClick={handleSignOut}
                        className="rounded-lg block lg:hidden w-full"
                      >
                        {isSigningOut ? "Signing Out..." : "Sign Out"}
                      </HoverButton>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row gap-4">
                    <Link href="/sign-in" className="w-full">
                      <HoverButton
                        onClick={() => setOpen(false)}
                        className="rounded-lg block lg:hidden w-full"
                      >
                        User Login
                      </HoverButton>
                    </Link>
                    <Link href="/sign-up" className="w-full">
                      <HoverButton
                        onClick={() => setOpen(false)}
                        className="rounded-lg block lg:hidden w-full"
                      >
                        Sign Up
                      </HoverButton>
                    </Link>
                  </div>
                )}
              </AnimationContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
};

export default Navbar;
