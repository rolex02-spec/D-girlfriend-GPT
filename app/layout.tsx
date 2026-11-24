import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import AgeGate from "@/components/site/AgeGate";

export const metadata: Metadata = {
  title: {
    default: "Girlfriend-GPT — Adult AI Companions, Honest by Design",
    template: "%s · Girlfriend-GPT",
  },
  description:
    "Meet 82 fictional adult AI companions from 34 countries. Warm conversation, multilingual roleplay, and an honest promise: they are AI characters — never real people, never falsely human. Adults only.",
  keywords: [
    "AI companion",
    "adult AI companion",
    "fictional AI characters",
    "multilingual chat",
    "AI roleplay 18+",
  ],
  openGraph: {
    title: "Girlfriend-GPT — Adult AI Companions, Honest by Design",
    description:
      "Emotionally intelligent fictional AI companions for adults. 82 characters, 34 countries, 58 languages. Always AI — never pretending to be human.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0e0810",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Fonts via link so the build never hard-fails offline; system serif/sans fallbacks declared in globals.css */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Inter:wght@400;450;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23e9a2b8' d='M50 88C20 66 6 44 6 27 6 12 18 4 30 4c8 0 15 4 20 11C55 8 62 4 70 4c12 0 24 8 24 23 0 17-14 39-44 61z'/%3E%3C/svg%3E" />
      </head>
      <body className="min-h-screen bg-ink font-sans text-cream antialiased selection:bg-rose/30">
        {/* Skip link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-cream focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <AgeGate />
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
