"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const EMPLOYEE_OPTIONS = ["1 – 10", "11 – 25", "26 – 50", "51 – 100", "101 – 250", "250+"];
const PREMISE_OPTIONS  = ["Office", "Warehouse", "Garage / Workshop", "School", "Retail", "Other"];
const MEAL_TYPES = [
  { value: "standard",   label: "Standard",   desc: "Home-style portions, balanced nutrition",      note: "Orders must be placed by 10 PM the night before delivery." },
  { value: "commercial", label: "Commercial",  desc: "Larger portions for physical workplaces",      note: "Minimum order quantity of 100 meals per delivery." },
];

const BENEFITS = [
  { icon: "⚡", text: "Setup in under 5 minutes" },
  { icon: "🚚", text: "Free delivery to your door" },
  { icon: "🍱", text: "Fresh chef-prepared meals daily" },
  { icon: "📊", text: "Full team dashboard included" },
];

export default function GetWorkspaceCodePage() {
  const [step, setStep]       = useState(1);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const [workspace, setWorkspace] = useState({
    name: "", address1: "",
    town: "", city: "", postcode: "",
    deliveryTimes: [""],   // index 0 = main, 1+ = Break 1, Break 2…
    mealType: "",
    employees: "", premiseType: "",
  });
  const [contact, setContact] = useState({
    firstName: "", lastName: "", email: "", phone: "",
  });

  const setW  = (k, v) => { setWorkspace(p => ({ ...p, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };
  const setCt = (k, v) => { setContact(p => ({ ...p, [k]: v }));   setErrors(e => ({ ...e, [k]: "" })); };

  const updateTime = (i, v) => {
    setWorkspace(p => { const t = [...p.deliveryTimes]; t[i] = v; return { ...p, deliveryTimes: t }; });
    setErrors(e => ({ ...e, deliveryTimes: "" }));
  };
  const addTime    = () => setWorkspace(p => ({ ...p, deliveryTimes: [...p.deliveryTimes, ""] }));
  const removeTime = (i) => setWorkspace(p => ({ ...p, deliveryTimes: p.deliveryTimes.filter((_, idx) => idx !== i) }));

  const validateStep1 = () => {
    const e = {};
    if (!workspace.name.trim())                 e.name          = "Required";
    if (!workspace.town.trim())                 e.town          = "Required";
    if (!workspace.city.trim())                 e.city          = "Required";
    if (!workspace.postcode.trim())             e.postcode      = "Required";
    if (!workspace.deliveryTimes[0].trim())     e.deliveryTimes = "At least one delivery time is required";
    if (!workspace.mealType)                    e.mealType      = "Required";
    if (!workspace.employees)                   e.employees     = "Required";
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
  const filledTimes = workspace.deliveryTimes.filter(t => t.trim());

  return (
    <div className={styles.root}>

      {/* ── Left panel ── */}
      <div className={styles.left}>
        <Link href="/" className={styles.backLink}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to home
        </Link>

        <div className={styles.leftContent}>
          <div className={styles.logo}>
            <span className={styles.logoDash}>—</span>
            <span className={styles.logoText}>Subtle Kitchen</span>
          </div>
          <h1 className={styles.leftHeading}>
            Get your<br />
            <span className={styles.leftAccent}>workspace</span><br />
            code
          </h1>
          <p className={styles.leftSub}>
            Register your workplace and we'll set up a dedicated lunch programme with your own unique code.
          </p>
          <ul className={styles.benefits}>
            {BENEFITS.map((b, i) => (
              <li key={i} className={styles.benefit} style={{ animationDelay: (0.1 + i * 0.08) + "s" }}>
                <span className={styles.benefitIcon}>{b.icon}</span>
                <span className={styles.benefitText}>{b.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className={styles.leftFooter}>
          Already have a code?{" "}
          <Link href="/get-started" className={styles.leftFooterLink}>Sign in here</Link>
        </p>
      </div>

      {/* ── Right panel ── */}
      <div className={styles.right}>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: progress + "%" }} />
        </div>

        <div className={styles.formWrap}>
          {step < 3 && (
            <div className={styles.stepRow}>
              <span className={styles.stepBadge}>Step {step} of 2</span>
              <span className={styles.stepLabel}>{step === 1 ? "Workspace details" : "Contact details"}</span>
            </div>
          )}

          {/* ── Step 1 ── */}
          {step === 1 && (
            <div className={styles.formStep} key="step1">
              <h2 className={styles.formHeading}>
                Tell us about your <span className={styles.formAccent}>workspace</span>
              </h2>
              <p className={styles.formSub}>We'll set up your delivery location and generate your unique code.</p>

              <div className={styles.fields}>

                {/* Workspace name */}
                <div className={styles.field} style={{ "--fi": 0 }}>
                  <label className={styles.label}>Workspace name <span className={styles.req}>*</span></label>
                  <input className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                    placeholder="e.g. Acme HQ" value={workspace.name}
                    onChange={e => setW("name", e.target.value)} autoFocus />
                  {errors.name && <p className={styles.errMsg}>{errors.name}</p>}
                </div>

                {/* Address */}
                <div className={styles.field} style={{ "--fi": 1 }}>
                  <label className={styles.label}>Address <span className={styles.req}>*</span></label>
                  <div className={styles.addressWrap}
                    onClick={() => window.open("https://maps.google.com", "_blank")}
                    role="button" tabIndex={0}
                    onKeyDown={e => e.key === "Enter" && window.open("https://maps.google.com", "_blank")}>
                    <svg className={styles.addressMapIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span className={styles.addressText}>
                      {workspace.address1 || <span className={styles.addressPlaceholder}>Click to pick address on Google Maps</span>}
                    </span>
                    <span className={styles.addressOpenBadge}>Open Maps ↗</span>
                  </div>
                  {errors.address1 && <p className={styles.errMsg}>{errors.address1}</p>}
                </div>

                <div className={styles.row}>
                  <div className={styles.field} style={{ "--fi": 2 }}>
                    <label className={styles.label}>Town <span className={styles.req}>*</span></label>
                    <input className={`${styles.input} ${errors.town ? styles.inputError : ""}`}
                      placeholder="e.g. Canary Wharf" value={workspace.town}
                      onChange={e => setW("town", e.target.value)} />
                    {errors.town && <p className={styles.errMsg}>{errors.town}</p>}
                  </div>
                  <div className={styles.field} style={{ "--fi": 3 }}>
                    <label className={styles.label}>City <span className={styles.req}>*</span></label>
                    <input className={`${styles.input} ${errors.city ? styles.inputError : ""}`}
                      placeholder="e.g. London" value={workspace.city}
                      onChange={e => setW("city", e.target.value)} />
                    {errors.city && <p className={styles.errMsg}>{errors.city}</p>}
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field} style={{ "--fi": 4 }}>
                    <label className={styles.label}>Postcode <span className={styles.req}>*</span></label>
                    <input className={`${styles.input} ${errors.postcode ? styles.inputError : ""}`}
                      placeholder="e.g. E14 5AB" value={workspace.postcode}
                      onChange={e => setW("postcode", e.target.value.toUpperCase())} />
                    {errors.postcode && <p className={styles.errMsg}>{errors.postcode}</p>}
                  </div>
                  <div className={styles.field} style={{ "--fi": 5 }}>
                    <label className={styles.label}>Country</label>
                    <div className={styles.countryStatic}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                      United Kingdom
                    </div>
                  </div>
                </div>

                {/* Delivery times */}
                <div className={styles.field} style={{ "--fi": 7 }}>
                  <label className={styles.label}>
                    Lunch delivery time <span className={styles.req}>*</span>
                    <span className={styles.opt}> — type e.g. 12:30 PM</span>
                  </label>

                  <div className={styles.timeSlotsWrap}>
                    {workspace.deliveryTimes.map((t, i) => (
                      <div key={i} className={styles.timeSlotRow} style={{ animationDelay: (i * 0.06) + "s" }}>
                        <span className={styles.timeSlotTag}>
                          Break {i + 1}
                        </span>
                        <input
                          className={`${styles.input} ${styles.timeInput} ${i === 0 && errors.deliveryTimes ? styles.inputError : ""}`}
                          placeholder="e.g. 12:30 PM"
                          value={t}
                          onChange={e => updateTime(i, e.target.value)}
                        />
                        {i > 0 && (
                          <button type="button" className={styles.timeRemoveBtn} onClick={() => removeTime(i)} aria-label="Remove">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
                              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}

                    {workspace.deliveryTimes.length < 3 && (
                      <button type="button" className={styles.timeAddBtn} onClick={addTime}>
                        <span className={styles.timeAddIcon}>+</span>
                        Add another time slot
                      </button>
                    )}
                  </div>
                  {errors.deliveryTimes && <p className={styles.errMsg}>{errors.deliveryTimes}</p>}
                </div>

                {/* Meal type */}
                <div className={styles.field} style={{ "--fi": 8 }}>
                  <label className={styles.label}>Meal type <span className={styles.req}>*</span></label>
                  <div className={styles.mealTypeGroup}>
                    {MEAL_TYPES.map(m => (
                      <button key={m.value} type="button"
                        className={`${styles.mealTypeBtn} ${workspace.mealType === m.value ? styles.mealTypeBtnActive : ""} ${errors.mealType ? styles.mealTypeBtnError : ""}`}
                        onClick={() => setW("mealType", m.value)}>
                        <span className={styles.mealTypeName}>{m.label}</span>
                        <span className={styles.mealTypeDesc}>{m.desc}</span>
                        {workspace.mealType === m.value && (
                          <span className={styles.mealTypeNote}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            {m.note}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  {errors.mealType && <p className={styles.errMsg}>{errors.mealType}</p>}
                </div>

                {/* Employees + Premise */}
                <div className={styles.row}>
                  <div className={styles.field} style={{ "--fi": 9 }}>
                    <label className={styles.label}>No. of employees <span className={styles.req}>*</span></label>
                    <select className={`${styles.input} ${styles.select} ${errors.employees ? styles.inputError : ""}`}
                      value={workspace.employees} onChange={e => setW("employees", e.target.value)}>
                      <option value="">Select…</option>
                      {EMPLOYEE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    {errors.employees && <p className={styles.errMsg}>{errors.employees}</p>}
                  </div>
                  <div className={styles.field} style={{ "--fi": 10 }}>
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
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <form className={styles.formStep} key="step2" onSubmit={handleSubmit} noValidate>
              <h2 className={styles.formHeading}>
                Your <span className={styles.formAccent}>contact</span> details
              </h2>
              <p className={styles.formSub}>We'll send your workspace code and setup instructions here.</p>

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
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {workspace.name} · {workspace.town}, {workspace.city} · {filledTimes.map((t, i) => `Break ${i + 1}: ${t}`).join(" / ")} · {workspace.mealType}
                </div>
              </div>

              <button type="submit" className={styles.btnPrimary} disabled={loading}>
                {loading
                  ? <span className={styles.spinner} />
                  : <>Get my workspace code <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>
                }
              </button>
              <button type="button" className={styles.btnGhost} onClick={() => setStep(1)}>← Back to workspace details</button>
            </form>
          )}

          {/* ── Step 3: Success ── */}
          {step === 3 && (
            <div className={styles.formStep} key="step3">
              <div className={styles.successRing}>
                <div className={styles.successIcon}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              </div>

              <h2 className={styles.formHeading} style={{ marginTop: 28 }}>
                You&apos;re all set, <span className={styles.formAccent}>{contact.firstName}!</span>
              </h2>
              <p className={styles.formSub}>
                We'll send your unique workspace code to <strong>{contact.email}</strong> within 1–2 business days.
              </p>

              <div className={styles.successCard}>
                <div className={styles.successRow}>
                  <span className={styles.successLabel}>Workspace</span>
                  <span className={styles.successVal}>{workspace.name}</span>
                </div>
                <div className={styles.successDivider} />
                <div className={styles.successRow}>
                  <span className={styles.successLabel}>Address</span>
                  <span className={styles.successVal}>{workspace.address1 || "—"}, {workspace.town}, {workspace.city} {workspace.postcode}, UK</span>
                </div>
                <div className={styles.successDivider} />
                <div className={styles.successRow}>
                  <span className={styles.successLabel}>Delivery</span>
                  <span className={styles.successVal}>
                    {workspace.deliveryTimes.filter(t => t.trim()).map((t, i) => (
                      <span key={i} className={styles.timeTag}>
                        Break {i + 1}: {t}
                      </span>
                    ))}
                  </span>
                </div>
                <div className={styles.successDivider} />
                <div className={styles.successRow}>
                  <span className={styles.successLabel}>Meal type</span>
                  <span className={styles.successVal} style={{ textTransform: "capitalize" }}>{workspace.mealType}</span>
                </div>
                <div className={styles.successDivider} />
                <div className={styles.successRow}>
                  <span className={styles.successLabel}>Contact</span>
                  <span className={styles.successVal}>{contact.firstName} {contact.lastName}</span>
                </div>
              </div>

              <Link href="/" className={styles.btnPrimary} style={{ textDecoration: "none", justifyContent: "center" }}>
                Back to home
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
