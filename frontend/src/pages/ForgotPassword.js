// src/pages/ForgotPassword.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://smart-online-examination-system.onrender.com/api/auth";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState("");
  const [newPw,    setNewPw]    = useState("");
  const [confirmPw,setConfirmPw]= useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);

  const handleReset = async () => {
    setError("");
    if(!email.trim())              { setError("Email is required.");              return; }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email."); return; }
    if(newPw.length < 6)           { setError("Password must be at least 6 characters."); return; }
    if(newPw !== confirmPw)        { setError("Passwords do not match."); return; }

    setLoading(true);
    try {
      await axios.post(`${API}/forgot-password`, {
        email: email.trim().toLowerCase(),
        newPassword: newPw,
      });
      setSuccess(true);
      setTimeout(()=>navigate("/login"), 2200);
    } catch(err) {
      setError(err.response?.data?.message || "Failed. Please check your email and try again.");
    } finally {
      setLoading(false);
    }
  };

  const fi=(e)=>{e.target.style.borderColor="var(--blue)";e.target.style.background="rgba(59,158,255,0.06)";e.target.style.boxShadow="0 0 0 3px rgba(59,158,255,0.12)";};
  const fb=(e)=>{e.target.style.borderColor="var(--border)";e.target.style.background="rgba(255,255,255,0.04)";e.target.style.boxShadow="none";};

  return (
    <div className="forgot-page auth-page">
      <div className="bg-grid"/><div className="orb orb-a"/><div className="orb orb-b"/>

      <div className="forgot-card">
        <div className="form-card">
          {success ? (
            <div className="success-wrap anim-popIn">
              <div className="success-anim">✅</div>
              <div className="success-title">Password Updated!</div>
              <p className="success-sub">Your password has been reset successfully.<br/>Redirecting to login…</p>
              <div className="spinner" style={{margin:"0 auto",width:22,height:22}}/>
            </div>
          ) : (
            <>
              {/* Brand */}
              <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:28,cursor:"pointer"}} onClick={()=>navigate("/login")}>
                <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#3b9eff,#0070f3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🎓</div>
                <span style={{fontFamily:"var(--font-display)",fontSize:19,fontWeight:800}}>Smart<span style={{color:"var(--blue)"}}>Exam</span></span>
              </div>

              <div style={{width:52,height:52,borderRadius:"50%",background:"rgba(245,166,35,0.12)",border:"1px solid rgba(245,166,35,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:18}}>🔐</div>

              <div className="form-title">Reset Password</div>
              <p className="form-sub">Enter your registered email and set a new password.</p>

              <div className="field-group">
                <label className="field-label">Registered email</label>
                <div className="field-wrap">
                  <span className="field-icon">✉️</span>
                  <input type="email" className="field-input" placeholder="you@university.edu"
                    value={email} onChange={e=>setEmail(e.target.value)} onFocus={fi} onBlur={fb}/>
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">New password</label>
                <div className="field-wrap">
                  <span className="field-icon">🔒</span>
                  <input type={showPw?"text":"password"} className="field-input" placeholder="Minimum 6 characters"
                    value={newPw} onChange={e=>setNewPw(e.target.value)} onFocus={fi} onBlur={fb}
                    style={{paddingRight:44}}/>
                  <button className="pw-toggle" onClick={()=>setShowPw(v=>!v)} type="button">{showPw?"🙈":"👁️"}</button>
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Confirm new password</label>
                <div className="field-wrap">
                  <span className="field-icon">🔑</span>
                  <input type="password" className="field-input" placeholder="Repeat new password"
                    value={confirmPw} onChange={e=>setConfirmPw(e.target.value)} onFocus={fi} onBlur={fb}/>
                </div>
                {confirmPw&&newPw!==confirmPw&&<div className="field-error">Passwords do not match</div>}
                {confirmPw&&newPw===confirmPw&&newPw.length>=6&&<div style={{fontSize:11,color:"var(--green)",marginTop:5}}>✓ Passwords match</div>}
              </div>

              {error&&<div className="field-error" style={{marginBottom:14}}>⚠️ {error}</div>}

              <button className="btn-primary" onClick={handleReset} disabled={loading}>
                {loading?<><span className="spinner"/>Resetting…</>:"🔐 Reset Password"}
              </button>

              <p style={{textAlign:"center",marginTop:18,fontSize:13,color:"var(--text2)"}}>
                Remembered it? <span style={{color:"var(--blue)",cursor:"pointer",fontWeight:600}} onClick={()=>navigate("/login")}>Back to Login</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}