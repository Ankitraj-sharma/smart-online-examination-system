// src/pages/Dashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API = "https://smart-online-examination-system.onrender.com/api";

export default function Dashboard() {
  const navigate   = useNavigate();
  const token      = localStorage.getItem("token");
  const userName   = localStorage.getItem("name")       || "Student";
  const userAvatar = localStorage.getItem("avatar")     || "🧑‍🎓";
  const department = localStorage.getItem("department") || "N/A";
  const studentId  = localStorage.getItem("studentId")  || "N/A";

  const [results,  setResults]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [detail,   setDetail]   = useState(null);
  const [error,    setError]    = useState("");

  // ── Fetch this student's results from API ──
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`${API}/results/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(res.data.results || []);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          setError("Failed to load results.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [token, navigate]);

  // ── Computed stats ──
  const total    = results.length;
  const avgPct   = total ? Math.round(results.reduce((a,r) => a + r.percentage, 0) / total) : 0;
  const passed   = results.filter(r => r.percentage >= 50).length;
  const distinc  = results.filter(r => r.percentage >= 80).length;
  const failed   = results.filter(r => r.percentage < 50).length;

  const filtered = results.filter(r =>
    (r.examName || "").toLowerCase().includes(search.toLowerCase())
  );

  const pColor = (p) => p >= 75 ? "var(--green)" : p >= 50 ? "var(--amber)" : "var(--coral)";
  const pBadge = (p) => p >= 80 ? "badge-green" : p >= 50 ? "badge-blue" : "badge-coral";
  const pLabel = (p) => p >= 80 ? "Distinction" : p >= 50 ? "Pass" : "Fail";
  const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
  const fmtTime = (s) => `${Math.floor(s/60)}m ${s%60}s`;

  const UPCOMING = [
    { name:"Data Structures & Algorithms", questions:15, duration:30, date:"March 25, 2026", time:"10:00 AM", urgency:"urgent", countdown:"Tomorrow" },
    { name:"Operating Systems (Final)",     questions:15, duration:30, date:"March 27, 2026", time:"2:00 PM",  urgency:"soon",   countdown:"In 3 days" },
    { name:"Computer Networks",            questions:15, duration:30, date:"April 1, 2026",  time:"11:00 AM", urgency:"later",  countdown:"In 8 days" },
  ];

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <div className="bg-grid"/>
        <div className="orb orb-a"/><div className="orb orb-b"/>

        <div className="dash-content">

          {/* GREETING */}
          <div className="greeting anim-fadeUp">
            <div className="greeting-glow"/>
            <div>
              <h2 className="greeting-title">Good morning, {userName.split(" ")[0]}! 👋</h2>
              <p className="greeting-sub">
                {total > 0
                  ? <>You have completed <strong style={{color:"var(--blue)"}}>{total} exam{total > 1 ? "s" : ""}</strong>. Avg score: <strong style={{color:"var(--green)"}}>{avgPct}%</strong></>
                  : <>Welcome! Take your first exam to see your results here.</>
                }
              </p>
            </div>
            <div className="greeting-avatar">{userAvatar}</div>
          </div>

          {/* STAT CARDS */}
          <div className="stat-grid">
            {[
              { icon:"📝", bg:"var(--blue-dim)",  val:total,       label:"Exams Taken",  color:"var(--blue)",  trend:`+${total}` },
              { icon:"🏆", bg:"var(--green-dim)", val:`${avgPct}%`, label:"Avg Score",    color:"var(--green)", trend:"overall"   },
              { icon:"✅", bg:"var(--teal-dim)",  val:passed,      label:"Exams Passed", color:"var(--teal)",  trend:`${total ? Math.round(passed/total*100) : 0}%` },
              { icon:"🎯", bg:"var(--amber-dim)", val:`#${total < 5 ? "N/A" : "12"}`, label:"Dept. Rank", color:"var(--amber)", trend:"CSE" },
            ].map((s,i) => (
              <div key={i} className={`stat-card anim-fadeUp d-${i+1}`}>
                <div className="stat-top">
                  <div className="stat-icon-wrap" style={{background:s.bg}}>{s.icon}</div>
                  <span className="trend-up">{s.trend}</span>
                </div>
                <div className="stat-val" style={{color:s.color}}>{s.val}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* CHARTS ROW */}
          <div className="charts-row">

            {/* Score Trend */}
            <div className="chart-card anim-fadeUp d-3">
              <div className="chart-header">
                <div>
                  <div className="chart-title">Score Trend</div>
                  <div className="chart-sub">Your last {Math.min(results.length,14)} exams</div>
                </div>
              </div>
              {loading ? (
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:150,color:"var(--text2)",fontSize:13}}>
                  <span className="spinner" style={{marginRight:10}}/>Loading results…
                </div>
              ) : results.length === 0 ? (
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:150,gap:8}}>
                  <span style={{fontSize:32}}>📭</span>
                  <span style={{fontSize:13,color:"var(--text2)"}}>No exam results yet.</span>
                  <button className="start-exam-btn" style={{width:"auto",padding:"8px 20px",marginTop:4}} onClick={()=>navigate("/exam")}>Take your first exam →</button>
                </div>
              ) : (
                <>
                  <div className="trend-bars">
                    {results.slice(-14).map((r,i) => (
                      <div key={i} className="trend-bar-wrap" title={`${r.examName}: ${r.percentage}%`}>
                        <div className="trend-bar-fill" style={{height:`${r.percentage}%`,background:pColor(r.percentage)}}/>
                        <div className="trend-bar-label">E{i+1}</div>
                      </div>
                    ))}
                  </div>
                  <div className="chart-legend">
                    <span style={{color:"var(--green)"}}>● ≥75% Good</span>
                    <span style={{color:"var(--amber)"}}>● ≥50% Pass</span>
                    <span style={{color:"var(--coral)"}}>● &lt;50% Fail</span>
                  </div>
                </>
              )}
            </div>

            {/* Donut */}
            <div className="chart-card anim-fadeUp d-4">
              <div className="chart-header">
                <div className="chart-title">Result Breakdown</div>
                <div className="chart-sub">{total} exams total</div>
              </div>
              <div className="donut-wrap">
                <div>
                  <svg viewBox="0 0 120 120" width="130" height="130">
                    <circle cx="60" cy="60" r="48" fill="none" stroke="var(--card2)" strokeWidth="14"/>
                    {total > 0 && <>
                      <circle cx="60" cy="60" r="48" fill="none" stroke="var(--green)" strokeWidth="14"
                        strokeDasharray={`${distinc/total*301.6} 301.6`} strokeDashoffset="75.4"
                        transform="rotate(-90 60 60)"/>
                      <circle cx="60" cy="60" r="48" fill="none" stroke="var(--blue)" strokeWidth="14"
                        strokeDasharray={`${(passed-distinc)/total*301.6} 301.6`}
                        strokeDashoffset={`${75.4-distinc/total*301.6}`}
                        transform="rotate(-90 60 60)"/>
                      <circle cx="60" cy="60" r="48" fill="none" stroke="var(--coral)" strokeWidth="14"
                        strokeDasharray={`${failed/total*301.6} 301.6`}
                        strokeDashoffset={`${75.4-passed/total*301.6}`}
                        transform="rotate(-90 60 60)"/>
                    </>}
                    <text x="60" y="55" textAnchor="middle" fill="var(--text)" fontSize="16" fontWeight="700" fontFamily="Outfit">{total}</text>
                    <text x="60" y="70" textAnchor="middle" fill="var(--text2)" fontSize="8">exams</text>
                  </svg>
                </div>
                <div className="donut-stats">
                  {[
                    {label:"Distinction",  val:distinc,       color:"var(--green)"},
                    {label:"Pass",         val:passed-distinc,color:"var(--blue)"},
                    {label:"Failed",       val:failed,        color:"var(--coral)"},
                  ].map((r,i) => (
                    <div key={i} className="donut-row">
                      <span className="donut-dot" style={{background:r.color}}/>
                      <span className="donut-label">{r.label}</span>
                      <span className="donut-val" style={{color:r.color}}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM GRID */}
          <div className="bottom-grid">

            {/* Exam History Table */}
            <div className="table-card anim-fadeUp d-4">
              <div className="table-header">
                <div className="chart-title">Exam History</div>
                <span className="view-all-link">Total: {total}</span>
              </div>
              <div className="search-bar">
                <span>🔍</span>
                <input className="search-input" placeholder="Search exams…" value={search} onChange={e=>setSearch(e.target.value)}/>
                {search && <span className="search-clear" onClick={()=>setSearch("")}>✕</span>}
              </div>

              {error && <div style={{color:"var(--coral)",fontSize:13,padding:"8px 0"}}>{error}</div>}

              {loading ? (
                <div style={{display:"flex",justifyContent:"center",padding:"20px 0"}}>
                  <span className="spinner"/>
                </div>
              ) : (
                <div className="table-wrap">
                  <table className="exam-table">
                    <thead>
                      <tr>
                        <th>#</th><th>Exam Name</th><th>Score</th><th>%</th><th>Time</th><th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr><td colSpan={6} className="no-results">
                          {total === 0 ? "No exams taken yet. Start your first exam!" : `No results match "${search}"`}
                        </td></tr>
                      ) : (
                        filtered.map((r,i) => (
                          <tr key={r._id} className="exam-row" onClick={()=>setDetail(r)}>
                            <td className="td-num">{i+1}</td>
                            <td>
                              <div className="exam-name-cell">{r.examName || "Online Exam"}</div>
                              <div className="exam-date-cell">{fmtDate(r.createdAt)}</div>
                            </td>
                            <td style={{color:pColor(r.percentage),fontWeight:700,fontFamily:"Outfit,sans-serif",fontSize:15}}>
                              {r.score}/{r.totalMarks}
                            </td>
                            <td>
                              <div className="mini-bar-row">
                                <div className="mini-bar-track">
                                  <div className="mini-bar-fill" style={{width:r.percentage+"%",background:pColor(r.percentage)}}/>
                                </div>
                                <span style={{color:pColor(r.percentage),fontSize:12,fontWeight:600}}>{r.percentage}%</span>
                              </div>
                            </td>
                            <td style={{fontSize:12,color:"var(--text2)"}}>{fmtTime(r.timeTaken||0)}</td>
                            <td><span className={`badge ${pBadge(r.percentage)}`}>{pLabel(r.percentage)}</span></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="right-col">
              {/* Upcoming */}
              <div className="upcoming-card anim-fadeUp d-5">
                <div className="chart-title" style={{marginBottom:14}}>📅 Upcoming Exams</div>
                {UPCOMING.map((ex,i) => (
                  <div key={i} className={`upcoming-item urgency-${ex.urgency}`}>
                    <div className="upcoming-top">
                      <div>
                        <div className="upcoming-name">{ex.name}</div>
                        <div className="upcoming-meta">{ex.questions} MCQs · {ex.duration} min</div>
                      </div>
                      <span className={`countdown-badge countdown-${ex.urgency}`}>{ex.countdown}</span>
                    </div>
                    <div className="upcoming-time">📅 {ex.date} · {ex.time}</div>
                  </div>
                ))}
                <button className="start-exam-btn" onClick={()=>navigate("/exam")}>
                  🚀 Start Next Exam
                </button>
              </div>

              {/* Student Info Card */}
              <div className="rank-card anim-fadeUp d-6">
                <div style={{fontSize:40,marginBottom:8}}>{userAvatar}</div>
                <div className="rank-label">{userName}</div>
                <div style={{fontSize:12,color:"var(--text2)",marginTop:4}}>ID: {studentId}</div>
                <div style={{fontSize:12,color:"var(--text2)",marginTop:2}}>{department}</div>
                <div style={{marginTop:12}}>
                  <span style={{fontFamily:"Outfit,sans-serif",fontSize:24,fontWeight:800,color:"var(--amber)"}}>
                    {total > 0 ? `${avgPct}%` : "—"}
                  </span>
                  <div style={{fontSize:11,color:"var(--text2)",marginTop:2}}>Avg. Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        {detail && (
          <div className="modal-overlay" onClick={()=>setDetail(null)}>
            <div className="modal-box" onClick={e=>e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-icon">📝</div>
                <div>
                  <div className="modal-title">{detail.examName || "Online Exam"}</div>
                  <div className="modal-sub">{fmtDate(detail.createdAt)}</div>
                </div>
                <button className="modal-close-btn" onClick={()=>setDetail(null)}>✕</button>
              </div>
              {[
                ["Score",       `${detail.score} / ${detail.totalMarks}`],
                ["Percentage",  `${detail.percentage}%`],
                ["Result",      pLabel(detail.percentage)],
                ["Correct",     `${detail.correctCount || detail.score}`],
                ["Wrong",       `${detail.wrongCount || (detail.totalMarks - detail.score)}`],
                ["Skipped",     `${detail.skippedCount || 0}`],
                ["Time Taken",  fmtTime(detail.timeTaken || 0)],
                ["Date",        fmtDate(detail.createdAt)],
              ].map(([k,v],i) => (
                <div key={i} className="modal-row">
                  <span className="modal-key">{k}</span>
                  <span className="modal-value" style={
                    k==="Percentage"?{color:pColor(detail.percentage)}:
                    k==="Result"?{color:detail.percentage>=50?"var(--green)":"var(--coral)"}:{}
                  }>{v}</span>
                </div>
              ))}
              <button className="btn-primary" style={{marginTop:20}} onClick={()=>setDetail(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}