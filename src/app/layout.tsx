import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/blocks/sidebar/app-sidebar";
import { AppProviders } from "@/components/providers/app-providers";
import { ShellMain } from "@/components/blocks/sidebar/inset/main-shell";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Homify",
  description: "A bunch of personal tools!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "")}>
        <AppProviders>
          <div className="flex h-screen w-screen">
            {/* Left nav */}
            <AppSidebar />
            {/* Right side (sticky header + scrollable content) */}
            <ShellMain>{children}</ShellMain>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
