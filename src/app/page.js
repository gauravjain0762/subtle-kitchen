"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { useScrollAnimation } from "./hooks/useScrollAnimation";
import MarqueeBanner from "./components/MarqueeBanner";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Menu",         href: "#menu" },
  { label: "For businesses", href: "#for-businesses" },
  { label: "Pricing",     href: "#menu" },
];
const HERO_DISHES = [
  { img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=85", name: "Chicken Katsu Curry",    desc: "Crispy panko chicken, house curry sauce, jasmine rice, pickled radish.", kcal: "620 KCAL" },
  { img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&q=85", name: "Sesame Ahi Poke Bowl",    desc: "Sushi-grade tuna, edamame, cucumber, pickled ginger, sesame dressing.", kcal: "480 KCAL" },
  { img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=900&q=85", name: "Miso Salmon & Quinoa", desc: "Atlantic salmon, white miso glaze, tri-colour quinoa, steamed greens.",   kcal: "560 KCAL" },
  { img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&q=85", name: "Herby Falafel Wrap",    desc: "Crispy falafel, tahini, roasted peppers, fresh herbs, flatbread.",       kcal: "520 KCAL" },
];

const HEADLINE_LINES = [
  ["Lunch", "your", "team"],
  ["actually", "looks"],
  ["forward", "to", "..."],
];

const MENU_HEADING = "This week’s menu";

const MENU_ITEMS = [
  { day: "MON", date: 24, name: "Sesame Ahi Poke Bowl",       desc: "Sushi-grade tuna, edamame, cucumber, sesame dressing",  kcal: 480, protein: 32, tags: ["GLUTEN FREE", "OMEGA-3"],    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=160&q=80", active: true  },
  { day: "TUE", date: 25, name: "Herby Falafel & Hummus Wrap", desc: "Crispy falafel, tahini, roasted peppers, flatbread",     kcal: 520, protein: 18, tags: ["VEGAN", "HIGH FIBER"],      img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=160&q=80", active: false },
  { day: "WED", date: 26, name: "Chicken Katsu Curry",         desc: "Panko chicken, house curry, jasmine rice, pickled radish", kcal: 620, protein: 41, tags: ["TRENDING", "HIGH PROTEIN"], img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=160&q=80", active: false },
  { day: "THU", date: 27, name: "Miso Salmon & Quinoa",        desc: "Atlantic salmon, white miso glaze, tri-colour quinoa",   kcal: 560, protein: 44, tags: ["DAIRY FREE"],               img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=160&q=80", active: false },
  { day: "FRI", date: 28, name: "Roasted Pepper Burrito Bowl", desc: "Black beans, guacamole, pico de gallo, chipotle crema",  kcal: 490, protein: 22, tags: ["VEGETARIAN"],               img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=160&q=80", active: false },
];

const PERKS = [
  {
    label: "NO MINIMUM ORDER",
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  },
  {
    label: "FREE DELIVERY",
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  },
  {
    label: "CANCEL ANYTIME",
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  },
];

const HOW_STEPS = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1" fill="#0a0a0a" stroke="none"/></svg>,
    title: "Enter your Company code",
    desc: "Simply use your office's unique code to unlock your custom menu.",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" stroke="#0a0a0a" strokeWidth="2.5"/></svg>,
    title: "Pick your days",
    desc: "Choose which days you'd like a hot lunch delivered to your desk.",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 4M7 13l-1.5 7h13L17 13"/></svg>,
    title: "Choose your portion",
    desc: "Standard or Large — whatever your hunger levels demand that day.",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    title: "Pay and you're done",
    desc: "Seamless checkout via company billing or personal card.",
  },
];

export default function Home() {
  useScrollAnimation();
  const [scrolled, setScrolled] = useState(false);
  const [slide, setSlide] = useState(0);
  const [tSlide, setTSlide] = useState(0);
  const heroRef = useRef(null);
  const cursorRef = useRef(null);
  const imgRef = useRef(null);
  const cardParallaxRef = useRef(null);
  const ctaRef = useRef(null);
  const eatBetterRef = useRef(null);
  const scrollProgressRef = useRef(null);
  const statNumRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      if (scrollProgressRef.current) {
        const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        scrollProgressRef.current.style.width = pct + "%";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const move = (e) => { cursor.style.left = e.clientX + "px"; cursor.style.top = e.clientY + "px"; };
    const expand = (e) => { if (e.target.closest("a, button, [data-cursor]")) cursor.classList.add(styles.cursorExpanded); };
    const shrink = (e) => { if (e.target.closest("a, button, [data-cursor]")) cursor.classList.remove(styles.cursorExpanded); };
    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", expand);
    document.addEventListener("mouseout", shrink);
    return () => { window.removeEventListener("mousemove", move); document.removeEventListener("mouseover", expand); document.removeEventListener("mouseout", shrink); };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf;
    const lerp = (a, b, t) => a + (b - a) * t;
    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
    };
    const onLeave = () => { tx = 0; ty = 0; };
    const tick = () => {
      cx = lerp(cx, tx, 0.06);
      cy = lerp(cy, ty, 0.06);
      if (imgRef.current)
        imgRef.current.style.transform = "translate(" + (-cx * 24) + "px," + (-cy * 16) + "px)";
      if (cardParallaxRef.current)
        cardParallaxRef.current.style.transform = "translate(" + (-cx * 12) + "px," + (-cy * 8) + "px)";
      raf = requestAnimationFrame(tick);
    };
    hero.addEventListener("mousemove", onMove, { passive: true });
    hero.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => { hero.removeEventListener("mousemove", onMove); hero.removeEventListener("mouseleave", onLeave); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % HERO_DISHES.length), 3500);
    return () => clearInterval(t);
  }, []);

  const TESTIMONIALS = [
    { quote: "The quality of the food is incredible for a delivery service. It's become the highlight of our team's work day.", name: "Sarah M.", role: "Operations Lead at AeroScale", img: "https://i.pravatar.cc/40?img=47" },
    { quote: "Subtle Kitchen solved our office lunch problem overnight. No more cold deliveries or missing items. It's flawless.", name: "James T.", role: "Founder at FlowState", img: "https://i.pravatar.cc/40?img=12" },
    { quote: "The dashboard makes managing our weekly subsidy so easy. Our employees are healthier and happier.", name: "Priya K.", role: "HR Director at Veridian", img: "https://i.pravatar.cc/40?img=32" },
  ];

  useEffect(() => {
    const t = setInterval(() => setTSlide(s => (s + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(t);
  }, [TESTIMONIALS.length]);

  useEffect(() => {
    const onScroll = () => {
      if (!eatBetterRef.current || !ctaRef.current) return;
      const rect = ctaRef.current.getBoundingClientRect();
      eatBetterRef.current.style.transform = "translate(-50%, calc(-50% + " + (-rect.top * 0.3) + "px))";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── 2. Number counter on stat card ──
  useEffect(() => {
    const el = statNumRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const target = 2847;
      let start = null;
      const step = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 2000, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      io.disconnect();
    }, { threshold: 0.8 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ── 3. Magnetic buttons ──
  useEffect(() => {
    const btns = Array.from(document.querySelectorAll("[data-magnetic]"));
    const cleanup = btns.map(btn => {
      const onEnter = () => { btn.style.transition = "transform 0.15s ease"; };
      const onMove  = (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width  / 2) * 0.22;
        const y = (e.clientY - r.top  - r.height / 2) * 0.22;
        btn.style.transform = "translate(" + x + "px," + y + "px)";
      };
      const onLeave = () => {
        btn.style.transition = "transform 0.5s cubic-bezier(0.23,1,0.32,1)";
        btn.style.transform = "";
      };
      btn.addEventListener("mouseenter", onEnter);
      btn.addEventListener("mousemove",  onMove);
      btn.addEventListener("mouseleave", onLeave);
      return () => { btn.removeEventListener("mouseenter", onEnter); btn.removeEventListener("mousemove", onMove); btn.removeEventListener("mouseleave", onLeave); };
    });
    return () => cleanup.forEach(fn => fn());
  }, []);

  // ── 4. Text scramble on nav links ──
  useEffect(() => {
    const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const links = Array.from(document.querySelectorAll("[data-scramble]"));
    const cleanup = links.map(link => {
      const original = link.textContent;
      let raf = null;
      const scramble = () => {
        let i = 0;
        const tick = () => {
          link.textContent = original.split("").map((ch, idx) => {
            if (ch === " ") return " ";
            if (idx < i) return original[idx];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          }).join("");
          i += 0.5;
          if (i <= original.length) raf = requestAnimationFrame(tick);
          else link.textContent = original;
        };
        raf = requestAnimationFrame(tick);
      };
      const reset = () => { cancelAnimationFrame(raf); link.textContent = original; };
      link.addEventListener("mouseenter", scramble);
      link.addEventListener("mouseleave", reset);
      return () => { link.removeEventListener("mouseenter", scramble); link.removeEventListener("mouseleave", reset); };
    });
    return () => cleanup.forEach(fn => fn());
  }, []);

  // ── 5. Section background colour transition ──
  useEffect(() => {
    const map = { "how-it-works": "#fdf8ec", "menu": "#fff39a", "for-businesses": "#fdf8ec" };
    document.body.style.transition = "background-color 0.9s ease";
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting && map[e.target.id]) document.body.style.backgroundColor = map[e.target.id]; });
    }, { threshold: 0.35 });
    Object.keys(map).forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => { io.disconnect(); document.body.style.backgroundColor = ""; document.body.style.transition = ""; };
  }, []);

  return (
    <div className={styles.root}>
      <div ref={scrollProgressRef} className={styles.scrollProgress} />

      {/* ── Navbar ── */}
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Subtle Kitchen" className={styles.logoImg} />
          </Link>
          <ul className={styles.navLinks}>
            {NAV_LINKS.map((link) => (
              <li key={link.label}><a href={link.href} className={styles.navLink}>{link.label}</a></li>
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
        <div className={styles.heroNoise} aria-hidden="true" />

        <div className={styles.heroLeft}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            FRESH LUNCH, DELIVERED DAILY
          </div>

          <h1 className={styles.headline}>
            {HEADLINE_LINES.map((line, li) => {
              const offset = HEADLINE_LINES.slice(0, li).reduce((a, l) => a + l.length, 0);
              return (
                <span key={li} className={styles.headlineLine}>
                  {line.map((word, wi) => (
                    <span key={wi} className={styles.word} style={{ animationDelay: (0.3 + (offset + wi) * 0.18) + "s", marginRight: word === "..." ? 0 : (line[wi + 1] === "..." ? "0.08em" : wi < line.length - 1 ? "0.26em" : 0), fontSize: word === "..." ? "0.5em" : undefined, verticalAlign: "baseline" }}>
                      {word}
                    </span>
                  ))}
                </span>
              );
            })}
          </h1>

          <p className={styles.subtext}>
            Nutritious, <span className={styles.accent}>chef-prepared</span> meals delivered directly to your office.
            <br />
            No more uninspired sandwiches or <span className={styles.accent}>expensive solo deliveries.</span>
          </p>

          <div className={styles.ctas}>
            <a href="#" className={styles.ctaPrimary} data-magnetic>Get your company code</a>
            <a href="#" className={styles.ctaSecondary} data-magnetic>See this week&apos;s menu →</a>
          </div>

          <div className={styles.divider} />

          <div className={styles.perks}>
            {PERKS.flatMap((p, i) => [
              <span key={p.label} className={styles.perk}>
                <span className={styles.perkIconWrap}>{p.icon}</span>
                {p.label}
              </span>,
              i < PERKS.length - 1 ? <span key={"sep" + i} className={styles.perkSep} aria-hidden="true" /> : null,
            ])}
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.heroImgWrap}>
            <div className={styles.heroImgClip} ref={imgRef}>
              {HERO_DISHES.map((dish, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={dish.img}
                  alt={dish.name}
                  className={`${styles.heroImg} ${i === slide ? styles.heroImgActive : ""}`}
                />
              ))}
            </div>

            <div className={styles.slideDots}>
              {HERO_DISHES.map((_, i) => (
                <button key={i} className={`${styles.slideDot} ${i === slide ? styles.slideDotActive : ""}`} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`} />
              ))}
            </div>

            <div ref={cardParallaxRef} className={styles.menuCardWrap}>
              <div className={styles.menuCard}>
                <div className={styles.menuCardTop}>
                  <span className={styles.menuCardBadge}>TODAY&apos;S LUNCH</span>
                  <span className={styles.menuCardAvailable}>
                    <span className={styles.dot} /> AVAILABLE
                  </span>
                </div>
                <h3 className={styles.menuCardTitle}>{HERO_DISHES[slide].name}</h3>
                <p className={styles.menuCardDesc}>{HERO_DISHES[slide].desc}</p>
                <div className={styles.menuCardDivider} />
                <div className={styles.menuCardFooter}>
                  <span className={styles.kcal}>{HERO_DISHES[slide].kcal}</span>
                  <span className={styles.infoIcon}>ⓘ</span>
                </div>
                <div className={styles.progressBar} key={slide} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarqueeBanner />

      {/* ── How It Works ── */}
      <section id="how-it-works" className={styles.how}>
        <div className={styles.howInner}>
          <p className={styles.howLabel} data-animate="fade-in">SIMPLE BY DESIGN</p>
          <h2 className={styles.howHeading} data-animate="fade-up" data-stagger-delay="1">Order tomorrow&apos;s lunch in under 30 seconds.</h2>
          <div className={styles.howGrid}>
            {HOW_STEPS.map((step, i) => (
              <div key={i} className={styles.howCardWrap} data-animate="fade-up" data-stagger-delay={i}>
                <div
                  className={styles.howCard}
                  data-cursor="true"
                  style={{ animationDelay: (0.1 * i) + "s" }}
                  onMouseMove={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - r.left) / r.width - 0.5;
                    const y = (e.clientY - r.top) / r.height - 0.5;
                    e.currentTarget.style.transition = "transform 0.15s ease";
                    e.currentTarget.style.transform = "rotateX(" + (-y * 8) + "deg) rotateY(" + (x * 8) + "deg) scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transition = "transform 0.4s ease-out";
                    e.currentTarget.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
                  }}
                >
                  <span className={styles.stepNum}>0{i + 1}</span>
                  <div className={styles.howIcon}>{step.icon}</div>
                  <h3 className={styles.howCardTitle}>{step.title}</h3>
                  <p className={styles.howCardDesc}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.sectionDivider} />

      {/* ── This Week's Menu ── */}
      <section id="menu" className={styles.menu}>
        <div className={styles.menuInner}>
          <div className={styles.menuLeft} data-animate="slide-right">
            <h2 className={styles.menuHeading}>
              {MENU_HEADING.split("").map((char, i) => (
                <span key={i} className={styles.menuChar} style={{ animationDelay: (i * 20) + "ms" }}>
                  {char === " " ? " " : char}
                </span>
              ))}
            </h2>
            <p className={styles.menuSubtext}>A different, nutritionally balanced meal every single day. Crafted by professional chefs for the modern worker.</p>
            <a href="#" className={styles.menuBtn}>See full menu →</a>
          </div>
          <div className={styles.menuRight}>
            {MENU_ITEMS.map((item, i) => (
              <div key={i} className={`${styles.menuRow} ${item.active ? styles.menuRowActive : ""}`} data-cursor="true" data-animate="fade-up" data-stagger-delay={i}>
                <div className={styles.dayPill}>
                  {item.active ? (
                    <span className={styles.todayLabel}>TODAY</span>
                  ) : (
                    <><span className={styles.dayName}>{item.day}</span><span className={styles.dayNum}>{item.date}</span></>
                  )}
                </div>
                <div className={styles.menuThumbWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.img} alt={item.name} className={styles.menuThumb} />
                </div>
                <div className={styles.menuInfo}>
                  <span className={styles.menuItemName}>{item.name}</span>
                  <span className={styles.menuItemDesc}>{item.desc}</span>
                </div>
                <div className={styles.macros}>
                  <span className={styles.macroPill}>{item.kcal} KCAL</span>
                  <span className={styles.macroPill}>{item.protein}G PRO</span>
                </div>
                <span className={styles.menuArrow}>→</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Businesses ── */}
      <section id="for-businesses" className={styles.biz}>
        <div className={styles.bizInner}>
          <p className={styles.bizLabel} data-animate="fade-in">EMPOWER YOUR TEAM</p>
          <h2 className={styles.bizHeading} data-animate="fade-up" data-stagger-delay="1">Set up your office in minutes.</h2>
          <div className={styles.bizGrid}>
            <div className={styles.bizCard} data-cursor="true" data-animate="scale-in" data-stagger-delay="0">
              <div className={styles.bizIcon}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                  <rect x="14" y="14" width="3" height="3"/><rect x="18" y="18" width="3" height="3"/>
                </svg>
              </div>
              <h3 className={styles.bizCardTitle}>One code per office</h3>
              <p className={styles.bizCardDesc}>Distribute a single invite code. No individual account creation needed for employees to browse.</p>
            </div>
            <div className={`${styles.bizCard} ${styles.bizCardDark}`} data-cursor="true" data-animate="scale-in" data-stagger-delay="1">
              <div className={styles.bizIcon}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
              </div>
              <h3 className={`${styles.bizCardTitle} ${styles.bizCardTitleDark}`}>Full orders dashboard</h3>
              <p className={`${styles.bizCardDesc} ${styles.bizCardDescDark}`}>Track consumption, manage office locations, and view nutritional analytics in real-time.</p>
            </div>
            <div className={styles.bizCard} data-cursor="true" data-animate="scale-in" data-stagger-delay="2">
              <div className={styles.bizIcon}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
                </svg>
              </div>
              <h3 className={styles.bizCardTitle}>Flexible billing</h3>
              <p className={styles.bizCardDesc}>Choose between full company subsidy, partial employee contribution, or direct payment.</p>
            </div>
          </div>
          <a href="#" className={styles.bizLink} data-animate="fade-up" data-stagger-delay="3">Get a company code →</a>
        </div>
      </section>

      {/* ── Subscribe ── */}
      <section className={styles.subscribe}>
        <div className={styles.subscribeInner}>
          <div className={styles.subscribeContent} data-animate="slide-right">
            <h2 className={styles.subscribeHeading}>Subscribe and never think about lunch again.</h2>
            <ul className={styles.subscribePerks}>
              {["Auto-orders based on your preferences", "Priority delivery window every day", "15% discount on all weekly orders"].map((p, i) => (
                <li key={p} className={styles.subscribePerk} data-animate="slide-right" data-stagger-delay={i}>
                  <span className={styles.subscribeCheck}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  <span className={styles.subscribePerkText}>{p}</span>
                </li>
              ))}
            </ul>
            <a href="#" className={styles.subscribeBtn}>Start your subscription</a>
          </div>

          <div className={styles.subscribeImgWrap} data-animate="slide-left">
            <div className={styles.subscribeImgFade} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80" alt="Healthy meal bowls" className={styles.subscribeImg} />
            <div className={styles.statCard}>
              <span className={styles.statIcon}>↻</span>
              <div>
                <p className={styles.statNum} ref={statNumRef}>2,847</p>
                <p className={styles.statLabel}>repeat orders this week</p>
              </div>
            </div>
            <div className={styles.repeatBadge}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
              </svg>
              Repeat last week
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className={styles.testimonials}>
        <div className={styles.testimonialSlider} data-animate="fade-up">
          <div className={styles.testimonialViewport}>
          <div className={styles.testimonialTrack} style={{ transform: "translateX(-" + (tSlide * 100) + "%)" }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={styles.testimonialCard}
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - r.left) / r.width - 0.5;
                  const y = (e.clientY - r.top) / r.height - 0.5;
                  e.currentTarget.style.transition = "transform 0.15s ease";
                  e.currentTarget.style.transform = "perspective(800px) rotateX(" + (-y * 7) + "deg) rotateY(" + (x * 7) + "deg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transition = "transform 0.4s ease-out";
                  e.currentTarget.style.transform = "perspective(800px) rotateX(0) rotateY(0)";
                }}
              >
                <div className={styles.stars}>
                  {"★★★★★".split("").map((s, si) => (
                    <span key={si} className={styles.star} style={{ animationDelay: (si * 0.08) + "s" }}>{s}</span>
                  ))}
                </div>
                <p className={styles.testimonialQuote}>{t.quote}</p>
                <div className={styles.testimonialDivider} />
                <div className={styles.testimonialAuthor}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.img} alt={t.name} className={styles.avatar} />
                  <div>
                    <p className={styles.authorName}>{t.name}</p>
                    <p className={styles.authorRole}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>{/* testimonialViewport */}

          <div className={styles.tDots}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} className={`${styles.tDot} ${i === tSlide ? styles.tDotActive : ""}`} onClick={() => setTSlide(i)} aria-label={"Testimonial " + (i + 1)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className={styles.finalCta} ref={ctaRef}>
        <div ref={eatBetterRef} className={styles.eatBetter} aria-hidden="true">EAT BETTER</div>
        <h2 className={styles.finalCtaHeading} data-animate="fade-up">Ready to upgrade your office lunch?</h2>
        <div className={styles.finalCtaBtns} data-animate="fade-up" data-stagger-delay="1">
          <a href="#" className={styles.finalCtaPrimary}>
            Get a company code
            <svg className={styles.ctaArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
          <a href="#" className={styles.finalCtaSecondary}>Contact us</a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner} data-animate="fade-up">
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <span className={styles.footerLogoDash}>—</span>
              <span className={styles.footerLogoText}>Subtle Kitchen</span>
            </div>
            <p className={styles.footerTagline}>Refined dining for the modern workplace. Delivered daily, with care.</p>
            <a href="#" className={styles.footerSocial} aria-label="Twitter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </a>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerCol}>
              <p className={styles.footerColTitle}>PLATFORM</p>
              <a href="#" className={styles.footerLink}>Menu</a>
              <a href="#" className={styles.footerLink}>For businesses</a>
              <a href="#" className={styles.footerLink}>Pricing</a>
            </div>
            <div className={styles.footerCol}>
              <p className={styles.footerColTitle}>COMPANY</p>
              <a href="#" className={styles.footerLink}>About us</a>
              <a href="#" className={styles.footerLink}>Contact</a>
              <a href="#" className={styles.footerLink}>Privacy Policy</a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p className={styles.footerCopy}>© 2026 Subtle Kitchen. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
