import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", background: "#0B0B0D", color: "#FAFAF9", fontSize: 125, fontWeight: 700, letterSpacing: -10 }}>S<span style={{ color: "#FF4B1F" }}>.</span></div>, size);
}
