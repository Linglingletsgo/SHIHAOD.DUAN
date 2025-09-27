import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalNavigation from "@/components/ConditionalNavigation";
import SplashCursor from "@/components/SplashCursor";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shihao D. Duan",
  description: "Fashion Designer & Music Producer & Interdiscipline Artist \n LCF MA Fashion Futures 2025 & ZSTU BEng",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SplashCursor 
          SPLAT_RADIUS={0.05}
          SPLAT_FORCE={1500}
          DENSITY_DISSIPATION={3.0}
          VELOCITY_DISSIPATION={2.0}
          COLOR_UPDATE_SPEED={3}
        />
        <ConditionalNavigation />
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
