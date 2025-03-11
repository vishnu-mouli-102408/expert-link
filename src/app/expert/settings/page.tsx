import type { Metadata } from "next";
import { Settings } from "@/components";

export const metadata: Metadata = {
  title: "Settings",
  description: "This is the settings page for expert.",
  icons: [{ rel: "icon", url: "/favicon/favicon.ico" }],
};

const SettingsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-900 to-black">
      <Settings />
    </div>
  );
};

export default SettingsPage;
