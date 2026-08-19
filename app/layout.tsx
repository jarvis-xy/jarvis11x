import type { Metadata } from "next";
import { Chivo_Mono, Figtree, Syne } from "next/font/google";
import "./globals.css";

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"],
});

const sans = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = Chivo_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "XPrice · X Premium 全球标价图",
  description: "把 X Premium 各国 Web 订阅标价换算成可比较的全球分布图。只浏览比价，不提供换区或代订。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={`${display.variable} ${sans.variable} ${mono.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
