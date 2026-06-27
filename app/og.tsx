import { ImageResponse } from "next/og";

export const ogImageSize = {
  width: 1200,
  height: 630,
};

export const ogImageContentType = "image/png";

type OgImageOptions = {
  eyebrow: string;
  title: string;
  description: string;
  footer?: string[];
  glow?: string;
};

export function createOgImage({
  eyebrow,
  title,
  description,
  footer = ["ArcadeGhosts", "Jason Pollard"],
  glow = "#29f0d4",
}: OgImageOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "68px 72px",
          background:
            "radial-gradient(circle at 15% 18%, rgba(255, 198, 109, 0.35), transparent 28%), linear-gradient(135deg, #090b10 0%, #111827 45%, #0c2a25 100%)",
          color: "#f8efe3",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              color: glow,
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 5,
              textTransform: "uppercase",
            }}
          >
            <span>Jason Pollard</span>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: glow,
                boxShadow: `0 0 22px ${glow}`,
              }}
            />
          </div>
          <div
            style={{
              maxWidth: 1020,
              color: "#ffcf6e",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              maxWidth: 1040,
              fontSize: 82,
              lineHeight: 0.96,
              fontWeight: 800,
            }}
          >
            {title}
          </div>
          <div
            style={{
              maxWidth: 980,
              fontSize: 33,
              lineHeight: 1.24,
              color: "#f3e5d7",
            }}
          >
            {description}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            color: "#f8efe3",
            fontSize: 26,
          }}
        >
          {footer.map((item) => (
            <span
              key={item}
              style={{
                padding: "10px 18px",
                borderRadius: 999,
                border: "1px solid rgba(248, 239, 227, 0.18)",
                background: "rgba(255, 255, 255, 0.06)",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    ),
    ogImageSize,
  );
}
