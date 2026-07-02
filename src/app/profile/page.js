"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import Navbar from "../components/Navbar";
import AuthPanel from "../components/AuthPanel";
import { useAuth } from "../context/AuthContext";

function EditProfilePanel({ user, onClose }) {
  const [name,  setName]  = useState(user?.name  || user?.email?.split("@")[0] || "");
  const [email, setEmail] = useState(user?.email || "");
  const [editingName,  setEditingName]  = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [saved, setSaved] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 900);
  };

  return (
    <div className={styles.editOverlay}>
      <div className={styles.editPanel} ref={panelRef}>
        <div className={styles.editPanelHeader}>
          <button className={styles.editCloseBtn} onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <h2 className={styles.editPanelTitle}>Edit profile</h2>
        </div>

        <div className={styles.editFields}>
          {/* Name field */}
          <div className={styles.editField}>
            <span className={styles.editFieldLabel}>Name</span>
            {editingName ? (
              <div className={styles.editFieldInput}>
                <input
                  className={styles.editInput}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoFocus
                  placeholder="Your name"
                />
                <button className={styles.editSaveFieldBtn} onClick={() => setEditingName(false)}>Done</button>
              </div>
            ) : (
              <div className={styles.editFieldRow}>
                <span className={styles.editFieldValue}>{name || "—"}</span>
                <button className={styles.editChangeBtn} onClick={() => setEditingName(true)}>CHANGE</button>
              </div>
            )}
          </div>

          <div className={styles.editDivider} />

          {/* Email field */}
          <div className={styles.editField}>
            <span className={styles.editFieldLabel}>Email id</span>
            {editingEmail ? (
              <div className={styles.editFieldInput}>
                <input
                  className={styles.editInput}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoFocus
                  type="email"
                  placeholder="Your email"
                />
                <button className={styles.editSaveFieldBtn} onClick={() => setEditingEmail(false)}>Done</button>
              </div>
            ) : (
              <div className={styles.editFieldRow}>
                <span className={styles.editFieldValue}>{email || "—"}</span>
                <button className={styles.editChangeBtn} onClick={() => setEditingEmail(true)}>CHANGE</button>
              </div>
            )}
          </div>
        </div>

        <button className={`${styles.editSubmitBtn} ${saved ? styles.editSubmitBtnSaved : ""}`} onClick={handleSave}>
          {saved ? "Saved ✓" : "Save changes"}
        </button>
      </div>
    </div>
  );
}

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
  return (
    <div className={styles.panel}>
      <h2 className={styles.panelHeading}>Past Orders</h2>
      {PAST_ORDERS.length === 0 ? (
        <div className={styles.emptyOrders}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.25 }}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <p>No orders yet. <Link href="/menu" className={styles.emptyLink}>Start ordering →</Link></p>
        </div>
      ) : (
        <div className={styles.orderScroll}>
        <div className={styles.orderList}>
          {PAST_ORDERS.map((order, i) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderCardTop}>
                <div className={styles.orderImgStack}>
                  {order.items.slice(0, 2).map((item, j) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={j} src={item.img} alt={item.name} className={styles.orderThumb} style={{ zIndex: order.items.length - j, marginLeft: j > 0 ? -12 : 0 }} />
                  ))}
                </div>
                <div className={styles.orderCardInfo}>
                  <div className={styles.orderCardMeta}>
                    <span className={styles.orderDate}>{order.date}</span>
                    <span className={styles.orderStatusBadge}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      {order.status}
                    </span>
                  </div>
                  <p className={styles.orderId}>ORDER #{order.id}</p>
                  <button className={styles.viewDetailsBtn} onClick={() => setExpanded(expanded === i ? null : i)}>
                    {expanded === i ? "Hide details" : "View details"}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      {expanded === i ? <path d="M18 15l-6-6-6 6"/> : <path d="M6 9l6 6 6-6"/>}
                    </svg>
                  </button>
                </div>
                <div className={styles.orderCardRight}>
                  <span className={styles.orderTotal}>£{order.total.toFixed(2)}</span>
                </div>
              </div>

              {expanded === i && (
                <div className={styles.orderDetails}>
                  {order.items.map((item, j) => (
                    <div key={j} className={styles.orderDetailItem}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.img} alt={item.name} className={styles.orderDetailImg} />
                      <span className={styles.orderDetailName}>{item.name}</span>
                      <span className={styles.orderDetailPortion}>{item.portion}</span>
                      <span className={styles.orderDetailQty}>x{item.qty}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.orderCardActions}>
                <Link href="/menu" className={styles.reorderBtn}>Reorder</Link>
              </div>
            </div>
          ))}
        </div>
        </div>
      )}
    </div>
  );
}

function SettingsPanel({ user }) {
  const [marketing, setMarketing] = useState(true);

  return (
    <div className={styles.panel}>
      <h2 className={styles.panelHeading}>Email Preferences</h2>

      <div className={styles.prefGroup}>
        <div className={styles.prefItem}>
          <div className={styles.prefItemLeft}>
            <span className={styles.prefTitle}>Recommendations & offers</span>
            <span className={styles.prefDesc}>New menu drops, personalised picks, and exclusive deals.</span>
          </div>
          <button
            className={`${styles.toggle} ${marketing ? styles.toggleOn : ""}`}
            onClick={() => setMarketing(v => !v)}
            aria-checked={marketing}
            role="switch"
          >
            <div className={styles.toggleKnob} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [tab, setTab]           = useState("orders");
  const [authOpen, setAuthOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const NAV_TABS = [
    {
      id: "orders", label: "Orders",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>,
    },
    {
      id: "settings", label: "Settings",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    },
  ];

  const displayName  = user?.name  || user?.email?.split("@")[0] || "Account";
  const displayEmail = user?.email || "";

  return (
    <>
    <div className={styles.root}>
      <Navbar onSignIn={() => setAuthOpen(true)} />

      {/* ── Yellow banner (Swiggy-style) ── */}
      <div className={styles.profileBanner}>
        <div className={styles.profileBannerInner}>
          <div>
            <h1 className={styles.profileName}>{displayName}</h1>
            <p className={styles.profileMeta}>
              {displayEmail}
              {user?.companyCode && (
                <><span className={styles.metaDot}>·</span>{user.companyCode}</>
              )}
            </p>
          </div>
          <div className={styles.workspaceCodeBlock}>
            <span className={styles.workspaceCodeLabel}>Workspace Code</span>
            <span className={styles.workspaceCodeValue}>{user?.companyCode || "SK-2024-ARPIT"}</span>
          </div>
        </div>
      </div>

      {/* ── White body card ── */}
      <div className={styles.bodyOuter}>
        <div className={styles.bodyCard}>

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
            {tab === "orders"   && <OrdersPanel />}
            {tab === "settings" && <SettingsPanel user={user} />}
          </main>

        </div>
      </div>
    </div>
    {authOpen && <AuthPanel onClose={() => setAuthOpen(false)} />}
    {editOpen && <EditProfilePanel user={user} onClose={() => setEditOpen(false)} />}
    </>
  );
}
