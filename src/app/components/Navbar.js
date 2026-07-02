"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { label: "How it works",              href: "/how-it-works" },
  { label: "Order now",                  href: "/menu" },
  { label: "Become a Delivery Location", href: "/for-businesses" },
  { label: "Pricing",                   href: "/#pricing" },
];

function ProfileMenu({ user, logout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      className={styles.profileWrap}
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className={styles.profileBtn} aria-label="Profile menu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" />
        </svg>
      </button>

      <div className={`${styles.dropdown} ${open ? styles.dropdownOpen : ""}`}>
        <div className={styles.dropdownUser}>
          <span className={styles.dropdownUserName}>{user?.name || user?.email || "Account"}</span>
          {user?.companyCode && <span className={styles.dropdownCompany}>{user.companyCode}</span>}
        </div>
        <div className={styles.dropdownDivider} />
        <Link href="/profile" className={styles.dropdownItem} onClick={() => setOpen(false)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          Profile
        </Link>
        <Link href="/orders" className={styles.dropdownItem} onClick={() => setOpen(false)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>
          Orders
        </Link>
        <div className={styles.dropdownDivider} />
        <button className={`${styles.dropdownItem} ${styles.dropdownLogout}`} onClick={() => { logout(); setOpen(false); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Log out
        </button>
      </div>
    </div>
  );
}

export default function Navbar({ onSignIn }) {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = user
    ? NAV_LINKS.filter(l => l.label !== "Become a Delivery Location")
    : NAV_LINKS;

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}>
      <div className={styles.navInner}>
        <Link href="/" className={styles.logoLink}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Subtle Kitchen" className={styles.logo} />
        </Link>

        <ul className={styles.navLinks}>
          {links.map(link => (
            <li key={link.label}>
              <Link href={link.href} className={styles.navLink}>{link.label}</Link>
            </li>
          ))}
        </ul>

        <div className={styles.navActions}>
          {user ? (
            <ProfileMenu user={user} logout={logout} />
          ) : (
            <button className={styles.signIn} onClick={onSignIn}>Sign in</button>
          )}
        </div>
      </div>
    </nav>
  );
}
