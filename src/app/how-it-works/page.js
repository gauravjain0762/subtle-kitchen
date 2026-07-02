"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import Navbar from "../components/Navbar";
import GetStartedModal from "../components/GetStartedModal";
import AuthPanel from "../components/AuthPanel";

function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function TiltCard({ children, className }) {
  const ref = useRef(null);
  const handleMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 18;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -18;
    ref.current.style.setProperty("--rx", `${y}deg`);
    ref.current.style.setProperty("--ry", `${x}deg`);
    ref.current.style.setProperty("--tz", "20px");
  };
  const handleLeave = () => {
    if (!ref.current) return;
    ref.current.style.setProperty("--rx", "0deg");
    ref.current.style.setProperty("--ry", "0deg");
    ref.current.style.setProperty("--tz", "0px");
  };
  return (
    <div ref={ref} className={className} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {children}
    </div>
  );
}

const STEPS = [
  {
    num: "01",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    title: "Sign up through your workspace code",
    desc: "Your workplace has a unique code. Sign up with it to unlock your workspace's lunch programme, delivery address, and team pricing.",
    tag: "Takes 60 seconds",
    colour: "#f59e0b",
  },
  {
    num: "02",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&q=80",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
    title: "Pick your meals for the week",
    desc: "Browse this week's freshly designed menu. Choose the days you want lunch and select your dishes — all before the 10 PM cutoff.",
    tag: "New menu every week",
    colour: "#10b981",
  },
  {
    num: "03",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=700&q=80",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    title: "Hot lunch at your desk",
    desc: "We prepare your meal fresh overnight and deliver it hot to your workplace the next day. No queues, no leaving the building.",
    tag: "Delivered at lunchtime",
    colour: "#6366f1",
  },
];

const QUALITY = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: "Never frozen, never reheated",
    desc: "No freezers. No microwaves. No shortcuts. Every dish is cooked the morning it's delivered.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
    title: "Hot at delivery — always",
    desc: "Insulated packaging and optimised routes mean your food arrives at the perfect temperature every single time.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>
      </svg>
    ),
    title: "Seasonal & locally sourced",
    desc: "Our menu rotates weekly using fresh, locally sourced produce. Real ingredients, real flavour — and it shows.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
    title: "52 new menus a year",
    desc: "We design a completely new menu every single week — so lunch never gets boring, and there's always something to look forward to.",
  },
];

const TIMELINE = [
  { emoji: "📱", time: "Before 10 PM", label: "You place your order online" },
  { emoji: "🌅", time: "Next morning", label: "Fresh cooking begins at dawn" },
  { emoji: "🍱", time: "Lunchtime", label: "Hot delivery arrives at your workplace" },
];

