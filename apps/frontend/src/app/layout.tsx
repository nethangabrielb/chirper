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
  title: "Twitter",
  description: "A twitter clone I made for learning purposes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className={`antialiased h-svh bg-background`}>
        <Toaster position="top-center" richColors />
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
