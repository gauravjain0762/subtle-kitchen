"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const ORDER_ITEMS = [
  { day: "Mon", date: "30", month: "Jun", label: "Monday Lunch",    name: "Chicken Teriyaki",    portion: "Regular", price: 8.50, img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&q=80" },
  { day: "Wed", date: "2",  month: "Jul", label: "Wednesday Lunch", name: "Mediterranean Salmon", portion: "Regular", price: 8.50, img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=80&q=80" },
];
const DELIVERY_DAYS = "Mon · Wed";
const ADDRESS = "Acme Corp · 12 Business Park, London";

const COUPONS = [
  { code: "SAVE15",    title: "15% off your order",    desc: "Save 15% on your total bill. Valid for all meals.",   savings: "Save £2.55+" },
  { code: "WELCOME10", title: "10% welcome discount",  desc: "For new subscribers. One-time use on first order.",   savings: "Save £1.70+" },
  { code: "LUNCH20",   title: "£2 off lunch orders",   desc: "Flat £2 off on any lunch order above £8.",            savings: "Save £2.00" },
];

export default function ReviewPage() {
  const router = useRouter();
  const [items, setItems] = useState(ORDER_ITEMS);
  const removeItem = (i) => setItems(prev => prev.filter((_, idx) => idx !== i));
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [checking, setChecking] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [payMethod, setPayMethod] = useState("");

  const subtotal = items.reduce((s, i) => s + i.price, 0);
  const discount = promoApplied ? subtotal * 0.15 : 0;
  const total = subtotal - discount;

  const applyPromo = (code) => {
    const val = (code || promoInput).trim().toUpperCase();
    if (!val) return;
    setPromo(val);
    setChecking(true);
    setTimeout(() => {
      if (val === "SAVE15") { setPromoApplied(true); setPromoError(""); setPromoOpen(false); }
      else { setPromoError("Invalid code. Try SAVE15."); setPromoApplied(false); }
      setChecking(false);
    }, 600);
  };

  return (
    <div className={styles.root}>
      {/* ── Navbar ── */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.logoLink}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Subtle Kitchen" className={styles.logo} />
        </Link>
        <div className={styles.navLinks}>
          {["How it works", "Menu", "For businesses", "Pricing"].map(l => (
            <Link key={l} href="/" className={styles.navLink}>{l}</Link>
          ))}
        </div>
        <div className={styles.navSpacer} />
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
          {items.map((item, i) => (
            <div key={i} className={styles.orderItem} style={{ animationDelay: (i * 0.1) + "s" }}>
              <div className={styles.orderItemLeft}>
                <div className={styles.dayBadge}>
                  <span className={styles.dayBadgeNum}>{item.date}</span>
                  <span className={styles.dayBadgeMon}>{item.month}</span>
                </div>
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
                <button className={styles.removeItemBtn} onClick={() => removeItem(i)} aria-label="Remove">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                </button>
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
            <div className={styles.weeklyInfo}>
              <p className={styles.weeklyTitle}>Weekly subscription active</p>
              <p className={styles.weeklyDesc}>These meals will repeat every week automatically.</p>
              <p className={styles.weeklyDays}>Your delivery days: <strong>{DELIVERY_DAYS}</strong></p>
            </div>
            <a href="#" className={styles.weeklyChange}>Change</a>
          </div>
        </div>

        {/* Promo code trigger */}
        <button className={styles.promoTrigger} onClick={() => { setPromoOpen(true); setPromoInput(""); setPromoError(""); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          {promoApplied ? <span className={styles.promoTriggerApplied}>✓ {promo} applied — 15% off!</span> : <span>Have a promo code?</span>}
          {promoApplied
            ? <button className={styles.promoRemoveBtn} onClick={e => { e.stopPropagation(); setPromoApplied(false); setPromo(""); }}>Remove</button>
            : <span className={styles.promoTriggerArrow}>›</span>
          }
        </button>

        {/* Promo modal */}
        {promoOpen && (
          <div className={styles.promoOverlay} onClick={() => setPromoOpen(false)}>
            <div className={styles.promoModal} onClick={e => e.stopPropagation()}>
              <div className={styles.promoModalHeader}>
                <h3 className={styles.promoModalTitle}>Apply Coupon</h3>
                <button className={styles.promoModalClose} onClick={() => setPromoOpen(false)}>✕</button>
              </div>

              {/* Manual input */}
              <div className={styles.promoModalInputRow}>
                <input
                  className={styles.promoModalInput}
                  placeholder="Enter coupon code"
                  value={promoInput}
                  onChange={e => { setPromoInput(e.target.value.toUpperCase()); setPromoError(""); }}
                  onKeyDown={e => e.key === "Enter" && applyPromo()}
                  autoFocus
                />
                <button className={styles.promoModalApplyBtn} onClick={() => applyPromo()} disabled={checking || !promoInput}>
                  {checking ? <span className={styles.spinner} /> : "Apply"}
                </button>
              </div>
              {promoError && <p className={styles.promoModalError}>{promoError}</p>}

              <p className={styles.promoModalSectionLabel}>Available Coupons</p>

              <div className={styles.promoModalList}>
                {COUPONS.map(c => (
                  <div key={c.code} className={styles.promoCouponCard}>
                    <div className={styles.promoCouponLeft}>
                      <div className={styles.promoCouponCode}>{c.code}</div>
                      <div className={styles.promoCouponTitle}>{c.title}</div>
                      <div className={styles.promoCouponDesc}>{c.desc}</div>
                      <div className={styles.promoCouponSavings}>{c.savings}</div>
                    </div>
                    <button className={styles.promoCouponApply} onClick={() => { setPromoInput(c.code); applyPromo(c.code); }}>
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Payment method */}
        <div className={styles.payCard}>
          <p className={styles.payLabel}>Pay with</p>
          {[
            { id: "apple", label: "Apple Pay", icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            )},
            { id: "google", label: "Google Pay", icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 10.4v3.2h4.57c-.19 1.07-.76 1.98-1.62 2.59v2.15h2.62c1.53-1.41 2.41-3.49 2.41-5.96 0-.57-.05-1.12-.14-1.65H12v-.33zM12 21c2.43 0 4.47-.8 5.96-2.18l-2.62-2.04c-.91.61-2.07.97-3.34.97-2.57 0-4.74-1.73-5.52-4.07H3.76v2.12C5.24 18.91 8.4 21 12 21zM6.48 13.68A5.5 5.5 0 0 1 6.18 12c0-.58.1-1.14.3-1.68V8.2H3.76A9 9 0 0 0 3 12c0 1.45.35 2.82.96 4.04l2.52-2.36zM12 6.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58C16.46 3.89 14.43 3 12 3 8.4 3 5.24 5.09 3.76 8.2l2.72 2.12C7.26 8.31 9.43 6.58 12 6.58z"/></svg>
            )},
          ].map(opt => (
            <label key={opt.id} className={`${styles.payOption} ${payMethod === opt.id ? styles.payOptionSelected : ""}`}>
              <input
                type="radio"
                name="payment"
                value={opt.id}
                checked={payMethod === opt.id}
                onChange={() => setPayMethod(opt.id)}
                className={styles.payRadio}
              />
              <span className={styles.payOptionIcon}>{opt.icon}</span>
              <span className={styles.payOptionLabel}>{opt.label}</span>
              <span className={`${styles.payRadioCustom} ${payMethod === opt.id ? styles.payRadioCustomOn : ""}`} />
            </label>
          ))}
        </div>

        {/* CTA */}
        <div className={styles.ctaWrap}>
          <button className={styles.checkoutBtn} onClick={() => router.push("/confirmation")}>
            {payMethod === "apple" && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            )}
            {payMethod === "google" && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 10.4v3.2h4.57c-.19 1.07-.76 1.98-1.62 2.59v2.15h2.62c1.53-1.41 2.41-3.49 2.41-5.96 0-.57-.05-1.12-.14-1.65H12v-.33zM12 21c2.43 0 4.47-.8 5.96-2.18l-2.62-2.04c-.91.61-2.07.97-3.34.97-2.57 0-4.74-1.73-5.52-4.07H3.76v2.12C5.24 18.91 8.4 21 12 21zM6.48 13.68A5.5 5.5 0 0 1 6.18 12c0-.58.1-1.14.3-1.68V8.2H3.76A9 9 0 0 0 3 12c0 1.45.35 2.82.96 4.04l2.52-2.36zM12 6.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58C16.46 3.89 14.43 3 12 3 8.4 3 5.24 5.09 3.76 8.2l2.72 2.12C7.26 8.31 9.43 6.58 12 6.58z"/></svg>
            )}
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
