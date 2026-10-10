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

const title = "Privacy X-Ray | Interactive Privacy Engineering Lab";
const description =
  "Explore how web interactions become behavioral signals, how consent controls processing, and how privacy choices affect profiling, storage, network activity, and advertising.";

export const metadata: Metadata = {
  title,
  description,
  applicationName: "Privacy X-Ray",
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "Privacy X-Ray",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
