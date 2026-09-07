"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Navbar from "../components/Navbar";
import AuthPanel from "../components/AuthPanel";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

const PAST_ORDERS = [
  {
    id: "SK-20260630-001",
    date: "Mon, 30 June 2026, 12:14 PM",
    status: "Delivered",
    items: [
      { name: "Chicken Katsu Curry", qty: 1, portion: "Large", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&q=80" },
      { name: "Mediterranean Salmon", qty: 1, portion: "Regular", img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=80&q=80" },
    ],
    total: 26.50,
  },
  {
    id: "SK-20260623-002",
    date: "Mon, 23 June 2026, 12:08 PM",
    status: "Delivered",
    items: [
      { name: "Korean BBQ Chicken", qty: 1, portion: "Regular", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&q=80" },
    ],
    total: 9.50,
  },
  {
    id: "SK-20260616-003",
    date: "Mon, 16 June 2026, 12:22 PM",
    status: "Delivered",
    items: [
      { name: "Butter Chicken & Rice", qty: 2, portion: "Regular", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=80&q=80" },
      { name: "Garlic Naan", qty: 2, portion: "Regular", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=80&q=80" },
    ],
    total: 31.00,
  },
  {
    id: "SK-20260609-004",
    date: "Mon, 9 June 2026, 12:05 PM",
    status: "Delivered",
    items: [
      { name: "Grilled Teriyaki Salmon", qty: 1, portion: "Large", img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=80&q=80" },
    ],
    total: 14.50,
  },
  {
    id: "SK-20260602-005",
    date: "Mon, 2 June 2026, 12:18 PM",
    status: "Delivered",
    items: [
      { name: "Paneer Tikka Masala", qty: 1, portion: "Regular", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=80&q=80" },
      { name: "Mango Lassi", qty: 1, portion: "Regular", img: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=80&q=80" },
    ],
    total: 18.00,
  },
];

function OrdersPanel() {
  const [expanded, setExpanded] = useState(null);
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const router = useRouter();

  useEffect(() => {
    api.get("/api/orders/my")
      .then(data => setOrders(data.orders || []))
      .catch(() => setError("Failed to load orders."))
      .finally(() => setLoading(false));
  }, []);


  const formatDate = (iso) =>
    new Date(iso).toLocaleString("en-GB", { weekday:"short", day:"numeric", month:"long", year:"numeric" });

  const formatOrderDate = (iso) =>
    new Date(iso).toLocaleString("en-GB", { weekday:"short", day:"numeric", month:"short", year:"numeric" });

  return (
    <div className={styles.panel}>
      <h2 className={styles.panelHeading}>Past Orders</h2>
      {loading ? (
        <div className={styles.emptyOrders}><p style={{ opacity: 0.5 }}>Loading orders…</p></div>
      ) : error ? (
        <div className={styles.emptyOrders}><p style={{ opacity: 0.5 }}>{error}</p></div>
      ) : orders.length === 0 ? (
        <div className={styles.emptyOrders}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.25 }}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <p>No orders yet. <Link href="/menu" className={styles.emptyLink}>Start ordering →</Link></p>
        </div>
      ) : (
        <div className={styles.orderScroll}>
          <div className={styles.orderList}>
            {orders.map((order, i) => (
              <div key={order._id} className={styles.orderCard}>
                <div className={`${styles.orderCardTop} ${expanded === i ? styles.orderCardTopExpanded : ""}`} onClick={() => setExpanded(expanded === i ? null : i)} style={{ cursor: 'pointer' }}>
                  <div className={styles.orderSummary}>
                    <div>
                      <p className={styles.orderId}>{order.orderNumber}</p>
                      <div style={{ fontSize: 13, marginTop: 4, opacity: 0.7 }}>
                        <div>Order Placed - {formatOrderDate(order.createdAt)}</div>
                        <div style={{ marginTop: "4px" }}>Order Delivery - {formatOrderDate(order.deliveryDate)}</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.orderCardRight}>
                    <span className={styles.orderTotal}>£{order.total.toFixed(2)}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 12, opacity: 0.6, transition: 'transform 0.2s' }}>
                      {expanded === i ? <path d="M18 15l-6-6-6 6"/> : <path d="M6 9l6 6 6-6"/>}
                    </svg>
                  </div>
                </div>

                {expanded === i && (
                  <div className={styles.orderDetails}>
                    {order.items.map((item, j) => (
                      <div key={j} className={styles.orderDetailItem}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.images?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&q=80"} alt={item.dishName} className={styles.orderDetailImg} />
                        <div className={styles.orderDetailInfo}>
                          <span className={styles.orderDetailName}>{item.dishName}</span>
                          {item.portionSize && <span className={styles.orderDetailPortion}>{item.portionSize}</span>}
                          <span className={styles.orderDetailPrice}>£{((item.unitPrice || 0) * (item.qty || 1)).toFixed(2)}</span>
                        </div>
                        <span className={styles.orderDetailQty}>x{item.qty}</span>
                        <span className={styles.orderItemStatus}>{order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Placed"}</span>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SubscriptionsPanel() {
  const [sub, setSub]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError]   = useState("");

  useEffect(() => {
    api.get("/api/subscriptions/my-plan")
      .then(data => {
        const sub = data.subscription;
        if (sub) {
          setSub({
            ...sub,
            mealName: sub.meal?.name,
            mealPrice: sub.mealPrice,
            planName: sub.plan?.name,
            planType: sub.plan?.type,
            activeDays: sub.pattern || [],
            nextDelivery: data.upcomingOrders?.[0]?.scheduledDate,
            nextBilling: sub.nextChargeDate,
            startedOn: sub.createdAt || new Date().toISOString(),
          });
        } else {
          setSub(null);
        }
        setError("");
      })
      .catch(() => setError("Failed to load subscription."))
      .finally(() => setLoading(false));
  }, []);

  const handlePauseResume = async () => {
    if (!sub) return;
    const action = sub.status === "paused" ? "resume" : "pause";
    setActionLoading(true);
    try {
      const data = await api.patch("/api/subscriptions/my", { action });
      setSub(s => ({ ...s, status: data.subscription.status }));
    } catch (err) {
      setError(err.error || "Failed to update subscription.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelPlan = async () => {
    if (!sub) return;
    if (!confirm("Are you sure? This will cancel your subscription.\n\nNote: The amount will not be refundable.")) return;

    setActionLoading(true);
    try {
      await api.delete("/api/subscriptions/my");
      setSub(null);
      setError("");
    } catch (err) {
      setError(err.error || "Failed to cancel subscription.");
    } finally {
      setActionLoading(false);
    }
  };

  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString("en-GB", { weekday:"short", day:"numeric", month:"long", year:"numeric" }) : "—";
  const paused = sub?.status === "paused";

  const getDayDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const daysUntilNextMonday = currentDay === 0 ? 1 : currentDay === 1 ? 7 : (8 - currentDay);
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilNextMonday);

    const dayOffsets = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4 };
    const dates = {};
    Object.entries(dayOffsets).forEach(([dayName, offset]) => {
      const date = new Date(nextMonday);
      date.setDate(nextMonday.getDate() + offset);
      const day = date.getDate();
      const month = date.toLocaleDateString("en-GB", { month: "short" });
      dates[dayName] = `${day} ${month}`;
    });
    return dates;
  };

  const dayDates = getDayDates();

  return (
    <div className={styles.panel}>
      <h2 className={styles.panelHeading}>Plans &amp; Subscriptions</h2>
      {loading ? (
        <p style={{ opacity: 0.5, padding: "20px 0" }}>Loading…</p>
      ) : error ? (
        <p style={{ opacity: 0.5, padding: "20px 0" }}>{error}</p>
      ) : !sub ? (
        <div className={styles.emptyOrders}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.25, marginBottom: "12px" }}><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          <p>You haven't subscribed to any plan yet. <Link href="/pricing" className={styles.emptyLink}>Browse plans →</Link></p>
        </div>
      ) : (
        <>
          {/* ── Active plan card ── */}
          <div className={styles.subCard}>
            <div className={styles.subCardHeader}>
              <div className={styles.subCardTitleRow}>
                <div>
                  <h3 className={styles.subCardPlan}>{sub.planName}</h3>
                </div>
                <span className={`${styles.subStatusBadge} ${paused ? styles.subStatusPaused : styles.subStatusActive}`}>
                  {paused ? (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  ) : (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  )}
                  {paused ? "Paused" : "Active"}
                </span>
              </div>
            </div>

            <div>
              <p className={styles.subDaysLabel}>Active week</p>
              <div className={styles.subDaysRow}>
                {["Mon","Tue","Wed","Thu","Fri"].map(d => {
                  const isActive = (sub.activeDays || []).includes(d);
                  return (
                    <div key={d} className={`${styles.subDay} ${isActive ? styles.subDayActive : ""}`}>
                      <span className={styles.subDayName}>{d}</span>
                      <span className={styles.subDayDate}>{dayDates[d]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.subInfoGrid}>
              <div className={styles.subInfoItem}>
                <div className={styles.subInfoLabelRow}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span className={styles.subInfoLabel}>Next billing</span>
                </div>
                <span className={styles.subInfoVal}>{paused ? "Paused" : fmtDate(sub.nextBilling)}</span>
              </div>
              <div className={styles.subInfoItem}>
                <div className={styles.subInfoLabelRow}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span className={styles.subInfoLabel}>Member since</span>
                </div>
                <span className={styles.subInfoVal}>{fmtDate(sub.startedOn)}</span>
              </div>
            </div>

            <div className={styles.subActions}>
              <button
                className={styles.subActionCancel}
                onClick={handleCancelPlan}
                disabled={actionLoading}
              >
                {actionLoading ? "Cancelling…" : "Cancel plan"}
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

function FavoritesPanel() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const router = useRouter();

  useEffect(() => {
    api.get("/api/favorites")
      .then(data => setFavorites(data.dishes || []))
      .catch(() => setError("Failed to load favorites."))
      .finally(() => setLoading(false));
  }, []);

  const removeFavorite = async (dishId) => {
    setFavorites(f => f.filter(d => (d.dishId || d._id) !== dishId));
    try { await api.delete(`/api/favorites/${dishId}`); } catch {}
  };

  const handleOrder = (fav) => {
    try {
      const reorderItems = JSON.parse(sessionStorage.getItem("reorder_items") || "[]");
      const dishName = fav.dishName || fav.name;
      const portionSize = fav.portionSize || "Regular";

      const existingIndex = reorderItems.findIndex(
        item => item.name === dishName && item.portion === portionSize
      );

      if (existingIndex !== -1) {
        reorderItems[existingIndex].qty = (reorderItems[existingIndex].qty || 1) + 1;
      } else {
        reorderItems.push({
          name: dishName,
          portion: portionSize,
          qty: 1
        });
      }

      sessionStorage.setItem("reorder_items", JSON.stringify(reorderItems));
    } catch (e) {
      console.error("Error adding to order:", e);
    }
    router.push("/menu");
  };

  return (
    <div className={styles.panel}>
      <h2 className={styles.panelHeading}>Favorites</h2>
      {loading ? (
        <div className={styles.emptyOrders}><p style={{ opacity: 0.5 }}>Loading favorites…</p></div>
      ) : error ? (
        <div className={styles.emptyOrders}><p style={{ opacity: 0.5 }}>{error}</p></div>
      ) : favorites.length === 0 ? (
        <div className={styles.emptyOrders}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.25 }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <p>No favorites yet. <Link href="/menu" className={styles.emptyLink}>Browse the menu →</Link></p>
        </div>
      ) : (
        <div className={styles.favScroll}>
          <div className={styles.favList}>
            {favorites.map((fav) => {
              const dishId = fav.dishId || fav._id;
              const name   = fav.dishName || fav.name;
              const img    = fav.img || fav.images?.[0];
              const category = fav.category || "";
              const price  = Number(fav.price) || 0;
              return (
                <div key={dishId} className={styles.favCardRow}>
                  <div className={styles.favCardImg}>
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={name} className={styles.favCardImgEl} />
                    ) : (
                      <div className={styles.favCardImgPlaceholder}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                      </div>
                    )}
                  </div>
                  <div className={styles.favCardInfo}>
                    <div className={styles.favCardTop}>
                      <div>
                        <p className={styles.favCardName}>{name}</p>
                        {category && <p className={styles.favCardCategory}>{category}</p>}
                      </div>
                      <span className={styles.favCardPrice}>£{price.toFixed(2)}</span>
                    </div>
                    <div className={styles.favCardActions}>
                      <button className={styles.reorderBtn} onClick={() => handleOrder(fav)}>Order now</button>
                      <button className={styles.favRemoveBtn} onClick={() => removeFavorite(dishId)} aria-label="Remove from favorites">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { user, ready } = useAuth();
  const [tab, setTab]           = useState("orders");
  const [authOpen, setAuthOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.push("/");
  }, [ready, user, router]);

  const NAV_TABS = [
    {
      id: "orders", label: "Orders",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>,
    },
    {
      id: "favorites", label: "Favorites",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    },
    {
      id: "subscriptions", label: "Plans & Subscriptions",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
    },
  ];

  const displayName  = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.name || user?.email?.split("@")[0] || "Account";
  const displayEmail = user?.email || "";
  const companyCode  = user?.workspaceCode || user?.companyCode || "";

  if (!ready || !user) return null;

  return (
    <>
    <div className={styles.root}>
      <Navbar onSignIn={() => setAuthOpen(true)} />

      {/* ── Profile header ── */}
      <div className={styles.profileHeader}>
        <div className={styles.profileHeaderInner}>
          <div className={styles.avatarCircle}>
            {(displayName)[0].toUpperCase()}
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.profileName}>{displayName}</h1>
            <div className={styles.profileMetas}>
              <span className={styles.profileMetaItem}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                {displayEmail}
              </span>
              <span className={styles.profileMetaDot} />
              <span className={styles.profileMetaItem}>
                <span className={styles.profileMetaKey}>Company code:</span>
                {companyCode}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Full-width body ── */}
      <div className={styles.body}>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          {NAV_TABS.map(t => (
            <button
              key={t.id}
              className={`${styles.sidebarItem} ${tab === t.id ? styles.sidebarItemActive : ""}`}
              onClick={() => setTab(t.id)}
            >
              <span className={styles.sidebarIconCircle}>{t.icon}</span>
              <span className={styles.sidebarLabel}>{t.label}</span>
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className={styles.content}>
          {tab === "orders"        && <OrdersPanel />}
          {tab === "favorites"     && <FavoritesPanel />}
          {tab === "subscriptions" && <SubscriptionsPanel />}
        </main>

      </div>
    </div>
    {authOpen && <AuthPanel onClose={() => setAuthOpen(false)} />}
    </>
  );
}
