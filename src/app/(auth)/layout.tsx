import { type ReactNode } from "react";
import type { Metadata } from "next";
import { Footer, Navbar } from "@/components";

export const metadata: Metadata = {
  title: "Auth Layout",
  description: "This is the layout for the auth pages.",
  icons: [{ rel: "icon", url: "/favicon/favicon.ico" }],
};

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
