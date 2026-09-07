"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import AuthPanel from "../components/AuthPanel";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import LogoLoader from "../components/LogoLoader";


function formatCouponHeadline(c) {
  if (c.type === "percentage") return `Get ${c.value}% off`;
  return `Get £${c.value} off`;
}

export default function ReviewPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const isGymUser = user?.premiseType === "Gym";

  // ── Order from sessionStorage ──
  // Read after mount (not in a useState initializer) so the server-rendered
  // markup and the client's first hydration pass match — sessionStorage is
  // only available on the client, so reading it during render would make
  // the client's initial render diverge from what the server sent.
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let parsed = null;
    try { parsed = JSON.parse(sessionStorage.getItem("sk_order") || "null"); }
    catch { parsed = null; }
    setOrder(parsed);
    setItems(parsed?.items || []);

    // Auto-select plan and set start date based on order type
    if (parsed?.isWeeklySubscription === true) {
      setSelectedPlan("weekly");
      // Use the delivery date from order as start date
      if (parsed?.deliveryDate) {
        setStartDate(parsed.deliveryDate);
      }
    } else if (parsed?.isWeeklySubscription === false && parsed?.items?.length > 1) {
      setSelectedPlan("one-off");
      if (parsed?.deliveryDate) {
        setStartDate(parsed.deliveryDate);
      }
    } else {
      setSelectedPlan("one-time");
    }
  }, []);

  const removeItem = (i) => setItems(prev => prev.filter((_, idx) => idx !== i));

  // ── Promo ──
  const [promo, setPromo]                   = useState("");
  const [promoApplied, setPromoApplied]     = useState(false);
  const [promoDiscount, setPromoDiscount]   = useState(null); // { type, value, label }
  const [promoError, setPromoError]         = useState("");
  const [checking, setChecking]             = useState(false);
  const [promoOpen, setPromoOpen]           = useState(false);
  const [promoInput, setPromoInput]         = useState("");
  const [availableCodes, setAvailableCodes] = useState([]);
  const [expandedCoupons, setExpandedCoupons] = useState(new Set());

  const toggleCouponExpanded = (code) => {
    setExpandedCoupons(prev => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  };

  useEffect(() => {
    const wc = order?.workspaceCode || user?.workspaceCode || "";
    api.get(`/api/promo${wc ? `?workspaceCode=${encodeURIComponent(wc)}` : ""}`)
      .then(data => { if (data.promoCodes) setAvailableCodes(data.promoCodes); })
      .catch(() => {});
  }, [order, user]);

  const applyPromo = async (code) => {
    const val = (code || promoInput).trim().toUpperCase();
    if (!val) return;
    setChecking(true);
    setPromoError("");
    try {
      const data = await api.post("/api/promo/validate", {
        code: val,
        workspaceCode: order?.workspaceCode || user?.workspaceCode || "",
      });
      if (data.valid) {
        setPromo(val);
        setPromoDiscount(data.discount);
        setPromoApplied(true);
        setPromoOpen(false);
      } else {
        setPromoError(data.error || "Invalid or expired promo code");
        setPromoApplied(false);
      }
    } catch {
      setPromoError("Could not validate code. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  // ── Plan selection ──
  const [selectedPlan, setSelectedPlan] = useState("one-time");
  const [selectedPlanType, setSelectedPlanType] = useState("one-time");
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    const currentDay = today.getDay();
    const daysUntilNextMonday = currentDay === 0 ? 1 : currentDay === 1 ? 7 : (8 - currentDay);
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilNextMonday);
    return nextMonday.toISOString().split('T')[0];
  });
  const [selectedPattern, setSelectedPattern] = useState("");
  const [isRecurring, setIsRecurring] = useState(true);
  const [allPlansData, setAllPlansData] = useState([]);
  const [deliveryDates, setDeliveryDates] = useState([]);
  const [calculatedCharge, setCalculatedCharge] = useState(0);
  const [selectPlanLoading, setSelectPlanLoading] = useState(false);
  const [selectPlanError, setSelectPlanError] = useState("");
  const [oneOffPatterns, setOneOffPatterns] = useState([]);
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [checkoutSessionId, setCheckoutSessionId] = useState("");
  const [plans, setPlans] = useState({});

  // Fetch available plans from API and initialize plan selection
  useEffect(() => {
    api.get("/api/subscriptions/available-plans")
      .then(data => {
        const plansArray = data?.plans || data || [];
        const plansObj = {};
        if (Array.isArray(plansArray)) {
          plansArray.forEach(plan => {
            plansObj[plan._id] = { name: plan.name, type: plan.type };
          });
        }
        // Add one-time option
        plansObj["one-time"] = { name: "One-Time Order", type: "one-time" };
        setPlans(plansObj);
      })
      .catch(err => {
        console.error("Failed to fetch plans:", err);
        // Fallback to one-time only
        setPlans({ "one-time": { name: "One-Time Order" } });
      });

    // Load selected plan from sessionStorage (will be matched to plan ID after plans load)
    try {
      const stored = JSON.parse(sessionStorage.getItem("sk_order") || "null");
      if (stored?.selectedPlan) {
        sessionStorage.setItem("_tempSelectedPlan", stored.selectedPlan);
      }
      if (stored?.selectedPattern) {
        setSelectedPattern(stored.selectedPattern);
      }
    } catch {}
  }, []);

  // Auto-select plan based on sessionStorage after plans are loaded
  useEffect(() => {
    if (Object.keys(plans).length > 0) {
      // First try to use the specific plan ID if it was saved
      const tempPlanId = sessionStorage.getItem("_tempSelectedPlanId");
      if (tempPlanId && plans[tempPlanId]) {
        setSelectedPlan(tempPlanId);
        setSelectedPlanType(plans[tempPlanId].type);
        sessionStorage.removeItem("_tempSelectedPlanId");
      } else {
        // Fall back to type-based selection for backward compatibility
        const tempPlan = sessionStorage.getItem("_tempSelectedPlan");
        if (tempPlan) {
          // tempPlan is the type (e.g., "weekly", "one-off")
          // Find the plan with that type
          const matchingPlan = Object.entries(plans).find(([_, plan]) => plan.type === tempPlan);
          if (matchingPlan) {
            const [planId, plan] = matchingPlan;
            setSelectedPlan(planId);
            setSelectedPlanType(plan.type);
            sessionStorage.removeItem("_tempSelectedPlan");
          }
        }
      }
    }
  }, [plans]);

  // Calculate first delivery date based on pattern for one-off plans
  const getFirstDeliveryDate = () => {
    if (selectedPlanType === "one-off" && selectedPattern && allPlansData.length > 0) {
      // Find the pattern object
      const pattern = oneOffPatterns.find(p => p.id === selectedPattern);
      if (pattern && pattern.days && pattern.days.length > 0) {
        // Get the first day in the pattern
        const firstDay = pattern.days[0];
        const dayMap = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 };
        const targetDayOfWeek = dayMap[firstDay];

        // Calculate date for that day
        const today = new Date();
        const currentDay = today.getDay();
        const daysUntilNextMonday = currentDay === 0 ? 1 : currentDay === 1 ? 7 : (8 - currentDay);
        const nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() + daysUntilNextMonday);

        const dayOffset = (targetDayOfWeek === 0 ? 7 : targetDayOfWeek) - 1;
        const firstDeliveryDate = new Date(nextMonday);
        firstDeliveryDate.setDate(nextMonday.getDate() + dayOffset);

        return firstDeliveryDate.toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
    }
    // For weekly and one-time, use the startDate
    const startDateObj = new Date(startDate + "T00:00:00");
    return startDateObj.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Fetch plans and patterns on mount
  useEffect(() => {
    api.get("/api/subscriptions/available-plans")
      .then(data => {
        if (data.plans && Array.isArray(data.plans)) {
          setAllPlansData(data.plans);

          // Collect all patterns from all one-off plans by type
          const allPatterns = [];
          data.plans.forEach(p => {
            if (p.type === "one-off" && p.patterns && Array.isArray(p.patterns)) {
              allPatterns.push(...p.patterns);
            }
          });
          if (allPatterns.length > 0) {
            setOneOffPatterns(allPatterns);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Call select-plan endpoint when plan/date/pattern changes
  useEffect(() => {
    if (selectedPlanType === "one-time" || items.length === 0) {
      setDeliveryDates([]);
      setCalculatedCharge(0);
      return;
    }

    // For one-off, must have pattern selected
    if (selectedPlanType === "one-off" && !selectedPattern) {
      setSelectPlanError("Please select a delivery pattern");
      setDeliveryDates([]);
      setCalculatedCharge(0);
      return;
    }

    // Find the correct plan ID based on type and pattern
    let planId;
    if (selectedPlanType === "weekly") {
      const weeklyPlan = allPlansData.find(p => p.type === "weekly");
      planId = weeklyPlan?._id;
    } else if (selectedPlanType === "one-off") {
      // Find the plan that contains the selected pattern
      const oneOffPlan = allPlansData.find(p =>
        p.type === "one-off" &&
        p.patterns?.some(pat => pat.id === selectedPattern)
      );
      planId = oneOffPlan?._id;
    }

    if (!planId) {
      setSelectPlanError("Plan not found");
      return;
    }

    setSelectPlanLoading(true);
    setSelectPlanError("");

    // Send subscription details to backend
    api.post("/api/subscriptions/select-plan", {
      planId: planId,
      items: items.map(item => ({
        mealId: item.dishId,
        mealPrice: item.price,
        quantity: item.qty || 1,
      })),
      startDate: startDate,
      isRecurring: isRecurring,  // NEW: User's recurring choice
      ...(selectedPlanType === "one-off" && { patternId: selectedPattern }),
    })
      .then(data => {
        const charge = data.summary?.totalCharge || 0;
        // Stripe minimum for GBP is £0.30
        if (charge < 0.30) {
          setSelectPlanError(`Minimum charge is £0.30. Current charge is £${charge.toFixed(2)}. Try adding more servings or selecting a later start date.`);
          setDeliveryDates([]);
          setCalculatedCharge(0);
          setCheckoutUrl("");
          setCheckoutSessionId("");
        } else {
          setDeliveryDates(data.deliveryDates || []);
          setCalculatedCharge(charge);
          setCheckoutUrl(data.checkoutUrl || "");
          setCheckoutSessionId(data.checkoutSessionId || "");
          setSelectPlanError("");
        }
      })
      .catch(err => {
        setSelectPlanError(err.error || "Failed to calculate subscription");
        setDeliveryDates([]);
        setCalculatedCharge(0);
        setCheckoutUrl("");
        setCheckoutSessionId("");
      })
      .finally(() => setSelectPlanLoading(false));
  }, [selectedPlan, startDate, selectedPattern, items, allPlansData, isRecurring]);

  // ── Order submission ──
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const getAddonTotal = (item) => {
    return (item.addons || []).reduce((sum, addon) => {
      const addonPrice = typeof addon === "object" ? addon.price || 0 : 0;
      const addonQty = typeof addon === "object" ? addon.qty || 1 : 1;
      return sum + (addonPrice * addonQty);
    }, 0);
  };

  // Calculate subtotal and final total based on plan type
  const getDishSubtotal = () => items.reduce((s, i) => s + ((i.price || 0) * (i.qty || 1)) + getAddonTotal(i), 0);
  const dishSubtotal = getDishSubtotal();

  // For one-time orders, use dish subtotal; for subscriptions, use backend-calculated charge
  const getOrderPrice = () => {
    if (selectedPlanType === "one-time") {
      return dishSubtotal;
    }
    return calculatedCharge > 0 ? calculatedCharge : dishSubtotal;
  };

  const subtotal = getOrderPrice();
  const discount = promoApplied && promoDiscount
    ? promoDiscount.type === "percentage"
      ? subtotal * (promoDiscount.value / 100)
      : Math.min(promoDiscount.value, subtotal)
    : 0;
  const total = subtotal - discount;

  const MIN_QUANTITY = 1;
  const MAX_QUANTITY = 100;

  const handlePlaceOrder = async () => {
    if (!user) { setAuthOpen(true); return; }
    if (!order || items.length === 0) return;

    // For subscription orders, validate meal count (skip for gym users doing bulk orders)
    if (selectedPlanType === "weekly" && !isGymUser && items.length !== 5) {
      setSubmitError("Weekly plans require exactly 5 meals (one per weekday). Please select meals for all days.");
      return;
    }
    if (selectedPlanType === "one-off" && items.length < 1) {
      setSubmitError("Please select at least one meal for your order.");
      return;
    }

    // Validate quantity ranges
    for (const item of items) {
      const qty = item.qty || 1;
      if (qty < MIN_QUANTITY || qty > MAX_QUANTITY) {
        setSubmitError(`Each dish must be between ${MIN_QUANTITY} and ${MAX_QUANTITY} servings. ${item.dishName} has ${qty}.`);
        return;
      }
      if (Array.isArray(item.addons)) {
        for (const addon of item.addons) {
          const addonQty = typeof addon === "object" ? addon.qty : 1;
          if (addonQty < MIN_QUANTITY || addonQty > MAX_QUANTITY) {
            setSubmitError(`Each add-on must be between ${MIN_QUANTITY} and ${MAX_QUANTITY}. ${typeof addon === "object" ? addon.name : addon} has ${addonQty}.`);
            return;
          }
        }
      }
    }

    // Validate subscription charge meets Stripe minimum (£0.30 for GBP)
    if (selectedPlanType !== "one-time" && calculatedCharge < 0.30) {
      setSubmitError("Subscription charge is below minimum (£0.30). Please increase quantity or select a later start date.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      // Different endpoints for subscriptions vs one-time orders
      if (selectedPlanType === "one-time") {
        // One-time order via existing orders endpoint
        const data = await api.post("/api/orders", {
          workspaceCode:       order.workspaceCode || user.workspaceCode,
          deliveryDate:        order.deliveryDate,
          lunchTime:           order.lunchTime,
          planType:            "one-time",
          planPrice:           getOrderPrice(),
          ...(promoApplied && promo ? { promoCode: promo } : {}),
          items: items.map(item => ({
            dishId:      item.dishId,
            portionSize: item.portionSize || (item.portion === "large" ? "Large" : "Regular"),
            qty:         item.qty || 1,
            addons:  item.addons || [],
          })),
          useStripeCheckout: true,
        });
        handleOrderResponse(data);
      } else {
        // Subscription order - redirect to Stripe Checkout
        if (!checkoutUrl) {
          setSubmitError("Checkout URL not ready. Please refresh and try again.");
          setSubmitting(false);
          return;
        }

        // Clear order from sessionStorage before redirecting to Stripe
        sessionStorage.removeItem("sk_order");

        // Store order type and session ID for verification after payment
        sessionStorage.setItem("sk_order_type", "subscription");
        sessionStorage.setItem("sk_checkout_session_id", checkoutSessionId);

        // Redirect to Stripe Checkout
        window.location.href = checkoutUrl;
        return;
      }
    } catch (err) {
      setSubmitError(err.error || "Failed to place order. Please try again.");
      setSubmitting(false);
    }
  };

  const handleOrderResponse = async (data) => {
    const localItems = order?.items || [];
    const enrichItems = (apiItems) => (apiItems?.length ? apiItems : localItems).map(apiItem => {
      const local = localItems.find(li => String(li.dishId) === String(apiItem.dishId));
      return {
        dishId:      apiItem.dishId      || local?.dishId      || "",
        dishName:    apiItem.dishName    || local?.dishName    || "",
        portionSize: apiItem.portionSize || local?.portionSize || "",
        qty:         apiItem.qty         ?? local?.qty         ?? 1,
        addons:      apiItem.addons      || local?.addons      || [],
        price:       apiItem.price       ?? local?.price       ?? 0,
        img:         apiItem.img         || local?.img         || "",
        tags:        local?.tags         || [],
      };
    });

    sessionStorage.removeItem("sk_order");

    // Mark promo code as used if one was applied
    if (promoApplied && promo) {
      try {
        await api.post("/api/promo/mark-used", { code: promo });
      } catch (err) {
        console.error("Failed to mark promo as used:", err);
      }
    }

    if (data.checkoutUrl) {
      sessionStorage.setItem("sk_order_type", "one-time");
      sessionStorage.setItem("sk_pending_order", JSON.stringify({ items: localItems }));
      window.location.href = data.checkoutUrl;
      return;
    }

    // Order confirmed without Stripe
    sessionStorage.setItem("sk_confirmation", JSON.stringify({
      ...data.order,
      items: enrichItems(data.order.items),
    }));
    router.push("/confirmation");
    setSubmitting(false);
  };

  return (
    <>
    <div className={styles.root} suppressHydrationWarning>
      <Navbar onSignIn={() => setAuthOpen(true)} />

      <div className={styles.twoCol}>

        {/* ── Left: delivery info ── */}
        {items.length > 0 && (
        <div className={styles.addrPanel}>
          <div className={styles.deliveryInfo}>
            <p className={styles.sectionTitle} style={{ marginTop: 0 }}>Delivery address</p>

            <div className={styles.deliveryAddrCard}>
              <div className={styles.deliveryAddrCardTop}>
                <div className={styles.deliveryAddrCardIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                  </svg>
                </div>
                <span className={styles.deliveryAddrCardBadge}>Workspace</span>
              </div>
              <h2 className={styles.deliveryInfoCompany}>{user?.workspaceName || order?.workspaceCode || "Your workspace"}</h2>
              <div className={styles.deliveryAddrDivider} />
              <p className={styles.deliveryInfoAddr}>
                {[user?.workspaceAddress, user?.workspaceCity, user?.workspaceCounty, user?.workspacePostcode]
                  .filter(Boolean)
                  .join(", ") || user?.email}
              </p>
            </div>

            <p className={styles.sectionTitle}>Delivery date</p>
            <div className={styles.deliveryInfoEtaBadge}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {selectedPlanType === "one-off" ? getFirstDeliveryDate() : (order?.deliveryDateDisplay || order?.deliveryDate || "—")}
            </div>

            <p className={styles.sectionTitle}>Delivery time</p>
            <div className={styles.deliveryInfoEtaBadge}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {order?.lunchTime || "—"}
            </div>
          </div>
        </div>
        )}

        {/* ── Right: review order ── */}
        <div className={styles.main}>
          <div className={styles.mainInner}>
            <div className={styles.header}>
              <h1 className={styles.heading}>Review your order</h1>
            </div>

            {items.length === 0 ? (
              <div style={{ padding: "40px 0", textAlign: "center", opacity: 0.5 }}>
                <p>No items in your order. <Link href="/menu" className={styles.backToMenuLink}>Go back to menu →</Link></p>
              </div>
            ) : (
              <div className={styles.orderCard}>
                {items.map((item, i) => {
                  return (
                    <div key={i} className={styles.orderItem} style={{ animationDelay: (i * 0.1) + "s" }}>
                      <div className={styles.orderItemLeft}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {item.img && <img src={item.img} alt={item.dishName} className={styles.itemImg} />}
                        <div className={styles.itemInfo}>
                          <span className={styles.itemName}>{item.dishName}</span>
                          <span className={styles.portionTag}>{item.portionSize || item.portion} · x{item.qty}</span>
                          {item.addons?.length > 0 && (
                            <span className={styles.portionTag} style={{ opacity: 0.6 }}>
                              + {item.addons.map(a => typeof a === "string" ? a : `${a.name}${a.qty > 1 ? ` ×${a.qty}` : ""}`).join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={styles.orderItemRight}>
                        <span className={styles.itemPrice}>£{(((item.price || 0) * (item.qty || 1)) + getAddonTotal(item)).toFixed(2)}</span>
                        {selectedPlanType === "one-time" ? (
                          <button className={styles.removeItemBtn} onClick={() => removeItem(i)} aria-label="Remove">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                            </svg>
                          </button>
                        ) : (
                          <button
                            className={styles.removeItemBtn}
                            onClick={() => {
                              sessionStorage.setItem("sk_returning_from_checkout", "1");
                              router.push("/menu");
                            }}
                            aria-label="Edit"
                            title="Edit weekly meals"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div className={styles.divider} />
                <div className={styles.totals}>
                  <div className={styles.totalRow}>
                    <span className={styles.totalLabel}>Subtotal</span>
                    <span className={styles.totalVal}>£{subtotal.toFixed(2)}</span>
                  </div>
                  {promoApplied && promoDiscount && (
                    <div className={`${styles.totalRow} ${styles.discountRow}`}>
                      <span className={styles.totalLabel}>Discount ({promoDiscount.label})</span>
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
            )}

            {/* Promo */}
            {items.length > 0 && (
            <div
              className={`${styles.promoTrigger} ${items.length === 0 ? styles.promoTriggerDisabled : ""}`}
              role="button"
              tabIndex={items.length === 0 ? -1 : 0}
              aria-disabled={items.length === 0}
              onClick={() => { if (items.length === 0) return; setPromoOpen(true); setPromoInput(""); setPromoError(""); }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
              {promoApplied
                ? <span className={styles.promoTriggerApplied}>✓ {promo} applied — {promoDiscount?.label}!</span>
                : <span>Have a promo code?</span>}
              {promoApplied
                ? <button className={styles.promoRemoveBtn} onClick={e => { e.stopPropagation(); setPromoApplied(false); setPromo(""); setPromoDiscount(null); }}>Remove</button>
                : <span className={styles.promoTriggerArrow}>›</span>}
            </div>
            )}

            {promoOpen && (
              <div className={styles.promoOverlay} onClick={() => setPromoOpen(false)}>
                <div className={styles.promoModal} onClick={e => e.stopPropagation()}>
                  <div className={styles.promoModalHeader}>
                    <h3 className={styles.promoModalTitle}>Apply Coupon</h3>
                    <button className={styles.promoModalClose} onClick={() => setPromoOpen(false)}>✕</button>
                  </div>
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
                  {availableCodes.length > 0 && (
                    <>
                      <p className={styles.promoModalSectionLabel}>Available Coupons</p>
                      <div className={styles.promoModalList}>
                        {availableCodes.map(c => {
                          const expanded = expandedCoupons.has(c.code);
                          return (
                            <div key={c.code} className={styles.promoCouponCard}>
                              <div className={styles.promoCouponBadge}>
                                <span className={styles.promoCouponBadgeIcon}>🎟️</span>
                                {c.code}
                              </div>

                              <p className={styles.promoCouponHeadline}>{formatCouponHeadline(c)}</p>
                              <p className={styles.promoCouponSub}>
                                Use code <strong>{c.code}</strong> & {formatCouponHeadline(c).replace(/^Get /, "").toLowerCase()}
                              </p>

                              {c.description && (
                                <>
                                  <button
                                    type="button"
                                    className={styles.promoCouponMoreBtn}
                                    onClick={() => toggleCouponExpanded(c.code)}
                                  >
                                    {expanded ? "− Less" : "+ More"}
                                  </button>
                                  {expanded && (
                                    <div className={styles.promoCouponDesc}>
                                      {c.description.split("\n").map((line, i) => <p key={i}>{line}</p>)}
                                      {c.expiresAt && (
                                        <p className={styles.promoCouponExpiry}>
                                          Valid till {new Date(c.expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </>
                              )}

                              <button
                                className={styles.promoCouponApply}
                                onClick={() => { setPromoInput(c.code); applyPromo(c.code); }}
                              >
                                Apply Coupon
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Gym Bulk Order Info & Recurring Option — shown only for gym users */}
            {items.length > 0 && isGymUser && (
              <div style={{ marginBottom: "24px" }}>
                <div style={{ background: "#f0f9ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: 600, color: "#1e40af" }}>
                    Gym Bulk Order
                  </h3>
                  <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#1e3a8a", lineHeight: "1.5" }}>
                    Will be delivered to {user?.workspaceName}{user?.workspaceAddress ? ` at ${user.workspaceAddress}${user?.workspacePostcode ? `, ${user.workspacePostcode}` : ""}` : " at your workspace"}. Your meals will be labelled in the reception fridge.
                  </p>
                  <p style={{ margin: "0", fontSize: "14px", color: "#1e3a8a", lineHeight: "1.5" }}>
                    Delivery will be scheduled based on the kitchen's meal preparation schedule.
                  </p>
                </div>

                <div style={{ background: "#fef3c7", border: "1px solid #fcd34d", borderRadius: "12px", padding: "20px" }}>
                  <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: 600, color: "#92400e" }}>
                    Delivery frequency
                  </h3>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", flex: 1 }}>
                      <input
                        type="radio"
                        name="gym-frequency"
                        value="one-time"
                        checked={selectedPlan === "one-time"}
                        onChange={() => {
                          setSelectedPlan("one-time");
                          setSelectedPlanType("one-time");
                        }}
                        style={{ cursor: "pointer" }}
                      />
                      <span style={{ fontSize: "14px", fontWeight: 500, color: "#78350f" }}>One-Time Order</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", flex: 1 }}>
                      <input
                        type="radio"
                        name="gym-frequency"
                        value="weekly"
                        checked={selectedPlan === "weekly"}
                        onChange={() => {
                          setSelectedPlan("weekly");
                          setSelectedPlanType("weekly");
                        }}
                        style={{ cursor: "pointer" }}
                      />
                      <span style={{ fontSize: "14px", fontWeight: 500, color: "#78350f" }}>Weekly Recurring</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Plan Selection — hidden for gym users */}
            {items.length > 0 && !isGymUser && (
            <div className={styles.planSection}>
              <h3 className={styles.planSectionTitle}>Deliver as recurring meal plan? (optional)</h3>
              <div className={styles.plansGrid}>
                {Object.entries(plans).map(([key, plan]) => (
                  <label key={key} className={`${styles.planCard} ${selectedPlan === key ? styles.planCardSelected : ""} ${order ? styles.planCardDisabled : ""}`}>
                    <input
                      type="radio"
                      name="plan"
                      value={key}
                      checked={selectedPlan === key}
                      onChange={() => {
                        setSelectedPlan(key);
                        setSelectedPlanType(plans[key].type);
                        // Save plan ID to sessionStorage for next visit
                        sessionStorage.setItem("_tempSelectedPlanId", key);
                      }}
                      disabled={!!order}
                      className={styles.planRadio}
                    />
                    <div className={styles.planCardContent}>
                      <p className={styles.planCardName}>{plan.name}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Subscription Options */}
              {selectedPlanType !== "one-time" && (
                <div className={styles.subscriptionOptions}>
                  {selectedPlanType === "one-off" && (
                    <div className={styles.optionGroup}>
                      <label className={styles.optionLabel}>Delivery Pattern</label>
                      <select
                        value={selectedPattern}
                        onChange={(e) => setSelectedPattern(e.target.value)}
                        disabled={true}
                        className={styles.patternSelect}
                        style={{ opacity: 1, cursor: "default", backgroundColor: "#f5f5f0" }}
                      >
                        <option value="">Select a pattern...</option>
                        {oneOffPatterns.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.days.join(", ")})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Hidden Start Date - sent to backend but not shown in UI */}
              {selectedPlanType !== "one-time" && !startDate && (
                <input type="hidden" value={startDate} readOnly />
              )}

              {/* Delivery Dates Summary */}
              {selectedPlanType !== "one-time" && deliveryDates.length > 0 && (
                <div className={styles.deliverySummary}>
                  <p className={styles.deliveryTitle}>📅 Deliveries this week:</p>
                  <div className={styles.deliveryDatesList}>
                    {deliveryDates.map((date, idx) => (
                      <span key={idx} className={styles.deliveryDateBadge}>
                        {date.dayOfWeek} {new Date(date.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                      </span>
                    ))}
                  </div>
                  <p className={styles.chargeSummary}>
                    Charge: £{calculatedCharge.toFixed(2)}
                  </p>
                </div>
              )}

              {/* Recurring Payment Toggle */}
              {selectedPlanType !== "one-time" && (
                <div style={{
                  background: "#fafaf6",
                  border: "1.5px solid rgba(0,0,0,0.08)",
                  borderRadius: "12px",
                  padding: "16px",
                  marginTop: "16px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                    <div>
                      <p style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: "600", color: "#0a0a0a" }}>
                        Auto-Renew Subscription
                      </p>
                      <p style={{ margin: "0", fontSize: "12px", color: "rgba(10,10,10,0.5)" }}>
                        {isRecurring
                          ? "Will auto-charge every 7 days"
                          : "One-time payment only"}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsRecurring(!isRecurring)}
                      style={{
                        position: "relative",
                        width: "42px",
                        height: "24px",
                        borderRadius: "100px",
                        background: isRecurring ? "#0a0a0a" : "rgba(0,0,0,0.15)",
                        border: "none",
                        cursor: "pointer",
                        transition: "background 0.22s",
                        flexShrink: 0,
                        padding: 0
                      }}
                    >
                      <div style={{
                        position: "absolute",
                        top: "3px",
                        left: isRecurring ? "21px" : "3px",
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        background: "#fff",
                        transition: "transform 0.22s",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.2)"
                      }} />
                    </button>
                  </div>
                </div>
              )}

              {selectPlanError && (
                <p className={styles.planError}>{selectPlanError}</p>
              )}

              {selectPlanLoading && selectedPlanType !== "one-time" && (
                <p className={styles.planLoading}>Calculating delivery dates...</p>
              )}
            </div>
            )}

            {submitError && (
              <p style={{ color: "#c0392b", fontSize: 13, marginBottom: 12 }}>{submitError}</p>
            )}

            {items.length > 0 && (
            <div className={styles.ctaWrap}>
              <button
                className={styles.checkoutBtn}
                onClick={handlePlaceOrder}
                disabled={submitting || items.length === 0}
              >
                <span className={styles.checkoutBtnLeft}>
                  {submitting ? "Placing order…" : "Place order"}
                </span>
                <span className={styles.checkoutBtnPrice}>£{total.toFixed(2)}</span>
              </button>
            </div>
            )}

          </div>
        </div>
      </div>
    </div>
    {authOpen && <AuthPanel onClose={() => setAuthOpen(false)} />}
    </>
  );
}
