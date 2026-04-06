// src/pages/Result.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Result() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [showAnswers, setShowAnswers] = useState(false);

  // Result data passed from Exam.js via navigate state
  const r = location.state || {
    correct:0, wrong:0, total:0, skippedCount:0,
    unattempted:0, pct:0, timeTaken:0, answers:{}, questions:[],
  };

  const pColor  = r.pct>=75 ? "var(--green)" : r.pct>=50 ? "var(--amber)" : "var(--coral)";
  const grade   = r.pct>=90?"A+":r.pct>=80?"A":r.pct>=70?"B+":r.pct>=60?"B":r.pct>=50?"C":"F";
  const trophy  = r.pct>=80?"🏆":r.pct>=50?"✅":"📋";
  const verdict = r.pct>=80?"Excellent Work!":r.pct>=50?"You Passed!":"Better Luck Next Time";
  const fmtTime = (s) => `${Math.floor(s/60)}m ${s%60}s`;
  const today   = new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});

  return (
    <>
      <Navbar/>
      <div className="result-page">
        <div className="bg-grid"/><div className="orb orb-a"/><div className="orb orb-b"/>

        <div className="result-content">

          {/* HERO */}
          <div className="result-hero anim-fadeUp">
            <span className="result-trophy">{trophy}</span>
            <div className="result-title">{verdict}</div>
            <div className="result-sub">Online Examination · {today}</div>

            <div className="result-score-ring" style={{borderColor:pColor,boxShadow:`0 0 40px ${pColor}33`}}>
              <div className="result-pct" style={{color:pColor}}>{r.pct}%</div>
              <div className="result-pct-label">Score</div>
            </div>

            <div className="result-stats-row">
              {[
                {val:`${r.correct}/${r.total}`, lbl:"Correct",   color:"var(--green)"},
                {val:grade,                      lbl:"Grade",     color:pColor},
                {val:fmtTime(r.timeTaken||0),    lbl:"Time Taken",color:"var(--blue)"},
                {val:r.pct>=50?"PASS":"FAIL",    lbl:"Result",    color:r.pct>=50?"var(--green)":"var(--coral)"},
              ].map((s,i)=>(
                <div key={i} className="result-stat">
                  <div className="result-stat-val" style={{color:s.color}}>{s.val}</div>
                  <div className="result-stat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* GRID */}
          <div className="result-grid">

            {/* Breakdown */}
            <div className="result-card anim-fadeUp d-2">
              <div className="result-card-title">📊 Answer Breakdown</div>
              {[
                {icon:"✅",label:"Correct",      val:r.correct,       color:"var(--green)", pct:r.total?r.correct/r.total*100:0},
                {icon:"❌",label:"Wrong",         val:r.wrong,         color:"var(--coral)", pct:r.total?r.wrong/r.total*100:0},
                {icon:"⏭️",label:"Skipped",      val:r.skippedCount,  color:"var(--amber)", pct:r.total?r.skippedCount/r.total*100:0},
                {icon:"🔲",label:"Not attempted", val:r.unattempted,   color:"var(--text2)", pct:r.total?r.unattempted/r.total*100:0},
              ].map((row,i)=>(
                <div key={i}>
                  <div className="breakdown-row">
                    <span className="breakdown-icon">{row.icon}</span>
                    <span className="breakdown-label">{row.label}</span>
                    <span className="breakdown-val" style={{color:row.color}}>{row.val}</span>
                  </div>
                  <div className="breakdown-bar-track" style={{margin:"6px 0 10px 38px"}}>
                    <div className="breakdown-bar-fill" style={{width:`${row.pct}%`,background:row.color}}/>
                  </div>
                </div>
              ))}
            </div>

            {/* Details */}
            <div className="result-card anim-fadeUp d-3">
              <div className="result-card-title">📋 Exam Details</div>
              {[
                ["Total Questions", r.total],
                ["Marks Obtained",  r.correct,  pColor],
                ["Percentage",      `${r.pct}%`, pColor],
                ["Grade",           grade,        pColor],
                ["Result",          r.pct>=50?"PASS":"FAIL", r.pct>=50?"var(--green)":"var(--coral)"],
                ["Time Taken",      fmtTime(r.timeTaken||0)],
                ["Date",            today],
              ].map(([k,v,c])=>(
                <div key={k} className="result-detail-row">
                  <span className="rd-key">{k}</span>
                  <span className="rd-val" style={{color:c||"var(--text)"}}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ANSWER REVIEW */}
          {r.questions && r.questions.length > 0 && (
            <div className="result-card anim-fadeUp d-4" style={{marginBottom:22}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:showAnswers?16:0}}>
                <div className="result-card-title" style={{marginBottom:0}}>📝 Answer Review</div>
                <button className="btn-secondary" style={{padding:"8px 18px",fontSize:13}} onClick={()=>setShowAnswers(v=>!v)}>
                  {showAnswers?"Hide Answers ▲":"Show Answers ▼"}
                </button>
              </div>

              {showAnswers && (
                <div style={{display:"flex",flexDirection:"column",gap:14,marginTop:16}}>
                  {r.questions.map((q,qi) => {
                    const userAns   = r.answers[qi];
                    const isCorrect = userAns === q.correctAnswer;
                    const isSkipped = userAns === undefined;
                    return (
                      <div key={qi} style={{
                        background:"var(--card2)",border:"1px solid var(--border)",borderRadius:"var(--r-md)",padding:"16px 18px",
                        borderLeft:`3px solid ${isCorrect?"var(--green)":isSkipped?"var(--amber)":"var(--coral)"}`,
                      }}>
                        <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:12}}>
                          <span style={{background:"var(--blue-dim)",color:"var(--blue)",fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:"var(--r-sm)",flexShrink:0,fontFamily:"var(--font-display)"}}>Q{qi+1}</span>
                          <span style={{fontSize:14,fontWeight:600,lineHeight:1.5,flex:1}}>{q.questionText}</span>
                          <span style={{fontSize:18,flexShrink:0}}>{isSkipped?"⏭️":isCorrect?"✅":"❌"}</span>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:6}}>
                          {(q.options||[]).map((opt,oi)=>{
                            const isCorrectOpt = oi === q.correctAnswer;
                            const isUserOpt    = oi === userAns;
                            return (
                              <div key={oi} style={{
                                display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:"var(--r-sm)",
                                background:isCorrectOpt?"var(--green-dim)":isUserOpt?"var(--coral-dim)":"rgba(255,255,255,0.03)",
                                border:`1px solid ${isCorrectOpt?"rgba(34,197,94,0.3)":isUserOpt?"rgba(255,92,109,0.3)":"var(--border)"}`,
                                color:isCorrectOpt?"var(--green)":isUserOpt?"var(--coral)":"var(--text2)",
                                fontSize:13,
                              }}>
                                <span style={{
                                  width:22,height:22,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",
                                  fontSize:11,fontWeight:700,
                                  background:isCorrectOpt?"var(--green)":isUserOpt?"var(--coral)":"rgba(255,255,255,0.06)",
                                  color:(isCorrectOpt||isUserOpt)?"#fff":"var(--text3)",
                                }}>
                                  {String.fromCharCode(65+oi)}
                                </span>
                                {opt}
                                {isCorrectOpt && <span style={{marginLeft:"auto",fontSize:11,fontWeight:600,color:"var(--green)"}}>✓ Correct</span>}
                                {isUserOpt&&!isCorrectOpt && <span style={{marginLeft:"auto",fontSize:11,fontWeight:600,color:"var(--coral)"}}>✗ Your answer</span>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ACTIONS */}
          <div className="result-actions anim-fadeUp d-5">
            <button className="action-btn primary" onClick={()=>navigate("/exam")}>🔄 Retake Exam</button>
            <button className="action-btn secondary" onClick={()=>navigate("/dashboard")}>🏠 Dashboard</button>
            <button className="action-btn secondary" onClick={()=>window.print()}>🖨️ Print Result</button>
          </div>

        </div>
      </div>
    </>
  );
}