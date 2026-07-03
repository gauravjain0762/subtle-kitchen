"use client";
import styles from "./DeliveryVanAnimation.module.css";

export default function DeliveryVanAnimation() {
  return (
    <div className={styles.scene} aria-hidden="true" role="presentation">

      {/* Parallax city skyline silhouette */}
      <div className={styles.skyline} />

      {/* Road with scrolling centre dashes */}
      <div className={styles.road}>
        <div className={styles.roadDash} />
      </div>

      {/* Van + shadow, wrapped for bounce */}
      <div className={styles.vanBounce}>

        {/* Soft ellipse shadow — shrinks when van lifts */}
        <div className={styles.groundShadow} />

        {/* Exhaust cloud puffs (float left from rear) */}
        <div className={styles.exhaustWrap}>
          <span className={styles.puffA} />
          <span className={styles.puffB} />
          <span className={styles.puffC} />
        </div>

        {/* ── Premium van SVG ── */}
        <svg
          className={styles.van}
          viewBox="0 0 260 86"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Body: charcoal highlight at crown → near-black at base */}
            <linearGradient id="sk-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#2e2e2e" />
              <stop offset="28%"  stopColor="#191919" />
              <stop offset="100%" stopColor="#070707" />
            </linearGradient>

            {/* Soft sheen running across top of panels */}
            <linearGradient id="sk-gloss" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="rgba(255,255,255,0.14)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>

            {/* Windshield: sky-blue with warm tint */}
            <linearGradient id="sk-glass" x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0%"   stopColor="#c8e2f8" />
              <stop offset="55%"  stopColor="#9bbfe6" />
              <stop offset="100%" stopColor="#6fa3d4" />
            </linearGradient>

            {/* Brand yellow stripe */}
            <linearGradient id="sk-yellow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#fff9c0" />
              <stop offset="100%" stopColor="#eec800" />
            </linearGradient>

            {/* Tyre: rubber with highlight */}
            <radialGradient id="sk-tyre" cx="36%" cy="26%" r="64%">
              <stop offset="0%"   stopColor="#3c3c3c" />
              <stop offset="100%" stopColor="#090909" />
            </radialGradient>

            {/* Rim: polished alloy */}
            <radialGradient id="sk-rim" cx="38%" cy="28%" r="60%">
              <stop offset="0%"   stopColor="#636363" />
              <stop offset="100%" stopColor="#1c1c1c" />
            </radialGradient>

            {/* Headlight cone */}
            <radialGradient id="sk-hl" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#fff9c4" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#fff39a" stopOpacity="0"   />
            </radialGradient>
          </defs>

          {/* ── Faint ground haze in the SVG itself ── */}
          <ellipse cx="132" cy="84" rx="118" ry="4" fill="rgba(0,0,0,0.15)" />

          {/* ════════ CARGO BOX ════════ */}
          <rect x="6" y="14" width="158" height="58" rx="6" fill="url(#sk-body)" />
          {/* Top gloss band */}
          <rect x="6" y="14" width="158" height="22" rx="6" fill="url(#sk-gloss)" />
          {/* Left edge specular line */}
          <line x1="6" y1="16" x2="6" y2="72" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
          {/* Bottom undercarriage */}
          <rect x="6" y="68" width="158" height="4" rx="0" fill="rgba(0,0,0,0.3)" />

          {/* ════════ CAB ════════ */}
          <path d="M164,14 L218,14 L248,44 L248,72 L164,72 Z" fill="url(#sk-body)" />
          {/* Cab top gloss */}
          <path d="M164,14 L218,14 L244,38 L164,38 Z" fill="url(#sk-gloss)" opacity="0.65" />

          {/* ════════ WINDSHIELD ════════ */}
          <path d="M170,18 L214,18 L240,43 L240,62 L170,62 Z"
                fill="url(#sk-glass)" opacity="0.9" />
          {/* Upper-left reflection streak */}
          <path d="M174,21 L196,21 L207,32 L177,32 Z"
                fill="rgba(255,255,255,0.36)" />
          {/* Lower tint shadow */}
          <path d="M170,55 L240,55 L240,62 L170,62 Z"
                fill="rgba(0,0,0,0.14)" />
          {/* A-pillar left */}
          <line x1="170" y1="18" x2="170" y2="62"
                stroke="rgba(0,0,0,0.25)" strokeWidth="3" />

          {/* ════════ YELLOW ACCENT STRIPE ════════ */}
          <rect x="6"   y="65" width="158" height="7" fill="url(#sk-yellow)" />
          {/* Faint echo on cab lower */}
          <rect x="164" y="65" width="84"  height="7" fill="url(#sk-yellow)" opacity="0.22" />

          {/* ════════ BRAND PANEL ════════ */}
          {/* Recessed shadow panel behind text */}
          <rect x="14" y="22" width="144" height="40" rx="3"
                fill="rgba(0,0,0,0.18)"
                stroke="rgba(255,243,154,0.08)" strokeWidth="0.6" />
          {/* "subtle" */}
          <text x="24" y="44" fontSize="10" fontWeight="700"
                fill="#fff39a"
                fontFamily="Inter,system-ui,-apple-system,sans-serif"
                letterSpacing="1.8">subtle</text>
          {/* "KITCHEN" */}
          <text x="24" y="57" fontSize="12" fontWeight="900"
                fill="#ffffff"
                fontFamily="Inter,system-ui,-apple-system,sans-serif"
                letterSpacing="2.5">KITCHEN</text>

          {/* ════════ PANEL DETAILS ════════ */}
          {/* Rear door seam */}
          <line x1="148" y1="16" x2="148" y2="65"
                stroke="rgba(255,243,154,0.18)" strokeWidth="1.2" />
          {/* Door handle bar */}
          <rect x="131" y="47" width="14" height="3" rx="1.5"
                fill="rgba(255,243,154,0.42)" />
          {/* Cargo box roof seam */}
          <line x1="8" y1="14" x2="163" y2="14"
                stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

          {/* ════════ LIGHTS ════════ */}
          {/* Headlight lens */}
          <rect x="241" y="50" width="9" height="10" rx="2.5" fill="#fff39a" />
          {/* Headlight glow cone */}
          <ellipse cx="247" cy="55" rx="13" ry="10"
                   fill="url(#sk-hl)" opacity="0.5" />
          {/* Tail light */}
          <rect x="4" y="46" width="4" height="16" rx="1.5"
                fill="#ff2e2e" opacity="0.82" />
          {/* Tail glow */}
          <ellipse cx="5" cy="54" rx="5" ry="6"
                   fill="rgba(255,40,40,0.12)" />

          {/* ════════ BUMPERS ════════ */}
          <rect x="2"   y="70" width="8" height="5" rx="1.5" fill="#1c1c1c" />
          <rect x="246" y="70" width="8" height="5" rx="1.5" fill="#1c1c1c" />

          {/* ════════ WHEEL ARCHES ════════ */}
          <path d="M27,72 Q50,57 73,72 Z"   fill="#040404" />
          <path d="M187,72 Q210,57 233,72 Z" fill="#040404" />

          {/* ════════ REAR WHEEL ════════ */}
          {/* Outer tyre */}
          <circle cx="50" cy="76" r="14" fill="url(#sk-tyre)" />
          {/* Tyre tread shimmer arc */}
          <path d="M38,66 A14,14 0 0 1 62,66"
                fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
          {/* Alloy rim */}
          <circle cx="50" cy="76" r="9" fill="url(#sk-rim)" />
          {/* Rim upper highlight arc */}
          <path d="M43,70 A9,9 0 0 1 57,70"
                fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
          {/* Tyre sidewall inner ring */}
          <circle cx="50" cy="76" r="11.5"
                  fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          {/* Hub cap */}
          <circle cx="50" cy="76" r="3.5" fill="#242424" />
          <circle cx="50" cy="76" r="1.8" fill="#fff39a" />
          {/* 5 lug nuts — this group spins */}
          <g className={styles.rearLugs}>
            <circle cx="50"   cy="70"   r="1.3" fill="#3a3a3a" />
            <circle cx="55.7" cy="73.1" r="1.3" fill="#3a3a3a" />
            <circle cx="53.5" cy="79.9" r="1.3" fill="#3a3a3a" />
            <circle cx="46.5" cy="79.9" r="1.3" fill="#3a3a3a" />
            <circle cx="44.3" cy="73.1" r="1.3" fill="#3a3a3a" />
          </g>

          {/* ════════ FRONT WHEEL ════════ */}
          <circle cx="210" cy="76" r="14" fill="url(#sk-tyre)" />
          <path d="M198,66 A14,14 0 0 1 222,66"
                fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
          <circle cx="210" cy="76" r="9" fill="url(#sk-rim)" />
          <path d="M203,70 A9,9 0 0 1 217,70"
                fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
          <circle cx="210" cy="76" r="11.5"
                  fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <circle cx="210" cy="76" r="3.5" fill="#242424" />
          <circle cx="210" cy="76" r="1.8" fill="#fff39a" />
          <g className={styles.frontLugs}>
            <circle cx="210"   cy="70"   r="1.3" fill="#3a3a3a" />
            <circle cx="215.7" cy="73.1" r="1.3" fill="#3a3a3a" />
            <circle cx="213.5" cy="79.9" r="1.3" fill="#3a3a3a" />
            <circle cx="206.5" cy="79.9" r="1.3" fill="#3a3a3a" />
            <circle cx="204.3" cy="73.1" r="1.3" fill="#3a3a3a" />
          </g>
        </svg>
      </div>
    </div>
  );
}
