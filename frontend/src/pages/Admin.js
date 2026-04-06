// src/pages/Admin.js
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API = "http://localhost:5000/api";

// ── Must match Home.js EXAM_CATALOG exactly ──────────────────────
const EXAM_CATALOG = [
  {
    id:          "dsa",
    title:       "Data Structures & Algorithms",
    subject:     "Algorithms",
    icon:        "🧮",
    color:       "#3b9eff",
    colorDim:    "rgba(59,158,255,0.10)",
    colorBorder: "rgba(59,158,255,0.25)",
    gradient:    "linear-gradient(135deg,#3b9eff,#0070f3)",
    difficulty:  "Medium",
    diffColor:   "#f5a623",
    tags:        ["Arrays","Trees","Graphs","Sorting","Dynamic Programming"],
  },
  {
    id:          "dbms",
    title:       "Database Management",
    subject:     "DBMS",
    icon:        "🗄️",
    color:       "#00e0c4",
    colorDim:    "rgba(0,224,196,0.10)",
    colorBorder: "rgba(0,224,196,0.25)",
    gradient:    "linear-gradient(135deg,#00e0c4,#0097a7)",
    difficulty:  "Easy",
    diffColor:   "#22c55e",
    tags:        ["SQL","Normalization","ACID","ER Diagram","Transactions"],
  },
  {
    id:          "os",
    title:       "Operating Systems",
    subject:     "OS",
    icon:        "🖥️",
    color:       "#a855f7",
    colorDim:    "rgba(168,85,247,0.10)",
    colorBorder: "rgba(168,85,247,0.25)",
    gradient:    "linear-gradient(135deg,#a855f7,#7c3aed)",
    difficulty:  "Hard",
    diffColor:   "#ff5c6d",
    tags:        ["Scheduling","Memory","Deadlock","IPC","Virtual Memory"],
  },
  {
    id:          "networks",
    title:       "Computer Networks",
    subject:     "Networks",
    icon:        "🌐",
    color:       "#f5a623",
    colorDim:    "rgba(245,166,35,0.10)",
    colorBorder: "rgba(245,166,35,0.25)",
    gradient:    "linear-gradient(135deg,#f5a623,#e65c00)",
    difficulty:  "Medium",
    diffColor:   "#f5a623",
    tags:        ["OSI","TCP/IP","DNS","HTTP","Routing"],
  },
  {
    id:          "programming",
    title:       "Programming Fundamentals",
    subject:     "Programming",
    icon:        "💻",
    color:       "#22c55e",
    colorDim:    "rgba(34,197,94,0.10)",
    colorBorder: "rgba(34,197,94,0.25)",
    gradient:    "linear-gradient(135deg,#22c55e,#15803d)",
    difficulty:  "Easy",
    diffColor:   "#22c55e",
    tags:        ["OOP","Functions","Types","Logic","Recursion"],
  },
  {
    id:          "mixed",
    title:       "Mixed Grand Test",
    subject:     "Mixed",
    icon:        "🏆",
    color:       "#ff5c6d",
    colorDim:    "rgba(255,92,109,0.10)",
    colorBorder: "rgba(255,92,109,0.25)",
    gradient:    "linear-gradient(135deg,#ff5c6d,#c2185b)",
    difficulty:  "Hard",
    diffColor:   "#ff5c6d",
    tags:        ["All Subjects","Final Prep","Mixed"],
  },
];

const OPT_COLORS = ["var(--blue)", "var(--teal)", "var(--amber)", "var(--coral)"];
const OPT_BG     = ["var(--blue-dim)", "var(--teal-dim)", "var(--amber-dim)", "var(--coral-dim)"];

