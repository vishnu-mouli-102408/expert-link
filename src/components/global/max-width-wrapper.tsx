import React from "react";

import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  children: React.ReactNode;
}

const MaxWidthWrapper = ({ className, children }: Props) => {
  return (
    <section
      className={cn(
        "h-full mx-auto w-full lg:max-w-screen-xl px-4 lg:px-16",
        className
      )}
    >
      {children}
    </section>
  );
};

export default MaxWidthWrapper;
