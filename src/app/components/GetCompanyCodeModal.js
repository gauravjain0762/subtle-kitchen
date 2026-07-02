"use client";
import { useState } from "react";
import styles from "./GetCompanyCodeModal.module.css";

const EMPLOYEE_OPTIONS = ["1 – 10", "11 – 25", "26 – 50", "51 – 100", "101 – 250", "250+"];
const PREMISE_OPTIONS  = ["Office", "Warehouse", "Garage / Workshop", "School", "Retail", "Other"];
const DELIVERY_SLOTS   = [
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "1:00 PM",  "1:30 PM",  "2:00 PM",  "2:30 PM",
  "3:00 PM",  "3:30 PM",  "4:00 PM",
];
const COUNTRIES = ["United Kingdom", "Europe", "America"];

export default function GetCompanyCodeModal({ onClose }) {
  const [step, setStep]     = useState(1);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [workspace, setWorkspace] = useState({
    name: "", address1: "", address2: "",
    town: "", city: "", postcode: "", country: "United Kingdom",
    deliverySlot: "", employees: "", premiseType: "",
  });
  const [contact, setContact] = useState({
    firstName: "", lastName: "", email: "", phone: "",
  });

  const setW  = (k, v) => { setWorkspace(p => ({ ...p, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };
  const setCt = (k, v) => { setContact(p => ({ ...p, [k]: v }));   setErrors(e => ({ ...e, [k]: "" })); };

  const validateStep1 = () => {
    const e = {};
    if (!workspace.name.trim())     e.name     = "Required";
    if (!workspace.address1.trim()) e.address1 = "Required";
    if (!workspace.town)            e.town     = "Required";
    if (!workspace.city.trim())     e.city     = "Required";
    if (!workspace.postcode.trim()) e.postcode = "Required";
    if (!workspace.country)         e.country  = "Required";
    if (!workspace.deliverySlot)    e.deliverySlot = "Required";
    if (!workspace.employees)       e.employees = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!contact.firstName.trim()) e.firstName = "Required";
    if (!contact.lastName.trim())  e.lastName  = "Required";
    if (!contact.email.trim() || !/\S+@\S+\.\S+/.test(contact.email)) e.email = "Valid email required";
    if (!contact.phone.trim())     e.phone     = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validateStep1()) setStep(2); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(3); }, 1000);
  };

  const progress = step === 3 ? 100 : step === 2 ? 66 : 33;

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>

        {/* ── Top bar: progress + close ── */}
        <div className={styles.topBar}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: progress + "%" }} />
          </div>
          <div className={styles.topBarInner}>
            {step < 3 ? (
              <div className={styles.headerMeta}>
                <span className={styles.stepBadge}>Step {step} of 2</span>
                <span className={styles.stepLabel}>
                  {step === 1 ? "Workspace details" : "Contact details"}
                </span>
              </div>
            ) : <div />}
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* ── Step 1 ── */}
        {step === 1 && (
          <div className={styles.step} key="step1">
            <h2 className={styles.heading}>Tell us about your <span className={styles.headingAccent}>workspace</span></h2>
            <p className={styles.subtext}>We'll set up your delivery address and generate your unique code.</p>

            <div className={styles.fields}>
              <div className={styles.field} style={{ "--fi": 0 }}>
                <label className={styles.label}>Workspace name <span className={styles.req}>*</span></label>
                <input className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                  placeholder="e.g. Acme HQ" value={workspace.name}
                  onChange={e => setW("name", e.target.value)} autoFocus />
                {errors.name && <p className={styles.errMsg}>{errors.name}</p>}
              </div>

              <div className={styles.field} style={{ "--fi": 1 }}>
                <label className={styles.label}>Address line 1 <span className={styles.req}>*</span></label>
                <input className={`${styles.input} ${errors.address1 ? styles.inputError : ""}`}
                  placeholder="e.g. 12 Business Park" value={workspace.address1}
                  onChange={e => setW("address1", e.target.value)} />
                {errors.address1 && <p className={styles.errMsg}>{errors.address1}</p>}
              </div>

              <div className={styles.field} style={{ "--fi": 2 }}>
                <label className={styles.label}>Address line 2 <span className={styles.opt}>(optional)</span></label>
                <input className={styles.input}
                  placeholder="Building, floor, unit…" value={workspace.address2}
                  onChange={e => setW("address2", e.target.value)} />
              </div>

              <div className={styles.row}>
                <div className={styles.field} style={{ "--fi": 3 }}>
                  <label className={styles.label}>Town <span className={styles.req}>*</span></label>
                  <input className={`${styles.input} ${errors.town ? styles.inputError : ""}`}
                    placeholder="e.g. Canary Wharf" value={workspace.town}
                    onChange={e => setW("town", e.target.value)} />
                  {errors.town && <p className={styles.errMsg}>{errors.town}</p>}
                </div>
                <div className={styles.field} style={{ "--fi": 4 }}>
                  <label className={styles.label}>City <span className={styles.req}>*</span></label>
                  <input className={`${styles.input} ${errors.city ? styles.inputError : ""}`}
                    placeholder="e.g. London" value={workspace.city}
                    onChange={e => setW("city", e.target.value)} />
                  {errors.city && <p className={styles.errMsg}>{errors.city}</p>}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field} style={{ "--fi": 5 }}>
                  <label className={styles.label}>Postcode <span className={styles.req}>*</span></label>
                  <input className={`${styles.input} ${errors.postcode ? styles.inputError : ""}`}
                    placeholder="e.g. E14 5AB" value={workspace.postcode}
                    onChange={e => setW("postcode", e.target.value.toUpperCase())} />
                  {errors.postcode && <p className={styles.errMsg}>{errors.postcode}</p>}
                </div>
                <div className={styles.field} style={{ "--fi": 6 }}>
                  <label className={styles.label}>Country <span className={styles.req}>*</span></label>
                  <div className={styles.countryGroup}>
                    {COUNTRIES.map(c => (
                      <button key={c} type="button"
                        className={`${styles.countryBtn} ${workspace.country === c ? styles.countryBtnActive : ""}`}
                        onClick={() => setW("country", c)}>
                        {c}
                      </button>
                    ))}
                  </div>
                  {errors.country && <p className={styles.errMsg}>{errors.country}</p>}
                </div>
              </div>

              <div className={styles.field} style={{ "--fi": 7 }}>
                <label className={styles.label}>Preferred delivery time <span className={styles.req}>*</span></label>
                <div className={`${styles.timeGrid} ${errors.deliverySlot ? styles.timeGridError : ""}`}>
                  {DELIVERY_SLOTS.map(s => (
                    <button key={s} type="button"
                      className={`${styles.timeBtn} ${workspace.deliverySlot === s ? styles.timeBtnActive : ""}`}
                      onClick={() => setW("deliverySlot", s)}>
                      {s}
                    </button>
                  ))}
                </div>
                {errors.deliverySlot && <p className={styles.errMsg}>{errors.deliverySlot}</p>}
              </div>

              <div className={styles.row}>
                <div className={styles.field} style={{ "--fi": 8 }}>
                  <label className={styles.label}>No. of employees <span className={styles.req}>*</span></label>
                  <select className={`${styles.input} ${styles.select} ${errors.employees ? styles.inputError : ""}`}
                    value={workspace.employees} onChange={e => setW("employees", e.target.value)}>
                    <option value="">Select…</option>
                    {EMPLOYEE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {errors.employees && <p className={styles.errMsg}>{errors.employees}</p>}
                </div>
                <div className={styles.field} style={{ "--fi": 9 }}>
                  <label className={styles.label}>Premise type <span className={styles.opt}>(optional)</span></label>
                  <select className={`${styles.input} ${styles.select}`}
                    value={workspace.premiseType} onChange={e => setW("premiseType", e.target.value)}>
                    <option value="">Select…</option>
                    {PREMISE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <button className={styles.btnPrimary} onClick={handleNext}>
              Continue
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <form className={styles.step} key="step2" onSubmit={handleSubmit} noValidate>
            <h2 className={styles.heading}>Your <span className={styles.headingAccent}>contact</span> details</h2>
            <p className={styles.subtext}>We'll send your workspace code and setup instructions here.</p>

            <div className={styles.fields}>
              <div className={styles.row}>
                <div className={styles.field} style={{ "--fi": 0 }}>
                  <label className={styles.label}>First name <span className={styles.req}>*</span></label>
                  <input className={`${styles.input} ${errors.firstName ? styles.inputError : ""}`}
                    placeholder="Jane" value={contact.firstName}
                    onChange={e => setCt("firstName", e.target.value)} autoFocus />
                  {errors.firstName && <p className={styles.errMsg}>{errors.firstName}</p>}
                </div>
                <div className={styles.field} style={{ "--fi": 1 }}>
                  <label className={styles.label}>Last name <span className={styles.req}>*</span></label>
                  <input className={`${styles.input} ${errors.lastName ? styles.inputError : ""}`}
                    placeholder="Smith" value={contact.lastName}
                    onChange={e => setCt("lastName", e.target.value)} />
                  {errors.lastName && <p className={styles.errMsg}>{errors.lastName}</p>}
                </div>
              </div>

              <div className={styles.field} style={{ "--fi": 2 }}>
                <label className={styles.label}>Work email <span className={styles.req}>*</span></label>
                <input type="email" className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                  placeholder="jane@workspace.com" value={contact.email}
                  onChange={e => setCt("email", e.target.value)} />
                {errors.email && <p className={styles.errMsg}>{errors.email}</p>}
              </div>

              <div className={styles.field} style={{ "--fi": 3 }}>
                <label className={styles.label}>Phone number <span className={styles.req}>*</span></label>
                <input type="tel" className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                  placeholder="+44 7700 000000" value={contact.phone}
                  onChange={e => setCt("phone", e.target.value)} />
                {errors.phone && <p className={styles.errMsg}>{errors.phone}</p>}
              </div>

              <div className={styles.summaryPill} style={{ "--fi": 4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {workspace.name} · {workspace.town || workspace.city}, {workspace.postcode} · {workspace.deliverySlot}
              </div>
            </div>

            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading
                ? <span className={styles.spinner} />
                : <>Get my workspace code <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>
              }
            </button>
            <button type="button" className={styles.btnGhost} onClick={() => setStep(1)}>← Back</button>
          </form>
        )}

        {/* ── Step 3: Success ── */}
        {step === 3 && (
          <div className={styles.step} key="step3">
            <div className={styles.successRing}>
              <div className={styles.successIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>
            <h2 className={styles.heading} style={{ marginTop: 24 }}>
              You&apos;re all set, <span className={styles.headingAccent}>{contact.firstName}!</span>
            </h2>
            <p className={styles.subtext}>
              We'll review your workspace and send your unique code to <strong>{contact.email}</strong> within 1–2 business days.
            </p>

            <div className={styles.successCard}>
              <div className={styles.successCardRow}>
                <span className={styles.successCardLabel}>Workspace</span>
                <span className={styles.successCardVal}>{workspace.name}</span>
              </div>
              <div className={styles.successCardDivider} />
              <div className={styles.successCardRow}>
                <span className={styles.successCardLabel}>Address</span>
                <span className={styles.successCardVal}>
                  {workspace.address1}, {workspace.town && `${workspace.town}, `}{workspace.city} {workspace.postcode}, {workspace.country}
                </span>
              </div>
              <div className={styles.successCardDivider} />
              <div className={styles.successCardRow}>
                <span className={styles.successCardLabel}>Delivery</span>
                <span className={styles.successCardVal}>{workspace.deliverySlot}</span>
              </div>
              <div className={styles.successCardDivider} />
              <div className={styles.successCardRow}>
                <span className={styles.successCardLabel}>Contact</span>
                <span className={styles.successCardVal}>{contact.firstName} {contact.lastName}</span>
              </div>
            </div>

            <button className={styles.btnPrimary} onClick={onClose}>Done</button>
          </div>
        )}

      </div>
    </div>
  );
}
