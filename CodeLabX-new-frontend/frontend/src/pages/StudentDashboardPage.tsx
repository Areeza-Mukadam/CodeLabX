import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ErrorBox, Empty, Loading } from "../components/Feedback";
import { useLoad } from "../hooks/useLoad";
import { api } from "../services/api";
import { useAuth } from "../state/authStore";
import type { Practical } from "../types";
import { date, humanStatus, statusClass } from "../utils/formatters";
import "../styles/pages/dashboards.css";

export function StudentDashboardPage() {
  const user = useAuth((s) => s.user);
  const [results, setResults] = useState<
    Array<{
      submissionId: number;
      practicalTitle: string;
      marks: number | null;
      feedback: string | null;
      reviewedAt: string;
      facultyName: string;
      submittedAt: string;
    }>
  >([]);

  const [activePdfResult, setActivePdfResult] = useState<{
    practicalTitle: string;
    marks: number | null;
    feedback: string | null;
    facultyName: string;
    reviewedAt: string;
  } | null>(null);

  const { data, error, loading, refresh } = useLoad(
    () => api<Practical[]>("/practicals"),
    [],
  );

  useEffect(() => {
    api<typeof results>("/submissions/results")
      .then(setResults)
      .catch(() => setResults([]));
  }, []);

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
      : "SE");
  const yearTitle =
    cohortName === "FE"
      ? "First Year"
      : cohortName === "TE"
        ? "Third Year"
        : cohortName === "BE"
          ? "Final Year"
          : "Second Year";

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
              ? `Enrolled in Class ${user.classSection} · Division ${divisionName} · `
              : ""}
            TCET Academic Programming Laboratory Workspace
          </p>
        </div>
        <div className="date-chip">⌑ &nbsp; AY 2026–27</div>
      </div>

      <div className="student-profile-banner">
        <div className="student-profile-avatar">
          {user?.name
            ?.split(" ")
            .map((x) => x[0])
            .join("")
            .slice(0, 2) || "ST"}
        </div>
        <div className="student-profile-main">
          <div className="profile-identity">
            <h2>{user?.name}</h2>
            <span className="badge-class">
              Class {user?.classSection || "SE-B"}
            </span>
            <span className="badge-div">Division {divisionName}</span>
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
          margin: "20px 0 4px",
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
            Select your department (Computer, IT, AI&DS, AIML, CSE-IoT, ENCS, ENTC) and choose semesters to access syllabus experiments.
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
          <small>SUBMITTED / EVALUATED</small>
          <b>
            {list
              .filter(
                (x) => x.status === "SUBMITTED" || x.status === "EVALUATED",
              )
              .length.toString()
              .padStart(2, "0")}
          </b>
        </div>
        <div className="metric-note">
          <span className="live-dot" /> Continuous assessment records active
        </div>
      </div>

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
                  Marks Awarded: {result.marks ?? "—"} / 14
                </p>
                <p style={{ margin: "4px 0", color: "var(--text)" }}>
                  <b>Faculty Feedback:</b> {result.feedback || "Good laboratory submission."}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", flexWrap: "wrap", gap: "8px" }}>
                  <small className="muted">
                    Reviewed by {result.facultyName} · {date(result.reviewedAt)}
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

            <div
              style={{
                padding: "36px 40px",
                color: "#1e293b",
                fontFamily: "var(--sans, system-ui, sans-serif)",
                lineHeight: "1.6",
                background: "#ffffff",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  borderBottom: "2px solid #b91c1c",
                  paddingBottom: "16px",
                  marginBottom: "20px",
                }}
              >
                <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: 800, color: "#991b1b" }}>
                  THAKUR COLLEGE OF ENGINEERING & TECHNOLOGY
                </h2>
                <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#475569" }}>
                  (Autonomous Institute Affiliated to University of Mumbai · NAAC 'A' Grade)
                </p>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>
                  Department of {user?.department || "Computer Engineering"}
                </p>
                <div
                  style={{
                    display: "inline-block",
                    marginTop: "10px",
                    padding: "4px 14px",
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "4px",
                    fontWeight: 700,
                    fontSize: "13px",
                    color: "#b91c1c",
                  }}
                >
                  CONTINUOUS LABORATORY EVALUATION GRADE SHEET
                </div>
              </div>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginBottom: "20px",
                  fontSize: "13px",
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ padding: "6px 10px", border: "1px solid #cbd5e1", background: "#f8fafc", fontWeight: 700 }}>
                      Student Name:
                    </td>
                    <td style={{ padding: "6px 10px", border: "1px solid #cbd5e1" }}>
                      {user?.name || "Student"}
                    </td>
                    <td style={{ padding: "6px 10px", border: "1px solid #cbd5e1", background: "#f8fafc", fontWeight: 700 }}>
                      Roll No / Div:
                    </td>
                    <td style={{ padding: "6px 10px", border: "1px solid #cbd5e1" }}>
                      {user?.rollNo || "13"} (Div {divisionName})
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "6px 10px", border: "1px solid #cbd5e1", background: "#f8fafc", fontWeight: 700 }}>
                      College Email:
                    </td>
                    <td style={{ padding: "6px 10px", border: "1px solid #cbd5e1" }}>
                      {user?.email}
                    </td>
                    <td style={{ padding: "6px 10px", border: "1px solid #cbd5e1", background: "#f8fafc", fontWeight: 700 }}>
                      Academic Year:
                    </td>
                    <td style={{ padding: "6px 10px", border: "1px solid #cbd5e1" }}>
                      2026–2027 (Class {user?.classSection || "SE-B"})
                    </td>
                  </tr>
                </tbody>
              </table>

              <div style={{ marginBottom: "18px" }}>
                <b style={{ fontSize: "14px", color: "#1e293b", display: "block", marginBottom: "4px" }}>
                  Practical Title:
                </b>
                <div style={{ padding: "8px 12px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", fontWeight: 600 }}>
                  {activePdfResult.practicalTitle}
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <b style={{ fontSize: "14px", color: "#1e293b", display: "block", marginBottom: "8px" }}>
                  Continuous Evaluation Breakdown:
                </b>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "#f1f5f9" }}>
                      <th style={{ padding: "8px 12px", border: "1px solid #cbd5e1", textAlign: "left" }}>Assessment Criteria</th>
                      <th style={{ padding: "8px 12px", border: "1px solid #cbd5e1", textAlign: "center", width: "120px" }}>Max Marks</th>
                      <th style={{ padding: "8px 12px", border: "1px solid #cbd5e1", textAlign: "center", width: "140px" }}>Marks Awarded</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "8px 12px", border: "1px solid #cbd5e1" }}>
                        <b>Part A:</b> Algorithm Design, Code Execution & Output Correctness
                      </td>
                      <td style={{ padding: "8px 12px", border: "1px solid #cbd5e1", textAlign: "center" }}>10</td>
                      <td style={{ padding: "8px 12px", border: "1px solid #cbd5e1", textAlign: "center", fontWeight: 700, color: "#15803d" }}>
                        {activePdfResult.marks ? Math.max(0, activePdfResult.marks - 3) : 9}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "8px 12px", border: "1px solid #cbd5e1" }}>
                        <b>Part B:</b> Viva-Voce Examination & Understanding
                      </td>
                      <td style={{ padding: "8px 12px", border: "1px solid #cbd5e1", textAlign: "center" }}>04</td>
                      <td style={{ padding: "8px 12px", border: "1px solid #cbd5e1", textAlign: "center", fontWeight: 700, color: "#15803d" }}>
                        {activePdfResult.marks ? activePdfResult.marks - Math.max(0, activePdfResult.marks - 3) : 3}
                      </td>
                    </tr>
                    <tr style={{ background: "#fef2f2", fontWeight: 800 }}>
                      <td style={{ padding: "10px 12px", border: "1px solid #cbd5e1", color: "#991b1b" }}>
                        TOTAL ASSESSMENT MARKS AWARDED
                      </td>
                      <td style={{ padding: "10px 12px", border: "1px solid #cbd5e1", textAlign: "center" }}>14</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #cbd5e1", textAlign: "center", fontSize: "16px", color: "#991b1b" }}>
                        {activePdfResult.marks ?? 12} / 14
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  padding: "12px 16px",
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "6px",
                  marginBottom: "28px",
                }}
              >
                <b style={{ color: "#166534", fontSize: "13px" }}>Faculty Feedback:</b>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#14532d" }}>
                  {activePdfResult.feedback || "Good laboratory submission and code logic."}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "40px",
                  paddingTop: "20px",
                  borderTop: "1px dashed #cbd5e1",
                }}
              >
                <div style={{ textAlign: "center", width: "200px" }}>
                  <div style={{ height: "40px" }} />
                  <div style={{ borderTop: "1px solid #475569", paddingTop: "4px", fontSize: "12px", fontWeight: 600 }}>
                    Student Signature
                  </div>
                </div>

                <div style={{ textAlign: "center", width: "240px" }}>
                  <b style={{ fontSize: "13px", color: "#1e293b", display: "block" }}>
                    {activePdfResult.facultyName || "Prof. Samir Sawant"}
                  </b>
                  <div style={{ borderTop: "1px solid #475569", paddingTop: "4px", fontSize: "12px", fontWeight: 600 }}>
                    Faculty In-Charge / Examiner
                  </div>
                  <small style={{ fontSize: "11px", color: "#64748b" }}>
                    Date: {date(activePdfResult.reviewedAt || new Date().toISOString())}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