export default function Admin() {
  const navigate  = useNavigate();
  const token     = localStorage.getItem("token");
  const adminName = localStorage.getItem("name") || "Admin";

  // ── State ──
  const [activeExam,  setActiveExam]  = useState("dsa");       // which exam tab
  const [activeTab,   setActiveTab]   = useState("questions");  // questions | results | students
  const [allQuestions,setAllQuestions]= useState([]);
  const [results,     setResults]     = useState([]);
  const [students,    setStudents]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [selected,    setSelected]    = useState(null);
  const [search,      setSearch]      = useState("");
  const [toast,       setToast]       = useState("");
  const [toastType,   setToastType]   = useState("success");

  // Add question form
  const [newQ,      setNewQ]      = useState("");
  const [newOpts,   setNewOpts]   = useState(["","","",""]);
  const [newAns,    setNewAns]    = useState(0);
  const [newMarks,  setNewMarks]  = useState(1);
  const [newTag,    setNewTag]    = useState("");
  const [formErr,   setFormErr]   = useState("");
  const [formLoad,  setFormLoad]  = useState(false);

  const currentExam = EXAM_CATALOG.find(e => e.id === activeExam);

  // ── Questions for active exam ──
  const examQuestions = allQuestions.filter(q => q.subject === currentExam?.subject);
  const filteredQs    = examQuestions.filter(q =>
    q.questionText.toLowerCase().includes(search.toLowerCase()) ||
    (q.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  // ── Per-exam counts ──
  const examCounts = EXAM_CATALOG.reduce((acc, ex) => {
    acc[ex.id] = allQuestions.filter(q => q.subject === ex.subject).length;
    return acc;
  }, {});

  const showToast = (msg, type = "success") => {
    setToastType(type);
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  };

  // ── Fetch all data ──
  const fetchAll = useCallback(async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [qRes, rRes, uRes] = await Promise.all([
        axios.get(`${API}/questions`,   { headers }),
        axios.get(`${API}/results`,     { headers }),
        axios.get(`${API}/auth/users`,  { headers }),
      ]);
      setAllQuestions(qRes.data.questions || []);
      setResults(rRes.data.results       || []);
      setStudents(uRes.data.users        || []);
    } catch (err) {
      if (err.response?.status === 401) { localStorage.clear(); navigate("/login"); }
      else if (err.response?.status === 403) navigate("/home");
      else showToast("❌ Failed to load data.", "error");
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Add question ──
  const addQuestion = async () => {
    setFormErr("");
    if (!newQ.trim())                 { setFormErr("Question text is required."); return; }
    if (newOpts.some(o => !o.trim())) { setFormErr("All 4 options are required."); return; }

    setFormLoad(true);
    try {
      const res = await axios.post(`${API}/questions`, {
        questionText:  newQ.trim(),
        options:       newOpts.map(o => o.trim()),
        correctAnswer: newAns,
        subject:       currentExam.subject,
        marks:         newMarks,
        tags:          newTag ? newTag.split(",").map(t => t.trim()).filter(Boolean) : currentExam.tags,
        examId:        currentExam.id,
        examTitle:     currentExam.title,
      }, { headers: { Authorization: `Bearer ${token}` } });

      setAllQuestions(prev => [res.data.question, ...prev]);
      setNewQ(""); setNewOpts(["","","",""]); setNewAns(0); setNewTag(""); setFormErr("");
      showToast(`✅ Question added to "${currentExam.title}"!`);
    } catch (err) {
      setFormErr(err.response?.data?.message || "Failed to add question.");
    } finally {
      setFormLoad(false);
    }
  };

  // ── Delete question ──
  const deleteQuestion = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this question?")) return;
    try {
      await axios.delete(`${API}/questions/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setAllQuestions(prev => prev.filter(q => q._id !== id));
      if (selected?._id === id) setSelected(null);
      showToast("✅ Question deleted.");
    } catch { showToast("❌ Failed to delete.", "error"); }
  };

  const fmtDate  = d => new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
  const pColor   = p => p>=75 ? "var(--green)" : p>=50 ? "var(--amber)" : "var(--coral)";
  const pLabel   = p => p>=80 ? "Distinction" : p>=50 ? "Pass" : "Fail";
  const pBadge   = p => p>=80 ? "badge-green" : p>=50 ? "badge-blue" : "badge-coral";

  const fi = e => { e.target.style.borderColor="var(--blue)"; e.target.style.background="rgba(59,158,255,0.06)"; e.target.style.boxShadow="0 0 0 3px rgba(59,158,255,0.12)"; };
  const fb = e => { e.target.style.borderColor="var(--border)"; e.target.style.background="rgba(255,255,255,0.04)"; e.target.style.boxShadow="none"; };

  return (
    <>
      <Navbar />
      <div style={{ minHeight:"100vh", background:"var(--bg)", position:"relative", paddingBottom:48 }}>
        <div className="bg-grid"/>
        <div className="orb orb-a"/>
        <div className="orb orb-b"/>

        <div style={{ position:"relative", zIndex:1, maxWidth:1400, margin:"0 auto", padding:"26px 28px 0" }}>

          {/* ── HEADER ── */}
          <div className="anim-fadeUp" style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            marginBottom:24,
          }}>
            <div>
              <div style={{ fontFamily:"var(--font-display)", fontSize:26, fontWeight:900, letterSpacing:"-0.4px", marginBottom:4 }}>
                🧑‍💼 Admin Dashboard
              </div>
              <div style={{ fontSize:13, color:"var(--text2)" }}>
                Welcome, {adminName} · Manage exam questions, view results & students
              </div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button
                onClick={() => setActiveTab("questions")}
                style={{
                  padding:"10px 20px", borderRadius:"var(--r-md)",
                  background: activeTab==="questions" ? "var(--blue)" : "var(--card)",
                  border:`1px solid ${activeTab==="questions" ? "var(--blue)" : "var(--border)"}`,
                  color: activeTab==="questions" ? "#fff" : "var(--text2)",
                  fontSize:13, fontWeight:600, cursor:"pointer",
                  fontFamily:"var(--font-body)", transition:"all 0.2s",
                }}
              >📝 Questions</button>
              <button
                onClick={() => setActiveTab("results")}
                style={{
                  padding:"10px 20px", borderRadius:"var(--r-md)",
                  background: activeTab==="results" ? "var(--blue)" : "var(--card)",
                  border:`1px solid ${activeTab==="results" ? "var(--blue)" : "var(--border)"}`,
                  color: activeTab==="results" ? "#fff" : "var(--text2)",
                  fontSize:13, fontWeight:600, cursor:"pointer",
                  fontFamily:"var(--font-body)", transition:"all 0.2s",
                }}
              >📊 Results</button>
              <button
                onClick={() => setActiveTab("students")}
                style={{
                  padding:"10px 20px", borderRadius:"var(--r-md)",
                  background: activeTab==="students" ? "var(--blue)" : "var(--card)",
                  border:`1px solid ${activeTab==="students" ? "var(--blue)" : "var(--border)"}`,
                  color: activeTab==="students" ? "#fff" : "var(--text2)",
                  fontSize:13, fontWeight:600, cursor:"pointer",
                  fontFamily:"var(--font-body)", transition:"all 0.2s",
                }}
              >👥 Students</button>
            </div>
          </div>

          {/* ── GLOBAL STATS ── */}
          <div className="anim-fadeUp d-1" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:26 }}>
            {[
              { icon:"📝", val:loading?"…":allQuestions.length, lbl:"Total Questions", color:"var(--blue)"   },
              { icon:"👥", val:loading?"…":students.length,     lbl:"Students",        color:"var(--green)"  },
              { icon:"📊", val:loading?"…":results.length,      lbl:"Exams Taken",     color:"var(--amber)"  },
              { icon:"📚", val:EXAM_CATALOG.length,             lbl:"Exam Categories", color:"var(--teal)"   },
            ].map((s,i) => (
              <div key={i} style={{
                background:"var(--card)", border:"1px solid var(--border)",
                borderRadius:"var(--r-lg)", padding:"18px 20px",
                display:"flex", alignItems:"center", gap:14,
              }}>
                <span style={{ fontSize:26 }}>{s.icon}</span>
                <div>
                  <div style={{ fontFamily:"var(--font-display)", fontSize:26, fontWeight:800, color:s.color, marginBottom:2 }}>{s.val}</div>
                  <div style={{ fontSize:12, color:"var(--text2)" }}>{s.lbl}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ════════════════════════════════════
              QUESTIONS TAB
          ════════════════════════════════════ */}
          {activeTab === "questions" && (
            <div className="anim-fadeUp d-2">

              {/* ── EXAM SELECTOR CARDS ── */}
              <div style={{ marginBottom:22 }}>
                <div style={{ fontSize:13, fontWeight:600, color:"var(--text2)", marginBottom:12, textTransform:"uppercase", letterSpacing:"0.08em" }}>
                  Select Exam Category to Manage
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10 }}>
                  {EXAM_CATALOG.map(ex => (
                    <div
                      key={ex.id}
                      onClick={() => { setActiveExam(ex.id); setSelected(null); setSearch(""); }}
                      style={{
                        background: activeExam===ex.id ? ex.colorDim : "var(--card)",
                        border:`2px solid ${activeExam===ex.id ? ex.color : "var(--border)"}`,
                        borderRadius:"var(--r-lg)",
                        padding:"16px 12px",
                        cursor:"pointer",
                        textAlign:"center",
                        transition:"all 0.22s cubic-bezier(0.16,1,0.3,1)",
                        transform: activeExam===ex.id ? "translateY(-3px)" : "none",
                        boxShadow: activeExam===ex.id ? `0 8px 24px ${ex.colorDim}` : "none",
                        position:"relative",
                      }}
                    >
                      {/* Active indicator */}
                      {activeExam===ex.id && (
                        <div style={{
                          position:"absolute", top:0, left:0, right:0, height:3,
                          background:ex.gradient, borderRadius:"var(--r-lg) var(--r-lg) 0 0",
                        }}/>
                      )}

                      <div style={{
                        fontSize:28, marginBottom:8,
                        filter: activeExam===ex.id ? "none" : "grayscale(30%)",
                        transition:"filter 0.2s",
                      }}>{ex.icon}</div>

                      <div style={{
                        fontFamily:"var(--font-display)",
                        fontSize:11, fontWeight:700,
                        color: activeExam===ex.id ? ex.color : "var(--text2)",
                        marginBottom:6,
                        lineHeight:1.3,
                        transition:"color 0.2s",
                      }}>
                        {ex.title.split(" ").slice(0,2).join(" ")}
                      </div>

                      {/* Question count badge */}
                      <div style={{
                        display:"inline-flex", alignItems:"center", justifyContent:"center",
                        background: activeExam===ex.id ? ex.color : "rgba(255,255,255,0.08)",
                        color: activeExam===ex.id ? "#fff" : "var(--text3)",
                        borderRadius:100, padding:"2px 10px",
                        fontSize:11, fontWeight:700,
                        fontFamily:"var(--font-display)",
                        minWidth:28,
                        transition:"all 0.2s",
                      }}>
                        {loading ? "…" : examCounts[ex.id] || 0} Q
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── MAIN LAYOUT: Question List + Add Form ── */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 420px", gap:18 }}>

                {/* Question List */}
                <div style={{
                  background:"var(--card)", border:`1px solid ${currentExam.colorBorder}`,
                  borderRadius:"var(--r-lg)", padding:20,
                }}>
                  {/* Header */}
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                    <div style={{
                      width:42, height:42, borderRadius:12, background:currentExam.gradient,
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0,
                    }}>{currentExam.icon}</div>
                    <div>
                      <div style={{ fontFamily:"var(--font-display)", fontSize:16, fontWeight:700 }}>
                        {currentExam.title}
                      </div>
                      <div style={{ fontSize:12, color:"var(--text2)" }}>
                        {examCounts[activeExam] || 0} questions · {currentExam.subject} · {currentExam.difficulty}
                      </div>
                    </div>
                    <div style={{ marginLeft:"auto" }}>
                      <span style={{
                        background:currentExam.colorDim, border:`1px solid ${currentExam.colorBorder}`,
                        borderRadius:100, padding:"4px 14px",
                        fontSize:11, fontWeight:700, color:currentExam.color,
                      }}>
                        {currentExam.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Search */}
                  <div style={{
                    display:"flex", alignItems:"center", gap:8,
                    background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)",
                    borderRadius:"var(--r-md)", padding:"9px 13px", marginBottom:14,
                  }}>
                    <span style={{ fontSize:14 }}>🔍</span>
                    <input
                      style={{ background:"none", border:"none", outline:"none", color:"var(--text)", fontSize:13, flex:1, fontFamily:"var(--font-body)" }}
                      placeholder={`Search ${currentExam.title} questions…`}
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                    {search && <span style={{ fontSize:12, color:"var(--text2)", cursor:"pointer" }} onClick={() => setSearch("")}>✕</span>}
                  </div>

                  {/* Empty state */}
                  {!loading && filteredQs.length === 0 && (
                    <div style={{ textAlign:"center", padding:"40px 20px" }}>
                      <div style={{ fontSize:44, marginBottom:12 }}>{currentExam.icon}</div>
                      <div style={{ fontFamily:"var(--font-display)", fontSize:16, fontWeight:700, marginBottom:6 }}>
                        {search ? `No results for "${search}"` : `No questions yet`}
                      </div>
                      <div style={{ fontSize:13, color:"var(--text2)", marginBottom:16 }}>
                        {search ? "Try a different search term." : `Add your first question for ${currentExam.title} using the form on the right.`}
                      </div>
                      {!search && (
                        <div style={{
                          display:"inline-flex", alignItems:"center", gap:6,
                          background:currentExam.colorDim, border:`1px solid ${currentExam.colorBorder}`,
                          borderRadius:100, padding:"6px 16px",
                          fontSize:12, fontWeight:600, color:currentExam.color,
                        }}>
                          ➕ Use the form → to add questions
                        </div>
                      )}
                    </div>
                  )}

                  {loading && (
                    <div style={{ display:"flex", justifyContent:"center", padding:28 }}>
                      <span className="spinner"/>
                    </div>
                  )}

                  {/* Question list */}
                  <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:520, overflowY:"auto", paddingRight:4 }}>
                    {filteredQs.map((q, i) => (
                      <div
                        key={q._id}
                        onClick={() => setSelected(selected?._id === q._id ? null : q)}
                        style={{
                          background: selected?._id===q._id ? currentExam.colorDim : "var(--card2)",
                          border:`1px solid ${selected?._id===q._id ? currentExam.colorBorder : "var(--border)"}`,
                          borderLeft:`3px solid ${currentExam.color}`,
                          borderRadius:"var(--r-md)", padding:"14px 16px",
                          cursor:"pointer", transition:"all 0.15s",
                        }}
                      >
                        <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:8 }}>
                          <span style={{
                            background:currentExam.colorDim, color:currentExam.color,
                            fontSize:11, fontWeight:700, padding:"3px 9px",
                            borderRadius:100, flexShrink:0, fontFamily:"var(--font-display)",
                          }}>Q{i+1}</span>
                          <span style={{ fontSize:13, fontWeight:500, lineHeight:1.5, flex:1 }}>
                            {q.questionText}
                          </span>
                          <button
                            onClick={e => deleteQuestion(q._id, e)}
                            style={{
                              padding:"3px 10px", background:"var(--coral-dim)",
                              border:"1px solid rgba(255,92,109,0.2)",
                              borderRadius:"var(--r-sm)", color:"var(--coral)",
                              fontSize:11, fontWeight:600, cursor:"pointer",
                              fontFamily:"var(--font-body)", flexShrink:0,
                            }}
                          >🗑 Delete</button>
                        </div>

                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <span style={{ fontSize:11, color:"var(--text2)" }}>
                            {q.marks||1} mark · Added {fmtDate(q.createdAt)}
                          </span>
                        </div>

                        {/* Expanded options */}
                        {selected?._id === q._id && (
                          <div style={{ marginTop:12, paddingTop:12, borderTop:"1px solid var(--border)" }}>
                            {(q.options||[]).map((opt,oi) => (
                              <div key={oi} style={{
                                display:"flex", alignItems:"center", gap:10,
                                padding:"8px 10px", borderRadius:"var(--r-sm)", marginBottom:6,
                                background: oi===q.correctAnswer ? "var(--green-dim)" : "rgba(255,255,255,0.03)",
                                border:`1px solid ${oi===q.correctAnswer ? "rgba(34,197,94,0.3)" : "var(--border)"}`,
                              }}>
                                <span style={{
                                  width:24, height:24, borderRadius:"50%", flexShrink:0,
                                  display:"flex", alignItems:"center", justifyContent:"center",
                                  fontSize:11, fontWeight:700,
                                  background: oi===q.correctAnswer ? "var(--green)" : OPT_BG[oi],
                                  color: oi===q.correctAnswer ? "#fff" : OPT_COLORS[oi],
                                }}>
                                  {String.fromCharCode(65+oi)}
                                </span>
                                <span style={{ fontSize:13, color:oi===q.correctAnswer?"var(--green)":"var(--text)", flex:1 }}>
                                  {opt}
                                </span>
                                {oi===q.correctAnswer && (
                                  <span style={{ fontSize:11, color:"var(--green)", fontWeight:600 }}>✓ Correct</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── ADD QUESTION FORM ── */}
                <div style={{
                  background:"var(--card)", border:`1px solid ${currentExam.colorBorder}`,
                  borderRadius:"var(--r-lg)", padding:22,
                  position:"sticky", top:80, alignSelf:"start",
                }}>
                  {/* Form header */}
                  <div style={{
                    display:"flex", alignItems:"center", gap:10,
                    background:currentExam.gradient, borderRadius:"var(--r-md)",
                    padding:"14px 16px", marginBottom:20,
                    position:"relative", overflow:"hidden",
                  }}>
                    <div style={{ position:"absolute", top:-20, right:-20, width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.10)", pointerEvents:"none" }}/>
                    <span style={{ fontSize:24 }}>{currentExam.icon}</span>
                    <div>
                      <div style={{ fontFamily:"var(--font-display)", fontSize:14, fontWeight:700, color:"#fff" }}>
                        Add Question
                      </div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,0.75)" }}>
                        {currentExam.title}
                      </div>
                    </div>
                  </div>

                  {/* Subject (readonly, auto-filled) */}
                  <div style={{ marginBottom:14 }}>
                    <label style={{ display:"block", fontSize:11, fontWeight:600, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:7 }}>
                      Exam / Subject
                    </label>
                    <div style={{
                      display:"flex", alignItems:"center", gap:8,
                      background:currentExam.colorDim, border:`1px solid ${currentExam.colorBorder}`,
                      borderRadius:"var(--r-md)", padding:"10px 14px",
                    }}>
                      <span style={{ fontSize:18 }}>{currentExam.icon}</span>
                      <span style={{ fontSize:13, fontWeight:600, color:currentExam.color }}>
                        {currentExam.title}
                      </span>
                      <span style={{
                        marginLeft:"auto", fontSize:11, fontWeight:600,
                        background:"rgba(255,255,255,0.12)", color:currentExam.color,
                        padding:"2px 8px", borderRadius:100,
                      }}>
                        {currentExam.subject}
                      </span>
                    </div>
                  </div>

                  {/* Marks */}
                  <div style={{ marginBottom:14 }}>
                    <label style={{ display:"block", fontSize:11, fontWeight:600, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:7 }}>
                      Marks
                    </label>
                    <div style={{ display:"flex", gap:8 }}>
                      {[1,2,3,4,5].map(m => (
                        <button
                          key={m}
                          onClick={() => setNewMarks(m)}
                          style={{
                            flex:1, padding:"9px 0", borderRadius:"var(--r-sm)",
                            fontFamily:"var(--font-display)", fontSize:14, fontWeight:700,
                            cursor:"pointer", transition:"all 0.15s",
                            background: newMarks===m ? currentExam.gradient : "rgba(255,255,255,0.04)",
                            border:`1.5px solid ${newMarks===m ? currentExam.color : "var(--border)"}`,
                            color: newMarks===m ? "#fff" : "var(--text2)",
                            boxShadow: newMarks===m ? `0 4px 12px ${currentExam.colorDim}` : "none",
                          }}
                        >{m}</button>
                      ))}
                    </div>
                  </div>

                  {/* Question text */}
                  <div style={{ marginBottom:14 }}>
                    <label style={{ display:"block", fontSize:11, fontWeight:600, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:7 }}>
                      Question text *
                    </label>
                    <textarea
                      style={{
                        width:"100%", minHeight:88, resize:"vertical",
                        padding:"11px 13px",
                        background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)",
                        borderRadius:"var(--r-md)", color:"var(--text)", fontSize:13,
                        fontFamily:"var(--font-body)", outline:"none", transition:"all 0.2s",
                      }}
                      placeholder={`Enter ${currentExam.title} question…`}
                      value={newQ}
                      onChange={e => setNewQ(e.target.value)}
                      onFocus={fi} onBlur={fb}
                    />
                  </div>

                  {/* Options */}
                  <div style={{ marginBottom:14 }}>
                    <label style={{ display:"block", fontSize:11, fontWeight:600, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>
                      Options * &nbsp;
                      <span style={{ fontSize:10, color:currentExam.color, textTransform:"none", letterSpacing:0 }}>
                        (click radio = correct answer)
                      </span>
                    </label>
                    {[0,1,2,3].map(i => (
                      <div key={i} style={{
                        display:"flex", alignItems:"center", gap:8, marginBottom:8,
                        background: newAns===i ? "var(--green-dim)" : "rgba(255,255,255,0.02)",
                        border:`1px solid ${newAns===i ? "rgba(34,197,94,0.3)" : "var(--border)"}`,
                        borderRadius:"var(--r-md)", padding:"6px 10px",
                        transition:"all 0.15s",
                      }}>
                        <span style={{
                          width:28, height:28, borderRadius:"50%", flexShrink:0,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize:12, fontWeight:700,
                          background: newAns===i ? "var(--green)" : OPT_BG[i],
                          color: newAns===i ? "#fff" : OPT_COLORS[i],
                          transition:"all 0.15s",
                        }}>
                          {String.fromCharCode(65+i)}
                        </span>
                        <input
                          style={{
                            flex:1, background:"none", border:"none", outline:"none",
                            color:"var(--text)", fontSize:13, fontFamily:"var(--font-body)",
                          }}
                          placeholder={`Option ${String.fromCharCode(65+i)}`}
                          value={newOpts[i]}
                          onChange={e => { const o=[...newOpts]; o[i]=e.target.value; setNewOpts(o); }}
                        />
                        <label style={{ display:"flex", alignItems:"center", gap:5, cursor:"pointer", flexShrink:0 }}>
                          <input
                            type="radio" name="correct" value={i}
                            checked={newAns===i} onChange={() => setNewAns(i)}
                            style={{ accentColor:"var(--green)", width:14, height:14 }}
                          />
                          <span style={{ fontSize:10, color: newAns===i ? "var(--green)" : "var(--text3)", fontWeight:600 }}>
                            {newAns===i ? "✓ Correct" : "Correct"}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Tags (optional) */}
                  <div style={{ marginBottom:16 }}>
                    <label style={{ display:"block", fontSize:11, fontWeight:600, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:7 }}>
                      Tags <span style={{ fontWeight:400, textTransform:"none", letterSpacing:0 }}>(optional, comma separated)</span>
                    </label>
                    <div style={{ position:"relative" }}>
                      <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", fontSize:14, color:"var(--text3)" }}>🏷️</span>
                      <input
                        style={{
                          width:"100%", padding:"11px 13px 11px 38px",
                          background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)",
                          borderRadius:"var(--r-md)", color:"var(--text)", fontSize:13,
                          fontFamily:"var(--font-body)", outline:"none",
                        }}
                        placeholder="e.g. Arrays, Sorting, Binary Search"
                        value={newTag}
                        onChange={e => setNewTag(e.target.value)}
                        onFocus={fi} onBlur={fb}
                      />
                    </div>
                  </div>

                  {formErr && (
                    <div style={{ fontSize:12, color:"var(--coral)", marginBottom:12, padding:"8px 12px", background:"var(--coral-dim)", borderRadius:"var(--r-sm)" }}>
                      ⚠️ {formErr}
                    </div>
                  )}

                  <button
                    onClick={addQuestion}
                    disabled={formLoad}
                    style={{
                      width:"100%", padding:"13px",
                      background: formLoad ? `${currentExam.color}88` : currentExam.gradient,
                      border:"none", borderRadius:"var(--r-md)",
                      color:"#fff", fontSize:15, fontWeight:700,
                      fontFamily:"var(--font-display)", letterSpacing:"0.3px",
                      cursor: formLoad ? "not-allowed" : "pointer",
                      boxShadow:`0 8px 24px ${currentExam.colorDim}`,
                      transition:"all 0.2s",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:9,
                    }}
                    onMouseEnter={e => { if(!formLoad){ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 12px 32px ${currentExam.colorDim}`; } }}
                    onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow=`0 8px 24px ${currentExam.colorDim}`; }}
                  >
                    {formLoad
                      ? <><span className="spinner"/>Adding…</>
                      : <>{currentExam.icon} Add to {currentExam.title.split(" ")[0]} Exam</>
                    }
                  </button>

                  {/* Per-exam breakdown */}
                  <div style={{ marginTop:22, paddingTop:18, borderTop:"1px solid var(--border)" }}>
                    <div style={{ fontSize:11, fontWeight:600, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>
                      All Exams Question Count
                    </div>
                    {EXAM_CATALOG.map(ex => (
                      <div
                        key={ex.id}
                        onClick={() => setActiveExam(ex.id)}
                        style={{
                          display:"flex", alignItems:"center", gap:10,
                          marginBottom:10, cursor:"pointer",
                          opacity: activeExam===ex.id ? 1 : 0.7,
                          transition:"opacity 0.2s",
                        }}
                      >
                        <span style={{ fontSize:16, width:24, textAlign:"center" }}>{ex.icon}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                            <span style={{ fontSize:12, color: activeExam===ex.id ? ex.color : "var(--text2)", fontWeight: activeExam===ex.id ? 600 : 400 }}>
                              {ex.title.split(" ").slice(0,3).join(" ")}
                            </span>
                            <span style={{ fontSize:12, fontWeight:700, color:ex.color }}>
                              {examCounts[ex.id]||0}
                            </span>
                          </div>
                          <div style={{ height:3, background:"rgba(255,255,255,0.07)", borderRadius:100, overflow:"hidden" }}>
                            <div style={{
                              height:"100%", borderRadius:100, background:ex.gradient,
                              width:`${allQuestions.length ? ((examCounts[ex.id]||0)/allQuestions.length)*100 : 0}%`,
                              transition:"width 0.5s",
                            }}/>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════
              RESULTS TAB
          ════════════════════════════════════ */}
          {activeTab === "results" && (
            <div className="anim-fadeUp" style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"var(--r-lg)", padding:20 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                <div style={{ fontFamily:"var(--font-display)", fontSize:16, fontWeight:700 }}>
                  All Student Results ({results.length})
                </div>
              </div>
              {loading ? (
                <div style={{ display:"flex", justifyContent:"center", padding:28 }}><span className="spinner"/></div>
              ) : (
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead>
                      <tr>
                        {["#","Student","Exam","Score","%","Date","Status"].map(h => (
                          <th key={h} style={{ textAlign:"left", fontSize:11, fontWeight:600, color:"var(--text2)", textTransform:"uppercase", letterSpacing:"0.06em", padding:"0 8px 12px", borderBottom:"1px solid var(--border)" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.length === 0 ? (
                        <tr><td colSpan={7} style={{ textAlign:"center", padding:28, color:"var(--text2)", fontSize:13 }}>No results yet.</td></tr>
                      ) : results.map((r,i) => {
                        // Find matching exam by title or subject
                        const ex = EXAM_CATALOG.find(e => e.subject === r.subject || e.title === r.examName) || EXAM_CATALOG[5];
                        return (
                          <tr key={r._id} style={{ borderBottom:"1px solid var(--border)" }}>
                            <td style={{ padding:"11px 8px", fontSize:11, color:"var(--text3)" }}>{i+1}</td>
                            <td style={{ padding:"11px 8px" }}>
                              <div style={{ fontWeight:500, marginBottom:2, fontSize:13 }}>{r.student?.name||"Unknown"}</div>
                              <div style={{ fontSize:11, color:"var(--text2)" }}>{r.student?.email}</div>
                            </td>
                            <td style={{ padding:"11px 8px" }}>
                              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                                <span style={{ fontSize:16 }}>{ex.icon}</span>
                                <div>
                                  <div style={{ fontSize:12, fontWeight:500, color:ex.color }}>{r.examName||"Online Exam"}</div>
                                  <div style={{ fontSize:11, color:"var(--text2)" }}>{r.student?.department||""}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding:"11px 8px", fontFamily:"var(--font-display)", fontSize:15, fontWeight:700, color:pColor(r.percentage) }}>
                              {r.score}/{r.totalMarks}
                            </td>
                            <td style={{ padding:"11px 8px" }}>
                              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                                <div style={{ width:54, height:4, borderRadius:100, background:"rgba(255,255,255,0.08)", overflow:"hidden" }}>
                                  <div style={{ height:"100%", borderRadius:100, background:pColor(r.percentage), width:r.percentage+"%" }}/>
                                </div>
                                <span style={{ color:pColor(r.percentage), fontSize:12, fontWeight:600 }}>{r.percentage}%</span>
                              </div>
                            </td>
                            <td style={{ padding:"11px 8px", fontSize:12, color:"var(--text2)" }}>{fmtDate(r.createdAt)}</td>
                            <td style={{ padding:"11px 8px" }}>
                              <span className={`badge ${pBadge(r.percentage)}`}>{pLabel(r.percentage)}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════
              STUDENTS TAB
          ════════════════════════════════════ */}
          {activeTab === "students" && (
            <div className="anim-fadeUp" style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"var(--r-lg)", padding:20 }}>
              <div style={{ fontFamily:"var(--font-display)", fontSize:16, fontWeight:700, marginBottom:16 }}>
                Registered Students ({students.length})
              </div>
              {loading ? (
                <div style={{ display:"flex", justifyContent:"center", padding:28 }}><span className="spinner"/></div>
              ) : (
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead>
                      <tr>
                        {["#","Name","Email","Student ID","Department","Semester","Joined"].map(h => (
                          <th key={h} style={{ textAlign:"left", fontSize:11, fontWeight:600, color:"var(--text2)", textTransform:"uppercase", letterSpacing:"0.06em", padding:"0 8px 12px", borderBottom:"1px solid var(--border)" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {students.length === 0 ? (
                        <tr><td colSpan={7} style={{ textAlign:"center", padding:28, color:"var(--text2)", fontSize:13 }}>No students registered yet.</td></tr>
                      ) : students.map((s,i) => (
                        <tr key={s._id} style={{ borderBottom:"1px solid var(--border)" }}>
                          <td style={{ padding:"11px 8px", fontSize:11, color:"var(--text3)" }}>{i+1}</td>
                          <td style={{ padding:"11px 8px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <span style={{ fontSize:20 }}>{s.avatar||"🧑‍🎓"}</span>
                              <span style={{ fontWeight:500, fontSize:13 }}>{s.name}</span>
                            </div>
                          </td>
                          <td style={{ padding:"11px 8px", fontSize:13, color:"var(--text2)" }}>{s.email}</td>
                          <td style={{ padding:"11px 8px" }}>
                            <span style={{ padding:"2px 9px", borderRadius:100, background:"var(--blue-dim)", color:"var(--blue)", fontSize:11, fontWeight:500 }}>
                              {s.studentId||"—"}
                            </span>
                          </td>
                          <td style={{ padding:"11px 8px", fontSize:13 }}>{s.department||"—"}</td>
                          <td style={{ padding:"11px 8px", fontSize:13 }}>{s.semester||"—"}</td>
                          <td style={{ padding:"11px 8px", fontSize:12, color:"var(--text2)" }}>{fmtDate(s.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{
          position:"fixed", bottom:24, right:24, zIndex:999,
          background: toastType==="error" ? "#1a0a0a" : "var(--card)",
          border:`1px solid ${toastType==="error" ? "rgba(255,92,109,0.4)" : "var(--border2)"}`,
          borderRadius:"var(--r-lg)", padding:"13px 20px",
          fontSize:13, color:"var(--text)",
          boxShadow:"0 8px 32px rgba(0,0,0,0.5)",
          animation:"fadeUp 0.4s both",
          display:"flex", alignItems:"center", gap:8,
        }}>
          {toast}
        </div>
      )}
    </>
  );
}