import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Jay Moore — Product Designer for AI-native workflows";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#f1f3f5";
const FG = "#16191d";
const FG_SOFT = "#42474e";
const FG_FAINT = "#676c72";
const LINE = "#d7dbe0";
const ACCENT = "#1f57bd";
const GRID = "rgba(28, 25, 23, 0.06)";

type LoadedFont = {
  name: string;
  data: ArrayBuffer;
  style: "normal";
  weight: 400 | 600;
};

// Fetches the live .ttf URLs from the Google Fonts CSS API and downloads each
// face. Any single failure is swallowed — the route falls back to Satori's
// bundled default font rather than 500ing. Returning an empty array is fine;
// next/og treats `fonts: []` as "use defaults".
async function loadBrandFonts(): Promise<LoadedFont[]> {
  try {
    const cssRes = await fetch(
      "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600&family=Spline+Sans+Mono:wght@400&display=swap",
      {
        // UA forces Google Fonts to serve .ttf (Satori-friendly) instead of woff2.
        headers: { "User-Agent": "curl/8.0.0" },
        signal: AbortSignal.timeout(4000),
      },
    );
    if (!cssRes.ok) return [];
    const css = await cssRes.text();
    const matches = [
      ...css.matchAll(
        /font-family:\s*'([^']+)';[\s\S]*?font-weight:\s*(\d+);[\s\S]*?src:\s*url\((https:\/\/[^)]+\.ttf)\)/g,
      ),
    ];

    const wanted: Array<{ name: string; weight: 400 | 600; url: string }> = [];
    for (const m of matches) {
      const name = m[1];
      const weight = Number(m[2]) as 400 | 600;
      const url = m[3];
      if (
        (name === "Hanken Grotesk" && (weight === 400 || weight === 600)) ||
        (name === "Spline Sans Mono" && weight === 400)
      ) {
        wanted.push({ name, weight, url });
      }
    }

    const downloaded = await Promise.all(
      wanted.map(async (f): Promise<LoadedFont | null> => {
        try {
          const r = await fetch(f.url, {
            signal: AbortSignal.timeout(4000),
          });
          if (!r.ok) return null;
          return {
            name: f.name,
            data: await r.arrayBuffer(),
            style: "normal",
            weight: f.weight,
          };
        } catch {
          return null;
        }
      }),
    );
    return downloaded.filter((f): f is LoadedFont => f !== null);
  } catch {
    return [];
  }
}

export default async function OpengraphImage() {
  const fonts = await loadBrandFonts();

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: BG,
          color: FG,
          fontFamily: "Hanken Grotesk",
          position: "relative",
          padding: "64px 80px",
          backgroundImage: `
            linear-gradient(to right, ${GRID} 1px, transparent 1px),
            linear-gradient(to bottom, ${GRID} 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      >
        {/* Left rail — single accent bar echoes site's section numbering */}
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 110,
            bottom: 110,
            width: 2,
            background: ACCENT,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingLeft: 56,
            width: "100%",
          }}
        >
          {/* Top — mono caption */}
          <div
            style={{
              display: "flex",
              fontFamily: "Spline Sans Mono",
              fontSize: 20,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: FG_FAINT,
            }}
          >
            Product designer who codes.
          </div>

          {/* Center — H1 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                fontSize: 96,
                lineHeight: 1.02,
                letterSpacing: "-0.025em",
                fontWeight: 600,
                color: FG,
                maxWidth: 980,
              }}
            >
              Product designer for&nbsp;
              <span style={{ color: ACCENT }}>AI-native</span>
              &nbsp;workflows.
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 28,
                lineHeight: 1.3,
                color: FG_SOFT,
                maxWidth: 900,
              }}
            >
              Design AI products. Ship them in code.
            </div>
          </div>

          {/* Bottom — meta strip */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              borderTop: `1px solid ${LINE}`,
              paddingTop: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 48,
                fontFamily: "Spline Sans Mono",
                fontSize: 18,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: FG_FAINT,
              }}
            >
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ color: FG_FAINT }}>now</span>
                <span style={{ color: FG }}>Simple Path Media</span>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ color: FG_FAINT }}>open</span>
                <span style={{ color: FG }}>Sr / Staff PD · US remote</span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontFamily: "Spline Sans Mono",
                fontSize: 20,
                color: FG,
              }}
            >
              <span
                style={{
                  display: "flex",
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: ACCENT,
                }}
              />
              jaymoore.net
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    },
  );
}
