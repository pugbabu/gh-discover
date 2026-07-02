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
  title: "gh-discover · AI 应用发现器",
  description: "打开即刷 GitHub 上正在爆发的 AI 应用，AI 一句话讲清是啥、凭啥火。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="text-zinc-100">{children}</body>
    </html>
  );
}
