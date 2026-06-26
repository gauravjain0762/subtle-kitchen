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

      {/* Single row — scrolls left */}
      <div style={{ overflow: "hidden" }}>
        <div style={{
          display: "flex",
          width: "max-content",
          animation: "marqueeLeft 25s linear infinite",
        }}>
          {[...logos, ...logos, ...logos, ...logos].map((name, i) => (
            <span key={i} style={{
              padding: "0 48px",
              fontSize: "18px",
              fontWeight: "600",
              color: "rgba(255,255,255,0.5)",
              whiteSpace: "nowrap",
              fontFamily: "Inter, sans-serif",
            }}>
              {name}
              <span style={{ marginLeft: "48px", color: "rgba(255,243,154,0.4)" }}>•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
