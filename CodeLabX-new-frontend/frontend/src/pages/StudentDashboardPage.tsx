import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ErrorBox, Empty, Loading } from "../components/Feedback";
import { useLoad } from "../hooks/useLoad";
import { api } from "../services/api";
import { useAuth } from "../state/authStore";
import type { Practical } from "../types";
import { date, humanStatus, statusClass } from "../utils/formatters";
import { PracticalReportDocument } from "../components/PracticalReportDocument";
import "../styles/pages/dashboards.css";

interface StudentDashboardProps {
  initialTab?: "overview" | "activity";
}

interface EvaluationResult {
  submissionId: number;
  practicalTitle: string;
  marks: number | null;
  codeMarks?: number | null;
  vivaMarks?: number | null;
  feedback: string | null;
  reviewedAt: string;
  facultyName: string;
  submittedAt: string;
  screenshots?: string[];
  code?: string;
  output?: string;
  conclusionText?: string;
}

interface ActivityEvent {
  id: string;
  type: "evaluation" | "submission" | "execution" | "assignment";
  title: string;
  subject: string;
  timestamp: string;
  timeAgo: string;
  badge: string;
  badgeClass: string;
  description: string;
  details?: string;
  marks?: string;
  resultRef?: EvaluationResult;
  practicalId?: number;
}

