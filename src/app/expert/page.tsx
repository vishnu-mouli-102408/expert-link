import type { Metadata } from "next";
import { ExpertOverview } from "@/components";

export const metadata: Metadata = {
  title: {
    default: "Expert Layout",
    template: "%s | Expert",
  },
  description: "Tjis is the layout for the Expert pages.",
  icons: [{ rel: "icon", url: "/favicon/favicon.ico" }],
};

function Page() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-black/50 mx-auto p-6">
      <ExpertOverview />
    </div>
  );
}

export default Page;
