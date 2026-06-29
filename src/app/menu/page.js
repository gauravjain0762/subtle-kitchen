"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const WEEK = "30 Jun – 4 Jul 2025";
const COMPANY = "ACME2024";

// Day is closed if it's today AND current time is at or past 10:00 AM
const DAY_NUM = { MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5 };
function isClosed(day) {
  const now = new Date();
  return DAY_NUM[day] === now.getDay() && now.getHours() >= 10;
}

const MEALS = [
  {
    day: "MON", date: "30 Jun", name: "Chicken Katsu Curry", price: 8.50, closed: isClosed("MON"),
    desc: "Crispy golden panko-crusted chicken breast with house-made Japanese curry sauce, fragrant jasmine rice and pickled daikon radish.",
    kcal: 620, protein: 38, carbs: 72, fat: 18,
    tags: ["Chef's Pick", "High Protein"],
    allergens: "Gluten · Soy · Eggs",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=120&q=80",
    imgLarge: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=85",
    addons: [{ name: "Extra curry sauce", price: 0.50 }, { name: "Side salad", price: 1.00 }, { name: "Soft drink", price: 1.50 }],
  },
  {
    day: "TUE", date: "1 Jul", name: "Peri Peri Chicken Rice", price: 8.50, closed: isClosed("TUE"),
    desc: "Flame-grilled peri peri chicken thighs over saffron rice with roasted peppers, corn salsa and a cooling yoghurt drizzle.",
    kcal: 650, protein: 42, carbs: 68, fat: 16,
    tags: ["Spicy", "High Protein"],
    allergens: "Dairy · Gluten",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=120&q=80",
    imgLarge: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=85",
    addons: [{ name: "Extra peri sauce", price: 0.50 }, { name: "Side salad", price: 1.00 }, { name: "Garlic bread", price: 1.00 }, { name: "Soft drink", price: 1.50 }],
  },
  {
    day: "WED", date: "2 Jul", name: "Chicken Pasta", price: 8.00, closed: isClosed("WED"),
    desc: "Slow-cooked pulled chicken in a rich tomato and basil sauce, tossed with al dente penne, finished with fresh herbs and parmesan.",
    kcal: 580, protein: 35, carbs: 78, fat: 14,
    tags: ["Comfort Food"],
    allergens: "Gluten · Dairy · Eggs",
    img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=120&q=80",
    imgLarge: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=85",
    addons: [{ name: "Extra parmesan", price: 0.50 }, { name: "Garlic bread", price: 1.00 }, { name: "Side salad", price: 1.00 }, { name: "Soft drink", price: 1.50 }],
  },
  {
    day: "THU", date: "3 Jul", name: "Beef Burrito Bowl", price: 9.00, closed: isClosed("THU"),
    desc: "Seasoned ground beef, black beans, pico de gallo, corn, shredded cheddar and chipotle crema over cilantro-lime rice.",
    kcal: 710, protein: 45, carbs: 80, fat: 22,
    tags: ["Most Popular", "High Protein"],
    allergens: "Dairy · Gluten",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&q=80",
    imgLarge: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=85",
    addons: [{ name: "Guacamole", price: 1.00 }, { name: "Extra salsa", price: 0.50 }, { name: "Jalapeños", price: 0.50 }, { name: "Soft drink", price: 1.50 }],
  },
  {
    day: "FRI", date: "4 Jul", name: "Chicken Tikka Rice Bowl", price: 8.50, closed: isClosed("FRI"),
    desc: "Tandoor-marinated chicken tikka, basmati rice, cucumber raita, mango chutney and a sprinkle of toasted cumin seeds.",
    kcal: 640, protein: 42, carbs: 70, fat: 15,
    tags: ["Fan Favourite"],
    allergens: "Dairy · Gluten",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&q=80",
    imgLarge: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=85",
    addons: [{ name: "Extra raita", price: 0.50 }, { name: "Naan bread", price: 1.00 }, { name: "Mango lassi", price: 2.00 }, { name: "Soft drink", price: 1.50 }],
  },
];

