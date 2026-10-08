import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { ErrorBox, Loading } from "../components/Feedback";
import { SubmittedStatus } from "../components/SubmittedStatus";
import { useLoad } from "../hooks/useLoad";
import { api } from "../services/api";
import type { Detail, Progress } from "../types";
import { steps } from "../types";
import { humanStatus, statusClass } from "../utils/formatters";

const starterForLanguage = (language: string, practical: Detail) => {
  switch (language) {
    case "JAVA":
      return practical.javaStarterCode;
    case "PYTHON":
      return practical.pythonStarterCode;
    case "SQL":
      return "SELECT 'Hello from SQLite' AS message;";
    case "ASSEMBLY":
      return "section .text\nglobal _start\n_start:\n    mov rax, 60\n    xor rdi, rdi\n    syscall\n";
    default:
      return practical.javaStarterCode;
  }
};

const monacoLanguage = (language: string) => {
  if (language === "ASSEMBLY") return "plaintext";
  return language.toLowerCase();
};

export function PracticalLabPage() {
  const { id } = useParams(),
    practicalId = Number(id),
    nav = useNavigate(),
    {
      data: p,
      error,
      loading,
      refresh,
    } = useLoad(() => api<Detail>(`/practicals/${id}`), [id]),
    prog = useLoad(() => api<Progress>(`/practicals/${id}/progress`), [id]),
    [step, setStep] = useState("AIM"),
    [answers, setAnswers] = useState<Record<string, string>>({}),
    [code, setCode] = useState(""),
    [language, setLanguage] = useState("JAVA"),
    [stdin, setStdin] = useState(""),
    [conclusion, setConclusion] = useState(""),
    [terminal, setTerminal] = useState(""),
    [runState, setRunState] = useState(""),
    [busy, setBusy] = useState(false),
    [flash, setFlash] = useState("");
  useEffect(() => {
    if (prog.data && p) {
      const initialLanguage = p.semester === 5 ? "PYTHON" : "JAVA";
      setStep(prog.data.currentStep);
      setAnswers(prog.data.practiceAnswers || {});
      setLanguage(prog.data.draftLanguage || initialLanguage);
      setCode(prog.data.draftCode || starterForLanguage(initialLanguage, p));
      setConclusion(prog.data.conclusionText || "");
    }
  }, [prog.data, p]);
  useEffect(() => {
    if (!prog.data) return;
    const timer = window.setTimeout(
      () =>
        api(`/practicals/${id}/progress`, {
          method: "PUT",
          body: JSON.stringify({
            draftCode: code,
            draftLanguage: language,
            conclusionText: conclusion,
            practiceAnswers: answers,
          }),
        }).catch(() => {}),
      550,
    );
    return () => window.clearTimeout(timer);
  }, [prog.data, code, language, conclusion, answers]);
  if (loading || prog.loading) return <Loading />;
  if (error || prog.error)
    return (
      <ErrorBox
        message={error || prog.error}
        retry={() => {
          void refresh();
          void prog.refresh();
        }}
      />
    );
  if (!p || !prog.data) return null;
  if (prog.data.status === "SUBMITTED" || prog.data.status === "EVALUATED")
    return <SubmittedStatus title={p.title} status={prog.data.status} />;
  const idx = steps.findIndex((x) => x[0] === step),
    completed = prog.data.completedSteps || [];
  const selectStep = (key: string) => {
    const k = steps.findIndex((x) => x[0] === key);
    if (k <= idx || completed.includes(steps[k - 1]?.[0])) setStep(key);
  };
  const save = async (nextStep: string) => {
    try {
      const request: any = {
        step,
        ...(step === "PRACTICE" ? { practiceAnswers: answers } : {}),
        ...(step === "CONCLUSION" ? { conclusionText: conclusion } : {}),
        ...(step === "CODE"
          ? { draftCode: code, draftLanguage: language }
          : {}),
      };
      const x = await api<Progress>(`/practicals/${id}/progress`, {
        method: "POST",
        body: JSON.stringify(request),
      });
      prog.setData(x);
      setStep(nextStep);
      setFlash("Section complete · progress saved");
      setTimeout(() => setFlash(""), 2400);
    } catch (e) {
      setFlash(e instanceof Error ? e.message : "Could not save progress");
    }
  };
  const run = async () => {
    setBusy(true);
    setRunState("RUNNING");
    setTerminal("Running your program…");
    try {
      const r = await api<any>("/execution/run", {
        method: "POST",
        body: JSON.stringify({ practicalId, language, source: code, stdin }),
      });
      setRunState(r.status);
      setTerminal(
        [
          r.status === "SUCCESS"
            ? "✓ Execution successful"
            : `✕ ${r.status.replaceAll("_", " ").toLowerCase()}`,
          r.stdout && `Output:\n${r.stdout}`,
          r.compileError && `Compilation error:\n${r.compileError}`,
          r.runtimeError && `Runtime error:\n${r.runtimeError}`,
          r.stderr && `Details:\n${r.stderr}`,
          r.executionTime != null &&
            `Execution time: ${(r.executionTime / 1000).toFixed(2)}s`,
        ]
          .filter(Boolean)
          .join("\n\n"),
      );
    } catch (e) {
      setRunState("UNAVAILABLE");
      setTerminal(
        e instanceof Error
          ? e.message
          : "Code execution failed. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };
  const finish = async () => {
    setBusy(true);
    try {
      const completed = await api<Progress>(`/practicals/${id}/progress`, {
        method: "POST",
        body: JSON.stringify({
          step: "CONCLUSION",
          conclusionText: conclusion,
        }),
      });
      prog.setData(completed);
      await api("/submissions", {
        method: "POST",
        body: JSON.stringify({
          practicalId,
          language,
          code,
          output: terminal,
          executionStatus: runState,
          conclusionText: conclusion,
        }),
      });
      setFlash("Practical submitted successfully");
      await prog.refresh();
    } catch (e) {
      setFlash(e instanceof Error ? e.message : "Submission failed");
    } finally {
      setBusy(false);
    }
  };
  const integrity = (eventType: string, source: string) => {
    void api("/integrity/events", {
      method: "POST",
      body: JSON.stringify({
        practicalId,
        eventType,
        metadata: JSON.stringify({ source }),
      }),
    }).catch(() => {});
  };
  const current = steps[idx];
  return (
    <div className="lab-page">
      <div className="lab-heading">
        <button className="back-link" onClick={() => nav("/")}>
          ← My practicals
        </button>
        <div className="lab-title">
          <div>
            <span className="eyebrow">
              PRACTICAL · {String(practicalId).padStart(2, "0")}
            </span>
            <h1>{p.title}</h1>
          </div>
          <span className={`status ${statusClass(prog.data.status)}`}>
            {humanStatus(prog.data.status)}
          </span>
        </div>
      </div>
      <div className="stepper">
        {steps.map(([key, label], i) => {
          const isDone = completed.includes(key),
            locked = i > idx && !isDone,
            isCurrent = key === step;
          return (
            <button
              disabled={locked}
              onClick={() => selectStep(key)}
              className={`step-item ${isDone ? "is-done" : ""} ${isCurrent ? "is-current" : ""} ${locked ? "is-locked" : ""}`}
              key={key}
            >
              <span className="step-marker">
                {isDone ? "✓" : String(i + 1).padStart(2, "0")}
              </span>
              <span>{label}</span>
              {i < steps.length - 1 && <i />}
            </button>
          );
        })}
      </div>
      <div className="note-banner"><div className="note-symbol">i</div><div><b>{p.facultyName||"Faculty"} · Assigned {p.assignedAt?new Intl.DateTimeFormat(undefined,{dateStyle:"medium"}).format(new Date(p.assignedAt)):""}</b>{p.dueAt&&<p>Due {new Intl.DateTimeFormat(undefined,{dateStyle:"medium",timeStyle:"short"}).format(new Date(p.dueAt))}</p>}{p.assignmentInstructions&&<p>{p.assignmentInstructions}</p>}</div></div>
      <div className="lab-layout">
        <section className="lab-main">
          <div className="section-meta">
            <span>SECTION {String(idx + 1).padStart(2, "0")} / 06</span>
            <span>~ {step === "CODE" ? "10" : "3"} MIN</span>
          </div>
          <h2>{current[1]}</h2>
          <div className="step-content">
            {step === "AIM" && (
              <>
                <p className="lead">{p.aim}</p>
                <p>{p.description}</p>
                <div className="learning-callout">
                  <b>Learning objective</b>
                  <p>
                    Understand the problem requirements and the outcomes
                    expected from this practical.
                  </p>
                </div>
              </>
            )}
            {step === "THEORY" && (
              <div className="rich-copy">{paragraphs(p.theory)}</div>
            )}
            {step === "ALGORITHM" && (
              <>
                <div className="algorithm-box">
                  <pre>{p.algorithm}</pre>
                </div>
                <div className="learning-callout">
                  <b>Before you continue</b>
                  <p>
                    Trace the steps by hand and make sure you understand how
                    each stage contributes to the solution.
                  </p>
                </div>
              </>
            )}
            {step === "PRACTICE" && (
              <div className="question-list">
                {p.practiceQuestions.map((q, i) => (
                  <label className="question-card" key={q.id}>
                    <span className="question-index">
                      Q{String(i + 1).padStart(2, "0")}
                    </span>
                    <b>{q.question}</b>
                    <textarea
                      value={answers[String(q.id)] || ""}
                      onChange={(e) =>
                        setAnswers({ ...answers, [q.id]: e.target.value })
                      }
                      placeholder="Write your answer…"
                      rows={3}
                    />
                  </label>
                ))}
              </div>
            )}
            {step === "CODE" && (
              <>
                <p>{p.codeInstructions}</p>
                <div className="editor-shell">
                  <div className="editor-toolbar">
                    <label>
                      Language
                      <select
                        value={language}
                        onChange={(e) => {
                          const v = e.target.value;
                          setLanguage(v);
                          setCode(starterForLanguage(v, p));
                        }}
                      >
                        <option value="JAVA">Java</option>
                        <option value="PYTHON">Python</option>
                        <option value="SQL">SQL (SQLite)</option>
                        <option value="ASSEMBLY">Assembly (NASM)</option>
                      </select>
                    </label>
                    <div className="editor-actions">
                      <button
                        className="button secondary compact"
                        onClick={() => setCode(starterForLanguage(language, p))}
                      >
                        Reset
                      </button>
                      <button
                        className="button primary compact"
                        onClick={run}
                        disabled={busy}
                      >
                        ▶ &nbsp;{busy ? "Running…" : "Run"}
                      </button>
                    </div>
                  </div>
                  <div
                    className="monaco-wrap"
                    onKeyDownCapture={(e) => {
                      const key = e.key.toLowerCase(),
                        mod = e.ctrlKey || e.metaKey;
                      if (mod && ["c", "x", "v"].includes(key)) {
                        e.preventDefault();
                        integrity(
                          key === "c"
                            ? "COPY_ATTEMPT"
                            : key === "x"
                              ? "CUT_ATTEMPT"
                              : "PASTE_ATTEMPT",
                          "keyboard",
                        );
                      }
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      integrity("COPY_ATTEMPT", "context-menu");
                    }}
                  >
                    <Editor
                      height="360px"
                      language={monacoLanguage(language)}
                      theme="vs-dark"
                      value={code}
                      onChange={(v) => setCode(v || "")}
                      options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        contextmenu: false,
                        quickSuggestions: false,
                        wordWrap: "on",
                        padding: { top: 18 },
                        lineNumbers: "on",
                      }}
                    />
                  </div>
                  <label className="editor-stdin-label">
                    Program input{" "}
                    <span className="muted">(one value per line)</span>
                    <textarea
                      className="editor-stdin"
                      value={stdin}
                      onChange={(event) => setStdin(event.target.value)}
                      placeholder="Input passed to Scanner / input() when the program runs"
                      rows={3}
                    />
                  </label>
                  <div className="terminal">
                    <div className="terminal-title">
                      <span>
                        <i className="live-dot" /> TERMINAL
                      </span>
                      <span>{runState || "READY"}</span>
                    </div>
                    <pre>
                      {terminal || "Run your program to see output here."}
                    </pre>
                  </div>
                </div>
              </>
            )}
            {step === "CONCLUSION" && (
              <>
                <p>{p.conclusion}</p>
                <label className="field-label">
                  Your conclusion
                  <textarea
                    rows={7}
                    minLength={40}
                    value={conclusion}
                    onChange={(e) => setConclusion(e.target.value)}
                    placeholder="Summarize what you learned, the result, and any challenges you solved."
                  />
                </label>
                <span className="muted small">
                  {conclusion.trim().length} / 40 minimum characters
                </span>
              </>
            )}
          </div>
          <div className="step-footer">
            {idx > 0 && (
              <button
                className="button secondary"
                onClick={() => setStep(steps[idx - 1][0])}
              >
                ← Previous
              </button>
            )}
            <span className="muted small">
              {completed.length} of 6 sections complete
            </span>
            {step === "CONCLUSION" ? (
              <button
                className="button primary"
                onClick={finish}
                disabled={busy || conclusion.trim().length < 40}
              >
                {busy ? "Submitting…" : "Submit practical"} →
              </button>
            ) : (
              <button
                className="button primary"
                onClick={() => save(steps[Math.min(idx + 1, 5)][0])}
                disabled={
                  step === "PRACTICE" &&
                  p.practiceQuestions.some(
                    (q) => !(answers[String(q.id)] || "").trim(),
                  )
                }
              >
                Complete & continue →
              </button>
            )}
          </div>
        </section>
        <aside className="lab-rail">
          <div className="rail-card">
            <span className="eyebrow">PRACTICAL PROGRESS</span>
            <div className="progress-ring">
              <b>{prog.data.percent}%</b>
            </div>
            <p>
              Move through each section in order. Your answers are saved when
              you continue.
            </p>
            <div className="rail-divider" />
            <div className="rail-row">
              <span>Completed</span>
              <b>{completed.length} / 6</b>
            </div>
            <div className="rail-row">
              <span>Current section</span>
              <b>{current[1]}</b>
            </div>
          </div>
          <div className="rail-card support-card">
            <b>Need a reminder?</b>
            <p>Read the instructions carefully before moving to the editor.</p>
            <a href="#section">View code requirements ↗</a>
          </div>
        </aside>
      </div>
      {flash && <div className="toast">{flash}</div>}
    </div>
  );
}
function paragraphs(text: string) {
  return text
    .split("\n")
    .filter(Boolean)
    .map((x, i) => <p key={i}>{x}</p>);
}
import "../styles/pages/practical-lab.css";
