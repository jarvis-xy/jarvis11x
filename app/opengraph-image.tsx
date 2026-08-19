import { ImageResponse } from "next/og";

export const alt = "XPrice · X Premium 全球标价图";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = "XPrice  X Premium 全球标价图  只比价，不换区，也不替你下单  便宜 贵  WEB LIST PRICES  jarvis11x.space  @jarvis11x";

async function loadGoogleFont(family: string, weight: number, text: string) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await fetch(cssUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
    },
  }).then((res) => res.text());
  const match = css.match(/src: url\(([^)]+)\)/);
  if (!match?.[1]) {
    throw new Error(`Failed to locate font file for ${family}`);
  }
  const fontRes = await fetch(match[1]);
  if (!fontRes.ok) {
    throw new Error(`Failed to download font for ${family}`);
  }
  return fontRes.arrayBuffer();
}

export default async function OpenGraphImage() {
  const [syne, noto] = await Promise.all([
    loadGoogleFont("Syne", 700, "XPrice XP"),
    loadGoogleFont("Noto Sans SC", 700, COPY),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#ffffff",
          color: "#1c1917",
          fontFamily: '"Noto Sans SC"',
        }}
      >
        <div style={{ width: 14, height: "100%", background: "#c05621" }} />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 64px 48px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 22,
                letterSpacing: "0.28em",
                color: "#c05621",
                textTransform: "uppercase",
              }}
            >
              WEB LIST PRICES · NOT A CHECKOUT
            </div>
            <div style={{ display: "flex", alignItems: "center", marginTop: 36 }}>
              <div
                style={{
                  width: 88,
                  height: 88,
                  background: "#1c1917",
                  color: "#c05621",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "Syne",
                  fontSize: 36,
                  letterSpacing: "-2px",
                  marginRight: 24,
                }}
              >
                XP
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: "Syne",
                  fontSize: 96,
                  lineHeight: 0.9,
                  letterSpacing: "-4px",
                }}
              >
                XPrice
              </div>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 28,
                fontSize: 36,
                color: "#1c1917",
              }}
            >
              X Premium 全球标价图
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 12,
                fontSize: 26,
                color: "#6e675e",
              }}
            >
              只比价，不换区，也不替你下单
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", fontSize: 22, color: "#6e675e", marginRight: 16 }}>便宜</div>
              <div style={{ display: "flex" }}>
                <div style={{ width: 88, height: 18, background: "#2f6f63" }} />
                <div style={{ width: 88, height: 18, background: "#7d9a63" }} />
                <div style={{ width: 88, height: 18, background: "#cbb892" }} />
                <div style={{ width: 88, height: 18, background: "#d9894a" }} />
                <div style={{ width: 88, height: 18, background: "#c4471c" }} />
              </div>
              <div style={{ display: "flex", fontSize: 22, color: "#6e675e", marginLeft: 16 }}>贵</div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 36,
                fontSize: 24,
                color: "#6e675e",
              }}
            >
              <div style={{ display: "flex" }}>jarvis11x.space</div>
              <div style={{ display: "flex", color: "#c05621" }}>@jarvis11x</div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Syne", data: syne, weight: 700, style: "normal" },
        { name: "Noto Sans SC", data: noto, weight: 700, style: "normal" },
      ],
    },
  );
}
