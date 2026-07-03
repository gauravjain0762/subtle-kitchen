"use client";
import styles from "./UKDeliveryMap.module.css";

// Delivery pin locations on the UK SVG (viewBox "0 0 200 280")
// Concentrated in London / SE England where Subtle Kitchen operates
const PINS = [
  { cx: 157, cy: 210, label: "Central London" },
  { cx: 163, cy: 205, label: "City of London" },
  { cx: 165, cy: 215, label: "Greenwich" },
  { cx: 151, cy: 215, label: "Canary Wharf" },
  { cx: 152, cy: 204, label: "Islington" },
  { cx: 160, cy: 220, label: "Lewisham" },
  { cx: 168, cy: 208, label: "Stratford" },
  { cx: 147, cy: 209, label: "Hammersmith" },
  { cx: 158, cy: 226, label: "Croydon" },
  { cx: 172, cy: 200, label: "Romford" },
];

export default function UKDeliveryMap() {
  return (
    <div className={styles.wrap}>
      <svg
        viewBox="0 0 200 280"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.svg}
        aria-label="UK delivery map"
      >
        {/* ── Subtle grid ── */}
        {[56, 112, 168].map(x => (
          <line key={x} x1={x} y1="0" x2={x} y2="280" className={styles.grid} />
        ))}
        {[70, 140, 210].map(y => (
          <line key={y} x1="0" y1={y} x2="200" y2={y} className={styles.grid} />
        ))}

        {/* ── Great Britain outline ── */}
        {/* Scotland */}
        <path className={styles.land} d="
          M 98,18 L 82,22 L 68,30 L 56,42 L 50,56
          L 44,68 L 40,80 L 48,88 L 44,98
          L 52,104 L 60,96 L 66,102 L 72,108
          L 80,106 L 86,112 L 96,108
          L 102,100 L 110,96 L 118,100
          L 124,106 L 130,112 L 128,102
          L 136,94 L 138,82 L 134,70
          L 126,58 L 120,46 L 116,34
          L 108,24 Z
        " />

        {/* England + Wales */}
        <path className={styles.land} d="
          M 86,112 L 80,106 L 72,108 L 66,102
          L 60,96 L 52,104 L 48,110 L 50,120
          L 46,132 L 44,142 L 48,150
          L 42,158 L 38,168 L 42,178
          L 48,182 L 44,192 L 50,198
          L 56,202 L 52,212 L 58,220
          L 66,224 L 74,220 L 76,212
          L 80,206 L 78,198 L 84,192
          L 88,200 L 92,208 L 96,218
          L 100,228 L 104,238 L 108,248
          L 116,256 L 124,260 L 132,258
          L 140,252 L 148,244 L 154,234
          L 160,224 L 164,212 L 168,200
          L 172,188 L 174,174 L 172,162
          L 176,150 L 174,138 L 170,128
          L 164,120 L 162,110 L 156,104
          L 148,100 L 140,104 L 134,108
          L 130,112 L 124,106 L 118,100
          L 110,96 L 102,100 L 96,108 Z
        " />

        {/* ── Delivery pin pulses + dots ── */}
        {PINS.map((pin, i) => (
          <g key={i}>
            <circle
              cx={pin.cx} cy={pin.cy} r="10"
              className={styles.pulse}
              style={{ animationDelay: `${i * 0.28}s` }}
            />
            <circle
              cx={pin.cx} cy={pin.cy} r="5"
              className={styles.pulse2}
              style={{ animationDelay: `${i * 0.28 + 0.14}s` }}
            />
            <circle cx={pin.cx} cy={pin.cy} r="3.5" className={styles.dot} />
          </g>
        ))}

        {/* ── London label ── */}
        <text x="158" y="236" className={styles.cityLabel}>London</text>
      </svg>

      {/* Legend */}
      <div className={styles.legend}>
        <span className={styles.legendDot} />
        <span className={styles.legendText}>Active delivery zones</span>
      </div>
    </div>
  );
}
