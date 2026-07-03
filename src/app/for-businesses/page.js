"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import GetStartedModal from "../components/GetStartedModal";
import Footer from "../components/Footer";
import AuthPanel from "../components/AuthPanel";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const WORKSPACES = [
  {
    badge: "Standard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    title: "Corporate Office",
    desc: "Refined menus for corporate meetings and team lunches.",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80",
  },
  {
    badge: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
    title: "Workshop",
    desc: "Nutritious and hearty meals for hardworking craftsmen.",
    img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=900&q=80",
  },
  {
    badge: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    title: "Garage",
    desc: "Quick service and easy-to-eat meal packs.",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
  },
];

function getPos(i, active, total) {
  const diff = (i - active + total) % total;
  if (diff === 0) return "center";
  if (diff === 1) return "right";
  if (diff === total - 1) return "left";
  return "hidden";
}

export default function ForBusinesses() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [gsOpen, setGsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const sectionRef = useRef(null);
  const timerRef = useRef(null);
  const total = WORKSPACES.length;

  const next = useCallback(() => setActive(a => (a + 1) % total), [total]);
  const prev = useCallback(() => setActive(a => (a - 1 + total) % total), [total]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(next, 4000);
    return () => clearInterval(timerRef.current);
  }, [next]);

  const resetTimer = () => { clearInterval(timerRef.current); timerRef.current = setInterval(next, 4000); };

  const goTo = (i) => { setActive(i); resetTimer(); };

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <>
    <div className={styles.root}>

      <Navbar onSignIn={() => setAuthOpen(true)} />

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.badge}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            PREMIUM B2B SERVICE
          </div>
          <h1 className={styles.heading}>
            Premium Meals<br />
            <span className={styles.headingAccent}>for Every Workplace</span>
          </h1>
          <p className={styles.subtext}>
            We don't just serve workplaces — we provide fresh, chef-prepared lunches
            for garages, warehouses, workshops, and other Small &amp; Medium Enterprises (SMEs).
          </p>
          <div className={styles.ctas}>
            <Link href="/get-workspace-code" className={styles.ctaPrimary}>Get workspace code</Link>
            <Link href="/menu" className={styles.ctaSecondary}>View our menu</Link>
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.heroBg}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=900&q=80" alt="Chef" className={styles.heroImg} />
            <div className={styles.heroFloatCard}>
              <div className={styles.heroFloatIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
              <div>
                <p className={styles.heroFloatTitle}>Fresh Daily Delivery</p>
                <p className={styles.heroFloatSub}>Always hot &amp; ready by noon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Workspaces 3D Slider ── */}
      <section className={`${styles.workSection} ${visible ? styles.workVisible : ""}`} ref={sectionRef}>
        <div className={styles.workHeader}>
          <h2 className={styles.workHeading}>Tailored Solutions for Diverse Workspaces</h2>
          <p className={styles.workSubtext}>Whether you're in a modern studio or a busy workshop, our food is designed to keep your energy up.</p>
        </div>

        <div className={styles.sliderWrap}>
          <div className={styles.sliderStage}>
            {WORKSPACES.map((w, i) => {
              const pos = getPos(i, active, total);
              return (
                <div
                  key={i}
                  className={`${styles.sliderCard} ${styles[`card${pos.charAt(0).toUpperCase() + pos.slice(1)}`]}`}
                  onClick={() => pos !== "center" && goTo(i)}
                >
                  <div className={styles.cardInner}>
                    <div className={styles.cardTop}>
                      <div className={`${styles.cardIcon} ${pos === "center" ? styles.cardIconActive : ""}`}>{w.icon}</div>
                      {w.badge && <span className={styles.cardBadge}>{w.badge}</span>}
                    </div>
                    <h3 className={styles.cardTitle}>{w.title}</h3>
                    <p className={styles.cardDesc}>{w.desc}</p>
                    <div className={styles.cardImgWrap}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={w.img} alt={w.title} className={styles.cardImg} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={() => { prev(); resetTimer(); }} aria-label="Previous">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={() => { next(); resetTimer(); }} aria-label="Next">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        <div className={styles.dots}>
          {WORKSPACES.map((_, i) => (
            <button key={i} className={`${styles.dot} ${i === active ? styles.dotActive : ""}`} onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
      </section>

      {/* ── Delivery Section ── */}
      <section className={styles.deliverySection}>
        <div className={styles.deliveryInner}>

          {/* Left — visual card */}
          <div className={styles.deliveryLeft}>
            <div className={styles.deliveryMapBg}>
              <div className={styles.deliveryMapGlow} />
              <div className={styles.deliveryMapRing} />
              <div className={styles.deliveryMapRing2} />
              <div className={styles.deliveryCard}>
                <div className={styles.deliveryPinIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <p className={styles.deliveryCardTitle}>Delivery Limit</p>
                <p className={styles.deliveryCardSub}>We serve within a 15 km radius</p>
              </div>
            </div>
          </div>

          {/* Right — content */}
          <div className={styles.deliveryRight}>
            <h2 className={`${styles.deliveryHeading} ${styles.deliveryHeadingInline}`}>Guaranteed Fresh and Hot Food</h2>
            <p className={styles.deliverySubtext}>
              To maintain food quality and temperature, we serve within a fixed delivery area (Catchment Area).
            </p>

            <div className={styles.deliveryInfoBox}>
              <p className={styles.deliveryInfoQ}>Is your location within our service limit?</p>
              <p className={styles.deliveryInfoA}>Contact us to verify and get the best food experience for your team.</p>
            </div>

            <Link href="/contact" className={styles.deliveryBtn}>
              Contact Us
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>

        </div>
      </section>

      {/* ── Features ── */}
      <section className={styles.featSection}>
        <FeatureRow
          flip={false}
          badge="Commercial Meal Prep for Businesses"
          heading="Exclusive Commercial Meal Prep"
          body="Looking for fresh, chef-prepared meals for your team? We offer refrigerated commercial meal prep solutions for a select number of businesses. Whether you're an office, warehouse, garage, school, or other workplace, we'll work with you to create a tailored meal solution. Contact us to check availability and whether your business is within our delivery area."
          cta="Enquire Now"
          onCta={() => setGsOpen(true)}
          img="https://images.unsplash.com/photo-1547592180-85f173990554?w=900&q=80"
        />
        <FeatureRow
          flip={true}
          badge="A Conscious Reminder for Healthier Choices"
          heading="Seamless Integration with Custom Display Stands"
          body="Once we confirm delivery to your location, we'll provide custom display stands for your staff areas. These stands feature our unique NPH code, linking directly to our booking site for effortless ordering. They serve as a visible reminder for your team to choose nutritious, chef-prepared meals over less healthy, 'easy' options."
          cta="Learn More About Stands"
          onCta={() => setGsOpen(true)}
          img="https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=900&q=80"
        />
      </section>

      <Footer />

    </div>

    {gsOpen && <GetStartedModal onClose={() => setGsOpen(false)} />}
    {authOpen && <AuthPanel onClose={() => setAuthOpen(false)} />}
    </>
  );
}

function FeatureRow({ flip, badge, heading, body, cta, onCta, img }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.18 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const onMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 14;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * -14;
    setTilt({ x, y });
  };
  const onMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div ref={ref} className={`${styles.featRow} ${flip ? styles.featRowFlip : ""} ${vis ? styles.featRowVis : ""}`}>
      <div
        className={styles.featImgWrap}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={heading} className={styles.featImg} />
        <div className={styles.featImgShine} />
      </div>

      <div className={styles.featContent}>
        <span className={styles.featBadge}>{badge}</span>
        <h2 className={styles.featHeading}>{heading}</h2>
        <p className={styles.featBody}>{body}</p>
        {onCta
          ? <Link href="/get-workspace-code" className={styles.featBtn}>{cta}</Link>
          : <button className={styles.featBtn}>{cta}</button>
        }
      </div>
    </div>
  );
}
