"use client";
import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import styles from "./AuthPanel.module.css";

function OtpInput({ value, onChange, digits = 4 }) {
  const refs = Array.from({ length: digits }, () => useRef());
  const arr  = value.split("").concat(Array(digits).fill("")).slice(0, digits);

  const handleKey = (i, e) => {
    if (e.key === "Backspace") {
      const next = arr.slice();
      if (next[i]) { next[i] = ""; onChange(next.join("")); }
      else if (i > 0) { next[i - 1] = ""; onChange(next.join("")); refs[i - 1].current?.focus(); }
      return;
    }
    if (e.key === "ArrowLeft"  && i > 0)          { refs[i - 1].current?.focus(); return; }
    if (e.key === "ArrowRight" && i < digits - 1) { refs[i + 1].current?.focus(); return; }
    if (!/^\d$/.test(e.key)) return;
    const next = arr.slice();
    next[i] = e.key;
    onChange(next.join(""));
    if (i < digits - 1) refs[i + 1].current?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, digits);
    if (pasted) { onChange(pasted.padEnd(digits, "").slice(0, digits)); refs[Math.min(pasted.length, digits - 1)].current?.focus(); }
    e.preventDefault();
  };

  return (
    <div className={styles.otpRow}>
      {arr.map((d, i) => (
        <input
          key={i}
          ref={refs[i]}
          className={`${styles.otpBox} ${d ? styles.otpBoxFilled : ""}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={() => {}}
          onKeyDown={e => handleKey(i, e)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}

export default function AuthPanel({ onClose }) {
  const [mode, setMode]   = useState("signin"); // "signin" | "signup"
  const [step, setStep]   = useState("form");   // "form" | "otp"
  const [otp, setOtp]     = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm]   = useState({
    firstName: "", lastName: "", email: "", workspaceCode: "",
  });
  const { login } = useAuth();

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(""); };

  const switchMode = (m) => { setMode(m); setStep("form"); setOtp(""); setError(""); };

  const validate = () => {
    if (mode === "signup") {
      if (!form.firstName.trim())     { setError("First name is required"); return false; }
      if (!form.lastName.trim())      { setError("Last name is required"); return false; }
      if (!form.workspaceCode.trim()) { setError("Workspace code is required"); return false; }
    }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      setError("Enter a valid email address"); return false;
    }
    return true;
  };

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError("");
    try {
      if (mode === "signup") {
        await api.post("/api/auth/register", {
          firstName:     form.firstName.trim(),
          lastName:      form.lastName.trim(),
          email:         form.email.trim(),
          workspaceCode: form.workspaceCode.trim().toUpperCase(),
        });
      } else {
        await api.post("/api/auth/send-otp", { email: form.email.trim() });
      }
      setStep("otp");
      setOtp("");
    } catch (err) {
      setError(err.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 4) { setError("Enter all 4 digits"); return; }
    setLoading(true);
    setError("");
    try {
      const data = await api.post("/api/auth/verify-otp", { email: form.email.trim(), otp });
      login(data.token, data.user);
      onClose();
    } catch (err) {
      setError(err.error || "Invalid or expired code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.panel}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className={styles.header}>
          <div className={styles.headerText}>
            {step === "otp" && (
              <button className={styles.backLink} onClick={() => { setStep("form"); setOtp(""); setError(""); }}>
                ← Back
              </button>
            )}
            <h2 className={styles.heading}>
              {step === "form"
                ? (mode === "signin" ? "Sign in" : "Create account")
                : "Check your email"}
            </h2>
            {step === "form" && (
              <p className={styles.toggle}>
                {mode === "signin" ? "New here? " : "Already have an account? "}
                <button className={styles.toggleLink} onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}>
                  {mode === "signin" ? "Create an account" : "Sign in"}
                </button>
              </p>
            )}
            {step === "otp" && (
              <p className={styles.toggle}>
                We sent a 4-digit code to <strong>{form.email}</strong>
              </p>
            )}
          </div>
          <div className={styles.foodImgWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=85"
              alt=""
              className={styles.foodImg}
            />
          </div>
        </div>

        {/* ── Form step ── */}
        {step === "form" && (
          <form className={styles.form} onSubmit={handleSendOtp} noValidate>

            {mode === "signup" && (
              <>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>First name</label>
                    <input
                      className={`${styles.input} ${error && !form.firstName ? styles.inputError : ""}`}
                      placeholder="Jane"
                      value={form.firstName}
                      onChange={e => set("firstName", e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Last name</label>
                    <input
                      className={`${styles.input} ${error && !form.lastName ? styles.inputError : ""}`}
                      placeholder="Smith"
                      value={form.lastName}
                      onChange={e => set("lastName", e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <div className={styles.field}>
              <label className={styles.label}>Work email</label>
              <input
                type="email"
                className={`${styles.input} ${error && !form.email ? styles.inputError : ""}`}
                placeholder="jane@company.com"
                value={form.email}
                onChange={e => set("email", e.target.value)}
              />
            </div>

            {mode === "signup" && (
              <div className={styles.field}>
                <label className={styles.label}>Workspace code</label>
                <input
                  className={`${styles.input} ${error && !form.workspaceCode ? styles.inputError : ""}`}
                  placeholder="e.g. ACME2024"
                  value={form.workspaceCode}
                  onChange={e => set("workspaceCode", e.target.value.toUpperCase())}
                />
              </div>
            )}

            {error && <p className={styles.errorMsg}>{error}</p>}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "Sending…" : "Send code"}
            </button>

            <p className={styles.terms}>
              By continuing, you agree to our{" "}
              <a href="#">Terms &amp; Conditions</a> &amp; <a href="#">Privacy Policy</a>
            </p>
          </form>
        )}

        {/* ── OTP step ── */}
        {step === "otp" && (
          <form className={styles.form} onSubmit={handleVerifyOtp} noValidate>
            <div className={styles.field}>
              <label className={styles.label}>4-digit code</label>
              <OtpInput digits={4} value={otp} onChange={v => { setOtp(v); setError(""); }} />
              {error && <p className={styles.errorMsg}>{error}</p>}
            </div>
            <button type="submit" className={styles.submitBtn} disabled={loading || otp.length < 4}>
              {loading ? "Verifying…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
            <p className={styles.resendRow}>
              Didn&apos;t receive it?{" "}
              <button type="button" className={styles.forgotLink} onClick={handleSendOtp} disabled={loading}>
                Resend code
              </button>
            </p>
          </form>
        )}
      </div>
    </>
  );
}
