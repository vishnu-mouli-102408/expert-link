import { motion, MotionConfig } from "motion/react";

interface Props {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const AnimatedHamburgerButton = ({ active, setActive }: Props) => {
  return (
    <MotionConfig
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
    >
      <motion.button
        initial={false}
        animate={active ? "open" : "closed"}
        onClick={(e) => {
          e?.stopPropagation();
          setActive((prev: boolean) => !prev);
        }}
        className="relative h-10 w-10 border  border-white/15 inline-flex items-center justify-center rounded-lg bg-white/0 transition-colors hover:bg-white/20"
      >
        <motion.span
          variants={VARIANTS.top}
          className={`absolute h-[2px] ${active ? "w-5" : "w-6"} bg-white`}
          style={{ y: "-50%", left: "50%", x: "-50%", top: "35%" }}
        />
        <motion.span
          variants={VARIANTS.middle}
          className={`absolute h-[2px] ${active ? "w-5" : "w-6"} bg-white`}
          style={{ left: "50%", x: "-50%", top: "50%", y: "-50%" }}
        />
        <motion.span
          variants={VARIANTS.bottom}
          className="absolute h-[2px] w-[10px] bg-white"
          style={{
            x: "-50%",
            y: "50%",
            bottom: "35%",
            left: "calc(50% + 6px)",
          }}
        />
      </motion.button>
    </MotionConfig>
  );
};

const VARIANTS = {
  top: {
    open: {
      rotate: ["0deg", "0deg", "45deg"],
      top: ["35%", "50%", "50%"],
    },
    closed: {
      rotate: ["45deg", "0deg", "0deg"],
      top: ["50%", "50%", "35%"],
    },
  },
  middle: {
    open: {
      rotate: ["0deg", "0deg", "-45deg"],
    },
    closed: {
      rotate: ["-45deg", "0deg", "0deg"],
    },
  },
  bottom: {
    open: {
      rotate: ["0deg", "0deg", "45deg"],
      bottom: ["35%", "50%", "50%"],
      left: "50%",
    },
    closed: {
      rotate: ["45deg", "0deg", "0deg"],
      bottom: ["50%", "50%", "35%"],
      left: "calc(50% + 6px)",
    },
  },
};

export default AnimatedHamburgerButton;
