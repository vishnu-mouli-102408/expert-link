import { SidebarProvider } from "@/components/sidebar/sidebar-context";

import { AppLayoutContent, type AppLayoutProps } from "./app-layout-content";

const Layout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
};

export default Layout;
