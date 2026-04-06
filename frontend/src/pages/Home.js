// src/pages/Home.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// ── EXAM CATALOG ─────────────────────────────────────────────────
// Each exam has its own color, icon, difficulty, and question filter
const EXAM_CATALOG = [
  {
    id:          "dsa",
    title:       "Data Structures & Algorithms",
    subject:     "Algorithms",
    description: "Master arrays, linked lists, trees, graphs, sorting and searching algorithms.",
    icon:        "🧮",
    color:       "#3b9eff",
    colorDim:    "rgba(59,158,255,0.10)",
    colorBorder: "rgba(59,158,255,0.25)",
    gradient:    "linear-gradient(135deg,#3b9eff,#0070f3)",
    difficulty:  "Medium",
    diffColor:   "#f5a623",
    questions:   15,
    duration:    30,
    attempts:    "Unlimited",
    tags:        ["Arrays","Trees","Graphs","Sorting"],
    popular:     true,
  },
  {
    id:          "dbms",
    title:       "Database Management",
    subject:     "DBMS",
    description: "SQL queries, normalization, ACID properties, ER diagrams and transactions.",
    icon:        "🗄️",
    color:       "#00e0c4",
    colorDim:    "rgba(0,224,196,0.10)",
    colorBorder: "rgba(0,224,196,0.25)",
    gradient:    "linear-gradient(135deg,#00e0c4,#0097a7)",
    difficulty:  "Easy",
    diffColor:   "#22c55e",
    questions:   15,
    duration:    25,
    attempts:    "Unlimited",
    tags:        ["SQL","Normalization","ACID","ER Diagram"],
    popular:     false,
  },
  {
    id:          "os",
    title:       "Operating Systems",
    subject:     "OS",
    description: "Process management, scheduling, memory management, deadlocks and virtual memory.",
    icon:        "🖥️",
    color:       "#a855f7",
    colorDim:    "rgba(168,85,247,0.10)",
    colorBorder: "rgba(168,85,247,0.25)",
    gradient:    "linear-gradient(135deg,#a855f7,#7c3aed)",
    difficulty:  "Hard",
    diffColor:   "#ff5c6d",
    questions:   15,
    duration:    30,
    attempts:    "Unlimited",
    tags:        ["Scheduling","Memory","Deadlock","IPC"],
    popular:     false,
  },
  {
    id:          "networks",
    title:       "Computer Networks",
    subject:     "Networks",
    description: "OSI model, TCP/IP, DNS, HTTP, routing protocols and network security basics.",
    icon:        "🌐",
    color:       "#f5a623",
    colorDim:    "rgba(245,166,35,0.10)",
    colorBorder: "rgba(245,166,35,0.25)",
    gradient:    "linear-gradient(135deg,#f5a623,#e65c00)",
    difficulty:  "Medium",
    diffColor:   "#f5a623",
    questions:   15,
    duration:    25,
    attempts:    "Unlimited",
    tags:        ["OSI","TCP/IP","DNS","HTTP"],
    popular:     false,
  },
  {
    id:          "programming",
    title:       "Programming Fundamentals",
    subject:     "Programming",
    description: "OOP concepts, data types, control flow, functions and programming paradigms.",
    icon:        "💻",
    color:       "#22c55e",
    colorDim:    "rgba(34,197,94,0.10)",
    colorBorder: "rgba(34,197,94,0.25)",
    gradient:    "linear-gradient(135deg,#22c55e,#15803d)",
    difficulty:  "Easy",
    diffColor:   "#22c55e",
    questions:   15,
    duration:    20,
    attempts:    "Unlimited",
    tags:        ["OOP","Functions","Types","Logic"],
    popular:     true,
  },
  {
    id:          "mixed",
    title:       "Mixed Grand Test",
    subject:     "Mixed",
    description: "A comprehensive test covering all subjects — the ultimate challenge for exam preparation.",
    icon:        "🏆",
    color:       "#ff5c6d",
    colorDim:    "rgba(255,92,109,0.10)",
    colorBorder: "rgba(255,92,109,0.25)",
    gradient:    "linear-gradient(135deg,#ff5c6d,#c2185b)",
    difficulty:  "Hard",
    diffColor:   "#ff5c6d",
    questions:   15,
    duration:    40,
    attempts:    "Unlimited",
    tags:        ["All Subjects","Final Prep","Mixed"],
    popular:     true,
  },
];

