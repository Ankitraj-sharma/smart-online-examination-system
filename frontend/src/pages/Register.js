// src/pages/Register.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API     = "https://smart-online-examination-system.onrender.com/api/auth";
const AVATARS = ["🧑‍🎓","👩‍🎓","🧑‍💻","👩‍💻","🦸","🧠"];
const DEPTS   = ["Computer Science & Engineering","Information Technology","Electronics & Communication","Mechanical Engineering","Civil Engineering","Data Science & AI"];
const SEMS    = ["1st","2nd","3rd","4th","5th","6th","7th","8th"].map(s => s + " Semester");
const BATCHES = ["2024–2028","2023–2027","2022–2026","2021–2025"];
const SM      = [
  { label: "Too short", color: "var(--coral)" },
  { label: "Fair",      color: "var(--amber)" },
  { label: "Good",      color: "var(--teal)"  },
  { label: "Strong 💪", color: "var(--blue)"  },
];

function pwStrength(pw) {
  let s = 0;
  if (pw.length >= 6)            s++;
  if (/[A-Z]/.test(pw))         s++;
  if (/[0-9]/.test(pw))         s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

// ─────────────────────────────────────────────────────────────
// FIX: Field and Select are defined OUTSIDE the component
// so React does NOT recreate them on every render.
// This is what was causing the input to lose focus after each keystroke.
// ─────────────────────────────────────────────────────────────
function Field({ icon, type = "text", value, onChange, placeholder }) {
  const handleFocus = (e) => {
    e.target.style.borderColor = "var(--blue)";
    e.target.style.background  = "rgba(59,158,255,0.06)";
    e.target.style.boxShadow   = "0 0 0 3px rgba(59,158,255,0.12)";
  };
  const handleBlur = (e) => {
    e.target.style.borderColor = "var(--border)";
    e.target.style.background  = "rgba(255,255,255,0.04)";
    e.target.style.boxShadow   = "none";
  };
  return (
    <div className="field-wrap">
      <span className="field-icon">{icon}</span>
      <input
        type={type}
        className="field-input"
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoComplete="off"
      />
    </div>
  );
}

function SelectField({ icon, value, onChange, options, placeholder }) {
  const handleFocus = (e) => {
    e.target.style.borderColor = "var(--blue)";
    e.target.style.background  = "rgba(59,158,255,0.06)";
    e.target.style.boxShadow   = "0 0 0 3px rgba(59,158,255,0.12)";
  };
  const handleBlur = (e) => {
    e.target.style.borderColor = "var(--border)";
    e.target.style.background  = "rgba(255,255,255,0.04)";
    e.target.style.boxShadow   = "none";
  };
  return (
    <div className="field-wrap">
      <span className="field-icon">{icon}</span>
      <select
        className="field-input select-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Register component
// ─────────────────────────────────────────────────────────────
export default function Register() {
  const navigate = useNavigate();

  const [step,    setStep]    = useState(1);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [avatar,  setAvatar]  = useState("🧑‍🎓");

  // Step 1
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Step 2
  const [sid,   setSid]   = useState("");
  const [roll,  setRoll]  = useState("");
  const [dept,  setDept]  = useState("");
  const [sem,   setSem]   = useState("");
  const [batch, setBatch] = useState("");

  // Step 3
  const [pw1,    setPw1]    = useState("");
  const [pw2,    setPw2]    = useState("");
  const [showP1, setShowP1] = useState(false);
  const [showP2, setShowP2] = useState(false);
  const [terms,  setTerms]  = useState(false);

  const strength = pwStrength(pw1);

  const validate = (n) => {
    setError("");
    if (n === 1) {
      if (!fname.trim() || !lname.trim()) { setError("First and last name are required."); return false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email address."); return false; }
      return true;
    }
    if (n === 2) {
      if (!sid.trim()) { setError("Student ID is required."); return false; }
      if (!dept)       { setError("Please select your department."); return false; }
      return true;
    }
    if (n === 3) {
      if (pw1.length < 6) { setError("Password must be at least 6 characters."); return false; }
      if (pw1 !== pw2)    { setError("Passwords do not match."); return false; }
      if (!terms)         { setError("Please accept the Terms of Service."); return false; }
      return true;
    }
    return true;
  };

  const goStep = (n) => {
    if (n > step && !validate(step)) return;
    setError("");
    setStep(n);
  };

  // ── REGISTER API CALL ──
  const handleRegister = async () => {
    if (!validate(3)) return;
    setLoading(true);
    setError("");
    try {
      const payload = {
        name:       `${fname.trim()} ${lname.trim()}`,
        email:      email.trim().toLowerCase(),
        password:   pw1,
        role:       "student",
        studentId:  sid.trim(),
        rollNumber: roll.trim(),
        department: dept,
        semester:   sem,
        batch:      batch,
        phone:      phone.trim(),
        avatar:     avatar,
      };

      console.log("Registering with:", payload); // debug

      const res = await axios.post(`${API}/register`, payload);
      const { token, user } = res.data;

      // Save to localStorage
      localStorage.setItem("token",      token);
      localStorage.setItem("email",      user.email);
      localStorage.setItem("name",       user.name);
      localStorage.setItem("role",       user.role);
      localStorage.setItem("avatar",     user.avatar || avatar);
      localStorage.setItem("userId",     user.id);
      localStorage.setItem("studentId",  user.studentId  || "");
      localStorage.setItem("department", user.department || "");

      setSuccess(true);
      setTimeout(() => navigate("/home"), 2200);

    } catch (err) {
      console.error("Registration error:", err); // debug
      // Show the exact error from backend
      const msg = err.response?.data?.message || err.message || "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const progressState = (i) => i < step ? "done" : i === step ? "active" : "";

  const inputFocus = (e) => {
    e.target.style.borderColor = "var(--blue)";
    e.target.style.background  = "rgba(59,158,255,0.06)";
    e.target.style.boxShadow   = "0 0 0 3px rgba(59,158,255,0.12)";
  };
  const inputBlur = (e) => {
    e.target.style.borderColor = "var(--border)";
    e.target.style.background  = "rgba(255,255,255,0.04)";
    e.target.style.boxShadow   = "none";
  };

  return (
    <div className="register-page auth-page">
      <div className="bg-grid" />
      <div className="orb orb-a" />
      <div className="orb orb-b" />

      <div className="register-wrap">

        {/* TOP BAR */}
        <div className="reg-topbar">
          <div
            className="brand"
            style={{ cursor: "pointer", marginBottom: 0 }}
            onClick={() => navigate("/login")}
          >
            <div className="brand-icon" style={{ background: "linear-gradient(135deg,#3b9eff,#0070f3)", boxShadow: "0 8px 24px rgba(59,158,255,0.35)" }}>
              🎓
            </div>
            <span className="brand-name">
              Smart<span style={{ color: "var(--blue)" }}>Exam</span>
            </span>
          </div>
          <span style={{ fontSize: 13, color: "var(--text2)" }}>
            Have an account?{" "}
            <span
              style={{ color: "var(--blue)", cursor: "pointer", fontWeight: 500 }}
              onClick={() => navigate("/login")}
            >
              Sign in
            </span>
          </span>
        </div>

        {/* PROGRESS BAR */}
        {!success && (
          <div className="progress-bar">
            {[1, 2, 3].map(i => (
              <div key={i} className={`progress-step ${progressState(i)}`} />
            ))}
          </div>
        )}

        {/* CARD */}
        <div className="form-card">

          {/* ── SUCCESS ── */}
          {success && (
            <div className="success-wrap anim-popIn">
              <div className="success-anim">✅</div>
              <div className="success-title">You're all set! 🎉</div>
              <p className="success-sub">
                Your SmartExam account has been created.<br />
                Redirecting to your dashboard…
              </p>
              <div className="spinner" style={{ margin: "0 auto", width: 22, height: 22 }} />
            </div>
          )}

          {/* ── STEP 1 — PERSONAL INFO ── */}
          {!success && step === 1 && (
            <div className="anim-fadeUp">
              <div className="step-badge">Step 1 of 3</div>
              <div className="step-title">Personal Info</div>
              <div className="step-sub">Tell us who you are — sets up your student profile.</div>

              {/* Avatar picker */}
              <div style={{ marginBottom: 18 }}>
                <label className="field-label">Choose your avatar</label>
                <div className="avatar-grid">
                  {AVATARS.map(av => (
                    <div
                      key={av}
                      className={`avatar-opt ${avatar === av ? "selected" : ""}`}
                      onClick={() => setAvatar(av)}
                    >
                      {av}
                    </div>
                  ))}
                </div>
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label className="field-label">First name</label>
                  <Field icon="👤" value={fname} onChange={setFname} placeholder="Arjun" />
                </div>
                <div className="field-group">
                  <label className="field-label">Last name</label>
                  <Field icon="👤" value={lname} onChange={setLname} placeholder="Sharma" />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Email address</label>
                <Field icon="✉️" type="email" value={email} onChange={setEmail} placeholder="you@university.edu" />
              </div>

              <div className="field-group">
                <label className="field-label">Phone number</label>
                <Field icon="📱" type="tel" value={phone} onChange={setPhone} placeholder="+91 98765 43210" />
              </div>

              {error && <div className="field-error" style={{ marginBottom: 12 }}>⚠️ {error}</div>}

              <div className="btn-row">
                <button className="btn-primary" onClick={() => goStep(2)}>Continue →</button>
              </div>
            </div>
          )}

          {/* ── STEP 2 — ACADEMIC INFO ── */}
          {!success && step === 2 && (
            <div className="anim-fadeUp">
              <div className="step-badge">Step 2 of 3</div>
              <div className="step-title">Academic Info</div>
              <div className="step-sub">Link your enrollment details for exam assignment.</div>

              <div className="field-row">
                <div className="field-group">
                  <label className="field-label">Student ID</label>
                  <Field icon="🆔" value={sid} onChange={setSid} placeholder="CS2024001" />
                </div>
                <div className="field-group">
                  <label className="field-label">Roll number</label>
                  <Field icon="🔢" value={roll} onChange={setRoll} placeholder="001" />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Department</label>
                <SelectField icon="🏛️" value={dept} onChange={setDept} options={DEPTS} placeholder="Select your department" />
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label className="field-label">Semester</label>
                  <SelectField icon="📅" value={sem} onChange={setSem} options={SEMS} placeholder="Semester" />
                </div>
                <div className="field-group">
                  <label className="field-label">Batch year</label>
                  <SelectField icon="🎓" value={batch} onChange={setBatch} options={BATCHES} placeholder="Batch" />
                </div>
              </div>

              {error && <div className="field-error" style={{ marginBottom: 12 }}>⚠️ {error}</div>}

              <div className="btn-row">
                <button className="btn-secondary" onClick={() => goStep(1)}>← Back</button>
                <button className="btn-primary"   onClick={() => goStep(3)}>Continue →</button>
              </div>
            </div>
          )}

          {/* ── STEP 3 — PASSWORD ── */}
          {!success && step === 3 && (
            <div className="anim-fadeUp">
              <div className="step-badge">Step 3 of 3</div>
              <div className="step-title">Set Password</div>
              <div className="step-sub">Create a strong password to secure your account.</div>

              {/* Password */}
              <div className="field-group">
                <label className="field-label">Password</label>
                <div className="field-wrap">
                  <span className="field-icon">🔒</span>
                  <input
                    type={showP1 ? "text" : "password"}
                    className="field-input"
                    value={pw1}
                    placeholder="Minimum 6 characters"
                    onChange={e => setPw1(e.target.value)}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                    autoComplete="new-password"
                  />
                  <button className="pw-toggle" onClick={() => setShowP1(v => !v)} type="button">
                    {showP1 ? "🙈" : "👁️"}
                  </button>
                </div>
                {/* Strength bars */}
                <div className="strength-row">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className="strength-bar"
                      style={{
                        background: i <= strength
                          ? (SM[strength - 1]?.color || "var(--coral)")
                          : "rgba(255,255,255,0.08)",
                      }}
                    />
                  ))}
                </div>
                {pw1 && (
                  <div style={{ fontSize: 11, marginTop: 5, color: SM[strength - 1]?.color }}>
                    {SM[strength - 1]?.label}
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="field-group">
                <label className="field-label">Confirm password</label>
                <div className="field-wrap">
                  <span className="field-icon">🔑</span>
                  <input
                    type={showP2 ? "text" : "password"}
                    className="field-input"
                    value={pw2}
                    placeholder="Repeat your password"
                    onChange={e => setPw2(e.target.value)}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                    autoComplete="new-password"
                  />
                  <button className="pw-toggle" onClick={() => setShowP2(v => !v)} type="button">
                    {showP2 ? "🙈" : "👁️"}
                  </button>
                </div>
                {pw2 && pw1 !== pw2 && (
                  <div className="field-error">Passwords do not match</div>
                )}
                {pw2 && pw1 === pw2 && pw1.length >= 6 && (
                  <div style={{ fontSize: 11, color: "var(--green)", marginTop: 5 }}>✓ Passwords match</div>
                )}
              </div>

              {/* Terms */}
              <div className="terms-row">
                <input
                  type="checkbox"
                  checked={terms}
                  onChange={e => setTerms(e.target.checked)}
                />
                <div className="terms-text">
                  I agree to the <span>Terms of Service</span> and{" "}
                  <span>Privacy Policy</span>. My exam data will be stored securely.
                </div>
              </div>

              {error && <div className="field-error" style={{ marginBottom: 12 }}>⚠️ {error}</div>}

              <div className="btn-row">
                <button className="btn-secondary" onClick={() => goStep(2)}>← Back</button>
                <button className="btn-primary" onClick={handleRegister} disabled={loading}>
                  {loading ? <><span className="spinner" /> Creating…</> : "Create Account 🎓"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}