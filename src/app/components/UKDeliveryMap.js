"use client";
import styles from "./UKDeliveryMap.module.css";

// Delivery hubs — coordinates in 500×320 city-map space
const PINS = [
  { x: 195, y: 128, label: "Central London",  primary: true },
  { x: 332, y: 118, label: "Canary Wharf",    primary: true },
  { x: 148, y: 143, label: "Westminster" },
  { x: 263, y: 85,  label: "Shoreditch" },
  { x: 228, y: 162, label: "Borough" },
  { x: 98,  y: 116, label: "Hammersmith" },
  { x: 396, y: 175, label: "Greenwich" },
  { x: 202, y: 52,  label: "Islington" },
  { x: 305, y: 232, label: "Lewisham" },
];

function Pin({ x, y, primary, i }) {
  const r = primary ? 10 : 7;
  return (
    <g>
      {/* pulse rings */}
      <circle cx={x} cy={y} r={r + 10} className={styles.pulse}
        style={{ animationDelay: `${i * 0.22}s` }} />
      <circle cx={x} cy={y} r={r + 5} className={styles.pulse}
        style={{ animationDelay: `${i * 0.22 + 0.28}s` }} />
      {/* pin drop shadow */}
      <ellipse cx={x} cy={y + 16} rx={5} ry={2} fill="rgba(0,0,0,0.45)" />
      {/* pin teardrop body */}
      <path
        d={`M${x},${y + 14} C${x - r},${y + 5} ${x - r},${y - r * 1.2} ${x},${y - r * 1.6}
            C${x + r},${y - r * 1.2} ${x + r},${y + 5} ${x},${y + 14}`}
        className={primary ? styles.pinPrimary : styles.pinSecondary}
      />
      {/* white inner circle */}
      <circle cx={x} cy={y - r * 0.45} r={r * 0.42} fill="#fff" />
    </g>
  );
}

