import { ReactNode } from "react";
import * as motion from "motion/react-client";

type ProfileSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  index: number;
};

const ProfileSection = ({
  title,
  description,
  children,
  index,
}: ProfileSectionProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.1 * index,
      }}
      className="mb-8 pb-8 border-b border-white/10 last:border-b-0"
    >
      <div className="mb-5">
        <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400 mb-1">
          {title}
        </h3>
        {description && <p className="text-sm text-zinc-500">{description}</p>}
      </div>
      <div>{children}</div>
    </motion.section>
  );
};

export default ProfileSection;
