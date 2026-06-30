"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const KITCHEN_FEE = 15.00;
const MEAL_PRICE = 8.50;

const INITIAL_SCHEDULE = [
  {
    day: "MON", date: 14, month: "Oct",
    name: "Chicken Teriyaki Bento", tag: "CHEF'S CHOICE",
    desc: "Grilled chicken breast, ginger-soy glaze, steamed jasmine rice, and seasonal greens.",
    kcal: 620, delivery: "45m", enabled: true, qty: 15, initial: "C",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&q=80",
  },
  {
    day: "TUE", date: 15, month: "Oct",
    name: "Harvest Quinoa Bowl",
    desc: "Roasted sweet potato, kale, pomegranate seeds, and tahini dressing.",
    kcal: 480, delivery: "45m", enabled: false, qty: 0, initial: "H",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80&q=80",
  },
  {
    day: "WED", date: 16, month: "Oct",
    maintenance: true,
  },
  {
    day: "THU", date: 17, month: "Oct",
    name: "Mediterranean Salmon",
    desc: "Atlantic salmon with lemon-herb crust, couscous, and wilted spinach.",
    kcal: 560, delivery: "45m", enabled: true, qty: 10, initial: "M",
    img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=80&q=80",
  },
  {
    day: "FRI", date: 18, month: "Oct",
    name: "Roasted Pepper Burrito Bowl",
    desc: "Black beans, guacamole, pico de gallo, chipotle crema.",
    kcal: 490, delivery: "45m", enabled: false, qty: 0, initial: "R",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&q=80",
  },
];

