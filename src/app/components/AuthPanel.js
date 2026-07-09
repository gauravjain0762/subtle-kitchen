"use client";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import styles from "./AuthPanel.module.css";

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.3 21.3 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a21.3 21.3 0 0 1-4.22 5.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function AuthPanel({ onClose }) {
  const [mode, setMode]   = useState("signin"); // "signin" | "signup"
  const [step, setStep]   = useState("form");   // "form" | "success"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm]   = useState({
    firstName: "", lastName: "", email: "", workspaceCode: "", password: "", confirmPassword: "",
  });
  const { login } = useAuth();

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(""); };

  const switchMode = (m) => { setMode(m); setStep("form"); setError(""); };

  const validate = () => {
    if (mode === "signup") {
      if (!form.firstName.trim())     { setError("First name is required"); return false; }
      if (!form.lastName.trim())      { setError("Last name is required"); return false; }
      if (!form.workspaceCode.trim()) { setError("Workspace code is required"); return false; }
    }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      setError("Enter a valid email address"); return false;
    }
    if (mode === "signup") {
      if (!form.password || form.password.length < 6) { setError("Password must be at least 6 characters"); return false; }
      if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return false; }
    } else {
      if (!form.password) { setError("Password is required"); return false; }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError("");
    try {
      if (mode === "signup") {
        const data = await api.post("/api/auth/register", {
          firstName:       form.firstName.trim(),
          lastName:        form.lastName.trim(),
          email:           form.email.trim(),
          workspaceCode:   form.workspaceCode.trim().toUpperCase(),
          password:        form.password,
          confirmPassword: form.confirmPassword,
        });
        login(data.token, data.user);
        setStep("success");
      } else {
        const data = await api.post("/api/auth/login", { email: form.email.trim(), password: form.password });
        login(data.token, data.user);
        onClose();
      }
    } catch (err) {
      setError(err.error || "Something went wrong. Please try again.");
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
            <h2 className={styles.heading}>
              {step === "success"
                ? "You're all set!"
                : (mode === "signin" ? "Sign in" : "Create account")}
            </h2>
            {step === "form" && (
              <p className={styles.toggle}>
                {mode === "signin" ? "New here? " : "Already have an account? "}
                <button className={styles.toggleLink} onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}>
                  {mode === "signin" ? "Create an account" : "Sign in"}
                </button>
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
          <form className={styles.form} onSubmit={handleSubmit} noValidate>

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

            {mode === "signin" && (
              <div className={styles.field}>
                <label className={styles.label}>Password</label>
                <div className={styles.passWrap}>
                  <input
                    className={`${styles.input} ${error && !form.password ? styles.inputError : ""}`}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={e => set("password", e.target.value)}
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPassword(s => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>
            )}

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

            {mode === "signup" && (
              <>
                <div className={styles.field}>
                  <label className={styles.label}>Password</label>
                  <div className={styles.passWrap}>
                    <input
                      className={`${styles.input} ${error && !form.password ? styles.inputError : ""}`}
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 6 characters"
                      value={form.password}
                      onChange={e => set("password", e.target.value)}
                    />
                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() => setShowPassword(s => !s)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Confirm password</label>
                  <div className={styles.passWrap}>
                    <input
                      className={`${styles.input} ${error && !form.confirmPassword ? styles.inputError : ""}`}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repeat password"
                      value={form.confirmPassword}
                      onChange={e => set("confirmPassword", e.target.value)}
                    />
                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() => setShowConfirmPassword(s => !s)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      <EyeIcon open={showConfirmPassword} />
                    </button>
                  </div>
                </div>
              </>
            )}

            {error && <p className={styles.errorMsg}>{error}</p>}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading
                ? (mode === "signup" ? "Creating account…" : "Signing in…")
                : (mode === "signup" ? "Create account" : "Sign in")}
            </button>

            <p className={styles.terms}>
              By continuing, you agree to our{" "}
              <a href="#">Terms &amp; Conditions</a> &amp; <a href="#">Privacy Policy</a>
            </p>
          </form>
        )}

        {/* ── Success step ── */}
        {step === "success" && (
          <div className={styles.form}>
            <div className={styles.resetSuccess}>
              <div className={styles.resetSuccessIcon}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className={styles.resetSuccessTitle}>Account created</h3>
              <p className={styles.resetSuccessDesc}>
                Welcome, {form.firstName}! You&apos;re signed in and ready to go.
              </p>
            </div>
            <button type="button" className={styles.submitBtn} onClick={onClose}>
              Continue
            </button>
          </div>
        )}
      </div>
    </>
  );
}
