import type { Metadata } from "next";
import { ExpertProfile } from "@/components";

import { client } from "@/lib/client";

export const metadata: Metadata = {
  title: "Expert Profile",
  description: "This is the layout for the expert profile page.",
  icons: [{ rel: "icon", url: "/favicon/favicon.ico" }],
};

export async function generateStaticParams() {
  const response = await client.user.getAllExperts.$get();
  const expertProfiles = await response.json();
  return expertProfiles?.data?.experts?.map((expertProfile) => ({
    expertId: expertProfile.id,
  }));
}

const Page = async ({ params }: { params: Promise<{ expertId: string }> }) => {
  const { expertId } = await params;
  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-black/50 mx-auto p-6">
      <ExpertProfile />
    </div>
  );
};

export default Page;
