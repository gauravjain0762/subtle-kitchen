"use client";
import styles from "./UKDeliveryMap.module.css";

// London / SE England delivery pin locations
// Coordinates match the UK SVG path coordinate space (viewBox "0 0 250 340")
const PINS = [
  { cx: 158, cy: 281, label: "Central London" },
  { cx: 164, cy: 278, label: "City of London" },
  { cx: 166, cy: 285, label: "Greenwich" },
  { cx: 155, cy: 284, label: "Canary Wharf" },
  { cx: 154, cy: 276, label: "Islington" },
  { cx: 162, cy: 290, label: "Lewisham" },
  { cx: 170, cy: 279, label: "Stratford" },
  { cx: 150, cy: 278, label: "Hammersmith" },
  { cx: 160, cy: 294, label: "Croydon" },
  { cx: 172, cy: 274, label: "Romford" },
];

// Full Great Britain outline — clockwise from John O'Groats
// Coordinates: x=(lon+8)/10*250, y=(60.9-lat)/11.1*340
const UK_PATH = `
  M 122,70
  L 148,97 L 145,114 L 135,130 L 132,142 L 148,150
  L 163,175 L 200,200 L 210,236 L 230,237
  L 234,282 L 232,292 L 222,297 L 205,302
  L 182,302 L 140,308 L 114,312 L 92,318
  L 73,320 L 58,320
  L 60,312 L 75,294 L 84,288 L 92,286
  L 108,282 L 107,277 L 97,279 L 79,276
  L 65,272 L 49,267
  L 63,260 L 77,246 L 69,230 L 76,226
  L 101,223 L 106,215 L 101,206
  L 92,192 L 94,185
  L 79,185 L 53,192
  L 41,172 L 46,157 L 44,142
  L 29,132 L 39,105 L 51,94
  L 55,78 L 66,78 L 82,71
  Z
`;

// Zoomed viewBox focuses on SE England / London
const ZOOMED_VIEWBOX = "95 230 155 115";
const FULL_VIEWBOX   = "0 0 250 340";

export default function UKDeliveryMap() {
  return (
    <div className={styles.wrap}>
      {/* ── Main zoomed map: SE England ── */}
      <svg
        viewBox={ZOOMED_VIEWBOX}
        xmlns="http://www.w3.org/2000/svg"
        className={styles.svgMain}
        aria-label="London delivery zone map"
      >
        {/* subtle grid */}
        {[120,150,180,210,240].map(x => (
          <line key={x} x1={x} y1="220" x2={x} y2="355" className={styles.grid} />
        ))}
        {[240,260,280,300,320,340].map(y => (
          <line key={y} x1="85" y1={y} x2="260" y2={y} className={styles.grid} />
        ))}

        {/* Land */}
        <path d={UK_PATH} className={styles.land} />

        {/* Delivery pins */}
        {PINS.map((pin, i) => (
          <g key={i}>
            <circle cx={pin.cx} cy={pin.cy} r="9"
              className={styles.pulse}
              style={{ animationDelay: `${i * 0.25}s` }}
            />
            <circle cx={pin.cx} cy={pin.cy} r="3.5" className={styles.dot} />
          </g>
        ))}

        {/* London label */}
        <text x="157" y="303" className={styles.cityLabel}>LONDON</text>
      </svg>

      {/* ── Inset: full UK silhouette with red square showing zoom area ── */}
      <div className={styles.inset}>
        <svg
          viewBox={FULL_VIEWBOX}
          xmlns="http://www.w3.org/2000/svg"
          className={styles.svgInset}
        >
          <path d={UK_PATH} className={styles.insetLand} />
          {/* Red rectangle showing current zoom area */}
          <rect x="95" y="230" width="155" height="115"
            className={styles.insetZoomBox} />
        </svg>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <span className={styles.legendDot} />
        <span className={styles.legendText}>Active delivery zones · London</span>
      </div>
    </div>
  );
}
