import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export const alt = "Sued. Sites com a sua cara.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", background: "#0B0B0D", color: "#FAFAF9", padding: "64px 80px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", fontSize: 44, fontWeight: 700, letterSpacing: -3 }}>{siteConfig.brand}<span style={{ color: "#FF4B1F" }}>.</span></div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 76, letterSpacing: -4, lineHeight: 1.06 }}><span>{siteConfig.headline.opening}</span><span style={{ color: "#FF4B1F" }}>{siteConfig.headline.highlight}</span></div>
      <div style={{ display: "flex", fontSize: 22, color: "#A2A2A9" }}>Sites com a sua cara.</div>
    </div>,
    size,
  );
}
