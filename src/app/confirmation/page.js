"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import Navbar from "../components/Navbar";
import AuthPanel from "../components/AuthPanel";
import DeliveryVanAnimation from "../components/DeliveryVanAnimation";
import { useAuth } from "../context/AuthContext";

function formatDeliveryDate(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function getDayLabel(iso) {
  if (!iso) return { day: "—", date: "—" };
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return {
    day:  dt.toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase(),
    date: d,
  };
}

export default function ConfirmationPage() {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [visible, setVisible]   = useState(false);
  const [count, setCount]       = useState(0);

  const [order] = useState(() => {
    if (typeof window === "undefined") return null;
    try { return JSON.parse(sessionStorage.getItem("sk_confirmation") || "null"); }
    catch { return null; }
  });

  const items    = order?.items    || [];
  const total    = Number(order?.total)    || items.reduce((s, i) => s + (Number(i.price) || 0) * (i.qty || 1), 0);
  const subtotal = Number(order?.subtotal) || total;
  const discount = Number(order?.discount?.amount) || 0;

  const workspaceName  = user?.workspaceName  || order?.workspaceCode || "Your workspace";
  const deliveryDate   = formatDeliveryDate(order?.deliveryDate);
  const deliveryTime   = order?.lunchTime || "—";
  const { day: dayName, date: dayNum } = getDayLabel(order?.deliveryDate);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    let start = 0;
    const step = total / 40;
    const timer = setInterval(() => {
      start = Math.min(start + step, total);
      setCount(start);
      if (start >= total) clearInterval(timer);
    }, 28);
    return () => { clearTimeout(t); clearInterval(timer); };
  }, [total]);

  return (
    <>
    <div className={`${styles.root} ${visible ? styles.rootVisible : ""}`} suppressHydrationWarning>
      <Navbar onSignIn={() => setAuthOpen(true)} />

      <div className={styles.twoCol}>

        {/* ── Left panel ── */}
        <div className={styles.leftPanel}>
          <div className={styles.deliveryInfo}>

            <DeliveryVanAnimation />

            <p className={styles.sectionTitle} style={{ marginTop: 0 }}>Preferred delivery address</p>
            <div className={styles.deliveryAddrCard}>
              <div className={styles.deliveryAddrTop}>
                <div className={styles.deliveryAddrIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                  </svg>
                </div>
                <span className={styles.deliveryAddrBadge}>Workspace</span>
              </div>
              <h2 className={styles.deliveryCompany}>{workspaceName}</h2>
              <div className={styles.deliveryDivider} />
              <p className={styles.deliveryAddr}>
                {[user?.workspaceAddress, user?.workspaceCity, user?.workspaceCounty, user?.workspacePostcode]
                  .filter(Boolean)
                  .join(", ") || user?.email || "—"}
              </p>
            </div>

            <p className={styles.sectionTitle}>Preferred delivery date</p>
            <div className={styles.metaBadge}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {deliveryDate}
            </div>

            <p className={styles.sectionTitle}>Preferred delivery time</p>
            <div className={styles.metaBadge}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              {deliveryTime}
            </div>

          </div>
        </div>

        {/* ── Right panel ── */}
        <div className={styles.rightPanel}>
          <div className={styles.rightInner}>

            <div className={styles.successHeader}>
              <div className={styles.iconWrap}>
                <div className={styles.iconRing} />
                <div className={styles.iconCircle}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.checkSvg}>
                    <polyline className={styles.checkPath} points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
              <h1 className={styles.heading}>Order confirmed! 🎉</h1>
              <p className={styles.subtext}>Your lunch is on its way to <strong>{workspaceName}.</strong></p>
            </div>

            <div className={styles.card}>
              <p className={styles.cardLabel}>YOUR ORDER</p>
              <div className={styles.orderItems}>
                {items.map((item, i) => (
                  <div key={i} className={styles.orderItem}>
                    <div className={styles.dayBadge}>
                      <span className={styles.dayName}>{dayName}</span>
                      <span className={styles.dayDate}>{dayNum}</span>
                    </div>
                    {item.img && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={item.img} alt={item.dishName} className={styles.mealImg} />
                    )}
                    <div className={styles.mealInfo}>
                      <span className={styles.mealName}>{item.dishName}</span>
                      <div className={styles.mealMeta}>
                        <span>{item.portionSize} Portion</span>
                        {(item.tags || []).map(t => <span key={t} className={styles.tag}>· {t}</span>)}
                        {item.qty > 1 && <span className={styles.tag}>· x{item.qty}</span>}
                      </div>
                    </div>
                    <span className={styles.mealPrice}>£{(Number(item.price) * (item.qty || 1)).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {discount > 0 && (
                <div className={styles.totalRow} style={{ opacity: 0.65 }}>
                  <span className={styles.totalLabel}>Subtotal</span>
                  <span className={styles.totalAmt}>£{subtotal.toFixed(2)}</span>
                </div>
              )}
              {discount > 0 && (
                <div className={styles.totalRow} style={{ color: "#22a06b" }}>
                  <span className={styles.totalLabel}>Discount ({order?.discount?.label})</span>
                  <span className={styles.totalAmt}>−£{discount.toFixed(2)}</span>
                </div>
              )}
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total charged</span>
                <span className={styles.totalAmt}>£{count.toFixed(2)}</span>
              </div>
            </div>

            <div className={styles.actions}>
              <Link href="/menu" className={styles.btnPrimary}>Order more</Link>
              <Link href="/" className={styles.btnOutline}>Back to home</Link>
            </div>

          </div>
        </div>

      </div>
    </div>
    {authOpen && <AuthPanel onClose={() => setAuthOpen(false)} />}
    </>
  );
}
