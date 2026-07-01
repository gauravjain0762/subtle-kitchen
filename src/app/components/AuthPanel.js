"use client";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "./AuthPanel.module.css";

export default function AuthPanel({ onClose }) {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", companyCode: "", password: "", confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (mode === "signup") {
      if (!form.firstName.trim()) e.firstName = "Required";
      if (!form.lastName.trim()) e.lastName = "Required";
      if (!form.companyCode.trim()) e.companyCode = "Required";
      if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.password || form.password.length < 6) e.password = "Min 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const userData = {
        email: form.email,
        name: mode === "signup"
          ? `${form.firstName} ${form.lastName}`.trim()
          : form.email.split("@")[0],
        companyCode: form.companyCode || null,
      };
      login(userData);
      setLoading(false);
      onClose();
    }, 700);
  };

  const switchMode = () => {
    setMode(m => m === "signin" ? "signup" : "signin");
    setErrors({});
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
            <h2 className={styles.heading}>{mode === "signin" ? "Sign in" : "Create account"}</h2>
            <p className={styles.toggle}>
              {mode === "signin" ? "New here? " : "Already have an account? "}
              <button className={styles.toggleLink} onClick={switchMode}>
                {mode === "signin" ? "Create an account" : "Sign in"}
              </button>
            </p>
            <div className={styles.divider} />
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

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {mode === "signup" && (
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>First name</label>
                <input
                  className={`${styles.input} ${errors.firstName ? styles.inputError : ""}`}
                  placeholder="Jane"
                  value={form.firstName}
                  onChange={e => set("firstName", e.target.value)}
                />
                {errors.firstName && <p className={styles.errorMsg}>{errors.firstName}</p>}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Last name</label>
                <input
                  className={`${styles.input} ${errors.lastName ? styles.inputError : ""}`}
                  placeholder="Smith"
                  value={form.lastName}
                  onChange={e => set("lastName", e.target.value)}
                />
                {errors.lastName && <p className={styles.errorMsg}>{errors.lastName}</p>}
              </div>
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Work email</label>
            <input
              type="email"
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              placeholder="jane@company.com"
              value={form.email}
              onChange={e => set("email", e.target.value)}
              autoFocus={mode === "signin"}
            />
            {errors.email && <p className={styles.errorMsg}>{errors.email}</p>}
          </div>

          {mode === "signup" && (
            <div className={styles.field}>
              <label className={styles.label}>Company code</label>
              <input
                className={`${styles.input} ${errors.companyCode ? styles.inputError : ""}`}
                placeholder="e.g. ACME2024"
                value={form.companyCode}
                onChange={e => set("companyCode", e.target.value.toUpperCase())}
              />
              {errors.companyCode && <p className={styles.errorMsg}>{errors.companyCode}</p>}
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
              placeholder="Min 6 characters"
              value={form.password}
              onChange={e => set("password", e.target.value)}
            />
            {errors.password && <p className={styles.errorMsg}>{errors.password}</p>}
          </div>

          {mode === "signup" && (
            <div className={styles.field}>
              <label className={styles.label}>Confirm password</label>
              <input
                type="password"
                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={e => set("confirmPassword", e.target.value)}
              />
              {errors.confirmPassword && <p className={styles.errorMsg}>{errors.confirmPassword}</p>}
            </div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>

          <p className={styles.terms}>
            By continuing, you agree to our{" "}
            <a href="#">Terms &amp; Conditions</a> &amp; <a href="#">Privacy Policy</a>
          </p>
        </form>
      </div>
    </>
  );
}
