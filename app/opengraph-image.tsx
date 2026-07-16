import { ImageResponse } from "next/og"

export const alt = "ClearDoc Tools — private PDF and image tools"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 70, color: "#17221f", background: "linear-gradient(135deg,#fbfcfb,#dff2eb)", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30, fontWeight: 750 }}><div style={{ width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", color: "white", background: "#0a7359", borderRadius: 16 }}>C</div>ClearDoc Tools</div>
      <div><div style={{ maxWidth: 950, fontSize: 72, lineHeight: 1.05, fontWeight: 800, letterSpacing: -3 }}>Document tools without handing over your documents.</div><div style={{ marginTop: 28, color: "#52645e", fontSize: 30 }}>Free · local processing · no account</div></div>
    </div>,
    size,
  )
}
