"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";


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
  delivery: "Free delivery · Weekdays 12pm–2pm",
};

export default function GetStarted() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [view, setView] = useState("code"); // "code" | "confirm" | "order-type"
  const [orderType, setOrderType] = useState("");
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  // Request form state
  const [form, setForm] = useState({ company: "", address: "", city: "", county: "", postcode: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleContinue = () => {
    if (!code.trim()) { setError("Please enter your company code."); return; }
    setError("");
    setView("confirm");
  };

  const handleRequest = (e) => {
    e.preventDefault();
    if (!form.company || !form.address || !form.city || !form.county || !form.postcode) {
      setFormError("Please fill in all fields."); return;
    }
    setFormError("");
    setSubmitting(true);
    setTimeout(() => {
      setGeneratedCode(generateCode(form.company));
      setSubmitting(false);
    }, 1400);
  };

  const closeModal = () => { setShowModal(false); setGeneratedCode(""); setForm({ company: "", address: "", city: "", county: "", postcode: "" }); setFormError(""); setSubmitting(false); };

  return (
    <div className={styles.root}>
      <Link href="/" className={styles.logoLink}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Subtle Kitchen" className={styles.logo} />
      </Link>

      {view === "confirm" && (
        <div className={styles.confirmCard}>
          {/* Header */}
          <div className={styles.confirmHeader}>
            <h1 className={styles.confirmHeading}>Is this your office?</h1>
            <p className={styles.confirmSubtext}>
              We found your company linked to <span className={styles.accent}>{code}</span>
            </p>
          </div>

          {/* Company card */}
          <div className={styles.companyCard}>
            <div className={styles.companyRow}>
              <div className={styles.companyAvatar}>{MOCK_COMPANY.initial}</div>
              <div className={styles.companyInfo}>
                <span className={styles.companyName}>{MOCK_COMPANY.name}</span>
              </div>
              <div className={styles.verifiedBadge}>
                <span className={styles.verifiedDot} />
                VERIFIED
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

          {/* Map */}
          <div className={styles.mapWrap}>
            <div className={styles.mapBg}>
              {/* CSS map grid lines */}
              <div className={styles.mapGrid} />
              <div className={styles.mapPin}>
                <div className={styles.mapPinDot} />
                <div className={styles.mapPinRing} />
              </div>
              <div className={styles.mapStreet} style={{ top: "40%", width: "100%", height: "1px" }} />
              <div className={styles.mapStreet} style={{ top: "65%", width: "70%", left: "15%", height: "1px" }} />
              <div className={styles.mapStreet} style={{ top: "20%", left: "35%", width: "1px", height: "100%" }} />
              <div className={styles.mapStreet} style={{ top: "20%", left: "65%", width: "1px", height: "100%" }} />
            </div>
            <a href="#" className={styles.openMapBtn}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
              Open in maps
            </a>
          </div>

          {/* Actions */}
          <button className={styles.btnPrimary} style={{ borderRadius: "100px" }} onClick={() => setView("order-type")}>
            Yes, that&apos;s my office →
          </button>
          <button className={styles.btnGhost} onClick={() => setView("code")}>
            That&apos;s not right — try a different code
          </button>
        </div>
      )}

      {view === "order-type" && (
        <div className={styles.orderWrap}>
          <div className={styles.orderHeader}>
            <h1 className={styles.orderHeading}>How would you like to order?</h1>
            <p className={styles.orderSubtext}>You can always change this later.</p>
          </div>

          <div className={styles.orderGrid}>
            {/* One-off */}
            <div
              className={`${styles.orderCard} ${orderType === "oneoff" ? styles.orderCardSelected : ""}`}
              onClick={() => setOrderType("oneoff")}
              data-cursor="true"
            >
              <div className={styles.orderIconWrap}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                  <path d="M8 14h.01M12 14h.01M16 14h.01" strokeWidth="2.5"/>
                </svg>
              </div>
              <p className={styles.orderType}>ONE-OFF ORDER</p>
              <h2 className={styles.orderTitle}>Order this week</h2>
              <p className={styles.orderDesc}>Pick your meals for specific days this week. Great for trying us out.</p>
              <ul className={styles.orderPerks}>
                {["Choose any days this week", "Pay once, no commitment", "Easy to repeat next week"].map(p => (
                  <li key={p} className={styles.orderPerk}><span className={styles.orderCheck}>✓</span>{p}</li>
                ))}
              </ul>
              <button className={styles.selectBtn} onClick={() => { setOrderType("oneoff"); router.push("/menu"); }}>
                Select <span>→</span>
              </button>
            </div>

            {/* Weekly subscription */}
            <div
              className={`${styles.orderCard} ${styles.orderCardDark} ${orderType === "weekly" ? styles.orderCardSelected : ""}`}
              onClick={() => setOrderType("weekly")}
              data-cursor="true"
            >
              <div className={styles.popularBadge}>MOST POPULAR</div>
              <div className={`${styles.orderIconWrap} ${styles.orderIconWrapDark}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
                </svg>
              </div>
              <p className={`${styles.orderType} ${styles.orderTypeDark}`}>WEEKLY SUBSCRIPTION</p>
              <h2 className={`${styles.orderTitle} ${styles.orderTitleDark}`}>Same days every week</h2>
              <p className={`${styles.orderDesc} ${styles.orderDescDark}`}>Set your days once. We charge and deliver automatically. Cancel anytime.</p>
              <ul className={styles.orderPerks}>
                {["Auto-repeats every week", "Never think about it again", "Pause or cancel anytime"].map(p => (
                  <li key={p} className={`${styles.orderPerk} ${styles.orderPerkDark}`}><span className={`${styles.orderCheck} ${styles.orderCheckDark}`}>✓</span>{p}</li>
                ))}
              </ul>
              <button className={`${styles.selectBtn} ${styles.selectBtnDark}`} onClick={() => { setOrderType("weekly"); router.push("/menu"); }}>
                Select <span>→</span>
              </button>
            </div>
          </div>

          <button className={styles.skipBtn} onClick={() => setView("confirm")}>
            ← Back
          </button>
        </div>
      )}

      {view === "code" && <div className={styles.card}>
        <h1 className={styles.heading}>Enter your company code</h1>
        <p className={styles.subtext}>
          Your code links <span className={styles.accent}>directly</span> to your office
          delivery address. No need to enter it manually.
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

        <button className={styles.btnPrimary} onClick={handleContinue}>Continue →</button>

        <div className={styles.orDivider}><span>OR</span></div>

        <p className={styles.dontHave}>Don&apos;t have a company code?</p>
        <button className={styles.btnOutline} onClick={() => setShowModal(true)}>Request a company code →</button>

        <p className={styles.secNote}>🔒 Codes are assigned to approved businesses only.</p>
      </div>}


      {/* ── Modal ── */}
      {showModal && (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className={styles.modal}>
            {!generatedCode ? (
              <>
                <div className={styles.modalTopBar}>
                  <div className={styles.modalHeader}>
                    <h2 className={styles.modalHeading}>Request a company code</h2>
                    <p className={styles.modalSubtext}>Fill in your company details and we&apos;ll generate a unique delivery code instantly.</p>
                  </div>
                  <button className={styles.closeBtn} onClick={closeModal} aria-label="Close">✕</button>
                </div>

                <form onSubmit={handleRequest} className={styles.form}>
                  <div className={styles.field}>
                    <label className={styles.label}>Company name</label>
                    <input className={styles.input} placeholder="Acme Corp" value={form.company} onChange={e => set("company", e.target.value)} />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>Office / delivery address</label>
                    <input className={styles.input} placeholder="12 High Street" value={form.address} onChange={e => set("address", e.target.value)} />
                  </div>

                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label className={styles.label}>City</label>
                      <input className={styles.input} placeholder="London" value={form.city} onChange={e => set("city", e.target.value)} />
                    </div>
                    <div className={`${styles.field} ${styles.fieldSm}`}>
                      <label className={styles.label}>Town / County</label>
                      <input className={styles.input} placeholder="Yorkshire" value={form.county} onChange={e => set("county", e.target.value)} />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>Postcode</label>
                    <input className={styles.input} placeholder="SW1A 1AA" value={form.postcode} onChange={e => set("postcode", e.target.value)} />
                  </div>

                  {formError && <p className={styles.error}>{formError}</p>}

                  <button type="submit" className={`${styles.btnPrimary} ${submitting ? styles.btnLoading : ""}`} disabled={submitting}>
                    {submitting ? <span className={styles.spinner} /> : "Generate my company code →"}
                  </button>
                </form>
              </>
            ) : (
              <div className={styles.successWrap}>
                <div className={styles.successIcon}>✓</div>
                <h2 className={styles.modalHeading}>Your company code is ready!</h2>
                <p className={styles.modalSubtext}>Share this code with your team. They&apos;ll use it to unlock your custom menu.</p>
                <div className={styles.codeBox}>
                  <span className={styles.codeText}>{generatedCode}</span>
                  <button className={styles.copyBtn} onClick={() => navigator.clipboard.writeText(generatedCode)}>Copy</button>
                </div>
                <p className={styles.codeNote}>📍 Linked to: <strong>{form.address}, {form.city}, {form.county}, {form.postcode}</strong></p>
                <button className={styles.btnPrimary} onClick={() => { setCode(generatedCode); closeModal(); }}>
                  Use this code now →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