const DIFFICULTY_FILTERS = ["All", "Easy", "Medium", "Hard"];

export default function Home() {
  const navigate   = useNavigate();
  const userName   = localStorage.getItem("name")   || "Student";
  const userAvatar = localStorage.getItem("avatar") || "🧑‍🎓";

  const [filter,     setFilter]     = useState("All");
  const [search,     setSearch]     = useState("");
  const [selected,   setSelected]   = useState(null); // exam chosen for modal
  const [hovered,    setHovered]    = useState(null);
  const [startAnim,  setStartAnim]  = useState(false);

  // Filter exams
  const filtered = EXAM_CATALOG.filter(ex => {
    const diffOk   = filter === "All" || ex.difficulty === filter;
    const searchOk = ex.title.toLowerCase().includes(search.toLowerCase()) ||
                     ex.subject.toLowerCase().includes(search.toLowerCase()) ||
                     ex.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return diffOk && searchOk;
  });

  const handleStartExam = (exam) => {
    // Save selected exam info to localStorage so Exam.js can use it
    localStorage.setItem("selectedExam",    JSON.stringify(exam));
    localStorage.setItem("examSubject",     exam.subject);
    localStorage.setItem("examTitle",       exam.title);
    localStorage.setItem("examDuration",    exam.duration);
    localStorage.setItem("examQuestions",   exam.questions);
    setStartAnim(true);
    setTimeout(() => navigate("/exam"), 600);
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "var(--bg)", position: "relative", paddingBottom: 48 }}>
        <div className="bg-grid" />
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1300, margin: "0 auto", padding: "28px 28px 0" }}>

          {/* ── HERO HEADER ── */}
          <div className="anim-fadeUp" style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-xl)",
            padding: "32px 40px",
            marginBottom: 28,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}>
            {/* Decorative gradient blob */}
            <div style={{
              position: "absolute", top: -60, right: -60,
              width: 260, height: 260, borderRadius: "50%",
              background: "radial-gradient(circle,rgba(59,158,255,0.12) 0%,transparent 70%)",
              pointerEvents: "none",
            }}/>

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                background: "rgba(59,158,255,0.10)", border: "1px solid rgba(59,158,255,0.22)",
                borderRadius: 100, padding: "4px 14px",
                fontSize: 11, fontWeight: 700, color: "var(--blue)",
                letterSpacing: "0.08em", textTransform: "uppercase",
                marginBottom: 14,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--teal)", animation: "blink 2s infinite" }}/>
                Choose Your Exam
              </div>
              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: 30, fontWeight: 900, letterSpacing: "-0.5px",
                marginBottom: 8, lineHeight: 1.2,
              }}>
                Hello, {userName.split(" ")[0]}! 👋<br />
                <span style={{ color: "var(--blue)" }}>Which exam are you taking today?</span>
              </h1>
              <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6, maxWidth: 480 }}>
                Pick a subject below, read the instructions, and start when you're ready.
                All exams are timed — good luck! 🍀
              </p>
            </div>

            <div style={{
              position: "relative", zIndex: 1, flexShrink: 0,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            }}>
              <div style={{ fontSize: 72, lineHeight: 1 }}>{userAvatar}</div>
              <div style={{
                background: "var(--blue-dim)", border: "1px solid var(--border2)",
                borderRadius: "var(--r-sm)", padding: "4px 14px",
                fontSize: 12, fontWeight: 600, color: "var(--blue)",
              }}>
                {EXAM_CATALOG.length} Exams Available
              </div>
            </div>
          </div>

          {/* ── FILTERS + SEARCH ── */}
          <div className="anim-fadeUp d-1" style={{
            display: "flex", alignItems: "center",
            gap: 12, marginBottom: 24, flexWrap: "wrap",
          }}>
            {/* Search */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 220,
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: "var(--r-md)", padding: "10px 14px",
            }}>
              <span style={{ fontSize: 16 }}>🔍</span>
              <input
                style={{
                  background: "none", border: "none", outline: "none",
                  color: "var(--text)", fontSize: 14, flex: 1,
                  fontFamily: "var(--font-body)",
                }}
                placeholder="Search exams, subjects or topics…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <span
                  style={{ fontSize: 12, color: "var(--text2)", cursor: "pointer" }}
                  onClick={() => setSearch("")}
                >✕</span>
              )}
            </div>

            {/* Difficulty filter pills */}
            <div style={{ display: "flex", gap: 6 }}>
              {DIFFICULTY_FILTERS.map(d => (
                <button
                  key={d}
                  onClick={() => setFilter(d)}
                  style={{
                    padding: "9px 18px", borderRadius: "var(--r-md)",
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                    fontFamily: "var(--font-body)", border: "1px solid",
                    transition: "all 0.2s",
                    background: filter === d ? "var(--blue)" : "var(--card)",
                    color:      filter === d ? "#fff"        : "var(--text2)",
                    borderColor:filter === d ? "var(--blue)" : "var(--border)",
                    boxShadow:  filter === d ? "0 4px 16px rgba(59,158,255,0.28)" : "none",
                  }}
                >
                  {d === "All"    ? "🗂 All"    :
                   d === "Easy"   ? "🟢 Easy"   :
                   d === "Medium" ? "🟡 Medium" : "🔴 Hard"}
                </button>
              ))}
            </div>

            {/* Result count */}
            <div style={{ fontSize: 13, color: "var(--text2)", whiteSpace: "nowrap" }}>
              {filtered.length} exam{filtered.length !== 1 ? "s" : ""} found
            </div>
          </div>

          {/* ── EXAM CARDS GRID ── */}
          {filtered.length === 0 ? (
            <div className="anim-fadeUp" style={{
              textAlign: "center", padding: "60px 20px",
              background: "var(--card)", borderRadius: "var(--r-xl)",
              border: "1px solid var(--border)",
            }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>🔍</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                No exams found
              </div>
              <div style={{ fontSize: 14, color: "var(--text2)" }}>
                Try a different search or filter.
              </div>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
              gap: 20,
            }}>
              {filtered.map((exam, i) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  index={i}
                  hovered={hovered === exam.id}
                  onHover={() => setHovered(exam.id)}
                  onLeave={() => setHovered(null)}
                  onSelect={() => setSelected(exam)}
                />
              ))}
            </div>
          )}

          {/* ── QUICK STATS ROW ── */}
          <div className="anim-fadeUp d-5" style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14, marginTop: 28,
          }}>
            {[
              { icon:"📝", val: EXAM_CATALOG.length,    label:"Total Exams",     color:"var(--blue)"   },
              { icon:"⏱️", val: "20–40",               label:"Minutes per exam", color:"var(--amber)"  },
              { icon:"🎯", val: "15",                   label:"Questions each",  color:"var(--teal)"   },
              { icon:"♾️", val: "Unlimited",            label:"Attempts allowed",color:"var(--green)"  },
            ].map((s, i) => (
              <div key={i} style={{
                background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: "var(--r-lg)", padding: "18px 20px",
                display: "flex", alignItems: "center", gap: 14,
              }}>
                <span style={{ fontSize: 26 }}>{s.icon}</span>
                <div>
                  <div style={{
                    fontFamily: "var(--font-display)", fontSize: 22,
                    fontWeight: 800, color: s.color, marginBottom: 2,
                  }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── EXAM DETAIL MODAL ── */}
      {selected && (
        <ExamModal
          exam={selected}
          onClose={() => setSelected(null)}
          onStart={() => handleStartExam(selected)}
          startAnim={startAnim}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// EXAM CARD COMPONENT
// ─────────────────────────────────────────────────────────────────
function ExamCard({ exam, index, hovered, onHover, onLeave, onSelect }) {
  const delayClass = `d-${Math.min(index + 1, 6)}`;

  return (
    <div
      className={`anim-fadeUp ${delayClass}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        background: hovered ? exam.colorDim : "var(--card)",
        border: `1px solid ${hovered ? exam.colorBorder : "var(--border)"}`,
        borderRadius: "var(--r-xl)",
        padding: "26px 28px",
        cursor: "pointer",
        transition: "all 0.28s cubic-bezier(0.16,1,0.3,1)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? `0 20px 48px ${exam.colorDim}` : "none",
        position: "relative",
        overflow: "hidden",
      }}
      onClick={onSelect}
    >
      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: exam.gradient,
        borderRadius: "var(--r-xl) var(--r-xl) 0 0",
        opacity: hovered ? 1 : 0.5,
        transition: "opacity 0.3s",
      }}/>

      {/* Popular badge */}
      {exam.popular && (
        <div style={{
          position: "absolute", top: 16, right: 16,
          background: exam.gradient,
          borderRadius: 100, padding: "3px 10px",
          fontSize: 10, fontWeight: 700, color: "#fff",
          letterSpacing: "0.06em", textTransform: "uppercase",
          boxShadow: `0 4px 12px ${exam.colorDim}`,
        }}>
          ⭐ Popular
        </div>
      )}

      {/* Icon + title row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
        <div style={{
          width: 58, height: 58, borderRadius: 16, flexShrink: 0,
          background: exam.gradient,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28,
          boxShadow: `0 8px 20px ${exam.colorDim}`,
          transition: "all 0.3s",
          transform: hovered ? "scale(1.08) rotate(-4deg)" : "scale(1) rotate(0deg)",
        }}>
          {exam.icon}
        </div>
        <div style={{ flex: 1, paddingRight: exam.popular ? 70 : 0 }}>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 17, fontWeight: 800,
            letterSpacing: "-0.3px", marginBottom: 4,
            color: hovered ? exam.color : "var(--text)",
            transition: "color 0.2s",
          }}>
            {exam.title}
          </div>
          <div style={{ fontSize: 12, color: "var(--text2)" }}>{exam.subject}</div>
        </div>
      </div>

      {/* Description */}
      <p style={{
        fontSize: 13, color: "var(--text2)", lineHeight: 1.65,
        marginBottom: 18,
      }}>
        {exam.description}
      </p>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
        {exam.tags.map(tag => (
          <span key={tag} style={{
            padding: "3px 10px", borderRadius: 100,
            background: exam.colorDim,
            border: `1px solid ${exam.colorBorder}`,
            fontSize: 11, fontWeight: 600,
            color: exam.color,
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Info row */}
      <div style={{
        display: "flex", alignItems: "center", gap: 0,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r-md)",
        overflow: "hidden", marginBottom: 20,
      }}>
        {[
          { icon: "❓", val: `${exam.questions} Qs`    },
          { icon: "⏱️", val: `${exam.duration} min`    },
          { icon: "🎯", val: exam.difficulty            },
        ].map((item, i) => (
          <div key={i} style={{
            flex: 1, padding: "10px 8px", textAlign: "center",
            borderRight: i < 2 ? "1px solid var(--border)" : "none",
          }}>
            <div style={{ fontSize: 14, marginBottom: 3 }}>{item.icon}</div>
            <div style={{
              fontSize: 12, fontWeight: 700,
              color: i === 2 ? exam.diffColor : "var(--text)",
              fontFamily: "var(--font-display)",
            }}>{item.val}</div>
          </div>
        ))}
      </div>

      {/* Start button */}
      <button
        style={{
          width: "100%", padding: "13px",
          background: hovered ? exam.gradient : "rgba(255,255,255,0.06)",
          border: `1.5px solid ${hovered ? "transparent" : exam.colorBorder}`,
          borderRadius: "var(--r-md)",
          color: hovered ? "#fff" : exam.color,
          fontSize: 14, fontWeight: 700,
          fontFamily: "var(--font-display)",
          cursor: "pointer", letterSpacing: "0.3px",
          transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: hovered ? `0 8px 24px ${exam.colorDim}` : "none",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}
        onClick={e => { e.stopPropagation(); onSelect(); }}
      >
        {hovered ? `🚀 Start ${exam.title.split(" ")[0]} Exam →` : `View Details & Start →`}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// EXAM DETAIL MODAL
// ─────────────────────────────────────────────────────────────────
function ExamModal({ exam, onClose, onStart, startAnim }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, animation: "fadeIn 0.2s ease both",
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "var(--card)", border: `1px solid ${exam.colorBorder}`,
        borderRadius: "var(--r-2xl)", width: "100%", maxWidth: 520,
        boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px ${exam.colorBorder}`,
        animation: "slideUp 0.38s cubic-bezier(0.16,1,0.3,1) both",
        overflow: "hidden",
      }}>

        {/* Modal header with gradient */}
        <div style={{
          background: exam.gradient,
          padding: "28px 32px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -40, right: -40,
            width: 160, height: 160, borderRadius: "50%",
            background: "rgba(255,255,255,0.10)", pointerEvents: "none",
          }}/>
          <div style={{
            position: "absolute", bottom: -30, left: -20,
            width: 100, height: 100, borderRadius: "50%",
            background: "rgba(255,255,255,0.06)", pointerEvents: "none",
          }}/>

          <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative", zIndex: 1 }}>
            <div style={{
              width: 68, height: 68, borderRadius: 18,
              background: "rgba(255,255,255,0.20)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 34, flexShrink: 0,
            }}>
              {exam.icon}
            </div>
            <div>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: 22, fontWeight: 900, color: "#fff",
                marginBottom: 4, letterSpacing: "-0.3px",
              }}>
                {exam.title}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
                {exam.subject} · {exam.difficulty} Level
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                marginLeft: "auto", background: "rgba(255,255,255,0.15)",
                border: "none", borderRadius: 10,
                width: 34, height: 34, color: "#fff", fontSize: 16,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            >✕</button>
          </div>
        </div>

        {/* Modal body */}
        <div style={{ padding: "26px 32px" }}>

          {/* Description */}
          <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.7, marginBottom: 22 }}>
            {exam.description}
          </p>

          {/* Exam stats grid */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 10, marginBottom: 22,
          }}>
            {[
              { icon:"❓", label:"Total Questions", val: `${exam.questions} MCQs`    },
              { icon:"⏱️", label:"Time Limit",      val: `${exam.duration} minutes`  },
              { icon:"🎯", label:"Difficulty",      val: exam.difficulty, color: exam.diffColor },
              { icon:"♾️", label:"Attempts",        val: exam.attempts                },
              { icon:"📊", label:"Marks per Q",     val: "1 mark"                    },
              { icon:"✅", label:"Passing Score",   val: "50%"                        },
            ].map((item, i) => (
              <div key={i} style={{
                background: "var(--card2)", border: "1px solid var(--border)",
                borderRadius: "var(--r-md)", padding: "13px 16px",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 2, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {item.label}
                  </div>
                  <div style={{
                    fontSize: 14, fontWeight: 700,
                    fontFamily: "var(--font-display)",
                    color: item.color || "var(--text)",
                  }}>
                    {item.val}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Topics covered */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
              Topics Covered
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {exam.tags.map(tag => (
                <span key={tag} style={{
                  padding: "5px 13px", borderRadius: 100,
                  background: exam.colorDim, border: `1px solid ${exam.colorBorder}`,
                  fontSize: 12, fontWeight: 600, color: exam.color,
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div style={{
            background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.22)",
            borderRadius: "var(--r-md)", padding: "14px 16px", marginBottom: 24,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--amber)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              ⚠️ Instructions
            </div>
            <ul style={{ fontSize: 12, color: "var(--text2)", lineHeight: 2, paddingLeft: 16 }}>
              <li>Timer starts immediately when you begin</li>
              <li>You can skip questions and come back later</li>
              <li>Exam auto-submits when time runs out</li>
              <li>Each correct answer gives +1 mark</li>
              <li>No negative marking</li>
            </ul>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={onClose}
              style={{
                padding: "13px 24px", borderRadius: "var(--r-md)",
                background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)",
                color: "var(--text2)", fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--border2)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text2)"; e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              ← Back
            </button>
            <button
              onClick={onStart}
              style={{
                flex: 1, padding: "13px",
                background: startAnim ? "rgba(34,197,94,0.8)" : exam.gradient,
                border: "none", borderRadius: "var(--r-md)",
                color: "#fff", fontSize: 15, fontWeight: 700,
                fontFamily: "var(--font-display)", letterSpacing: "0.3px",
                cursor: "pointer",
                boxShadow: `0 8px 28px ${exam.colorDim}`,
                transition: "all 0.25s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 14px 36px ${exam.colorDim}`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 8px 28px ${exam.colorDim}`; }}
            >
              {startAnim ? "🚀 Starting…" : `🚀 Start ${exam.title.split(" ")[0]} Exam →`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}