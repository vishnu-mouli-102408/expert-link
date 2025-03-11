import type { Metadata } from "next";
import { UserOverview } from "@/components";

export const metadata: Metadata = {
  title: {
    default: "User Layout",
    template: "%s | User",
  },
  description: "Tjis is the layout for the user pages.",
  icons: [{ rel: "icon", url: "/favicon/favicon.ico" }],
};

function Page() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-black/50 mx-auto p-6">
      <UserOverview />
    </div>
  );
}

export default Page;
