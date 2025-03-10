import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { Providers } from "../components/providers";

import "./globals.css";

import { Suspense } from "react";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Expert Link",
  description:
    "A platform where users can book 1-on-1 video/audio calls with industry experts (doctors, lawyers, financial advisors, startup mentors, etc.).",
  icons: [{ rel: "icon", url: "/favicon/favicon.ico" }],
};

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={cn(
        poppins.variable,
        "min-h-screen overflow-x-hidden antialiased dark"
      )}
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="MyWebSite" />
        <link rel="icon" href="/favicon/favicon.ico" sizes="48x48" />
        <link
          rel="icon"
          href="/favicon/favicon.svg"
          sizes="any"
          type="image/svg+xml"
        />
        <link
          rel="icon"
          type="image/png"
          href="/favicon/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={cn(poppins.className, "antialiased dark")}>
        <ClerkProvider
          allowedRedirectOrigins={[
            "http://localhost:3000",
            "https://expert-link.vishnumouli.me",
          ]}
          appearance={{
            baseTheme: dark,
            elements: {
              footer: {
                display: "none",
              },
            },
            layout: {
              unsafe_disableDevelopmentModeWarnings: true,
            },
          }}
        >
          <ClerkLoading>
            <LoadingSpinner mainClassName="h-screen" />
          </ClerkLoading>
          <ClerkLoaded>
            <Suspense fallback={<LoadingSpinner mainClassName="h-screen" />}>
              <main className="flex flex-col relative">
                <Providers>{children}</Providers>
                <Toaster richColors />
              </main>
            </Suspense>
          </ClerkLoaded>
        </ClerkProvider>
      </body>
    </html>
  );
}
