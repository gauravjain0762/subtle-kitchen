"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const NAV_LINKS = ["How it works", "Menu", "For businesses", "Pricing"];
const BRANDS = ["AeroScale", "FlowState", "Veridian", "NexusOne", "Quartz", "AeroScale", "FlowState", "Veridian", "NexusOne", "Quartz"];

const HOW_STEPS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f8e396" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        <circle cx="12" cy="16" r="1" fill="#f8e396" stroke="none"/>
      </svg>
    ),
    title: "Enter your code",
    desc: "Simply use your office's unique code to unlock your custom menu.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f8e396" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" stroke="#f8e396" strokeWidth="2.5"/>
      </svg>
    ),
    title: "Pick your days",
    desc: "Choose which days you'd like a hot lunch delivered to your desk.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f8e396" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 4M7 13l-1.5 7h13L17 13"/>
      </svg>
    ),
    title: "Choose your portion",
    desc: "Standard or Large— whatever your hunger levels demand that day.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f8e396" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
    title: "Pay and you&apos;re done",
    desc: "Seamless checkout via company billing or personal card.",
  },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={styles.root}>
      {/* ── Navbar ── */}
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoMark}>subtle kitchen</span>
            <span className={styles.logoMain}>Subtle Kitchen</span>
          </Link>

          <ul className={styles.navLinks}>
            {NAV_LINKS.map((link) => (
              <li key={link}>
                <a href="#" className={styles.navLink}>{link}</a>
              </li>
            ))}
          </ul>

          <div className={styles.navActions}>
            <a href="#" className={styles.signIn}>Sign in</a>
            <a href="#" className={styles.getStarted}>Get started</a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroLeft}>
          <div className={styles.badge}>
            <span className={styles.badgeLeaf}>✦</span>
            FRESH LUNCH, DELIVERED DAILY
          </div>

          <h1 className={styles.headline}>
            Lunch your team actually looks forward to.
          </h1>

          <p className={styles.subtext}>
            Nutritious, <span className={styles.accent}>chef-prepared</span> meals delivered directly to your office.
            <br />
            No more uninspired sandwiches or <span className={styles.accent}>expensive solo deliveries.</span>
          </p>

          <div className={styles.ctas}>
            <a href="#" className={styles.ctaPrimary}>Get your company code</a>
            <a href="#" className={styles.ctaSecondary}>See this week&apos;s menu →</a>
          </div>

          <div className={styles.divider} />

          <div className={styles.perks}>
            {["NO MINIMUM ORDER", "FREE DELIVERY", "CANCEL ANYTIME"].map((p) => (
              <span key={p} className={styles.perk}>
                <span className={styles.perkCheck}>✔</span> {p}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.heroImgWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80"
              alt="Chicken Katsu Curry"
              className={styles.heroImg}
            />

            <div className={styles.menuCard}>
              <div className={styles.menuCardTop}>
                <span className={styles.menuCardBadge}>TODAY&apos;S LUNCH</span>
                <span className={styles.menuCardAvailable}>
                  <span className={styles.dot} /> AVAILABLE
                </span>
              </div>
              <h3 className={styles.menuCardTitle}>Chicken Katsu Curry</h3>
              <p className={styles.menuCardDesc}>
                Crispy panko chicken, house curry sauce, jasmine rice, pickled radish.
              </p>
              <div className={styles.menuCardDivider} />
              <div className={styles.menuCardFooter}>
                <span className={styles.kcal}>620 KCAL</span>
                <span className={styles.infoIcon}>ⓘ</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.sectionDivider} />

      {/* ── How It Works ── */}
      {/* <section className={styles.how}>
        <div className={styles.howInner}>
          <p className={styles.howLabel}>SIMPLE BY DESIGN</p>
          <h2 className={styles.howHeading}>Order tomorrow's lunch in under 30 seconds.</h2>
          <div className={styles.howGrid}>
            {HOW_STEPS.map((step, i) => (
              <div key={i} className={styles.howCard} style={{ animationDelay: `${0.1 * i}s` }}>
                <div className={styles.howIcon}>{step.icon}</div>
                <h3 className={styles.howCardTitle}>{step.title}</h3>
                <p className={styles.howCardDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* <div className={styles.sectionDivider} /> */}

      {/* ── This Week's Menu ── */}
      {/* <section className={styles.menu}>
        <div className={styles.menuInner}>
          <div className={styles.menuLeft}>
            <h2 className={styles.menuHeading}>This week&apos;s menu</h2>
            <p className={styles.menuSubtext}>A different, nutritionally balanced meal every single day. Crafted by professional chefs for the modern worker.</p>
            <a href="#" className={styles.menuBtn}>See full menu</a>
          </div>
          <div className={styles.menuRight}>
            {[
              { day: "MON", date: 24, name: "Sesame Ahi Poke Bowl", tags: ["GLUTEN FREE", "OMEGA-3"], img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&q=80", active: true },
              { day: "TUE", date: 25, name: "Herby Falafel & Hummus Wrap", tags: ["VEGAN", "HIGH FIBER"], img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=120&q=80", active: false },
              { day: "WED", date: 26, name: "Chicken Katsu Curry", tags: ["TRENDING", "HIGH PROTEIN"], img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=120&q=80", active: false },
              { day: "THU", date: 27, name: "Miso Salmon & Quinoa", tags: ["DAIRY FREE"], img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=120&q=80", active: false },
              { day: "FRI", date: 28, name: "Roasted Pepper Burrito Bowl", tags: ["VEGETARIAN"], img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&q=80", active: false },
            ].map((item, i) => (
              <div key={i} className={styles.menuRow} style={{ animationDelay: `${0.08 * i}s` }}>
                <div className={`${styles.dayBadge} ${item.active ? styles.dayBadgeActive : ""}`}>
                  <span className={styles.dayName}>{item.day}</span>
                  <span className={styles.dayNum}>{item.date}</span>
                </div>
                <img src={item.img} alt={item.name} className={styles.menuThumb} />
                <div className={styles.menuInfo}>
                  <span className={styles.menuItemName}>{item.name}</span>
                  <div className={styles.menuTags}>
                    {item.tags.map((t) => (
                      <span key={t} className={`${styles.tag} ${t === "TRENDING" ? styles.tagTrending : ""}`}>{t}</span>
                    ))}
                  </div>
                </div>
                <span className={styles.menuArrow}>›</span>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── Trusted By ── */}
      <section className={styles.trusted}>
        <div className={styles.trustedInner}>
          <span className={styles.trustedLabel}>TRUSTED BY TEAMS AT</span>
          <div className={styles.marqueeWrap}>
            <div className={styles.marqueeTrack}>
              {BRANDS.map((b, i) => (
                <span key={i} className={styles.brand}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
