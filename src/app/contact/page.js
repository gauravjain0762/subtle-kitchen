"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import AuthPanel from "../components/AuthPanel";
import styles from "./page.module.css";

export default function ContactPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", subject: "", message: "",
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <div className={styles.root}>
        <Navbar onSignIn={() => setAuthOpen(true)} />

        <div className={styles.page}>
          {/* ── Left ── */}
          <div className={styles.left}>
            <span className={styles.eyebrow}>GET IN TOUCH</span>
            <h1 className={styles.heading}>
              Let&apos;s Talk About<br />
              <span className={styles.accent}>Your Workplace Lunch</span>
            </h1>
            <p className={styles.sub}>
              Have a question, want to set up delivery, or need a custom plan for your team? We&apos;re here to help.
            </p>

            {sent ? (
              <div className={styles.successBox}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff39a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <div>
                  <p className={styles.successTitle}>Message sent!</p>
                  <p className={styles.successSub}>We&apos;ll get back to you within 1–2 business days.</p>
                </div>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.row2}>
                  <div className={styles.field}>
                    <input
                      className={styles.input}
                      placeholder="Full Name"
                      value={form.name}
                      onChange={e => set("name", e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <input
                      className={styles.input}
                      type="email"
                      placeholder="Email Address"
                      value={form.email}
                      onChange={e => set("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <input
                    className={styles.input}
                    type="tel"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={e => set("phone", e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <select
                    className={`${styles.input} ${styles.select}`}
                    value={form.subject}
                    onChange={e => set("subject", e.target.value)}
                    required
                  >
                    <option value="">Select a topic</option>
                    <option value="office">Office</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="factory">Factory</option>
                    <option value="garage">Garage</option>
                    <option value="workshop">Workshop</option>
                    <option value="depot">Depot</option>
                    <option value="construction">Construction site office</option>
                    <option value="industrial">Industrial unit</option>
                    <option value="business-park">Business park</option>
                    <option value="call-centre">Call centre</option>
                    <option value="clinic">Clinic</option>
                    <option value="school">School</option>
                    <option value="college">College</option>
                    <option value="gym">Gym</option>
                    <option value="studio">Commercial studio</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder="Your message…"
                    value={form.message}
                    onChange={e => set("message", e.target.value)}
                    rows={5}
                    required
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* ── Right ── */}
          <div className={styles.right}>
            <div className={styles.card}>
              <span className={styles.cardLabel}>OFFICE</span>
              <p className={styles.cardText}>
                Subtle Kitchen HQ<br />
                123 Food Street, Canary Wharf<br />
                London, E14 5AB<br />
                United Kingdom
              </p>
            </div>

            <div className={styles.card}>
              <span className={styles.cardLabel}>EMAIL US</span>
              <a href="mailto:hello@subtlekitchen.co.uk" className={styles.cardLink}>
                hello@subtlekitchen.co.uk
              </a>
            </div>

            <div className={`${styles.card} ${styles.cardHighlight}`}>
              <span className={styles.cardLabel}>CALL US</span>
              <a href="tel:+441234567890" className={styles.cardLink}>
                +44 12 3456 7890
              </a>
            </div>

            <div className={styles.card}>
              <span className={styles.cardLabel}>DELIVERY HOURS</span>
              <p className={styles.cardText}>
                Monday – Friday<br />
                11:00 AM – 2:00 PM<br />
                <span className={styles.cardNote}>Order by 10 PM the night before</span>
              </p>
            </div>

            <div className={styles.quickLinks}>
              <Link href="/get-workspace-code" className={styles.quickBtn}>Get workspace code →</Link>
              <Link href="/menu" className={styles.quickBtn}>View this week&apos;s menu →</Link>
            </div>
          </div>
        </div>
      </div>
      {authOpen && <AuthPanel onClose={() => setAuthOpen(false)} />}
    </>
  );
}
