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

const SITE_URL = "https://jarvis11x.space";
const SITE_TITLE = "XPrice · X Premium 全球标价图";
const SITE_DESCRIPTION = "把 X Premium 各国 Web 订阅标价换算成可比较的全球分布图。只浏览比价，不提供换区或代订。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: SITE_URL,
    siteName: "XPrice",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@jarvis11x",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={`${display.variable} ${sans.variable} ${mono.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
