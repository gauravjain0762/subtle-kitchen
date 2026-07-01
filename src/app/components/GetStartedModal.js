"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./GetStartedModal.module.css";

function generateCode(name) {
  const prefix = name.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 4).padEnd(4, "X");
  const num = Math.floor(1000 + Math.random() * 9000);
  return prefix + num;
}

const MOCK_COMPANY = {
  name: "Acme Corp",
  initial: "A",
  address: "12 Business Park, Canary Wharf",
  city: "London",
  postcode: "E14 5AB",
  delivery: "Free delivery · Weekdays 12 pm – 2 pm",
};

export default function GetStartedModal({ onClose }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [view, setView] = useState("code"); // "code" | "confirm"
  const router = useRouter();

  const handleContinue = () => {
    if (!code.trim()) { setError("Please enter your company code."); return; }
    setError("");
    setView("confirm");
  };

  const handleConfirm = () => {
    onClose();
    router.push("/menu");
  };

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* ── Step: Enter code ── */}
        {view === "code" && (
          <div className={styles.step}>
            <h2 className={styles.heading}>Enter your company code</h2>
            <p className={styles.subtext}>
              Your code links directly to your office delivery address.
            </p>
            <input
              type="text"
              placeholder="e.g. ACME2024"
              value={code}
              onChange={e => { setCode(e.target.value.toUpperCase()); setError(""); }}
              className={`${styles.input} ${error ? styles.inputError : ""}`}
              onKeyDown={e => e.key === "Enter" && handleContinue()}
              autoFocus
            />
            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.btnPrimary} onClick={handleContinue}>Continue</button>
          </div>
        )}

        {/* ── Step: Confirm office ── */}
        {view === "confirm" && (
          <div className={styles.step}>
            <h2 className={styles.heading}>Is this your office?</h2>
            <p className={styles.subtext}>We found your company linked to <span className={styles.accent}>{code}</span></p>

            <div className={styles.companyCard}>
              <div className={styles.companyRow}>
                <div className={styles.companyAvatar}>{MOCK_COMPANY.initial}</div>
                <div className={styles.companyInfo}>
                  <span className={styles.companyName}>{MOCK_COMPANY.name}</span>
                </div>
                <div className={styles.verifiedBadge}>
                  <span className={styles.verifiedDot} />VERIFIED
                </div>
              </div>
              <div className={styles.companyMeta}>
                <div className={styles.metaRow}>
                  <span className={styles.metaIcon}>📍</span>
                  <span className={styles.metaText}>{MOCK_COMPANY.address}, {MOCK_COMPANY.city} {MOCK_COMPANY.postcode}</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaIcon}>🚚</span>
                  <span className={styles.metaText}>{MOCK_COMPANY.delivery}</span>
                </div>
              </div>
            </div>

            <button className={styles.btnPrimary} onClick={handleConfirm}>Yes, that&apos;s my office</button>
            <button className={styles.btnGhost} onClick={() => setView("code")}>Try a different code</button>
          </div>
        )}
      </div>
    </div>
  );
}
