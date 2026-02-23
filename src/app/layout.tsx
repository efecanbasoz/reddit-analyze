import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reddit Analyzer - Topic Finder",
  description:
    "Discover trending Reddit discussions and uncover startup, marketing, and product ideas.",
  keywords: [
    "reddit",
    "analyzer",
    "topic finder",
    "trend",
    "subreddit",
    "marketing",
    "saas",
    "startup",
  ],
  openGraph: {
    title: "Reddit Analyzer - Topic Finder & Idea Discovery",
    description:
      "Discover trending Reddit discussions for marketing, SaaS, AI, and product ideation.",
    type: "website",
    locale: "en_US",
    siteName: "Reddit Analyzer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reddit Analyzer - Topic Finder",
    description:
      "Discover trending Reddit discussions and find new project ideas.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased min-h-screen font-[family-name:var(--font-geist-sans)]">
        {children}
      </body>
    </html>
  );
}
