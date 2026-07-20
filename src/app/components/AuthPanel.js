"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
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

function PasswordInput({ value, onChange, placeholder, hasError }) {
  const [show, setShow] = useState(false);
  return (
    <div className={styles.passWrap}>
      <input
        type={show ? "text" : "password"}
        className={`${styles.input} ${hasError ? styles.inputError : ""}`}
        placeholder={placeholder || "Min 6 characters"}
        value={value}
        onChange={onChange}
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
        />
      ))}
    </div>
  );
}

export default function AuthPanel({ onClose }) {
  const [mode, setMode]   = useState("signin"); // "signin" | "signup" | "forgot"
  const [step, setStep]   = useState("form");   // "form" | "success"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm]   = useState({
    firstName: "", lastName: "", email: "", workspaceCode: "", password: "", confirmPassword: "",
  });
  const { login } = useAuth();
  const router = useRouter();

  // ── Forgot password ──
  const [forgotStep, setForgotStep] = useState(1); // 1=email, 2=otp, 3=new password, 4=done
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(""); };

  const switchMode = (m) => { setMode(m); setStep("form"); setError(""); };

  const goBackToSignIn = () => {
    setMode("signin");
    setForgotStep(1);
    setResetOtp("");
    setNewPassword("");
    setConfirmNewPassword("");
    setError("");
  };

  const handleSendResetOtp = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      setError("Enter a valid email address"); return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/api/auth/forgot-password", { email: form.email.trim() });
      setForgotStep(2);
      setResetOtp("");
    } catch (err) {
      setError(err.error || "Could not send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResetOtp = (e) => {
    e.preventDefault();
    if (resetOtp.replace(/\D/g, "").length < 6) { setError("Enter all 6 digits"); return; }
    setError("");
    setForgotStep(3);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (newPassword !== confirmNewPassword) { setError("Passwords do not match"); return; }
    setLoading(true);
    setError("");
    try {
      await api.post("/api/auth/reset-password", {
        email:       form.email.trim(),
        otp:         resetOtp,
        newPassword,
      });
      setForgotStep(4);
    } catch (err) {
      setError(err.error || "Could not reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

        {step === "success" ? (
          <div className={styles.successHeader}>
            <div className={styles.logoImgWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" className={styles.logoImg} />
            </div>
            <h2 className={styles.heading}>You&apos;re all set! 🎉</h2>
          </div>
        ) : (
          <div className={styles.header}>
            <div className={styles.headerText}>
              {mode === "forgot" && forgotStep < 4 && (
                <button className={styles.backLink} onClick={goBackToSignIn}>← Back to sign in</button>
              )}
              <h2 className={styles.heading}>
                {mode === "signin" ? "Sign in"
                  : mode === "signup" ? "Create account"
                  : forgotStep === 1 ? "Forgot password"
                  : forgotStep === 2 ? "Enter code"
                  : forgotStep === 3 ? "New password"
                  : "Password reset!"}
              </h2>
              {mode !== "forgot" && (
                <p className={styles.toggle}>
                  {mode === "signin" ? "New here? " : "Already have an account? "}
                  <button className={styles.toggleLink} onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}>
                    {mode === "signin" ? "Create an account" : "Sign in"}
                  </button>
                </p>
              )}
            </div>
            <div className={styles.logoImgWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt=""
                className={styles.logoImg}
              />
            </div>
          </div>
        )}

        {/* ── Form step ── */}
        {step === "form" && mode !== "forgot" && (
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
                <div className={styles.passwordLabelRow}>
                  <label className={styles.label}>Password</label>
                  <button
                    type="button"
                    className={styles.forgotLink}
                    onClick={() => { setError(""); setMode("forgot"); setForgotStep(1); }}
                  >
                    Forgot password?
                  </button>
                </div>
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

        {/* ── Forgot password flow ── */}
        {mode === "forgot" && (
          <div className={styles.form}>

            {forgotStep < 4 && (
              <div className={styles.stepRow}>
                {[1, 2, 3].map(s => (
                  <div key={s} className={`${styles.stepDot} ${forgotStep >= s ? styles.stepDotActive : ""}`} />
                ))}
              </div>
            )}

            {forgotStep === 1 && (
              <form onSubmit={handleSendResetOtp} noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <p className={styles.resetHint}>Enter your work email and we&apos;ll send you a 6-digit reset code.</p>
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
                {error && <p className={styles.errorMsg}>{error}</p>}
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? "Sending code…" : "Send code"}
                </button>
              </form>
            )}

            {forgotStep === 2 && (
              <form onSubmit={handleVerifyResetOtp} noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <p className={styles.resetHint}>We sent a 6-digit code to <strong>{form.email}</strong>. Enter it below.</p>
                <div className={styles.field}>
                  <label className={styles.label}>Reset code</label>
                  <OtpInput value={resetOtp} onChange={v => { setResetOtp(v); setError(""); }} />
                  {error && <p className={styles.errorMsg}>{error}</p>}
                </div>
                <button type="submit" className={styles.submitBtn} disabled={resetOtp.length < 6}>
                  Verify code
                </button>
                <p className={styles.resendRow}>
                  Didn&apos;t receive it?{" "}
                  <button type="button" className={styles.forgotLink} onClick={handleSendResetOtp} disabled={loading}>
                    Resend code
                  </button>
                </p>
              </form>
            )}

            {forgotStep === 3 && (
              <form onSubmit={handleResetPassword} noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <p className={styles.resetHint}>Choose a new password for your account.</p>
                <div className={styles.field}>
                  <label className={styles.label}>New password</label>
                  <PasswordInput
                    value={newPassword}
                    onChange={e => { setNewPassword(e.target.value); setError(""); }}
                    hasError={error && !newPassword}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Confirm password</label>
                  <PasswordInput
                    value={confirmNewPassword}
                    onChange={e => { setConfirmNewPassword(e.target.value); setError(""); }}
                    placeholder="Repeat new password"
                    hasError={error && !confirmNewPassword}
                  />
                </div>
                {error && <p className={styles.errorMsg}>{error}</p>}
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? "Saving…" : "Reset password"}
                </button>
              </form>
            )}

            {forgotStep === 4 && (
              <div className={styles.resetSuccess}>
                <div className={styles.resetSuccessIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className={styles.resetSuccessTitle}>Password updated!</h3>
                <p className={styles.resetSuccessDesc}>Your password has been reset. Sign in with your new password.</p>
                <button type="button" className={styles.submitBtn} onClick={goBackToSignIn}>Sign in now</button>
              </div>
            )}

          </div>
        )}

        {/* ── Success step ── */}
        {step === "success" && (
          <div className={styles.form}>
            <div className={styles.resetSuccess}>
              <div className={styles.resetSuccessIcon}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline className={styles.resetSuccessTick} points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className={styles.resetSuccessTitle}>Account created</h3>
              <p className={styles.resetSuccessDesc}>
                Welcome 👋 {form.firstName}! You&apos;re signed in<br />make your first order.
              </p>
            </div>
            <button type="button" className={styles.submitBtn} onClick={() => { onClose(); router.push("/menu"); }}>
              Continue
            </button>
          </div>
        )}
      </div>
    </>
  );
}