export default function MenuPage() {
  const [selected, setSelected] = useState({});   // { dayIndex: true }
  const [portions, setPortions] = useState({});   // { dayIndex: "regular"|"large" }
  const [addons, setAddons] = useState({});        // { dayIndex: Set<string> }
  const [weekly, setWeekly] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");
  const router = useRouter();

  const setA = (k, v) => { setAuthForm(f => ({ ...f, [k]: v })); if (k === "email") { setOtpSent(false); setOtp(["","","",""]); setOtpError(""); } };

  const sendOtp = () => {
    if (!authForm.email || !/\S+@\S+\.\S+/.test(authForm.email)) { setAuthError("Enter a valid email first."); return; }
    setAuthError("");
    setOtpSending(true);
    setTimeout(() => { setOtpSending(false); setOtpSent(true); }, 1200);
  };

  const handleOtpInput = (val, i) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    setOtpError("");
    if (val && i < 3) document.getElementById(`otp-${i+1}`)?.focus();
  };

  const handleOtpKey = (e, i) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) document.getElementById(`otp-${i-1}`)?.focus();
  };

  const verifyOtp = () => {
    const code = otp.join("");
    if (code.length < 4) { setOtpError("Enter the 4-digit code."); return; }
    setOtpVerifying(true);
    setTimeout(() => { setOtpVerifying(false); setShowAuth(false); localStorage.setItem("sk_authed", "1"); router.push("/review"); }, 1200);
  };

  const handleAuth = (e) => {
    e.preventDefault();
    if (!authForm.email || !authForm.password) { setAuthError("Please fill in all fields."); return; }
    setAuthError("");
    setAuthLoading(true);
    setTimeout(() => { setAuthLoading(false); setShowAuth(false); localStorage.setItem("sk_authed", "1"); router.push("/review"); }, 1500);
  };
  const [detailIdx, setDetailIdx] = useState(null); // index of meal being viewed
  const [detailPortion, setDetailPortion] = useState("regular");
  const [detailAddons, setDetailAddons] = useState(new Set());

  const openDetail = (e, i) => { e.stopPropagation(); setDetailIdx(i); setDetailPortion(portions[i] || "regular"); setDetailAddons(new Set(addons[i] || [])); };
  const closeDetail = () => setDetailIdx(null);

  const toggleDetailAddon = (name) => setDetailAddons(prev => { const s = new Set(prev); s.has(name) ? s.delete(name) : s.add(name); return s; });

  const addToOrder = () => {
    const i = detailIdx;
    setSelected(s => ({ ...s, [i]: true }));
    setPortions(p => ({ ...p, [i]: detailPortion }));
    setAddons(a => ({ ...a, [i]: detailAddons }));
    closeDetail();
  };

  const detailMeal = detailIdx !== null ? MEALS[detailIdx] : null;
  const detailTotal = detailMeal ? detailMeal.price + (detailPortion === "large" ? 1.50 : 0) + [...detailAddons].reduce((s, n) => s + (detailMeal.addons.find(a => a.name === n)?.price || 0), 0) : 0;

  const toggleDay = (i) => {
    if (MEALS[i].closed) return;
    setSelected(s => {
      const next = { ...s };
      next[i] ? delete next[i] : (next[i] = true);
      return next;
    });
    if (!portions[i]) setPortions(p => ({ ...p, [i]: "regular" }));
  };

  const setPortion = (i, v) => setPortions(p => ({ ...p, [i]: v }));

  const toggleAddon = (i, name) => setAddons(a => { const s = new Set(a[i] || []); s.has(name) ? s.delete(name) : s.add(name); return { ...a, [i]: s }; });

  const getPrice = (i) => {
    const base = MEALS[i].price + (portions[i] === "large" ? 1.50 : 0);
    return base;
  };

  const orderItems = Object.keys(selected).map(i => ({
    i: +i,
    meal: MEALS[+i],
    price: getPrice(+i),
    portion: portions[+i] || "regular",
  }));

  const subtotal = orderItems.reduce((s, x) => s + x.price, 0);
  const total = subtotal;

  return (
    <div className={styles.root}>
      {/* ── Navbar ── */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.logoLink}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Subtle Kitchen" className={styles.logo} />
        </Link>
        <div className={styles.navCenter}>
          <span className={styles.weekBadge}>
            📅 Week of {WEEK}
          </span>
        </div>
        <div className={styles.navRight}>
          <span className={styles.companyBadge}>Company: {COMPANY}</span>
          <div className={styles.cartBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {orderItems.length > 0 && <span className={styles.cartCount}>{orderItems.length}</span>}
          </div>
        </div>
      </nav>

      {/* ── Main ── */}
      <div className={styles.main}>
        {/* Left: Menu list */}
        <div className={styles.menuList}>
          <div className={styles.menuListHeader}>
            <h1 className={styles.heading}>This week&apos;s menu</h1>
            <p className={styles.subtext}>Tick the days you want lunch. Tap any meal to see full details.</p>
          </div>

          <div className={styles.mealRows}>
            {MEALS.map((meal, i) => {
              const isSelected = !!selected[i];
              const isClosed = meal.closed;
              return (
                <div
                  key={i}
                  className={`${styles.mealRow} ${isSelected ? styles.mealRowSelected : ""} ${isClosed ? styles.mealRowClosed : ""}`}
                  style={{ animationDelay: (i * 0.08) + "s" }}
                >
                  {/* Row top */}
                  <div className={styles.mealRowTop} onClick={() => toggleDay(i)}>
                    {/* Checkbox */}
                    <div className={`${styles.checkbox} ${isSelected ? styles.checkboxChecked : ""} ${isClosed ? styles.checkboxDisabled : ""}`}>
                      {isSelected && <span className={styles.checkMark}>✓</span>}
                    </div>

                    {/* Day badge */}
                    <div className={`${styles.dayBadge} ${isSelected ? styles.dayBadgeActive : ""} ${isClosed ? styles.dayBadgeClosed : ""}`}>
                      <span className={styles.dayName}>{meal.day}</span>
                      <span className={styles.dayDate}>{meal.date.split(" ")[0]}</span>
                    </div>

                    {/* Image */}
                    <div className={styles.mealImgWrap}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={meal.img} alt={meal.name} className={styles.mealImg} />
                    </div>

                    {/* Info */}
                    <div className={styles.mealInfo}>
                      <span className={styles.mealName}>{meal.name}</span>
                      <div className={styles.mealMacros}>
                        <span className={styles.macroPill}>{meal.kcal} kcal</span>
                        <span className={styles.macroPill}>{meal.protein}g protein</span>
                      </div>
                      {isClosed && (
                        <div className={styles.closedNote}>
                          🔒 Order window closed · Must order before 10am
                        </div>
                      )}
                    </div>

                    {/* Price + view */}
                    <div className={styles.mealRight}>
                      <span className={styles.mealPrice}>£{meal.price.toFixed(2)}</span>
                      {!isClosed && (
                        <span className={styles.viewDetails} onClick={e => openDetail(e, i)}>
                          View details →
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expanded options */}
                  {isSelected && (
                    <div className={styles.mealExpanded}>
                      <div className={styles.expandedInner}>
                        {/* Portion */}
                        <div className={styles.optionGroup}>
                          <p className={styles.optionLabel}>Portion Size</p>
                          <div className={styles.optionBtns}>
                            <button
                              className={`${styles.optionBtn} ${portions[i] === "regular" ? styles.optionBtnActive : ""}`}
                              onClick={e => { e.stopPropagation(); setPortion(i, "regular"); }}
                            >Regular</button>
                            <button
                              className={`${styles.optionBtn} ${portions[i] === "large" ? styles.optionBtnActive : ""}`}
                              onClick={e => { e.stopPropagation(); setPortion(i, "large"); }}
                            >Large <span className={styles.optionExtra}>(+£1.50)</span></button>
                          </div>
                        </div>

                        {/* Add-ons */}
                        <div className={styles.optionGroup}>
                          <p className={styles.optionLabel}>Add-ons</p>
                          <div className={styles.addonBtns}>
                            {meal.addons.map(a => {
                              const active = addons[i]?.has(a.name);
                              return (
                                <button
                                  key={a.name}
                                  className={`${styles.addonBtn} ${active ? styles.addonBtnActive : ""}`}
                                  onClick={e => { e.stopPropagation(); toggleAddon(i, a.name); }}
                                >
                                  {active ? "✓ " : "+ "}{a.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Order summary */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <h2 className={styles.sidebarHeading}>Your order</h2>

            {orderItems.length === 0 ? (
              <div className={styles.emptyOrder}>
                <p className={styles.emptyText}>No meals selected yet.<br />Tick the days above to add meals.</p>
              </div>
            ) : (
              <div className={styles.orderList}>
                {orderItems.map(({ i, meal, price, portion }) => (
                  <div key={i} className={styles.orderItem}>
                    <div className={styles.orderItemLeft}>
                      <span className={styles.orderDay}>{meal.day}</span>
                      <div>
                        <p className={styles.orderItemName}>{meal.name}</p>
                        <p className={styles.orderItemPortion}>{portion.charAt(0).toUpperCase() + portion.slice(1)} portion</p>
                      </div>
                    </div>
                    <span className={styles.orderItemPrice}>£{price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.orderTotals}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Delivery</span>
                <span className={styles.freeTag}>FREE</span>
              </div>
              <div className={`${styles.totalRow} ${styles.totalFinal}`}>
                <span>Total</span>
                <span>£{total.toFixed(2)}</span>
              </div>
            </div>

            <button className={`${styles.reviewBtn} ${orderItems.length === 0 ? styles.reviewBtnDisabled : ""}`} disabled={orderItems.length === 0} onClick={() => orderItems.length > 0 && setShowAuth(true)}>
              Review order →
            </button>

            <button
              className={`${styles.weeklyToggle} ${weekly ? styles.weeklyToggleActive : ""}`}
              onClick={() => setWeekly(w => !w)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
              </svg>
              {weekly ? "✓ Weekly subscription active" : "Weekly subscription"}
            </button>

            <p className={styles.sidebarNote}>🔒 No charge yet. Pay at checkout.</p>
          </div>
        </div>
      </div>

      {/* ── Auth Modal ── */}
      {showAuth && (
        <div className={styles.authOverlay} onClick={e => e.target === e.currentTarget && setShowAuth(false)}>
          <div className={styles.authModal}>
            <button className={styles.authClose} onClick={() => setShowAuth(false)}>✕</button>

            <div className={styles.authTop}>
              <div className={styles.authLock}>🔒</div>
              <h2 className={styles.authTitle}>Sign in to continue</h2>
              <p className={styles.authSub}>Sign in or create an account to review and place your order.</p>
            </div>

            {/* Tabs */}
            <div className={styles.authTabs}>
              <button className={`${styles.authTab} ${authMode === "login" ? styles.authTabActive : ""}`} onClick={() => { setAuthMode("login"); setAuthError(""); }}>Sign in</button>
              <button className={`${styles.authTab} ${authMode === "signup" ? styles.authTabActive : ""}`} onClick={() => { setAuthMode("signup"); setAuthError(""); }}>Create account</button>
            </div>

            <form onSubmit={handleAuth} className={styles.authForm}>
              {authMode === "signup" && (
                <input className={styles.authInput} placeholder="Full name" value={authForm.name} onChange={e => setA("name", e.target.value)} />
              )}

              {/* Email row — Send OTP only in signup and only when email typed */}
              <div className={styles.emailRow}>
                <input
                  className={`${styles.authInput} ${styles.emailInput} ${otpSent ? styles.emailInputSent : ""}`}
                  type="email" placeholder="Work email"
                  value={authForm.email}
                  onChange={e => setA("email", e.target.value)}
                  autoFocus
                />
                {authMode === "signup" && authForm.email.trim() && (
                  <button
                    type="button"
                    className={`${styles.otpSendBtn} ${otpSent ? styles.otpSendBtnSent : ""} ${otpSending ? styles.otpSendBtnLoading : ""}`}
                    onClick={sendOtp}
                    disabled={otpSending || otpSent}
                  >
                    {otpSending ? <span className={styles.authSpinnerSm} /> : otpSent ? "✓ Sent" : "Send OTP"}
                  </button>
                )}
              </div>

              {/* OTP input slides down */}
              {otpSent && (
                <div className={styles.otpWrap}>
                  <p className={styles.otpHint}>
                    Enter the 4-digit code sent to <strong>{authForm.email}</strong>
                  </p>
                  <div className={styles.otpBoxes}>
                    {otp.map((v, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        className={`${styles.otpBox} ${otpError ? styles.otpBoxErr : ""}`}
                        type="text" inputMode="numeric"
                        maxLength={1} value={v}
                        onChange={e => handleOtpInput(e.target.value, i)}
                        onKeyDown={e => handleOtpKey(e, i)}
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>
                  {otpError && <p className={styles.otpError}>{otpError}</p>}
                  <button
                    type="button"
                    className={`${styles.authSubmit} ${otpVerifying ? styles.authSubmitLoading : ""}`}
                    onClick={verifyOtp}
                    disabled={otpVerifying}
                  >
                    {otpVerifying ? <span className={styles.authSpinner} /> : "Verify & continue →"}
                  </button>
                  <button type="button" className={styles.resendLink} onClick={() => { setOtp(["","","",""]); setOtpSent(false); setTimeout(sendOtp, 100); }}>
                    Resend code
                  </button>
                </div>
              )}

              {!otpSent && (
                <>
                  <input className={styles.authInput} type="password" placeholder="Password" value={authForm.password} onChange={e => setA("password", e.target.value)} />
                  {authError && <p className={styles.authError}>{authError}</p>}
                  <button type="submit" className={`${styles.authSubmit} ${authLoading ? styles.authSubmitLoading : ""}`} disabled={authLoading}>
                    {authLoading ? <span className={styles.authSpinner} /> : authMode === "login" ? "Sign in & review order →" : "Create account & continue →"}
                  </button>
                </>
              )}
            </form>

          </div>
        </div>
      )}

      {/* ── Dish Detail Modal ── */}
      {detailMeal && (
        <div className={styles.detailOverlay} onClick={e => e.target === e.currentTarget && closeDetail()}>
          <div className={styles.detailModal}>
            {/* Hero image */}
            <div className={styles.detailImgWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={detailMeal.imgLarge} alt={detailMeal.name} className={styles.detailImg} />
              <div className={styles.detailImgGradient} />
              <button className={styles.detailClose} onClick={closeDetail}>✕</button>
              <div className={styles.detailTags}>
                {detailMeal.tags.map(t => (
                  <span key={t} className={styles.detailTag}>{t}</span>
                ))}
              </div>
            </div>

            {/* Scrollable content */}
            <div className={styles.detailContent}>
              <div className={styles.detailHeader}>
                <div>
                  <h2 className={styles.detailName}>{detailMeal.name}</h2>
                  <p className={styles.detailDesc}>{detailMeal.desc}</p>
                </div>
                <span className={styles.detailPrice}>£{detailMeal.price.toFixed(2)}</span>
              </div>

              {/* Nutrition grid */}
              <div className={styles.nutritionGrid}>
                {[
                  { label: "Calories", val: detailMeal.kcal, unit: "kcal" },
                  { label: "Protein",  val: detailMeal.protein, unit: "g" },
                  { label: "Carbs",    val: detailMeal.carbs, unit: "g" },
                  { label: "Fat",      val: detailMeal.fat, unit: "g" },
                ].map(n => (
                  <div key={n.label} className={styles.nutritionCell}>
                    <span className={styles.nutritionVal}>{n.val}<small>{n.unit}</small></span>
                    <span className={styles.nutritionLabel}>{n.label}</span>
                  </div>
                ))}
              </div>

              <p className={styles.allergenNote}>⚠ Allergens: {detailMeal.allergens}</p>

              {/* Portion */}
              <div className={styles.detailSection}>
                <h3 className={styles.detailSectionTitle}>Portion Size</h3>
                <div className={styles.portionRow}>
                  {[
                    { id: "regular", label: "Regular", price: detailMeal.price },
                    { id: "large",   label: "Large",   price: detailMeal.price + 1.50, badge: "+£1.50" },
                  ].map(p => (
                    <button
                      key={p.id}
                      className={`${styles.portionCard2} ${detailPortion === p.id ? styles.portionCard2Active : ""}`}
                      onClick={() => setDetailPortion(p.id)}
                    >
                      <span className={styles.portionCard2Label}>{p.label}</span>
                      <span className={styles.portionCard2Price}>£{p.price.toFixed(2)}</span>
                      {p.badge && <span className={styles.portionBadge}>{p.badge}</span>}
                      {detailPortion === p.id && <span className={styles.portionTick2}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              <div className={styles.detailSection}>
                <h3 className={styles.detailSectionTitle}>Add-ons <span className={styles.optionalTag}>Optional</span></h3>
                <div className={styles.addonList}>
                  {detailMeal.addons.map(a => {
                    const active = detailAddons.has(a.name);
                    return (
                      <button
                        key={a.name}
                        className={`${styles.addonCard} ${active ? styles.addonCardActive : ""}`}
                        onClick={() => toggleDetailAddon(a.name)}
                      >
                        <div className={`${styles.addonCardCheck} ${active ? styles.addonCardCheckActive : ""}`}>
                          {active && "✓"}
                        </div>
                        <span className={styles.addonCardName}>{a.name}</span>
                        <span className={styles.addonCardPrice}>+£{a.price.toFixed(2)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sticky footer */}
            <div className={styles.detailFooter}>
              <div className={styles.detailTotal}>
                <span className={styles.detailTotalLabel}>Total</span>
                <span className={styles.detailTotalPrice}>£{detailTotal.toFixed(2)}</span>
              </div>
              <button className={styles.addToOrderBtn} onClick={addToOrder}>
                {selected[detailIdx] ? "Update order" : "Add to order"} →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
