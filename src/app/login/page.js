"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" | "signup" | "magic"
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const validate = () => {
    const e = {};
    if (mode === "signup" && !form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (mode !== "magic") {
      if (!form.password || form.password.length < 6) e.password = "Min 6 characters";
      if (mode === "signup" && form.password !== form.confirm) e.confirm = "Passwords don't match";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (mode === "magic") setMagicSent(true);
      else router.push("/checkout");
    }, 1600);
  };

  const switchMode = (m) => {
    setMode(m);
    setErrors({});
    setMagicSent(false);
    setForm({ name: "", email: "", password: "", confirm: "" });
  };

  return (
    <div className={styles.root}>
      {/* ── Left panel ── */}
      <div className={styles.left}>
        <Link href="/" className={styles.logoLink}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Subtle Kitchen" className={styles.logo} />
        </Link>

        <div className={styles.leftContent}>
          <div className={styles.leftBadge}>✦ FRESH LUNCH, DELIVERED DAILY</div>
          <h2 className={styles.leftHeading}>
            Fresh Meals, Delivered to Your Workplace
          </h2>
          <p className={styles.leftSubtext}>
            {"Enjoy fresh, chef-prepared meals delivered directly to your office, warehouse, garage, or workplace. Choose from one-off orders or flexible weekly meal plans designed to fit your team's schedule"}
          </p>

          <div className={styles.leftPerks}>
            {["Free delivery on every order", "Cancel or pause anytime", "Dedicated account manager"].map(p => (
              <div key={p} className={styles.leftPerk}>
                <span className={styles.leftPerkCheck}>✓</span>{p}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.leftFooter}>
          <div className={styles.leftAvatars}>
            {[47, 12, 32, 25].map(n => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={n} src={`https://i.pravatar.cc/40?img=${n}`} alt="" className={styles.avatar} />
            ))}
          </div>
          <p className={styles.leftSocial}><strong>2,400+</strong> companies onboarded this month</p>
        </div>
      </div>

      {/* ── Right: Auth form ── */}
      <div className={styles.right}>
        <div className={styles.formWrap}>
          {/* Logo (mobile) */}
          <Link href="/" className={`${styles.logoLink} ${styles.logoMobile}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Subtle Kitchen" className={styles.logo} />
          </Link>

          {/* Mode tabs */}
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${mode === "login" ? styles.tabActive : ""}`} onClick={() => switchMode("login")}>Sign in</button>
            <button className={`${styles.tab} ${mode === "signup" ? styles.tabActive : ""}`} onClick={() => switchMode("signup")}>Create account</button>
          </div>

          {/* Magic link sent state */}
          {magicSent ? (
            <div className={styles.magicSuccess}>
              <div className={styles.magicIcon}>📬</div>
              <h3 className={styles.magicTitle}>Check your inbox</h3>
              <p className={styles.magicDesc}>We sent a magic link to <strong>{form.email}</strong>. Click it to sign in instantly — no password needed.</p>
              <button className={styles.btnOutline} onClick={() => setMagicSent(false)}>← Try another email</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form} key={mode}>

              {mode === "signup" && (
                <div className={styles.field}>
                  <label className={styles.label}>Full name</label>
                  <input className={`${styles.input} ${errors.name ? styles.inputErr : ""}`} placeholder="Jane Smith" value={form.name} onChange={e => set("name", e.target.value)} />
                  {errors.name && <span className={styles.err}>{errors.name}</span>}
                </div>
              )}

              <div className={styles.field}>
                <label className={styles.label}>Work email</label>
                <input className={`${styles.input} ${errors.email ? styles.inputErr : ""}`} type="email" placeholder="jane@company.com" value={form.email} onChange={e => set("email", e.target.value)} />
                {errors.email && <span className={styles.err}>{errors.email}</span>}
              </div>

              {mode !== "magic" && (
                <div className={styles.field}>
                  <div className={styles.labelRow}>
                    <label className={styles.label}>Password</label>
                    {mode === "login" && <a href="#" className={styles.forgotLink}>Forgot password?</a>}
                  </div>
                  <div className={styles.inputWrap}>
                    <input
                      className={`${styles.input} ${errors.password ? styles.inputErr : ""}`}
                      type={showPassword ? "text" : "password"}
                      placeholder={mode === "signup" ? "Min 6 characters" : "Enter your password"}
                      value={form.password}
                      onChange={e => set("password", e.target.value)}
                    />
                    <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(s => !s)}>
                      {showPassword ? "🙈" : "👁"}
                    </button>
                  </div>
                  {errors.password && <span className={styles.err}>{errors.password}</span>}
                </div>
              )}

              {mode === "signup" && (
                <div className={styles.field}>
                  <label className={styles.label}>Confirm password</label>
                  <input className={`${styles.input} ${errors.confirm ? styles.inputErr : ""}`} type="password" placeholder="Repeat password" value={form.confirm} onChange={e => set("confirm", e.target.value)} />
                  {errors.confirm && <span className={styles.err}>{errors.confirm}</span>}
                </div>
              )}

              <button type="submit" className={`${styles.btnPrimary} ${loading ? styles.btnLoading : ""}`} disabled={loading}>
                {loading ? <span className={styles.spinner} /> : mode === "login" ? "Sign in" : mode === "signup" ? "Create account" : "Send magic link"}
              </button>

              {/* Divider */}
              <div className={styles.divider}><span>or</span></div>

              {/* Social / magic */}
              <div className={styles.altBtns}>
                <button type="button" className={styles.socialBtn}>
                  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continue with Google
                </button>
                {mode === "login" && (
                  <button type="button" className={styles.magicBtn} onClick={() => switchMode("magic")}>
                    ✨ Sign in with magic link
                  </button>
                )}
              </div>

              {mode === "login" && (
                <p className={styles.switchMode}>
                  Don&apos;t have an account?{" "}
                  <button type="button" className={styles.switchLink} onClick={() => switchMode("signup")}>Create one</button>
                </p>
              )}
              {mode === "signup" && (
                <p className={styles.switchMode}>
                  Already have an account?{" "}
                  <button type="button" className={styles.switchLink} onClick={() => switchMode("login")}>Sign in</button>
                </p>
              )}
              {mode === "magic" && (
                <p className={styles.switchMode}>
                  Want to use a password?{" "}
                  <button type="button" className={styles.switchLink} onClick={() => switchMode("login")}>Sign in</button>
                </p>
              )}

              {mode === "signup" && (
                <p className={styles.termsNote}>
                  By creating an account you agree to our{" "}
                  <a href="#" className={styles.termsLink}>Terms of Service</a> and{" "}
                  <a href="#" className={styles.termsLink}>Privacy Policy</a>.
                </p>
              )}
            </form>
          )}
        </div>

        <p className={styles.rightFooter}>🔒 256-bit SSL encryption. Your data is safe.</p>
      </div>
    </div>
  );
}
