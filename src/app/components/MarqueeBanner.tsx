"use client";

const logos = [
  "AeroScale", "FlowState", "Veridian", "NexusOne",
  "Quartz", "Meridian", "Pinnacle", "Orbit"
];

export default function MarqueeBanner() {
  return (
    <div style={{
      background: "#0a0a0a",
      padding: "40px 0",
      overflow: "hidden",
      width: "100%",
    }}>
      <p style={{
        textAlign: "center",
        fontSize: "11px",
        letterSpacing: "0.14em",
        color: "rgba(255,255,255,0.4)",
        marginBottom: "24px",
        textTransform: "uppercase",
        fontFamily: "Inter, sans-serif",
      }}>
        Trusted by teams at
      </p>

      {/* Row 1 — scrolls left */}
      <div style={{ overflow: "hidden", marginBottom: "16px" }}>
        <div style={{
          display: "flex",
          width: "max-content",
          animation: "marqueeLeft 20s linear infinite",
        }}>
          {[...logos, ...logos, ...logos, ...logos].map((name, i) => (
            <span key={i} style={{
              padding: "0 40px",
              fontSize: "18px",
              fontWeight: "600",
              color: "rgba(255,255,255,0.5)",
              whiteSpace: "nowrap",
              fontFamily: "Inter, sans-serif",
            }}>
              {name}
              <span style={{ marginLeft: "40px", color: "rgba(255,243,154,0.4)" }}>•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div style={{ overflow: "hidden" }}>
        <div style={{
          display: "flex",
          width: "max-content",
          animation: "marqueeRight 28s linear infinite",
        }}>
          {[...logos, ...logos, ...logos, ...logos].map((name, i) => (
            <span key={i} style={{
              padding: "0 40px",
              fontSize: "15px",
              fontWeight: "500",
              color: "rgba(255,255,255,0.3)",
              whiteSpace: "nowrap",
              fontFamily: "Inter, sans-serif",
            }}>
              {name}
              <span style={{ marginLeft: "40px", color: "rgba(255,243,154,0.25)" }}>•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
