"use client";
import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "./AuthPanel.module.css";

function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function PasswordInput({ value, onChange, placeholder, className, autoFocus, hasError }) {
  const [show, setShow] = useState(false);
  return (
    <div className={styles.passWrap}>
      <input
        type={show ? "text" : "password"}
        className={`${styles.input} ${hasError ? styles.inputError : ""} ${className || ""}`}
        placeholder={placeholder || "Min 6 characters"}
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
      />
      <button
        type="button"
        className={styles.eyeBtn}
        onClick={() => setShow(v => !v)}
        tabIndex={-1}
        aria-label={show ? "Hide password" : "Show password"}
      >
        <EyeIcon open={show} />
      </button>
    </div>
  );
}

function OtpInput({ value, onChange }) {
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const digits = value.split("").concat(Array(6).fill("")).slice(0, 6);

  const handleKey = (i, e) => {
    if (e.key === "Backspace") {
      const next = digits.slice();
      if (next[i]) { next[i] = ""; onChange(next.join("")); }
      else if (i > 0) { next[i - 1] = ""; onChange(next.join("")); refs[i - 1].current?.focus(); }
      return;
    }
    if (e.key === "ArrowLeft" && i > 0) { refs[i - 1].current?.focus(); return; }
    if (e.key === "ArrowRight" && i < 5) { refs[i + 1].current?.focus(); return; }
    if (!/^\d$/.test(e.key)) return;
    const next = digits.slice();
    next[i] = e.key;
    onChange(next.join(""));
    if (i < 5) refs[i + 1].current?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) { onChange(pasted.padEnd(6, "").slice(0, 6)); refs[Math.min(pasted.length, 5)].current?.focus(); }
    e.preventDefault();
  };

  return (
    <div className={styles.otpRow}>
      {digits.map((d, i) => (
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
          autoFocus={i === 0}
        />
      ))}
    </div>
  );
}