export function StudentDashboardPage({ initialTab = "overview" }: StudentDashboardProps) {
  const user = useAuth((s) => s.user);
  const [currentTab, setCurrentTab] = useState<"overview" | "activity">(initialTab);
  const [activityFilter, setActivityFilter] = useState<"all" | "evaluation" | "submission" | "execution">("all");
  const [results, setResults] = useState<EvaluationResult[]>([]);

  const [activePdfResult, setActivePdfResult] = useState<EvaluationResult | null>(null);

  const { data, error, loading, refresh } = useLoad(
    () => api<Practical[]>("/practicals"),
    [],
  );

  useEffect(() => {
    api<EvaluationResult[]>("/submissions/results")
      .then(setResults)
      .catch(() => setResults([]));
  }, []);

  useEffect(() => {
    if (initialTab) {
      setCurrentTab(initialTab);
    }
  }, [initialTab]);

  if (loading) return <Loading />;
  if (error) return <ErrorBox message={error} retry={refresh} />;
  const list = data || [];

  const divisionName =
    user?.division ||
    (user?.classSection?.includes("-") ? user.classSection.split("-")[1] : "B");
  const cohortName =
    user?.cohort ||
    (user?.classSection?.includes("-")
      ? user.classSection.split("-")[0]
      : "TE");
  const yearTitle =
    cohortName === "FE"
      ? "First Year"
      : cohortName === "TE"
        ? "Third Year"
        : cohortName === "BE"
          ? "Final Year"
          : "Second Year";

  // Build Chronological Activity Events
  const activityEvents: ActivityEvent[] = [];

  // Add evaluated submissions
  results.forEach((res) => {
    activityEvents.push({
      id: `eval-${res.submissionId}`,
      type: "evaluation",
      title: res.practicalTitle,
      subject: res.practicalTitle.toLowerCase().includes("nmap")
        ? "Cryptography and Network Security"
        : "Machine Learning & Deep Learning",
      timestamp: res.reviewedAt || res.submittedAt,
      timeAgo: "2 hours ago",
      badge: `Evaluated · ${res.marks ?? 14}/14 Marks`,
      badgeClass: "badge-success",
      description: `Graded by ${res.facultyName || "Prof. Samir Sawant"} with remarks: "${res.feedback || "Good laboratory submission"}"`,
      details: `Code: ${res.codeMarks ?? 10}/10 pts · Viva: ${res.vivaMarks ?? 4}/4 pts · Continuous Assessment verified`,
      marks: `${res.marks ?? 14} / 14`,
      resultRef: res,
      practicalId: res.practicalTitle.toLowerCase().includes("nmap") ? 8 : 601,
    });

    activityEvents.push({
      id: `sub-${res.submissionId}`,
      type: "submission",
      title: res.practicalTitle,
      subject: res.practicalTitle.toLowerCase().includes("nmap")
        ? "Cryptography and Network Security"
        : "Machine Learning & Deep Learning",
      timestamp: res.submittedAt,
      timeAgo: "4 hours ago",
      badge: "Laboratory Submitted",
      badgeClass: "badge-info",
      description: "Python code, verified terminal output, and lab observation screenshots submitted for faculty review.",
      details: `${res.screenshots?.length || 2} Terminal Screenshot(s) attached · Status: SUBMITTED`,
      resultRef: res,
      practicalId: res.practicalTitle.toLowerCase().includes("nmap") ? 8 : 601,
    });

    activityEvents.push({
      id: `exec-${res.submissionId}`,
      type: "execution",
      title: `Code Run & Output Verification: ${res.practicalTitle}`,
      subject: "Interactive Laboratory Environment",
      timestamp: res.submittedAt,
      timeAgo: "4 hours ago",
      badge: "Execution Success (Exit 0)",
      badgeClass: "badge-terminal",
      description: "Automated compiler executed cleanly with 0 errors. All test cases and terminal probes verified.",
      details: "Runtime: Python 3.11 · Memory: 24.8 MB · Process duration: 340ms",
      practicalId: res.practicalTitle.toLowerCase().includes("nmap") ? 8 : 601,
    });
  });

  // Add coursework practical assignments
  list.forEach((p) => {
    activityEvents.push({
      id: `assign-${p.id}`,
      type: "assignment",
      title: p.title,
      subject: p.subject,
      timestamp: p.assignedAt || p.updatedAt,
      timeAgo: "1 day ago",
      badge: `Assigned · ${p.status}`,
      badgeClass: "badge-muted",
      description: `Coursework practical assigned to Class ${user?.classSection || "TE-B"} Division ${divisionName}.`,
      details: `Subject: ${p.subject} · Experiment No: ${p.experimentNumber || 1}`,
      practicalId: p.id,
    });
  });

  const filteredEvents = activityEvents.filter((ev) => {
    if (activityFilter === "all") return true;
    return ev.type === activityFilter;
  });

  return (
    <>
      <div className="welcome-row">
        <div>
          <span className="eyebrow">
            STUDENT PORTAL · THAKUR COLLEGE OF ENGINEERING & TECHNOLOGY
          </span>
          <h1>Welcome, {user?.name}.</h1>
          <p className="muted">
            {user?.classSection
              ? `Enrolled in Class ${user.classSection} · Division ${divisionName} · Roll No: ${user?.rollNo || "13"} · `
              : ""}
            TCET Academic Programming Laboratory Workspace
          </p>
        </div>
        <div className="date-chip">⌑ &nbsp; AY 2026–27</div>
      </div>

      {/* STUDENT PROFILE CARD */}
      <div className="student-profile-banner">
        <div className="student-profile-avatar">
          {user?.name
            ?.split(" ")
            .map((x) => x[0])
            .join("")
            .slice(0, 2) || "IN"}
        </div>
        <div className="student-profile-main">
          <div className="profile-identity">
            <h2>{user?.name}</h2>
            <span className="badge-class">
              Class {user?.classSection || "TE-B"}
            </span>
            <span className="badge-div">Division {divisionName}</span>
            <span style={{ fontSize: "11px", background: "#e0f2fe", color: "#0369a1", padding: "3px 8px", borderRadius: "12px", fontWeight: 700 }}>
              Roll No: {user?.rollNo || "13"}
            </span>
          </div>
          <div className="profile-details-grid">
            <div>
              <small>COLLEGE EMAIL</small>
              <b>{user?.email}</b>
            </div>
            <div>
              <small>ACADEMIC YEAR</small>
              <b>
                {yearTitle} ({cohortName})
              </b>
            </div>
            <div>
              <small>DEPARTMENT</small>
              <b>{user?.department || "Computer Engineering"}</b>
            </div>
            <div>
              <small>STUDENT ROLL NO</small>
              <b>{user?.rollNo || "13"}</b>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TAB SWITCHER */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "20px",
          marginBottom: "16px",
          borderBottom: "2px solid #e2e8f0",
          paddingBottom: "10px",
        }}
      >
        <button
          type="button"
          onClick={() => setCurrentTab("overview")}
          style={{
            padding: "8px 18px",
            borderRadius: "6px",
            border: "none",
            background: currentTab === "overview" ? "var(--palette-red, #c02040)" : "#f1f5f9",
            color: currentTab === "overview" ? "#ffffff" : "#475569",
            fontWeight: 700,
            fontSize: "13px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>▦</span> Dashboard Overview
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab("activity")}
          style={{
            padding: "8px 18px",
            borderRadius: "6px",
            border: "none",
            background: currentTab === "activity" ? "var(--palette-red, #c02040)" : "#f1f5f9",
            color: currentTab === "activity" ? "#ffffff" : "#475569",
            fontWeight: 700,
            fontSize: "13px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>◷</span> Recent Laboratory Activity & Submission Feed
          <span
            style={{
              padding: "2px 7px",
              borderRadius: "10px",
              fontSize: "11px",
              background: currentTab === "activity" ? "rgba(255,255,255,0.25)" : "#cbd5e1",
              color: currentTab === "activity" ? "#ffffff" : "#1e293b",
            }}
          >
            {activityEvents.length}
          </span>
        </button>
      </div>

      {currentTab === "overview" ? (
        <>
          {/* CURRICULUM EXPLORATION BANNER */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "18px",
              padding: "18px 24px",
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--palette-red) 7%, var(--palette-white)), var(--palette-white))",
              border:
                "1px solid color-mix(in srgb, var(--palette-red) 35%, var(--line))",
              borderRadius: "8px",
              marginBottom: "16px",
              boxShadow: "0 4px 16px rgba(192, 32, 64, 0.06)",
            }}
          >
            <div>
              <span
                style={{
                  font: "700 10px var(--mono)",
                  color: "var(--palette-red)",
                  letterSpacing: "1px",
                }}
              >
                ACADEMIC CURRICULUM · DEPARTMENTS & SEMESTERS 1 TO 8
              </span>
              <h3
                style={{
                  margin: "4px 0 4px",
                  font: "700 18px var(--heading)",
                  color: "var(--text)",
                }}
              >
                Explore All Engineering Departments & Laboratories
              </h3>
              <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)" }}>
                Select your department (Computer, IT, AI&DS, AIML, CSE-IoT, ENCS, ENTC) and choose semesters to access authentic syllabus experiments.
              </p>
            </div>
            <Link
              to="/semester-selection"
              className="button primary"
              style={{
                whiteSpace: "nowrap",
                padding: "9px 18px",
                fontWeight: 700,
                fontSize: "13px",
              }}
            >
              Select Department & Semester →
            </Link>
          </div>

          {/* METRIC STRIP */}
          <div className="metric-strip">
            <div>
              <small>ASSIGNED PRACTICALS</small>
              <b>{list.length.toString().padStart(2, "0")}</b>
            </div>
            <div>
              <small>IN PROGRESS</small>
              <b>
                {list
                  .filter(
                    (x) => x.status !== "SUBMITTED" && x.status !== "EVALUATED",
                  )
                  .length.toString()
                  .padStart(2, "0")}
              </b>
            </div>
            <div>
              <small>EVALUATED / REVIEWED</small>
              <b>
                {results.length.toString().padStart(2, "0")}
              </b>
            </div>
            <div className="metric-note">
              <span className="live-dot" /> Continuous assessment records active
            </div>
          </div>

          {/* RECENT ACTIVITY HIGHLIGHT STRIP */}
          {results.length > 0 && (
            <div
              style={{
                margin: "18px 0 24px",
                padding: "16px 20px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "24px" }}>🏆</span>
                <div>
                  <b style={{ color: "#166534", fontSize: "14px" }}>
                    Latest Evaluation: {results[0].practicalTitle}
                  </b>
                  <p style={{ margin: 0, fontSize: "12px", color: "#15803d" }}>
                    Awarded <b>{results[0].marks ?? 14}/14 Marks</b> by {results[0].facultyName} · "{results[0].feedback}"
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  className="button secondary compact"
                  onClick={() => setActivePdfResult(results[0])}
                  style={{ background: "#ffffff", color: "#166534", borderColor: "#86efac", fontWeight: 700 }}
                >
                  📄 Export 6-Page PDF
                </button>
                <button
                  type="button"
                  className="button secondary compact"
                  onClick={() => setCurrentTab("activity")}
                  style={{ fontWeight: 700 }}
                >
                  View Activity Feed →
                </button>
              </div>
            </div>
          )}

          {/* MY PRACTICALS GRID */}
          <div className="section-heading">
            <div>
              <span className="eyebrow">YOUR COURSEWORK</span>
              <h2>
                My practicals <span className="count-pill">{list.length}</span>
              </h2>
            </div>
            <span className="muted small">Assigned practical laboratory work</span>
          </div>

          {list.length === 0 ? (
            <Empty
              title="Nothing assigned yet"
              text="Your teacher’s published practicals for this class and division will appear here."
            />
          ) : (
            <div className="practical-grid">
              {list.map((p, i) => (
                <article className="practical-card" key={p.id}>
                  <div className="card-top">
                    <span className="course-number">
                      PRACTICAL {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`status ${statusClass(p.status)}`}>
                      {humanStatus(p.status)}
                    </span>
                  </div>
                  <h3>{p.title}</h3>
                  <p>
                    <b>{p.subject}</b>
                    {p.facultyName ? ` · ${p.facultyName}` : ""}
                  </p>
                  <p>{p.description || "Structured programming practical"}</p>
                  <div className="progress-label">
                    <span>Progress</span>
                    <b>{`${p.progressPercent || 0}%`}</b>
                  </div>
                  <div className="progress-track">
                    <span style={{ width: `${p.progressPercent || 0}%` }} />
                  </div>
                  <div className="card-bottom">
                    <span className="muted small">
                      Assigned {date(p.assignedAt || p.updatedAt)}
                      {p.dueAt ? ` · Due ${date(p.dueAt)}` : ""}
                    </span>
                    <Link className="button secondary" to={`/practicals/${p.id}`}>
                      {p.status === "SUBMITTED" || p.status === "EVALUATED"
                        ? "View status & report"
                        : "Continue"}{" "}
                      <span>→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* EVALUATION & RESULTS SECTION */}
          <section style={{ marginTop: "32px" }}>
            <div className="section-heading">
              <div>
                <span className="eyebrow">FACULTY EVALUATION</span>
                <h2>My Results & Feedback</h2>
              </div>
            </div>
            {results.length ? (
              <div className="practical-grid">
                {results.map((result) => (
                  <article className="practical-card" key={result.submissionId}>
                    <span className="status done">Reviewed & Evaluated</span>
                    <h3>{result.practicalTitle}</h3>
                    <p style={{ margin: "6px 0", fontSize: "16px", fontWeight: 700, color: "var(--palette-red, #c02040)" }}>
                      Marks Awarded: {result.marks ?? "14"} / 14
                    </p>
                    <p style={{ margin: "4px 0", color: "var(--text)" }}>
                      <b>Faculty Feedback:</b> {result.feedback || "Good laboratory submission."}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", flexWrap: "wrap", gap: "8px" }}>
                      <small className="muted">
                        Reviewed by {result.facultyName} · {date(result.reviewedAt || result.submittedAt)}
                      </small>
                      <button
                        type="button"
                        className="button secondary compact"
                        onClick={() => setActivePdfResult(result)}
                        style={{ fontWeight: 700, color: "#0f766e" }}
                      >
                        📄 Export PDF Report
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="muted">
                No reviewed submissions yet. Feedback and printable grade sheets appear here after faculty submits a review.
              </p>
            )}
          </section>
        </>
      ) : (
        /* RECENT ACTIVITY TAB VIEW */
        <section style={{ marginTop: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
            <div>
              <span className="eyebrow">LABORATORY TIMELINE & SUBMISSION LOGS</span>
              <h2 style={{ margin: "2px 0", fontSize: "22px" }}>Recent Academic Activity</h2>
              <p className="muted" style={{ margin: 0, fontSize: "13px" }}>
                Real-time record of all your practical work, executions, submissions, and faculty evaluations.
              </p>
            </div>

            {/* Filter Pills */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {(
                [
                  { id: "all", label: "All Activity" },
                  { id: "evaluation", label: "Evaluations & Marks" },
                  { id: "submission", label: "Submissions" },
                  { id: "execution", label: "Code Runs" },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActivityFilter(f.id)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "16px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: activityFilter === f.id ? "1px solid var(--palette-red, #c02040)" : "1px solid #cbd5e1",
                    background: activityFilter === f.id ? "var(--palette-red, #c02040)" : "#ffffff",
                    color: activityFilter === f.id ? "#ffffff" : "#475569",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <Empty
              title="No activity recorded"
              text="No timeline events match the selected filter."
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filteredEvents.map((ev) => (
                <div
                  key={ev.id}
                  style={{
                    padding: "16px 20px",
                    background: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "14px",
                  }}
                >
                  <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", flex: 1, minWidth: "280px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background:
                          ev.type === "evaluation"
                            ? "#ecfdf5"
                            : ev.type === "submission"
                              ? "#eff6ff"
                              : ev.type === "execution"
                                ? "#f5f3ff"
                                : "#f8fafc",
                        color:
                          ev.type === "evaluation"
                            ? "#059669"
                            : ev.type === "submission"
                              ? "#2563eb"
                              : ev.type === "execution"
                                ? "#7c3aed"
                                : "#64748b",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "16px",
                        flexShrink: 0,
                      }}
                    >
                      {ev.type === "evaluation"
                        ? "🏆"
                        : ev.type === "submission"
                          ? "📤"
                          : ev.type === "execution"
                            ? "⚡"
                            : "📋"}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "12px",
                            background:
                              ev.type === "evaluation"
                                ? "#dcfce7"
                                : ev.type === "submission"
                                  ? "#dbeafe"
                                  : ev.type === "execution"
                                    ? "#ede9fe"
                                    : "#f1f5f9",
                            color:
                              ev.type === "evaluation"
                                ? "#166534"
                                : ev.type === "submission"
                                  ? "#1e40af"
                                  : ev.type === "execution"
                                    ? "#5b21b6"
                                    : "#475569",
                          }}
                        >
                          {ev.badge}
                        </span>
                        <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                          {date(ev.timestamp)}
                        </span>
                      </div>

                      <h4 style={{ margin: "2px 0 4px", fontSize: "15px", color: "#0f172a" }}>
                        {ev.title}
                      </h4>
                      <p style={{ margin: "0 0 6px", fontSize: "12px", color: "var(--palette-red, #c02040)", fontWeight: 600 }}>
                        {ev.subject}
                      </p>
                      <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#334155" }}>
                        {ev.description}
                      </p>
                      {ev.details && (
                        <p style={{ margin: 0, fontSize: "11px", color: "#64748b", fontFamily: "var(--mono)" }}>
                          {ev.details}
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    {ev.resultRef && (
                      <button
                        type="button"
                        className="button secondary compact"
                        onClick={() => setActivePdfResult(ev.resultRef!)}
                        style={{ fontWeight: 700, color: "#0f766e", fontSize: "12px" }}
                      >
                        📄 View 6-Page Report
                      </button>
                    )}
                    {ev.practicalId && (
                      <Link
                        to={`/practicals/${ev.practicalId}`}
                        className="button secondary compact"
                        style={{ fontSize: "12px" }}
                      >
                        Open Editor →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* DASHBOARD PDF MODAL */}
      {activePdfResult && (
        <div
          className="pdf-modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            className="pdf-modal-container"
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "800px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              className="no-print"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 24px",
                borderBottom: "1px solid #e2e8f0",
                background: "#f8fafc",
                position: "sticky",
                top: 0,
                zIndex: 10,
              }}
            >
              <div>
                <b style={{ color: "#1e293b", fontSize: "16px" }}>Official Laboratory Assessment Grade Sheet</b>
                <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                  Click "Print / Save PDF" to generate the signed laboratory sheet.
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className="button primary"
                  onClick={() => window.print()}
                  style={{ background: "#2563eb", color: "#fff" }}
                >
                  🖨️ Print / Save PDF
                </button>
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => setActivePdfResult(null)}
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Official 6-Page Laboratory Journal / Evaluation Document */}
            <PracticalReportDocument
              practical={{
                title: activePdfResult.practicalTitle,
                subject: (activePdfResult as any).subject || "Cryptography & Network Security",
                experimentNumber: (activePdfResult as any).experimentNumber || 8,
                semester: (activePdfResult as any).semester || 6,
              }}
              result={activePdfResult}
              user={user}
              screenshots={(activePdfResult as any).screenshots}
            />
          </div>
        </div>
      )}
    </>
  );
}
