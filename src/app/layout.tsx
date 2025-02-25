import type { Metadata } from "next";
import { Open_Sans, Poppins, Roboto } from "next/font/google";

import { Providers } from "./components/providers";

import "./globals.css";

import { Suspense } from "react";

import { cn } from "@/lib/utils";

import { LoadingSpinner } from "./components/Spinner";

export const metadata: Metadata = {
  title: "Expert Link",
  description:
    "A platform where users can book 1-on-1 video/audio calls with industry experts (doctors, lawyers, financial advisors, startup mentors, etc.).",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
  display: "swap",
  preload: true,
});
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
        openSans.variable,
        roboto.variable,
        "antialiased dark"
      )}
    >
      <body className="antialiased">
        <Suspense fallback={<LoadingSpinner mainClassName="h-screen" />}>
          <main className="flex flex-col flex-1 relative">
            <Providers>{children}</Providers>
          </main>
        </Suspense>
      </body>
    </html>
  );
}