export default function SchedulePage() {
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);

  const toggleDay = (i) => {
    setSchedule(s => s.map((d, idx) => idx === i
      ? { ...d, enabled: !d.enabled, qty: !d.enabled ? 10 : 0 }
      : d
    ));
  };

  const changeQty = (i, delta) => {
    setSchedule(s => s.map((d, idx) => idx === i
      ? { ...d, qty: Math.max(1, (d.qty || 1) + delta) }
      : d
    ));
  };

  const activeItems = schedule.filter(d => !d.maintenance && d.enabled);
  const totalMeals = activeItems.reduce((s, d) => s + d.qty, 0);
  const subtotal = totalMeals * MEAL_PRICE;
  const estTotal = subtotal + KITCHEN_FEE;

  return (
    <div className={styles.root}>
      {/* ── Navbar ── */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.logoLink}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Subtle Kitchen" className={styles.logo} />
        </Link>
        <div className={styles.navSteps}>
          {["Office", "Order Type", "Menu", "Schedule", "Review"].map((s, i) => (
            <div key={s} className={`${styles.step} ${i === 3 ? styles.stepActive : i < 3 ? styles.stepDone : ""}`}>
              <span className={styles.stepNum}>{i < 3 ? "✓" : i + 1}</span>
              <span className={styles.stepLabel}>{s}</span>
              {i < 4 && <span className={styles.stepLine} />}
            </div>
          ))}
        </div>
        <Link href="/" className={styles.exitBtn}>✕ Exit</Link>
      </nav>

      {/* ── Main ── */}
      <div className={styles.main}>
        {/* Left */}
        <div className={styles.left}>
          <div className={styles.pageHeader}>
            <h1 className={styles.heading}>Choose your delivery schedule</h1>
            <p className={styles.subtext}>
              Select the days and meals for your first operational week.{" "}
              <span className={styles.accent}>You can adjust these later in your kitchen dashboard.</span>
            </p>
          </div>

          {/* Week nav */}
          <div className={styles.weekNav}>
            <span className={styles.weekLabel}>Week of Oct 14 – Oct 20</span>
            <div className={styles.weekBtns}>
              <button className={styles.weekArrow}>‹</button>
              <button className={styles.weekArrow}>›</button>
            </div>
          </div>

          {/* Day rows */}
          <div className={styles.dayRows}>
            {schedule.map((day, i) => {
              if (day.maintenance) {
                return (
                  <div key={i} className={styles.maintenanceRow} style={{ animationDelay: (i * 0.07) + "s" }}>
                    <div className={`${styles.dayBadge} ${styles.dayBadgeMaint}`}>
                      <span className={styles.dayName}>{day.day}</span>
                      <span className={styles.dayDate}>{day.date}</span>
                    </div>
                    <p className={styles.maintenanceNote}>🔧 Kitchen maintenance window · No deliveries available</p>
                  </div>
                );
              }

              return (
                <div
                  key={i}
                  className={`${styles.dayRow} ${day.enabled ? styles.dayRowActive : ""}`}
                  style={{ animationDelay: (i * 0.07) + "s" }}
                >
                  <div className={styles.dayRowTop}>
                    {/* Day badge */}
                    <div className={`${styles.dayBadge} ${day.enabled ? styles.dayBadgeOn : ""}`}>
                      <span className={styles.dayName}>{day.day}</span>
                      <span className={styles.dayDate}>{day.date}</span>
                    </div>

                    {/* Meal info */}
                    <div className={styles.mealInfoBlock}>
                      <div className={styles.mealTitleRow}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={day.img} alt={day.name} className={styles.mealThumb} />
                        <div>
                          <div className={styles.mealTitleLine}>
                            <span className={styles.mealName}>{day.name}</span>
                            {day.tag && <span className={styles.mealTag}>{day.tag}</span>}
                          </div>
                          <p className={styles.mealDesc}>{day.desc}</p>
                          <div className={styles.mealMeta}>
                            <span>⚡ {day.kcal} kcal</span>
                            <span>🕐 {day.delivery} Delivery</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Toggle */}
                    <button
                      className={`${styles.toggle} ${day.enabled ? styles.toggleOn : ""}`}
                      onClick={() => toggleDay(i)}
                      aria-label="Toggle day"
                    >
                      <span className={styles.toggleThumb} />
                    </button>
                  </div>

                  {/* Expanded controls */}
                  {day.enabled && (
                    <div className={styles.dayRowExpanded}>
                      <div className={styles.qtyControl}>
                        <span className={styles.qtyLabel}>Quantity:</span>
                        <button className={styles.qtyBtn} onClick={() => changeQty(i, -1)}>−</button>
                        <span className={styles.qtyNum}>{day.qty}</span>
                        <button className={styles.qtyBtn} onClick={() => changeQty(i, +1)}>+</button>
                      </div>
                      <div className={styles.rowActions}>
                        <button className={styles.rowActionBtn}>Details</button>
                        <button className={styles.rowActionBtn}>Customize</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <div className={styles.sidebarTop}>
              <h2 className={styles.sidebarHeading}>Operational Review</h2>
              <p className={styles.sidebarMeta}>Reviewing your current selections</p>
            </div>

            {/* Item rows */}
            <div className={styles.reviewList}>
              {schedule.filter(d => !d.maintenance).map((d, i) => (
                <div key={i} className={`${styles.reviewItem} ${!d.enabled ? styles.reviewItemOff : ""}`}>
                  <div className={`${styles.reviewInitial} ${d.enabled ? styles.reviewInitialOn : ""}`}>
                    {d.initial}
                  </div>
                  <div className={styles.reviewItemInfo}>
                    <span className={styles.reviewItemName}>{d.enabled ? d.name?.split(" ").slice(0, 2).join(" ") : "No selection"}</span>
                  </div>
                  <span className={styles.reviewItemQty}>
                    {d.enabled ? `${d.qty} units` : "—"}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.reviewDivider} />

            {/* Totals */}
            <div className={styles.reviewTotals}>
              <div className={styles.reviewTotalRow}>
                <span>Subtotal ({totalMeals} meals)</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.reviewTotalRow}>
                <span>Kitchen Fee</span>
                <span>£{KITCHEN_FEE.toFixed(2)}</span>
              </div>
            </div>

            <div className={styles.estTotal}>
              <span className={styles.estTotalLabel}>Est. Total</span>
              <span className={styles.estTotalAmt}>£{estTotal.toFixed(2)}</span>
            </div>

            <button className={styles.continueBtn}>Continue to Review</button>

            <p className={styles.securedNote}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Secured by Subtle Kitchen Cloud
            </p>
          </div>

          {/* Stat cards */}
          <div className={styles.statCards}>
            <div className={`${styles.statCard} ${styles.statCardDark}`}>
              <span className={styles.statIcon}>⚡</span>
              <span className={styles.statVal}>34%</span>
              <span className={styles.statLabel}>Avg. Margin</span>
            </div>
            <div className={`${styles.statCard} ${styles.statCardYellow}`}>
              <span className={styles.statIcon}>👥</span>
              <span className={`${styles.statVal} ${styles.statValDark}`}>120+</span>
              <span className={`${styles.statLabel} ${styles.statLabelDark}`}>Employee Reach</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
