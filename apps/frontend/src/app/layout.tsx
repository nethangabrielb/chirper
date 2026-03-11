import type { Metadata } from "next";

import { Inter } from "next/font/google";

import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";

import QueryProvider from "@/providers/query-provider";
import SocketProvider from "@/providers/socket-provider";
import { ThemeProvider } from "@/providers/theme-provider";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chirper",
  description:
    "A twitter-inspired social media platform I created for learning purposes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className={`antialiased min-h-svh bg-background`}>
        <Toaster position="top-right" richColors />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SocketProvider>
            <QueryProvider>
              <Sidebar>{children}</Sidebar>
            </QueryProvider>
          </SocketProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
