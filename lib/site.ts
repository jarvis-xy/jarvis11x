import type { Metadata } from "next";

export const SITE_URL = "https://jarvis11x.space";
export const XPRICE_PATH = "/xprice";
export const XPRICE_URL = `${SITE_URL}${XPRICE_PATH}`;
export const XPRICE_METHODOLOGY_PATH = "/xprice/methodology";

export const XPRICE_TITLE = "XPrice · X Premium 全球标价图";
export const XPRICE_DESCRIPTION = "X Premium 各国 Web 标价观测站。本站由 @jarvis11x 开发。";

const OG_IMAGE = {
  url: `${SITE_URL}/og.png`,
  width: 1200,
  height: 630,
  alt: XPRICE_TITLE,
  type: "image/png",
};

export function xpriceMetadata(canonical = XPRICE_URL): Metadata {
  return {
    title: XPRICE_TITLE,
    description: XPRICE_DESCRIPTION,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "zh_CN",
      url: canonical,
      siteName: "XPrice",
      title: XPRICE_TITLE,
      description: XPRICE_DESCRIPTION,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      site: "@jarvis11x",
      creator: "@jarvis11x",
      title: XPRICE_TITLE,
      description: XPRICE_DESCRIPTION,
      images: [OG_IMAGE.url],
    },
  };
}
