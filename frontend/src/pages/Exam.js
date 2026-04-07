// src/pages/Exam.js
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://smart-online-examination-system.onrender.com/api";

export default function Exam() {
  const navigate = useNavigate();
  const token    = localStorage.getItem("token");

  // Read selected exam info saved by Home.js
  const selectedExam = JSON.parse(localStorage.getItem("selectedExam") || "null");
  const examId       = selectedExam?.id       || "mixed";
  const examTitle    = selectedExam?.title    || "Online Examination";
  const examSubject  = selectedExam?.subject  || "Mixed";
  const examDuration = selectedExam?.duration || 30;
  const examIcon     = selectedExam?.icon     || "📝";
  const TOTAL_TIME   = examDuration * 60;

  const [questions, setQuestions] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [current,   setCurrent]   = useState(0);
  const [answers,   setAnswers]   = useState({});
  const [skipped,   setSkipped]   = useState(new Set());
  const [timeLeft,  setTimeLeft]  = useState(TOTAL_TIME);
  const [animDir,   setAnimDir]   = useState("left");
  const [animKey,   setAnimKey]   = useState(0);
  const [confirm,   setConfirm]   = useState(false);
  const [saving,    setSaving]    = useState(false);

  // Fetch questions for the selected exam
  useEffect(() => {
    const fetchQs = async () => {
      try {
        const res = await axios.get(`${API}/questions/by-exam/${examId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const qs = res.data.questions || [];
        if (qs.length === 0) {
          setError(`No questions available for "${examTitle}". Please ask your admin to add questions first.`);
        }
        setQuestions(qs);
      } catch (err) {
        if (err.response?.status === 401) { localStorage.clear(); navigate("/login"); }
        else setError("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchQs();
  }, [token, navigate, examId, examTitle]);

  // Submit handler
  const handleSubmit = useCallback(async (auto = false) => {
    setConfirm(false);
    setSaving(true);

    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });

    const total        = questions.length;
    const wrong        = Object.keys(answers).filter(i => answers[Number(i)] !== questions[Number(i)]?.correctAnswer).length;
    const skippedCount = skipped.size;
    const unattempted  = total - Object.keys(answers).length;
    const pct          = total ? Math.round((correct / total) * 100) : 0;
    const timeTaken    = TOTAL_TIME - timeLeft;

    try {
      await axios.post(`${API}/results`, {
        examName:         examTitle,
        subject:          examSubject,
        examId:           examId,
        answers:          answers,
        score:            correct,
        totalMarks:       total,
        percentage:       pct,
        timeTaken,
        correctCount:     correct,
        wrongCount:       wrong,
        skippedCount,
        unattemptedCount: unattempted,
      }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      console.error("Failed to save result:", err);
    }

    navigate("/result", {
      state: {
        correct, wrong, total, skippedCount, unattempted,
        pct, timeTaken, answers, questions,
        examTitle, examIcon, autoSubmit: auto,
      },
    });
  }, [answers, skipped, timeLeft, questions, token, navigate, examTitle, examSubject, examId, examIcon, TOTAL_TIME]);

  // Timer countdown
  useEffect(() => {
    if (questions.length === 0) return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(id); handleSubmit(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [questions, handleSubmit]);

  const goTo = (idx, dir = "left") => {
    setAnimDir(dir);
    setAnimKey(k => k + 1);
    setCurrent(idx);
  };

  const selectAnswer = (optIdx) => {
    setAnswers(prev => ({ ...prev, [current]: optIdx }));
    setSkipped(prev => { const s = new Set(prev); s.delete(current); return s; });
  };

  const goPrev = () => { if (current > 0) goTo(current - 1, "right"); };
  const goNext = () => {
    if (current < questions.length - 1) goTo(current + 1, "left");
    else setConfirm(true);
  };
  const goSkip = () => {
    setSkipped(prev => { const s = new Set(prev); s.add(current); return s; });
    if (current < questions.length - 1) goTo(current + 1, "left");
  };

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const qStatus = (i) => {
    if (i === current)               return "current";
    if (answers[i] !== undefined)    return "answered";
    if (skipped.has(i))              return "skipped";
    return "";
  };

  const answeredCount = Object.keys(answers).length;
  const progress      = questions.length ? ((current + 1) / questions.length) * 100 : 0;
  const q             = questions[current];

  // Loading screen
  if (loading) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100vh", gap:16, background:"var(--bg)" }}>
      <span style={{ fontSize:52 }}>{examIcon}</span>
      <span className="spinner" style={{ width:32, height:32, borderWidth:3 }}/>
      <span style={{ fontSize:14, color:"var(--text2)" }}>Loading {examTitle}…</span>
    </div>
  );

  // Error screen
  if (error) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100vh", gap:16, background:"var(--bg)", padding:24, textAlign:"center" }}>
      <span style={{ fontSize:52 }}>📭</span>
      <div style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700 }}>{error}</div>
      <button className="btn-primary" style={{ width:"auto", padding:"12px 28px" }} onClick={() => navigate("/home")}>
        ← Back to Exams
      </button>
    </div>
  );

  return (
    <div className="exam-page">

      {/* TOP BAR */}
      <div className="exam-topbar">
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            width:38, height:38, borderRadius:10,
            background: selectedExam?.gradient || "var(--blue)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:20, flexShrink:0,
            boxShadow:`0 4px 12px ${selectedExam?.colorDim || "var(--blue-dim)"}`,
          }}>
            {examIcon}
          </div>
          <div>
            <div className="exam-title">{examTitle}</div>
            <div className="exam-subject">{examSubject} · {questions.length} Questions · {examDuration} min</div>
          </div>
        </div>

        <div className="exam-timer-wrap">
          <span style={{ fontSize:18 }}>⏱️</span>
          <div>
            <div className={`exam-timer-val ${timeLeft < 300 ? "warning" : ""}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="exam-timer-lbl">Time Remaining</div>
          </div>
        </div>

        <button className="exam-submit-btn" onClick={() => setConfirm(true)}>
          ✅ Submit Exam
        </button>
      </div>

      {/* BODY */}
      <div className="exam-body">

        {/* QUESTION AREA */}
        <div className="question-area">
          <div className="exam-progress-track">
            <div className="exam-progress-fill" style={{
              width: `${progress}%`,
              background: selectedExam?.gradient || "var(--blue)",
            }}/>
          </div>

          {/* QUESTION BOX */}
          <div
            key={animKey}
            className="question-box"
            style={{
              animation: `${animDir === "left" ? "slideLeft" : "slideRight"} 0.38s cubic-bezier(0.16,1,0.3,1) both`,
              borderColor: selectedExam?.colorBorder || "var(--border)",
            }}
          >
            {/* Colored top bar */}
            <div style={{
              position:"absolute", top:0, left:0, right:0, height:3,
              background: selectedExam?.gradient || "linear-gradient(90deg,var(--blue),var(--teal))",
              borderRadius:"var(--r-xl) var(--r-xl) 0 0",
            }}/>

            <div className="q-meta">
              <span className="q-num-badge" style={{
                background: selectedExam?.colorDim || "var(--blue-dim)",
                borderColor: selectedExam?.colorBorder || "var(--border2)",
                color: selectedExam?.color || "var(--blue)",
              }}>
                Q {current + 1} / {questions.length}
              </span>
              <span className="q-subject-badge">{q?.subject || examSubject}</span>
              <span className="q-marks">+<span>{q?.marks || 1}</span> mark</span>
            </div>

            <div className="q-text">{q?.questionText}</div>

            <div className="options-grid">
              {(q?.options || []).map((opt, i) => (
                <button
                  key={i}
                  className={`option-btn ${answers[current] === i ? "selected" : ""}`}
                  onClick={() => selectAnswer(i)}
                  style={answers[current] === i ? {
                    borderColor: selectedExam?.color || "var(--blue)",
                    background:  selectedExam?.colorDim || "var(--blue-dim)",
                    boxShadow:   `0 0 0 3px ${selectedExam?.colorDim || "rgba(59,158,255,0.12)"}`,
                  } : {}}
                >
                  <span className="option-letter" style={answers[current] === i ? {
                    background:  selectedExam?.color || "var(--blue)",
                    borderColor: selectedExam?.color || "var(--blue)",
                    color:       "#fff",
                  } : {}}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span style={{ flex:1, lineHeight:1.5 }}>{opt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* NAV BUTTONS */}
          <div className="q-nav-row">
            <button className="q-nav-btn prev" onClick={goPrev} disabled={current === 0}>
              ← Previous
            </button>
            <button className="q-nav-btn skip" onClick={goSkip}>
              ⏭ Skip
            </button>
            <button
              className="q-nav-btn next"
              onClick={goNext}
              style={{ background: selectedExam?.gradient || "var(--blue)", borderColor: selectedExam?.color || "var(--blue)" }}
            >
              {current === questions.length - 1 ? "Finish →" : "Next →"}
            </button>
          </div>

          {skipped.has(current) && (
            <div className="q-skip-note">⚠️ This question was skipped — select an answer to mark it.</div>
          )}
        </div>

        {/* SIDEBAR PALETTE */}
        <div className="exam-sidebar">
          <div className="palette-title">Question Palette</div>

          <div className="palette-grid">
            {questions.map((_, i) => (
              <button
                key={i}
                className={`palette-btn ${qStatus(i)}`}
                onClick={() => goTo(i, i > current ? "left" : "right")}
                style={qStatus(i) === "current" ? {
                  background:  selectedExam?.color || "var(--blue)",
                  borderColor: selectedExam?.color || "var(--blue)",
                  boxShadow:   `0 0 0 3px ${selectedExam?.colorDim || "rgba(59,158,255,0.2)"}`,
                } : {}}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="palette-legend">
            {[
              { color: selectedExam?.color || "var(--blue)", bg: selectedExam?.colorDim || "var(--blue-dim)", label: "Current"     },
              { color: "var(--green)", bg: "var(--green-dim)", label: "Answered"    },
              { color: "var(--amber)", bg: "var(--amber-dim)", label: "Skipped"     },
              { color: "var(--border)", bg: "rgba(255,255,255,0.04)", label: "Not visited" },
            ].map(({ color, bg, label }) => (
              <div key={label} className="legend-row">
                <div className="legend-dot" style={{ background: bg, border: `1.5px solid ${color}` }}/>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="exam-stats-mini">
            {[
              { lbl:"Answered",    val: answeredCount,                                              color:"var(--green)"  },
              { lbl:"Skipped",     val: skipped.size,                                               color:"var(--amber)"  },
              { lbl:"Not visited", val: Math.max(0, questions.length - answeredCount - skipped.size), color:"var(--text2)" },
              { lbl:"Total",       val: questions.length,                                           color:"var(--text)"   },
            ].map(({ lbl, val, color }) => (
              <div key={lbl} className="mini-stat">
                <span className="mini-stat-lbl">{lbl}</span>
                <span className="mini-stat-val" style={{ color }}>{val}</span>
              </div>
            ))}
          </div>

          <button
            className="exam-sidebar-submit"
            onClick={() => setConfirm(true)}
            style={{ background: selectedExam?.gradient || "var(--green)" }}
          >
            ✅ Submit Exam
          </button>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {confirm && (
        <div className="modal-overlay" onClick={() => setConfirm(false)}>
          <div className="modal-box confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-icon">{examIcon}</div>
            <div className="confirm-title">Submit {examTitle}?</div>
            <div className="confirm-sub">
              Answered: <strong style={{ color:"var(--green)" }}>{answeredCount}</strong> of{" "}
              <strong>{questions.length}</strong>.{" "}
              {skipped.size > 0 && <><strong style={{ color:"var(--amber)" }}>{skipped.size}</strong> skipped. </>}
              {questions.length - answeredCount - skipped.size > 0 && (
                <><strong style={{ color:"var(--coral)" }}>{questions.length - answeredCount - skipped.size}</strong> not attempted.</>
              )}
              <br/><br/>This action cannot be undone.
            </div>
            <div className="confirm-btns">
              <button className="btn-secondary" style={{ flex:1 }} onClick={() => setConfirm(false)} disabled={saving}>
                Continue Exam
              </button>
              <button
                className="btn-primary" style={{ flex:1, background: selectedExam?.gradient || "var(--blue)" }}
                onClick={() => handleSubmit(false)} disabled={saving}
              >
                {saving ? <><span className="spinner"/>Saving…</> : "Submit Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}