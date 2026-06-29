"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

const ORDER = [
  { day: "MONDAY",  name: "Roasted Miso Cod Bowl",    price: 12.50 },
  { day: "TUESDAY", name: "Gochujang Tofu Stir-fry",  price: 11.00 },
];

export default function CheckoutPage() {
  const [card, setCard]     = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [saveCard, setSave] = useState(false);
  const [method, setMethod] = useState("card"); // "apple"|"google"|"card"
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced]   = useState(false);
  const router = useRouter();
  const [errors, setErrors]   = useState({});

  const set = (k, v) => { setCard(c => ({ ...c, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const formatCard   = (v) => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const formatExpiry = (v) => { const d = v.replace(/\D/g,"").slice(0,4); return d.length > 2 ? d.slice(0,2)+"/"+d.slice(2) : d; };

  const subtotal = ORDER.reduce((s,i) => s+i.price, 0);
  const total    = subtotal;

  const validate = () => {
    const e = {};
    const raw = card.number.replace(/\s/g,"");
    if (raw.length < 16) e.number = "Enter 16-digit card number";
    if (!card.expiry || card.expiry.length < 5) e.expiry = "MM/YY required";
    if (!card.cvc || card.cvc.length < 3) e.cvc = "3-digit CVC";
    if (!card.name.trim()) e.name = "Name required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const placeOrder = () => {
    if (method === "card" && !validate()) return;
    setPlacing(true);
    setTimeout(() => { setPlacing(false); router.push("/confirmation"); }, 2000);
  };

  if (placed) return (
    <div className={styles.successRoot}>
      <div className={styles.successCard}>
        <div className={styles.successRing}>
          <div className={styles.successCheck}>✓</div>
        </div>
        <h2 className={styles.successTitle}>Order confirmed!</h2>
        <p className={styles.successDesc}>
          Your meals will be delivered to <strong>Culinary Logistics Hub</strong>.<br/>
          You&apos;ll receive a confirmation email shortly.
        </p>
        <div className={styles.successItems}>
          {ORDER.map(o => (
            <div key={o.day} className={styles.successItem}>
              <span className={styles.successDay}>{o.day}</span>
              <span className={styles.successName}>{o.name}</span>
              <span className={styles.successPrice}>£{o.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <Link href="/" className={styles.successBtn}>Back to home</Link>
      </div>
    </div>
  );

  return (
    <div className={styles.root}>
      {/* ── Navbar ── */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Subtle Kitchen" className={styles.logo} />
        </Link>
        <div className={styles.navLinks}>
          <a href="#" className={styles.navLink}>Kitchens</a>
          <a href="#" className={styles.navLink}>Orders</a>
          <a href="#" className={styles.navLink}>Inventory</a>
        </div>
        <div className={styles.navIcons}>
          <button className={styles.navIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </button>
          <button className={styles.navIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        </div>
      </nav>

      <div className={styles.main}>
        {/* ── LEFT ── */}
        <div className={styles.left}>
          <h1 className={styles.heading}>Complete your order</h1>

          {/* Address card */}
          <div className={styles.addressCard}>
            <div className={styles.addressTop}>
              <div className={styles.addressLeft}>
                <span className={styles.addressLabel}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  DELIVERING TO
                </span>
                <p className={styles.addressName}>Culinary Logistics Hub</p>
                <p className={styles.addressDetail}>124 Baker Street, Marylebone</p>
                <p className={styles.addressDetail}>London NW1 6XE, UK</p>
              </div>
              <div className={styles.addressRight}>
                <span className={styles.confirmedBadge}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  Address confirmed
                </span>
                <a href="#" className={styles.changeLink}>Change</a>
              </div>
            </div>
          </div>

          {/* Payment section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Payment</h2>

            {/* Express pay */}
            <div className={styles.expressBtns}>
              <button
                className={`${styles.expressBtn} ${styles.appleBtn} ${method === "apple" ? styles.expressBtnActive : ""}`}
                onClick={() => setMethod("apple")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.18 1.27-2.16 3.79.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.37 2.79M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                Apple Pay
              </button>
              <button
                className={`${styles.expressBtn} ${styles.googleBtn} ${method === "google" ? styles.expressBtnActive : ""}`}
                onClick={() => setMethod("google")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google Pay
              </button>
            </div>

            <div className={styles.cardDivider}><span>OR PAY BY CARD</span></div>

            {/* Card fields */}
            <div className={styles.cardFields}>
              <div className={styles.cardField}>
                <div className={styles.cardInputWrap}>
                  <input
                    className={`${styles.cardInput} ${errors.number ? styles.cardInputErr : ""}`}
                    placeholder="Card number"
                    value={card.number}
                    onChange={e => set("number", formatCard(e.target.value))}
                    inputMode="numeric"
                  />
                  <svg className={styles.cardIcon} width="22" height="16" viewBox="0 0 38 24" fill="none"><rect width="38" height="24" rx="4" fill="#E8E8E8"/><rect y="6" width="38" height="6" fill="#CCC"/><rect x="4" y="16" width="10" height="4" rx="1" fill="#999"/></svg>
                </div>
                {errors.number && <span className={styles.fieldErr}>{errors.number}</span>}
              </div>

              <div className={styles.cardRow}>
                <div className={styles.cardField}>
                  <input className={`${styles.cardInput} ${errors.expiry ? styles.cardInputErr : ""}`} placeholder="MM / YY" value={card.expiry} onChange={e => set("expiry", formatExpiry(e.target.value))} inputMode="numeric" />
                  {errors.expiry && <span className={styles.fieldErr}>{errors.expiry}</span>}
                </div>
                <div className={styles.cardField}>
                  <input className={`${styles.cardInput} ${errors.cvc ? styles.cardInputErr : ""}`} placeholder="CVC" value={card.cvc} onChange={e => set("cvc", e.target.value.replace(/\D/g,"").slice(0,3))} inputMode="numeric" />
                  {errors.cvc && <span className={styles.fieldErr}>{errors.cvc}</span>}
                </div>
              </div>

              <div className={styles.cardField}>
                <input className={`${styles.cardInput} ${errors.name ? styles.cardInputErr : ""}`} placeholder="Name on card" value={card.name} onChange={e => set("name", e.target.value)} />
                {errors.name && <span className={styles.fieldErr}>{errors.name}</span>}
              </div>

              <label className={styles.saveCard}>
                <div className={`${styles.checkbox} ${saveCard ? styles.checkboxOn : ""}`} onClick={() => setSave(s => !s)}>
                  {saveCard && <span className={styles.checkMark}>✓</span>}
                </div>
                <span>Save card for <span className={styles.futureAccent}>future</span> orders</span>
              </label>
            </div>

            {/* Place order */}
            <button className={`${styles.placeBtn} ${placing ? styles.placeBtnLoading : ""}`} onClick={placeOrder} disabled={placing}>
              {placing
                ? <><span className={styles.spinner} /> Processing...</>
                : `Place order · £${total.toFixed(2)}`
              }
            </button>

            {/* Security */}
            <div className={styles.secureWrap}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <a href="#" className={styles.secureLink}>Payments secured by Stripe</a>
            </div>

            {/* Card logos */}
            <div className={styles.cardLogos}>
              {["VISA", "MC", "AMEX"].map(l => (
                <div key={l} className={styles.cardLogo}>{l}</div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className={styles.sidebar}>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Order summary</h2>
            <div className={styles.summaryItems}>
              {ORDER.map(o => (
                <div key={o.day} className={styles.summaryItem}>
                  <div>
                    <p className={styles.summaryDay}>{o.day}</p>
                    <p className={styles.summaryName}>{o.name}</p>
                  </div>
                  <span className={styles.summaryPrice}>£{o.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className={styles.summaryDivider} />
            <div className={styles.summaryTotals}>
              <div className={styles.summaryRow}>
                <span>Delivery</span>
                <span className={styles.freeTag}>Free</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryGrand}`}>
                <span>Total</span>
                <span>£{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Repeat card */}
          <div className={styles.repeatCard}>
            <div className={styles.repeatIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff39a" strokeWidth="2.5" strokeLinecap="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </div>
            <div>
              <p className={styles.repeatTitle}>Repeats weekly</p>
              <p className={styles.repeatDesc}>Cancel anytime with one click.</p>
            </div>
          </div>

          {/* Food image */}
          <div className={styles.dishImgWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=85" alt="Chef's pick" className={styles.dishImg} />
            <span className={styles.chefPickBadge}>CHEF&apos;S PICK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
