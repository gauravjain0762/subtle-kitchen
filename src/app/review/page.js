"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const ORDER_ITEMS = [
  { day: "Mon", label: "Monday Lunch",    name: "Chicken Teriyaki",    portion: "Regular", price: 8.50, img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&q=80" },
  { day: "Wed", label: "Wednesday Lunch", name: "Mediterranean Salmon", portion: "Regular", price: 8.50, img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=80&q=80" },
];
const DELIVERY_DAYS = "Mon · Wed";
const ADDRESS = "Acme Corp · 12 Business Park, London";

export default function ReviewPage() {
  const router = useRouter();
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [checking, setChecking] = useState(false);

  const subtotal = ORDER_ITEMS.reduce((s, i) => s + i.price, 0);
  const discount = promoApplied ? subtotal * 0.15 : 0;
  const total = subtotal - discount;

  const applyPromo = () => {
    if (!promo.trim()) return;
    setChecking(true);
    setTimeout(() => {
      if (promo.toUpperCase() === "SAVE15") { setPromoApplied(true); setPromoError(""); }
      else { setPromoError("Invalid promo code. Try SAVE15."); setPromoApplied(false); }
      setChecking(false);
    }, 900);
  };

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
            <div key={s} className={`${styles.step} ${i === 4 ? styles.stepActive : styles.stepDone}`}>
              <span className={styles.stepNum}>{i < 4 ? "✓" : i + 1}</span>
              <span className={styles.stepLabel}>{s}</span>
              {i < 4 && <span className={styles.stepLine} />}
            </div>
          ))}
        </div>
        <Link href="/" className={styles.exitBtn}>✕ Exit</Link>
      </nav>

      {/* ── Content ── */}
      <div className={styles.main}>
        {/* Heading */}
        <div className={styles.header}>
          <h1 className={styles.heading}>Review your order</h1>
          <p className={styles.addressLine}>
            Delivering to <strong>{ADDRESS}</strong>
            <a href="#" className={styles.changeLink}>Change</a>
          </p>
        </div>

        {/* Order card */}
        <div className={styles.orderCard}>
          {ORDER_ITEMS.map((item, i) => (
            <div key={i} className={styles.orderItem} style={{ animationDelay: (i * 0.1) + "s" }}>
              <div className={styles.orderItemLeft}>
                <div className={styles.dayBadge}>{item.day}</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.img} alt={item.name} className={styles.itemImg} />
                <div className={styles.itemInfo}>
                  <span className={styles.itemLabel}>{item.label}</span>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.portionTag}>{item.portion}</span>
                </div>
              </div>
              <div className={styles.orderItemRight}>
                <span className={styles.itemPrice}>£{item.price.toFixed(2)}</span>
                <a href="#" className={styles.editLink}>Edit</a>
              </div>
            </div>
          ))}

          <div className={styles.divider} />

          {/* Totals */}
          <div className={styles.totals}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Subtotal</span>
              <span className={styles.totalVal}>£{subtotal.toFixed(2)}</span>
            </div>
            {promoApplied && (
              <div className={`${styles.totalRow} ${styles.discountRow}`}>
                <span className={styles.totalLabel}>Discount (15%)</span>
                <span className={styles.discountVal}>−£{discount.toFixed(2)}</span>
              </div>
            )}
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Delivery</span>
              <span className={styles.freeTag}>FREE</span>
            </div>
            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
              <span>Total</span>
              <span>£{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Weekly subscription card */}
        <div className={styles.weeklyCard}>
          <div className={styles.weeklyCardTop}>
            <div className={styles.weeklyIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
              </svg>
            </div>
            <div className={styles.weeklyInfo}>
              <p className={styles.weeklyTitle}>Weekly subscription active</p>
              <p className={styles.weeklyDesc}>These meals will repeat every week automatically.</p>
              <p className={styles.weeklyDays}>Your delivery days: <strong>{DELIVERY_DAYS}</strong></p>
            </div>
            <a href="#" className={styles.weeklyChange}>Change</a>
          </div>
        </div>

        {/* Promo code */}
        <div className={styles.promoWrap}>
          <div className={`${styles.promoField} ${promoApplied ? styles.promoFieldSuccess : promoError ? styles.promoFieldError : ""}`}>
            <input
              type="text"
              placeholder="Promo code"
              value={promo}
              onChange={e => { setPromo(e.target.value.toUpperCase()); setPromoError(""); }}
              className={styles.promoInput}
              onKeyDown={e => e.key === "Enter" && applyPromo()}
            />
            <button className={styles.applyBtn} onClick={applyPromo} disabled={checking}>
              {checking ? <span className={styles.spinner} /> : promoApplied ? "✓" : "Apply"}
            </button>
          </div>
          {promoError && <p className={styles.promoError}>{promoError}</p>}
          {promoApplied && <p className={styles.promoSuccess}>🎉 15% discount applied!</p>}
        </div>

        {/* CTA */}
        <div className={styles.ctaWrap}>
          <button className={styles.checkoutBtn} onClick={() => router.push("/confirmation")}>
            Proceed to checkout
          </button>
          <p className={styles.ctaNote}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            You won&apos;t be charged yet. Payment on next screen.
          </p>
        </div>
      </div>
    </div>
  );
}
