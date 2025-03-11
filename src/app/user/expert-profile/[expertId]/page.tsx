import type { Metadata } from "next";
import { ExpertProfile } from "@/components";

export const metadata: Metadata = {
  title: "Expert Profile",
  description: "This is the layout for the expert profile page.",
  icons: [{ rel: "icon", url: "/favicon/favicon.ico" }],
};

const Page = async ({ params }: { params: Promise<{ expertId: string }> }) => {
  const { expertId } = await params;
  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-black/50 mx-auto p-6">
      <ExpertProfile />
    </div>
  );
};

export default Page;
