import type { Metadata } from "next";
import { ExploreExperts } from "@/components";

export const metadata: Metadata = {
  title: "Explore Experts",
  description: "This is the layout for the explore experts pages.",
  icons: [{ rel: "icon", url: "/favicon/favicon.ico" }],
};

const Page = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-black/50 mx-auto p-6">
      <ExploreExperts />
    </div>
  );
};

export default Page;
