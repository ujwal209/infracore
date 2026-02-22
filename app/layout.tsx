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
  title: "Infracore | Global Engineering Intelligence",
  description: "Join the most advanced engineering intelligence network. Access automated skill gap analysis, dynamic career roadmapping, and cross-domain market signals.",
  keywords: ["Engineering", "Career Roadmap", "Intelligence Network", "Skill Gap Analysis", "Tech Trends"],
  authors: [{ name: "Infracore System" }],
  icons: {
    icon: "/favicon.ico", // Ensure you have a favicon in your public folder
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900 selection:bg-yellow-400 selection:text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}