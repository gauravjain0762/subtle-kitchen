"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const ORDER = [
  { day: "MON", date: 30, name: "Chicken Katsu Curry",    portion: "Large Portion",   tags: ["High Protein"], price: 13.25, img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&q=80" },
  { day: "WED", date: "02", name: "Mediterranean Salmon", portion: "Regular Portion", tags: ["Gluten Free"],  price: 13.25, img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=80&q=80" },
];
const TOTAL = ORDER.reduce((s, o) => s + o.price, 0);

const DOTS = [
  { top: "8%",  left: "18%", size: 8,  delay: 0 },
  { top: "4%",  left: "50%", size: 6,  delay: 0.15 },
  { top: "8%",  left: "82%", size: 8,  delay: 0.3 },
  { top: "22%", left: "6%",  size: 5,  delay: 0.45 },
  { top: "22%", left: "94%", size: 5,  delay: 0.6 },
];

export default function ConfirmationPage() {
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    // Count up total
    let start = 0;
    const target = TOTAL;
    const step = target / 40;
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`${styles.root} ${visible ? styles.rootVisible : ""}`}>
      {/* Decorative dots */}
      {DOTS.map((d, i) => (
        <div key={i} className={styles.dot} style={{ top: d.top, left: d.left, width: d.size, height: d.size, animationDelay: d.delay + "s" }} />
      ))}

      <div className={styles.inner}>
        {/* ── Check icon ── */}
        <div className={styles.iconWrap}>
          <div className={styles.iconRingOuter} />
          <div className={styles.iconRingInner} />
          <div className={styles.iconCircle}>
            <svg className={styles.checkSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        {/* ── Heading ── */}
        <div className={styles.headingWrap}>
          <h1 className={styles.heading}>Order confirmed! <span className={styles.emoji}>🎉</span></h1>
          <p className={styles.subtext}>Your lunch is on its way to <strong>Acme Corp.</strong></p>
        </div>

        {/* ── Selection card ── */}
        <div className={styles.card}>
          <p className={styles.cardLabel}>YOUR WEEKLY SELECTION</p>

          <div className={styles.orderItems}>
            {ORDER.map((o, i) => (
              <div key={i} className={styles.orderItem} style={{ animationDelay: (0.5 + i * 0.12) + "s" }}>
                <div className={styles.dayBadge}>
                  <span className={styles.dayName}>{o.day}</span>
                  <span className={styles.dayDate}>{o.date}</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={o.img} alt={o.name} className={styles.mealImg} />
                <div className={styles.mealInfo}>
                  <span className={styles.mealName}>{o.name}</span>
                  <div className={styles.mealMeta}>
                    <span>{o.portion}</span>
                    {o.tags.map(t => <span key={t} className={styles.tag}>· {t}</span>)}
                  </div>
                </div>
                <span className={styles.mealPrice}>£{o.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total charged</span>
            <span className={styles.totalAmt}>£{count.toFixed(2)}</span>
          </div>

          {/* Repeat info */}
          <div className={styles.repeatBox}>
            <div className={styles.repeatTop}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              <span className={styles.repeatTitle}>Repeating every week · Mon · Wed</span>
            </div>
            <p className={styles.repeatNext}>Next charge: 7 Jul · <strong>£{TOTAL.toFixed(2)}</strong></p>
            <a href="#" className={styles.manageLink}>Manage subscription</a>
          </div>
        </div>

        {/* ── Delivery info card ── */}
        <div className={`${styles.card} ${styles.deliveryCard}`}>
          <div className={styles.deliveryRow}>
            <span className={styles.deliveryIcon}>📍</span>
            <div>
              <p className={styles.deliveryTitle}>Delivering to Acme Corp</p>
              <p className={styles.deliveryDetail}>12 Business Park, London</p>
            </div>
          </div>
          <div className={styles.deliveryRow}>
            <span className={styles.deliveryIcon}>📅</span>
            <div>
              <p className={styles.deliveryTitle}>First delivery</p>
              <p className={styles.deliveryDetail}>Monday 30 June</p>
            </div>
          </div>
          <div className={styles.deliveryRow}>
            <span className={styles.deliveryIcon}>⏰</span>
            <div>
              <p className={styles.deliveryTitle}>Estimated arrival</p>
              <p className={styles.deliveryDetail}>12pm–1pm</p>
            </div>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className={styles.actions}>
          <a href="#" className={styles.btnPrimary}>View my account</a>
          <Link href="/" className={styles.btnOutline}>Back to home</Link>
        </div>

        {/* ── Footer notes ── */}
        <div className={styles.footNotes}>
          <p className={styles.footNote}>Confirmation sent to <a href="mailto:sarah@acme.com" className={styles.emailLink}>sarah@acme.com</a></p>
          <p className={styles.footNote}>Questions? <a href="mailto:hello@subtlekitchen.co.uk" className={styles.emailLink}>hello@subtlekitchen.co.uk</a></p>
        </div>
      </div>
    </div>
  );
}
