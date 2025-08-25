import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cryptiq Mind Map Demo",
  description: "Interactive mind map visualization with 1000+ nodes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`} style={{ background: '#010c2a' }}>
        {/* Always-on brain background */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <div id="brain-bg-root">
          {/* Client component renders the R3F brain behind all pages */}
          {/* @ts-expect-error Server/Client boundary */}
          <noscript />
        </div>
        {children}
      </body>
    </html>
  );
}
