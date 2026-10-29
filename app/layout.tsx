import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muhammad Refa Walada Mushtofa — Full Stack Engineer | Backend & System Design Focus",
  description:
    "Full Stack Engineer with 6+ years of experience specializing in backend development, system architecture, distributed systems, and event-driven architecture (Golang, PHP, Node.js, Next.js).",
  metadataBase: new URL("https://mrefawaladam.vercel.app"),
  openGraph: {
    title: "Muhammad Refa Walada Mushtofa — Full Stack Engineer",
    description: "Backend & System Design Focus · Distributed Systems · Event-Driven Architecture",
    url: "https://mrefawaladam.vercel.app",
    siteName: "Refa Creative Portfolio",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
