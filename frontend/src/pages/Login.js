// src/pages/Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api/auth";

const ROLES = {
  student: {
    label: "Student", icon: "🎓",
    endpoint: `${API}/login`, redirect: "/dashboard",
    color: "#3b9eff", colorDim: "rgba(59,158,255,0.11)",
    colorGlow: "rgba(59,158,255,0.35)", colorBorder: "rgba(59,158,255,0.26)",
    btnGrad: "linear-gradient(135deg,#3b9eff 0%,#0070f3 100%)",
    btnShadow: "0 8px 28px rgba(59,158,255,0.35)",
    placeholder: "student@university.edu",
    greeting: "Welcome back 👋",
    sub: "Sign in to access your exams and results.",
    tagLabel: "Student Portal",
  },
  admin: {
    label: "Admin", icon: "🧑‍💼",
    endpoint: `${API}/admin-login`, redirect: "/admin",
    color: "#a855f7", colorDim: "rgba(168,85,247,0.11)",
    colorGlow: "rgba(168,85,247,0.35)", colorBorder: "rgba(168,85,247,0.26)",
    btnGrad: "linear-gradient(135deg,#a855f7 0%,#7c3aed 100%)",
    btnShadow: "0 8px 28px rgba(168,85,247,0.35)",
    placeholder: "admin@university.edu",
    greeting: "Admin Access 🛡️",
    sub: "Restricted area — authorized personnel only.",
    tagLabel: "Admin Panel",
  },
};

