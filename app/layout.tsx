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
const SITE_DESCRIPTION = "X Premium 各国 Web 标价观测站。本站由 @jarvis11x 开发。";
const OG_IMAGE = {
  url: `${SITE_URL}/og.png`,
  width: 1200,
  height: 630,
  alt: SITE_TITLE,
  type: "image/png",
};

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
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    site: "@jarvis11x",
    creator: "@jarvis11x",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={`${display.variable} ${sans.variable} ${mono.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
