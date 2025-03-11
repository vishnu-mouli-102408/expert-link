import type { Metadata } from "next";

import { SidebarProvider } from "@/components/sidebar/sidebar-context";

import { AppLayoutContent, type AppLayoutProps } from "./app-layout-content";

export const metadata: Metadata = {
  title: {
    default: "Expert",
    template: "%s | Expert",
  },
  description: "This is the layout for the expert pages.",
  icons: [{ rel: "icon", url: "/favicon/favicon.ico" }],
};

const Layout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
};

export default Layout;
