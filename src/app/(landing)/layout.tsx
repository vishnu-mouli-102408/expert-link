import { type ReactNode } from "react";
import { Footer, Navbar } from "@/components";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default layout;
