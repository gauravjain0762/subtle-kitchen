"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import AuthPanel from "../components/AuthPanel";
import styles from "./page.module.css";

export default function PricingPage() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <div className={styles.root}>
        <Navbar onSignIn={() => setAuthOpen(true)} />
        <div className={styles.page}>
          <div className={styles.badge}>COMING SOON</div>
          <h1 className={styles.heading}>Pricing</h1>
          <p className={styles.sub}>
            We&apos;re putting together flexible plans for teams of all sizes.<br />
            Check back soon or get in touch to hear more.
          </p>
          <div className={styles.actions}>
            <Link href="/contact" className={styles.btnPrimary}>Contact us</Link>
            <Link href="/" className={styles.btnOutline}>Back to home</Link>
          </div>
        </div>
      </div>
      {authOpen && <AuthPanel onClose={() => setAuthOpen(false)} />}
    </>
  );
}