export default function UKDeliveryMap() {
  return (
    <div className={styles.wrap}>
      <svg viewBox="0 0 500 320" xmlns="http://www.w3.org/2000/svg" className={styles.svg}>
        <defs>
          <filter id="pinGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Background ── */}
        <rect width="500" height="320" fill="#1a2030" />

        {/* ── Parks / green areas ── */}
        <rect x="58"  y="78"  width="68" height="52" rx="5" fill="#1a2e1e" />
        <rect x="152" y="58"  width="44" height="54" rx="4" fill="#1a2e1e" />
        <rect x="393" y="174" width="58" height="46" rx="4" fill="#1a2e1e" />
        <rect x="430" y="55"  width="35" height="28" rx="3" fill="#1a2e1e" />

        {/* ── City blocks (subtle) ── */}
        {[
          [20,20,55,35], [85,20,55,35], [155,20,35,30], [195,20,55,30],
          [260,20,40,30], [310,20,50,30], [370,20,45,28],
          [20,65,30,25], [200,65,50,20], [260,65,40,20], [320,65,40,20],
          [420,90,60,28], [20,110,30,22], [55,110,25,22], [90,110,20,22],
          [430,120,55,20], [460,145,30,20],
          [20,165,55,25], [85,165,20,18], [260,155,22,20],[295,155,25,20],
          [20,225,60,30], [90,228,45,25], [155,230,40,22],[210,230,45,22],
          [265,235,38,22],[315,240,48,22],[375,240,40,22],[430,245,55,22],
          [20,268,55,30],[90,270,48,25],[155,272,42,22],[210,272,48,22],
          [270,278,40,18],[322,278,45,18],[375,278,40,18],[425,278,55,18],
        ].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="2" fill="#1e2638" />
        ))}

        {/* ── Major roads ── */}
        {/* Horizontal */}
        <line x1="0" y1="138" x2="500" y2="138" stroke="#2e3a50" strokeWidth="4.5" />
        <line x1="0" y1="100" x2="500" y2="100" stroke="#2a3448" strokeWidth="3" />
        <line x1="0" y1="60"  x2="500" y2="60"  stroke="#252f42" strokeWidth="2" />
        <line x1="0" y1="168" x2="145" y2="168" stroke="#2a3448" strokeWidth="3" />
        <line x1="220" y1="168" x2="500" y2="168" stroke="#2a3448" strokeWidth="3" />
        <line x1="0" y1="248" x2="500" y2="248" stroke="#2a3448" strokeWidth="3" />
        <line x1="0" y1="280" x2="500" y2="280" stroke="#252f42" strokeWidth="2" />

        {/* Vertical */}
        <line x1="200" y1="0" x2="200" y2="320" stroke="#2e3a50" strokeWidth="4.5" />
        <line x1="120" y1="0" x2="120" y2="320" stroke="#2a3448" strokeWidth="3" />
        <line x1="260" y1="0" x2="260" y2="320" stroke="#2a3448" strokeWidth="3" />
        <line x1="330" y1="0" x2="330" y2="320" stroke="#2a3448" strokeWidth="3" />
        <line x1="60"  y1="0" x2="60"  y2="320" stroke="#252f42" strokeWidth="2" />
        <line x1="400" y1="0" x2="400" y2="320" stroke="#252f42" strokeWidth="2.5" />
        <line x1="460" y1="0" x2="460" y2="320" stroke="#252f42" strokeWidth="2" />

        {/* Minor roads */}
        {[80,160,180,220,300,360,440].map(x => (
          <line key={x} x1={x} y1="0" x2={x} y2="320" stroke="#212b3a" strokeWidth="1.2" />
        ))}
        {[40,80,120,190,210,260].map(y => (
          <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#212b3a" strokeWidth="1.2" />
        ))}

        {/* ── River Thames ── */}
        {/* South bank outline */}
        <path
          d="M 0,210 C 50,208 90,206 130,208 C 160,210 172,218 200,222 C 225,225 248,222 268,216 C 292,208 312,192 338,178 C 360,166 380,160 402,163 C 428,167 455,175 500,178"
          fill="none" stroke="#2a4a6e" strokeWidth="28"
        />
        {/* Isle of Dogs S-loop */}
        <path
          d="M 292,208 C 302,220 310,248 330,258 C 350,268 372,258 388,242 C 404,226 408,200 402,163"
          fill="none" stroke="#2a4a6e" strokeWidth="28"
        />
        {/* River fill */}
        <path
          d="M 0,210 C 50,208 90,206 130,208 C 160,210 172,218 200,222 C 225,225 248,222 268,216 C 292,208 312,192 338,178 C 360,166 380,160 402,163 C 428,167 455,175 500,178"
          fill="none" stroke="#1d3d5e" strokeWidth="20"
        />
        <path
          d="M 292,208 C 302,220 310,248 330,258 C 350,268 372,258 388,242 C 404,226 408,200 402,163"
          fill="none" stroke="#1d3d5e" strokeWidth="20"
        />
        {/* River shimmer */}
        <path
          d="M 0,210 C 50,208 90,206 130,208 C 160,210 172,218 200,222 C 225,225 248,222 268,216 C 292,208 312,192 338,178 C 360,166 380,160 402,163 C 428,167 455,175 500,178"
          fill="none" stroke="#2558a0" strokeWidth="10" opacity="0.35"
        />
        {/* THAMES label */}
        <text x="245" y="205" fill="rgba(80,130,200,0.5)" fontSize="7.5" fontWeight="700"
          letterSpacing="0.18em" textAnchor="middle">THAMES</text>

        {/* ── Delivery pins ── */}
        {PINS.map((pin, i) => (
          <Pin key={i} x={pin.x} y={pin.y} primary={pin.primary} i={i} />
        ))}

        {/* ── Neighbourhood labels ── */}
        {[
          [195, 152, "CITY"],
          [330, 142, "CANARY WHARF"],
          [100, 138, "KENSINGTON"],
          [202,  38, "ISLINGTON"],
          [265, 105, "SHOREDITCH"],
          [396, 196, "GREENWICH"],
        ].map(([x, y, t]) => (
          <text key={t} x={x} y={y} fill="rgba(255,255,255,0.22)" fontSize="6.5"
            fontWeight="700" letterSpacing="0.12em" textAnchor="middle">{t}</text>
        ))}

        {/* Scale indicator */}
        <line x1="420" y1="306" x2="480" y2="306" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        <line x1="420" y1="302" x2="420" y2="310" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        <line x1="480" y1="302" x2="480" y2="310" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        <text x="450" y="300" fill="rgba(255,255,255,0.3)" fontSize="6" textAnchor="middle">5 km</text>
      </svg>

      {/* Legend */}
      <div className={styles.legend}>
        <span className={styles.legendDot} />
        <span className={styles.legendText}>Active delivery zones</span>
        <span className={styles.legendCount}>{PINS.length} hubs · London</span>
      </div>
    </div>
  );
}