export default function Login() {
  const [role,    setRole]    = useState("student");
  const [email,   setEmail]   = useState("");
  const [password,setPassword]= useState("");
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [focused, setFocused] = useState("");
  const navigate = useNavigate();

  const R = ROLES[role];

  const switchRole = (r) => {
    if (r === role) return;
    setRole(r); setEmail(""); setPassword(""); setError(""); setShowPw(false);
  };

  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password) { setError("Please fill in all fields."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email."); return; }

    setLoading(true);
    try {
      const res = await axios.post(R.endpoint, { email: email.trim().toLowerCase(), password });
      const { token, user } = res.data;

      localStorage.setItem("token",    token);
      localStorage.setItem("email",    user.email);
      localStorage.setItem("name",     user.name);
      localStorage.setItem("role",     user.role);
      localStorage.setItem("avatar",   user.avatar || (role === "admin" ? "🧑‍💼" : "🧑‍🎓"));
      localStorage.setItem("userId",   user.id);
      localStorage.setItem("studentId", user.studentId  || "");
      localStorage.setItem("department",user.department || "");

      navigate(R.redirect);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleLogin(); };

  const PANEL = {
    student: {
      title: "Exam smarter,", accent: "not harder.",
      sub: "A next-generation exam system — secure, auto-graded, real-time results and beautiful analytics.",
      stats: [{ n:"12K+", l:"Students enrolled" },{ n:"98%", l:"Uptime" },{ n:"4.9★", l:"Rating" }],
    },
    admin: {
      title: "Manage exams", accent: "with full control.",
      sub: "Admin dashboard to add questions, view student results, control exam content and monitor performance.",
      stats: [{ n:"186", l:"Students registered" },{ n:"14", l:"Exams conducted" },{ n:"99%", l:"Uptime" }],
    },
  };
  const P = PANEL[role];

  return (
    <div className="auth-page">
      <div className="bg-grid"/>
      <div className="orb orb-a" style={{ background: role === "admin" ? "rgba(168,85,247,0.10)" : undefined }}/>
      <div className="orb orb-b"/>

      <div className="login-layout" style={{ background: role === "admin" ? "linear-gradient(145deg,#080414,#130a2a)" : undefined }}>

        {/* ── LEFT HERO ── */}
        <div className="login-left" style={{ background: role === "admin" ? "linear-gradient(145deg,#080414 0%,#130a2a 60%,#1a0f3a 100%)" : "linear-gradient(145deg,#020817 0%,#060f2a 60%,#0a1540 100%)" }}>
          <div style={{ position:"absolute",inset:0,backgroundImage:`linear-gradient(${R.color}08 1px,transparent 1px),linear-gradient(90deg,${R.color}08 1px,transparent 1px)`,backgroundSize:"52px 52px",pointerEvents:"none" }}/>
          <div style={{ position:"absolute",width:520,height:520,borderRadius:"50%",top:-130,left:-150,background:`radial-gradient(circle,${R.colorDim} 0%,transparent 70%)`,filter:"blur(100px)",pointerEvents:"none",transition:"background 0.5s" }}/>

          <div className="brand">
            <div className="brand-icon" style={{ background:R.btnGrad, boxShadow:`0 8px 24px ${R.colorGlow}` }}>🎓</div>
            <span className="brand-name">Smart<span style={{ color:R.color }}>Exam</span></span>
          </div>

          <div className="hero-tag" style={{ background:`rgba(${role==="admin"?"168,85,247":"59,158,255"},0.10)`, border:`1px solid ${R.colorBorder}`, color:R.color }}>
            <span className="pulse-dot" style={{ background: role==="admin"?"#c084fc":"#00e5c4" }}/>
            {R.tagLabel}
          </div>

          <div key={role} className="anim-roleFade">
            <h1 className="hero-title">
              {P.title}<br/>
              <span style={{ color:R.color }}>{P.accent}</span>
            </h1>
            <p className="hero-sub">{P.sub}</p>
            <div className="stats-row">
              {P.stats.map((s,i) => (
                <div key={i}>
                  <div className="stat-num"><span style={{ color:R.color }}>{s.n}</span></div>
                  <div className="stat-lbl">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT FORM ── */}
        <div className="login-right" style={{ background: role==="admin"?"#06030f":"#030d1f" }}>
          <div className="form-card">

            {/* Role switcher */}
            <div className="role-switcher">
              {Object.entries(ROLES).map(([r, cfg]) => (
                <button
                  key={r}
                  className="role-switcher-btn"
                  onClick={() => switchRole(r)}
                  style={{
                    background: role===r ? cfg.btnGrad : "transparent",
                    color: role===r ? "#fff" : "var(--text3)",
                    boxShadow: role===r ? `0 4px 22px ${cfg.colorGlow}` : "none",
                    transform: role===r ? "scale(1.02)" : "scale(1)",
                  }}
                >
                  <span style={{ fontSize:17 }}>{cfg.icon}</span> {cfg.label}
                  {role===r && <span style={{ width:6,height:6,borderRadius:"50%",background:"rgba(255,255,255,0.7)",marginLeft:2 }}/>}
                </button>
              ))}
            </div>

            {/* Role indicator */}
            <div key={`ind-${role}`} className="role-indicator anim-roleFade" style={{ background:R.colorDim, border:`1px solid ${R.colorBorder}` }}>
              <span style={{ fontSize:20 }}>{R.icon}</span>
              <span className="role-indicator-text" style={{ color: role==="admin"?"#c084fc":R.color }}>
                {role==="student" ? "Signing in as Student — view exams & results" : "Signing in as Admin — manage questions & data"}
              </span>
              <span className="role-blink" style={{ background:R.color }}/>
            </div>

            <div key={`title-${role}`} className="anim-roleFade">
              <div className="form-title">{R.greeting}</div>
              <p className="form-sub">
                {R.sub}{" "}
                {role==="student" && <span style={{ color:"var(--blue)" }} onClick={() => navigate("/register")}>New? Register free</span>}
              </p>
            </div>

            {/* Email */}
            <div className="field-group">
              <label className="field-label">{role==="admin"?"Admin Email":"Email address"}</label>
              <div className="field-wrap">
                <span className="field-icon" style={{ color:focused==="email"?R.color:"var(--text3)" }}>✉️</span>
                <input className="field-input" type="email" placeholder={R.placeholder}
                  value={email} onChange={e=>setEmail(e.target.value)}
                  onFocus={()=>setFocused("email")} onBlur={()=>setFocused("")}
                  onKeyDown={handleKey}
                  style={{ borderColor:focused==="email"?R.color:"", background:focused==="email"?R.colorDim:"", boxShadow:focused==="email"?`0 0 0 3px ${R.colorDim}`:"" }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="field-group">
              <label className="field-label">Password</label>
              <div className="field-wrap">
                <span className="field-icon" style={{ color:focused==="pw"?R.color:"var(--text3)" }}>🔒</span>
                <input className="field-input" type={showPw?"text":"password"} placeholder="••••••••"
                  value={password} onChange={e=>setPassword(e.target.value)}
                  onFocus={()=>setFocused("pw")} onBlur={()=>setFocused("")}
                  onKeyDown={handleKey}
                  style={{ paddingRight:44, borderColor:focused==="pw"?R.color:"", background:focused==="pw"?R.colorDim:"", boxShadow:focused==="pw"?`0 0 0 3px ${R.colorDim}`:"" }}
                />
                <button className="pw-toggle" onClick={()=>setShowPw(v=>!v)} type="button">{showPw?"🙈":"👁️"}</button>
              </div>
            </div>

            {error && <div className="field-error" style={{ marginBottom:12 }}>⚠️ {error}</div>}

            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22 }}>
              <label style={{ display:"flex",alignItems:"center",gap:7,fontSize:13,color:"var(--text2)",cursor:"pointer" }}>
                <input type="checkbox" style={{ accentColor:R.color,width:15,height:15 }}/> Remember me
              </label>
              <span style={{ fontSize:13,color:R.color,cursor:"pointer" }} onClick={()=>navigate("/forgot-password")}>Forgot Password?</span>
            </div>

            <button className="btn-primary" onClick={handleLogin} disabled={loading}
              style={{ background:loading?`${R.color}88`:R.btnGrad, boxShadow:loading?"none":R.btnShadow }}>
              {loading ? <><span className="spinner"/>Signing in…</> : `${R.icon} Sign in as ${R.label} →`}
            </button>

            <div style={{ display:"flex",alignItems:"center",gap:12,margin:"20px 0" }}>
              <div style={{ flex:1,height:1,background:"var(--border)" }}/>
              <span style={{ fontSize:12,color:"var(--text3)" }}>{role==="admin"?"admin access only":"or continue with"}</span>
              <div style={{ flex:1,height:1,background:"var(--border)" }}/>
            </div>

            {role==="student" ? (
              <div style={{ display:"flex",gap:10 }}>
                {[{icon:"🔵",label:"Google"},{icon:"⚫",label:"GitHub"}].map(({icon,label})=>(
                  <button key={label} style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:11,background:"rgba(255,255,255,0.04)",border:"1px solid var(--border)",borderRadius:"var(--r-md)",color:"var(--text2)",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit",transition:"all 0.18s" }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.background="var(--blue-dim)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.background="rgba(255,255,255,0.04)";}}>
                    {icon} {label}
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ display:"flex",alignItems:"flex-start",gap:10,background:"rgba(168,85,247,0.07)",border:"1px solid rgba(168,85,247,0.18)",borderRadius:"var(--r-md)",padding:"12px 14px" }}>
                <span style={{ fontSize:18,flexShrink:0 }}>🔐</span>
                <div>
                  <div style={{ fontSize:12,fontWeight:600,color:"#c084fc",marginBottom:3 }}>Admin Authentication</div>
                  <div style={{ fontSize:11,color:"var(--text2)",lineHeight:1.6 }}>Restricted to authorized admins only. All access attempts are logged.</div>
                </div>
              </div>
            )}

            <p style={{ textAlign:"center",marginTop:20,fontSize:13,color:"var(--text2)" }}>
              {role==="student" ? (
                <>New user? <span style={{ color:"var(--blue)",cursor:"pointer",fontWeight:600 }} onClick={()=>navigate("/register")}>Register here</span></>
              ) : (
                <>Student? <span style={{ color:"var(--blue)",cursor:"pointer",fontWeight:600 }} onClick={()=>switchRole("student")}>Switch to Student Login</span></>
              )}
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}