export default function AuthPanel({ onClose }) {
  const [mode, setMode] = useState("signin"); // "signin" | "signup" | "forgot"
  const [forgotStep, setForgotStep] = useState(1); // 1=email, 2=otp, 3=new password, 4=done
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
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

  // Forgot step handlers
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      setErrors({ email: "Valid email required" }); return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); setForgotStep(2); setOtp(""); }, 800);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.replace(/\D/g, "").length < 6) {
      setErrors({ otp: "Enter all 6 digits" }); return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); setForgotStep(3); setErrors({}); }, 700);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    const e2 = {};
    if (!newPass || newPass.length < 6) e2.newPass = "Min 6 characters";
    if (newPass !== confirmPass) e2.confirmPass = "Passwords don't match";
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setForgotStep(4); }, 800);
  };

  const goBackToSignIn = () => {
    setMode("signin"); setForgotStep(1); setOtp("");
    setNewPass(""); setConfirmPass(""); setErrors({});
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
            {mode === "forgot" && forgotStep < 4 && (
              <button className={styles.backLink} onClick={goBackToSignIn}>← Back to sign in</button>
            )}
            <h2 className={styles.heading}>
              {mode === "signin" ? "Sign in" : mode === "signup" ? "Create account"
                : forgotStep === 1 ? "Forgot password" : forgotStep === 2 ? "Enter OTP"
                : forgotStep === 3 ? "New password" : "Password reset!"}
            </h2>
            {mode !== "forgot" && (
              <p className={styles.toggle}>
                {mode === "signin" ? "New here? " : "Already have an account? "}
                <button className={styles.toggleLink} onClick={switchMode}>
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

        {/* ── Forgot password multi-step ── */}
        {mode === "forgot" && (
          <div className={styles.form}>

            {/* Step indicator */}
            {forgotStep < 4 && (
              <div className={styles.stepRow}>
                {[1,2,3].map(s => (
                  <div key={s} className={`${styles.stepDot} ${forgotStep >= s ? styles.stepDotActive : ""}`} />
                ))}
              </div>
            )}

            {/* Step 1 — Email */}
            {forgotStep === 1 && (
              <form onSubmit={handleSendOtp} noValidate style={{ display:"flex", flexDirection:"column", gap:20 }}>
                <p className={styles.resetHint}>Enter your work email and we'll send you a 6-digit OTP.</p>
                <div className={styles.field}>
                  <label className={styles.label}>Work email</label>
                  <input
                    type="email"
                    className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                    placeholder="jane@company.com"
                    value={form.email}
                    onChange={e => set("email", e.target.value)}
                    autoFocus
                  />
                  {errors.email && <p className={styles.errorMsg}>{errors.email}</p>}
                </div>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? "Sending OTP…" : "Send OTP"}
                </button>
              </form>
            )}

            {/* Step 2 — OTP */}
            {forgotStep === 2 && (
              <form onSubmit={handleVerifyOtp} noValidate style={{ display:"flex", flexDirection:"column", gap:20 }}>
                <p className={styles.resetHint}>We sent a 6-digit code to <strong>{form.email}</strong>. Enter it below.</p>
                <div className={styles.field}>
                  <label className={styles.label}>One-time password</label>
                  <OtpInput value={otp} onChange={v => { setOtp(v); setErrors(e => ({ ...e, otp: "" })); }} />
                  {errors.otp && <p className={styles.errorMsg}>{errors.otp}</p>}
                </div>
                <button type="submit" className={styles.submitBtn} disabled={loading || otp.length < 6}>
                  {loading ? "Verifying…" : "Verify OTP"}
                </button>
                <p className={styles.resendRow}>
                  Didn't receive it?{" "}
                  <button type="button" className={styles.forgotLink} onClick={() => { setForgotStep(1); setOtp(""); }}>Resend OTP</button>
                </p>
              </form>
            )}

            {/* Step 3 — New password */}
            {forgotStep === 3 && (
              <form onSubmit={handleResetPassword} noValidate style={{ display:"flex", flexDirection:"column", gap:20 }}>
                <p className={styles.resetHint}>Choose a new password for your account.</p>
                <div className={styles.field}>
                  <label className={styles.label}>New password</label>
                  <PasswordInput
                    value={newPass}
                    onChange={e => { setNewPass(e.target.value); setErrors(ev => ({ ...ev, newPass: "" })); }}
                    hasError={!!errors.newPass}
                    autoFocus
                  />
                  {errors.newPass && <p className={styles.errorMsg}>{errors.newPass}</p>}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Confirm password</label>
                  <PasswordInput
                    value={confirmPass}
                    onChange={e => { setConfirmPass(e.target.value); setErrors(ev => ({ ...ev, confirmPass: "" })); }}
                    placeholder="Repeat new password"
                    hasError={!!errors.confirmPass}
                  />
                  {errors.confirmPass && <p className={styles.errorMsg}>{errors.confirmPass}</p>}
                </div>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? "Saving…" : "Reset password"}
                </button>
              </form>
            )}

            {/* Step 4 — Done */}
            {forgotStep === 4 && (
              <div className={styles.resetSuccess}>
                <div className={styles.resetSuccessIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className={styles.resetSuccessTitle}>Password updated!</h3>
                <p className={styles.resetSuccessDesc}>Your password has been reset. Sign in with your new password.</p>
                <button type="button" className={styles.submitBtn} onClick={goBackToSignIn}>Sign in now</button>
              </div>
            )}

          </div>
        )}

        {mode !== "forgot" && <form className={styles.form} onSubmit={handleSubmit} noValidate>
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
              <label className={styles.label}>Workspace code</label>
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
            <div className={styles.passwordLabelRow}>
              <label className={styles.label}>Password</label>
              {mode === "signin" && (
                <button type="button" className={styles.forgotLink} onClick={() => { setErrors({}); setMode("forgot"); }}>
                  Forgot password?
                </button>
              )}
            </div>
            <PasswordInput
              value={form.password}
              onChange={e => set("password", e.target.value)}
              hasError={!!errors.password}
            />
            {errors.password && <p className={styles.errorMsg}>{errors.password}</p>}
          </div>

          {mode === "signup" && (
            <div className={styles.field}>
              <label className={styles.label}>Confirm password</label>
              <PasswordInput
                value={form.confirmPassword}
                onChange={e => set("confirmPassword", e.target.value)}
                placeholder="Repeat your password"
                hasError={!!errors.confirmPassword}
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
        </form>}
      </div>
    </>
  );
}