export default function HowItWorksPage() {
  const [gsOpen, setGsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [stepsRef, stepsVisible] = useReveal(0.08);
  const [deadlineRef, deadlineVisible] = useReveal(0.12);
  const [qualityRef, qualityVisible] = useReveal(0.08);
  const [ctaRef, ctaVisible] = useReveal(0.2);

  return (
    <>
    <div className={styles.root}>

      <Navbar onSignIn={() => setAuthOpen(true)} onGetStarted={() => setGsOpen(true)} />

      {/* ── 1: Hero ── */}
      <div className={styles.heroWrap}>

        {/* LEFT: dark content panel */}
        <div className={styles.heroLeft}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            The Subtle Kitchen way
          </div>
          <h1 className={styles.heroHeading}>
            How it <span className={styles.heroAccent}>works</span>
          </h1>
          <p className={styles.heroSub}>
            Order before 10 PM tonight. Fresh chef-prepared lunch delivered hot to your workplace tomorrow — no queues, no leaving the building.
          </p>
          <div className={styles.heroActions}>
            <Link href="/menu" className={styles.heroCta}>View this week&apos;s menu</Link>
            <a href="#steps" className={styles.heroScrollLink}>
              See how it works
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
            </a>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatVal}>10 PM</span>
              <span className={styles.heroStatLbl}>Order cutoff</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatVal}>Lunch</span>
              <span className={styles.heroStatLbl}>Delivery window</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatVal}>52</span>
              <span className={styles.heroStatLbl}>Menus / year</span>
            </div>
          </div>
        </div>

        {/* RIGHT: food image + floating 3D cards */}
        <div className={styles.heroRight}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=85"
            alt=""
            className={styles.heroImg}
          />
          <div className={styles.heroImgOverlay} />
          <div className={styles.heroScene}>
            {STEPS.map((step, i) => (
              <div key={i} className={styles.heroCard3dWrap} style={{ "--i": i }}>
                <div className={styles.heroStepCard}>
                  <div className={styles.heroStepCardLeft}>
                    <span className={styles.heroStepNum}>{step.num}</span>
                    <div className={styles.heroStepIcon} style={{ "--step-colour": step.colour }}>
                      {step.icon}
                    </div>
                  </div>
                  <div className={styles.heroStepCardRight}>
                    <p className={styles.heroStepTitle}>{step.title}</p>
                    <span className={styles.heroStepTag}>{step.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── 2: Steps ── */}
      <section id="steps" className={`${styles.steps} ${stepsVisible ? styles.stepsVisible : ""}`} ref={stepsRef}>
        <div className={styles.stepsInner}>
          <p className={styles.sectionLabel}>The process</p>
          <h2 className={styles.stepsHeading}>Order in 3 steps</h2>
          <p className={styles.stepsSub}>From sign-up to lunch at your desk in under 3 minutes.</p>

          <div className={styles.stepsGrid}>
            {STEPS.map((step, i) => (
              <TiltCard key={i} className={`${styles.stepCard} ${stepsVisible ? styles.stepCardVisible : ""}`}>
                <div className={styles.stepImgWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={step.img} alt={step.title} className={styles.stepImg} />
                  <div className={styles.stepImgOverlay} />
                  <span className={styles.stepNum}>{step.num}</span>
                </div>
                <div className={styles.stepBody}>
                  <div className={styles.stepIconBox} style={{ "--step-colour": step.colour }}>
                    {step.icon}
                  </div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                  <span className={styles.stepTag}>{step.tag}</span>
                </div>
              </TiltCard>
            ))}
          </div>

          {/* Connector */}
          <div className={styles.connector} aria-hidden="true">
            <div className={`${styles.connLine} ${stepsVisible ? styles.connLineVisible : ""}`} />
            {[0, 1, 2].map((i) => (
              <div key={i} className={`${styles.connDot} ${stepsVisible ? styles.connDotVisible : ""}`} style={{ "--d": `${i * 0.25}s` }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 3: Order Deadline ── */}
      <section className={`${styles.deadline} ${deadlineVisible ? styles.deadlineVisible : ""}`} ref={deadlineRef}>
        <div className={styles.deadlineInner}>

          <div className={styles.deadlineLeft}>
            <p className={styles.sectionLabelLight}>The cutoff</p>
            <h2 className={styles.deadlineHeading}>
              Order before<br />
              <span className={styles.deadlineAccent}>10:00 PM</span>
            </h2>
            <p className={styles.deadlineSub}>
              Every evening our chefs review the next day&apos;s orders and begin planning fresh prep. Miss the cutoff and you&apos;ll need to wait until the following day.
            </p>

            <div className={styles.timeline}>
              {TIMELINE.map((t, i) => (
                <div
                  key={i}
                  className={`${styles.timelineItem} ${deadlineVisible ? styles.timelineItemVisible : ""}`}
                  style={{ "--d": `${i * 0.14 + 0.2}s` }}
                >
                  <div className={styles.timelineEmoji}>{t.emoji}</div>
                  <div className={styles.timelineText}>
                    <p className={styles.timelineTime}>{t.time}</p>
                    <p className={styles.timelineLabel}>{t.label}</p>
                  </div>
                  {i < TIMELINE.length - 1 && <div className={styles.timelineLine} />}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.deadlineRight}>
            <div className={styles.svgClockWrap}>
              {/* All positions are hard-coded SVG coords — no CSS rotation needed.
                  sin(300°) = −0.8660   cos(300°) = 0.5
                  Hour tip  (r=54): x=53.24  y=73.00
                  Spotlight (r=80): x=30.72  y=60.00  */}
              <svg className={styles.svgClock} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="cFaceGrad" cx="38%" cy="32%">
                    <stop offset="0%" stopColor="#1d1d1d" />
                    <stop offset="100%" stopColor="#0c0c0c" />
                  </radialGradient>
                </defs>

                {/* Outer decorative ring */}
                <circle cx="100" cy="100" r="98" fill="none"
                  stroke="rgba(245,200,66,0.14)" strokeWidth="1.5"
                  className={styles.svgRingPulse} />
                <circle cx="100" cy="100" r="92" fill="none"
                  stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

                {/* Clock face */}
                <circle cx="100" cy="100" r="89" fill="url(#cFaceGrad)" />
                <circle cx="100" cy="100" r="89" fill="none"
                  stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />

                {/* 60 tick marks — computed in SVG coords */}
                {Array.from({ length: 60 }).map((_, i) => {
                  const a = (i * 6 * Math.PI) / 180;
                  const major = i % 5 === 0;
                  const r1 = major ? 73 : 80;
                  const r2 = major ? 87 : 84;
                  return (
                    <line key={i}
                      x1={(100 + r1 * Math.sin(a)).toFixed(2)}
                      y1={(100 - r1 * Math.cos(a)).toFixed(2)}
                      x2={(100 + r2 * Math.sin(a)).toFixed(2)}
                      y2={(100 - r2 * Math.cos(a)).toFixed(2)}
                      stroke={major ? "rgba(255,255,255,0.48)" : "rgba(255,255,255,0.14)"}
                      strokeWidth={major ? "2" : "0.8"}
                      strokeLinecap="round"
                    />
                  );
                })}

                {/* 10 PM spotlight at (30.72, 60) */}
                <circle cx="30.72" cy="60" r="11"
                  fill="rgba(245,200,66,0.14)" className={styles.svgGlowPulse} />
                <circle cx="30.72" cy="60" r="4.5"
                  fill="var(--yellow, #fff39a)" />

                {/* Hour hand → 10 o'clock (tip at 53.24, 73) */}
                <line x1="100" y1="100" x2="53.24" y2="73"
                  stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />

                {/* Minute hand → 12 o'clock (tip at 100, 28) */}
                <line x1="100" y1="100" x2="100" y2="28"
                  stroke="rgba(255,255,255,0.82)" strokeWidth="3" strokeLinecap="round" />

                {/* Second hand — rotates via CSS around viewBox center (100,100) */}
                <line x1="100" y1="112" x2="100" y2="20"
                  stroke="var(--yellow, #fff39a)" strokeWidth="1.2" strokeLinecap="round"
                  className={styles.svgSecondHand} />

                {/* Pivot cap */}
                <circle cx="100" cy="100" r="6" fill="var(--yellow, #fff39a)" />
                <circle cx="100" cy="100" r="2.8" fill="#0d0d0d" />
              </svg>

              <p className={styles.svgClockLabel}>10 PM</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── 4: Quality ── */}
      <section className={`${styles.quality} ${qualityVisible ? styles.qualityVisible : ""}`} ref={qualityRef}>
        <div className={styles.qualityInner}>
          <p className={styles.sectionLabel}>Our promise</p>
          <h2 className={styles.qualityHeading}>
            No shortcuts ever.
          </h2>
          <p className={styles.qualitySub}>
            We believe workplace food shouldn&apos;t mean compromise. Here&apos;s what we stand for.
          </p>

          <div className={styles.qualityGrid}>
            {QUALITY.map((q, i) => (
              <div
                key={i}
                className={`${styles.qualityCard} ${qualityVisible ? styles.qualityCardVisible : ""}`}
                style={{ "--d": `${i * 0.1}s` }}
              >
                <div className={styles.qualityIcon}>{q.icon}</div>
                <h3 className={styles.qualityTitle}>{q.title}</h3>
                <p className={styles.qualityDesc}>{q.desc}</p>
              </div>
            ))}
          </div>

          <div className={styles.statsRow}>
            {[
              { val: "100%", label: "Fresh daily" },
              { val: "0×", label: "Reheated dishes" },
              { val: "52", label: "New menus per year" },
              { val: "Lunch", label: "Delivery window" },
            ].map((s, i) => (
              <div
                key={i}
                className={`${styles.stat} ${qualityVisible ? styles.statVisible : ""}`}
                style={{ "--d": `${i * 0.1 + 0.4}s` }}
              >
                <span className={styles.statVal}>{s.val}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5: CTA ── */}
      <section className={`${styles.cta} ${ctaVisible ? styles.ctaVisible : ""}`} ref={ctaRef}>
        <div className={styles.ctaGlow} />
        <div className={styles.ctaGlow2} />
        <div className={styles.ctaInner}>
          <div className={styles.ctaBadge}>Ready to start?</div>
          <h2 className={styles.ctaHeading}>
            Eat better at work
          </h2>
          <p className={styles.ctaSub}>
            Join offices, garages, and workshops across London who already enjoy Subtle Kitchen every week.
          </p>
          <div className={styles.ctaActions}>
            <Link href="/menu" className={styles.ctaPrimary}>View this week&apos;s menu</Link>
            <Link href="/for-businesses" className={styles.ctaSecondary}>Get your workspace code</Link>
          </div>
        </div>
      </section>

    </div>

    {gsOpen && <GetStartedModal onClose={() => setGsOpen(false)} />}
    {authOpen && <AuthPanel onClose={() => setAuthOpen(false)} />}
    </>
  );
}
