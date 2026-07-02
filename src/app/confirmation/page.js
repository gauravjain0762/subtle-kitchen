"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import Navbar from "../components/Navbar";
import AuthPanel from "../components/AuthPanel";

const ORDER = [
  { day: "MON", date: 30, name: "Chicken Katsu Curry",    portion: "Large Portion",   tags: ["High Protein"], price: 13.25, img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&q=80" },
  { day: "WED", date: "02", name: "Mediterranean Salmon", portion: "Regular Portion", tags: ["Gluten Free"],  price: 13.25, img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=80&q=80" },
];
const TOTAL = ORDER.reduce((s, o) => s + o.price, 0);

const DELIVERY = {
  company: "Acme Corp",
  type: "HQ Office",
  line1: "12 Business Park, Canary Wharf",
  line2: "London, E14 5AB",
  date: "Monday, 30 June 2026",
  time: "12:00 PM – 1:00 PM",
};

export default function ConfirmationPage() {
  const [visible, setVisible]   = useState(false);
  const [count, setCount]       = useState(0);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
    let start = 0;
    const step = TOTAL / 40;
    const timer = setInterval(() => {
      start = Math.min(start + step, TOTAL);
      setCount(start);
      if (start >= TOTAL) clearInterval(timer);
    }, 28);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
    <div className={`${styles.root} ${visible ? styles.rootVisible : ""}`}>
      <Navbar onSignIn={() => setAuthOpen(true)} />

      <div className={styles.twoCol}>

        {/* ── Left panel — mirrors review page ── */}
        <div className={styles.leftPanel}>
          <div className={styles.deliveryInfo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Subtle Kitchen" className={styles.deliveryLogo} />
            <p className={styles.deliveryInfoLabel}>We delivered to</p>

            <div className={styles.deliveryAddrCard}>
              <div className={styles.deliveryAddrTop}>
                <div className={styles.deliveryAddrIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                  </svg>
                </div>
                <span className={styles.deliveryAddrBadge}>{DELIVERY.type}</span>
              </div>
              <h2 className={styles.deliveryCompany}>{DELIVERY.company}</h2>
              <div className={styles.deliveryDivider} />
              <p className={styles.deliveryAddr}>{DELIVERY.line1}</p>
              <p className={styles.deliveryAddr}>{DELIVERY.line2}</p>
            </div>

            <div className={styles.deliveryMeta}>
              <div className={styles.deliveryMetaItem}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {DELIVERY.date}
              </div>
              <div className={styles.deliveryMetaItem}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                {DELIVERY.time}
              </div>
            </div>

            {/* Subscription status */}
            <div className={styles.subStatus}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              <span>Repeating every week · Mon · Wed</span>
            </div>
          </div>
        </div>

        {/* ── Right panel — confirmation content ── */}
        <div className={styles.rightPanel}>

          {/* Check + heading */}
          <div className={styles.successHeader}>
            <div className={styles.iconWrap}>
              <div className={styles.iconRing} />
              <div className={styles.iconCircle}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.checkSvg}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
            <h1 className={styles.heading}>Order confirmed! 🎉</h1>
            <p className={styles.subtext}>Your lunch is on its way to <strong>{DELIVERY.company}.</strong></p>
          </div>

          {/* Order items */}
          <div className={styles.card}>
            <p className={styles.cardLabel}>YOUR WEEKLY SELECTION</p>
            <div className={styles.orderItems}>
              {ORDER.map((o, i) => (
                <div key={i} className={styles.orderItem}>
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
            <div className={styles.repeatBox}>
              <p className={styles.repeatNext}>Next charge: <strong>7 Jul · £{TOTAL.toFixed(2)}</strong></p>
              <a href="#" className={styles.manageLink}>Manage subscription</a>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <Link href="/menu" className={styles.btnPrimary}>Order more</Link>
            <Link href="/" className={styles.btnOutline}>Back to home</Link>
          </div>
        </div>

      </div>
    </div>
    {authOpen && <AuthPanel onClose={() => setAuthOpen(false)} />}
    </>
  );
}
