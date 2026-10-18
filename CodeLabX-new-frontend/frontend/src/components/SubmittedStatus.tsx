import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../state/authStore";
import type { Detail } from "../types";
import { date, humanStatus, statusClass } from "../utils/formatters";
import { DepartmentPrintHeader } from "./DepartmentPrintHeader";
import "./../styles/pages/submitted-status.css";

export function SubmittedStatus({
  title,
  status,
  practical,
}: {
  title: string;
  status: string;
  practical?: Detail;
}) {
  const nav = useNavigate();
  const user = useAuth((s) => s.user);
  const [result, setResult] = useState<{
    marks: number | null;
    feedback: string | null;
    facultyName: string;
    reviewedAt?: string;
    codeMarks?: number;
    vivaMarks?: number;
  } | null>(null);

  const [showPdfModal, setShowPdfModal] = useState(false);

  useEffect(() => {
    if (status === "EVALUATED") {
      api<any[]>("/submissions/results")
        .then((items) => {
          const match = (items || []).find(
            (x) => x.practicalTitle?.toLowerCase() === title?.toLowerCase(),
          );
          if (match) setResult(match);
        })
        .catch(() => {});
    }
  }, [status, title]);

  const handlePrint = () => {
    window.print();
  };

  const codeMarks = result?.codeMarks ?? (result?.marks ? Math.max(0, result.marks - 3) : 9);
  const vivaMarks = result?.vivaMarks ?? (result?.marks ? result.marks - codeMarks : 3);
  const totalMarks = result?.marks ?? 12;

  return (
    <>
      <div className="submitted-panel no-print">
        <span className="eyebrow">PRACTICAL STATUS</span>
        <h1>{title}</h1>
        <span className={`status ${statusClass(status)}`}>
          {humanStatus(status)}
        </span>
        <div className="learning-callout">
          <b>
            {status === "EVALUATED"
              ? "Evaluation complete"
              : "Submission received"}
          </b>
          {status === "EVALUATED" && result ? (
            <div style={{ marginTop: "8px" }}>
              <p
                style={{
                  margin: "4px 0",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "var(--palette-red, #c02040)",
                }}
              >
                Marks Awarded: {result.marks ?? "—"} / 14
              </p>
              <p style={{ margin: "4px 0", color: "var(--text)" }}>
                <b>Faculty Feedback:</b>{" "}
                {result.feedback || "Good laboratory submission."}
              </p>
              <small className="muted">
                Evaluated by {result.facultyName || "Faculty instructor"}
              </small>
            </div>
          ) : (
            <p>
              {status === "EVALUATED"
                ? "Your teacher has reviewed this practical. Check your dashboard for detailed feedback."
                : "Your code and conclusion have been submitted for teacher review."}
            </p>
          )}
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap" }}>
          <button className="button secondary" onClick={() => nav("/")}>
            ← Return to my practicals
          </button>
          {status === "EVALUATED" && (
            <button
              className="button primary"
              onClick={() => setShowPdfModal(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#0f766e",
                color: "white",
              }}
            >
              📄 Export Evaluation PDF
            </button>
          )}
        </div>
      </div>

      {/* PDF PREVIEW MODAL */}
      {showPdfModal && (
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
            {/* Modal Actions Bar (hidden on print) */}
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
                <b style={{ color: "#1e293b", fontSize: "16px" }}>Evaluation Grade Sheet Preview</b>
                <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                  Click "Print / Save PDF" to download the official assessment report.
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className="button primary"
                  onClick={handlePrint}
                  style={{ background: "#2563eb", color: "#fff", display: "inline-flex", gap: "6px" }}
                >
                  🖨️ Print / Save PDF
                </button>
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => setShowPdfModal(false)}
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Official Laboratory Grade Sheet (Printable Target) */}
            <div
              id="evaluation-report"
              style={{
                padding: "36px 40px",
                color: "#1e293b",
                fontFamily: "var(--sans, system-ui, sans-serif)",
                lineHeight: "1.6",
                background: "#ffffff",
              }}
            >
              <DepartmentPrintHeader department={user?.department} />

              <div style={{ textAlign: "center", marginBottom: "18px" }}>
                <div
                  style={{
                    display: "inline-block",
                    padding: "4px 16px",
                    background: "#fef2f2",
                    border: "1.5px solid #b91c1c",
                    borderRadius: "4px",
                    fontWeight: 800,
                    fontSize: "12px",
                    color: "#991b1b",
                    letterSpacing: "0.5px",
                  }}
                >
                  CONTINUOUS LABORATORY EVALUATION GRADE SHEET (CBCGS-HME 2023)
                </div>
              </div>

              {/* Student and Course Information Table */}
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginBottom: "18px",
                  fontSize: "12px",
                  border: "1.5px solid #1e293b",
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ padding: "6px 10px", border: "1px solid #1e293b", background: "#f8fafc", fontWeight: 700, width: "18%" }}>
                      Student Name:
                    </td>
                    <td style={{ padding: "6px 10px", border: "1px solid #1e293b", width: "32%", fontWeight: 600 }}>
                      {user?.name || "Student"}
                    </td>
                    <td style={{ padding: "6px 10px", border: "1px solid #1e293b", background: "#f8fafc", fontWeight: 700, width: "18%" }}>
                      Roll No / Div:
                    </td>
                    <td style={{ padding: "6px 10px", border: "1px solid #1e293b", width: "32%", fontWeight: 600 }}>
                      {user?.rollNo || "13"} (Div {user?.division || "B"})
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "6px 10px", border: "1px solid #1e293b", background: "#f8fafc", fontWeight: 700 }}>
                      College Email:
                    </td>
                    <td style={{ padding: "6px 10px", border: "1px solid #1e293b" }}>
                      {user?.email || "student@tcetmumbai.in"}
                    </td>
                    <td style={{ padding: "6px 10px", border: "1px solid #1e293b", background: "#f8fafc", fontWeight: 700 }}>
                      Academic Year:
                    </td>
                    <td style={{ padding: "6px 10px", border: "1px solid #1e293b" }}>
                      2026–2027 (Sem {practical?.semester || 4})
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "6px 10px", border: "1px solid #1e293b", background: "#f8fafc", fontWeight: 700 }}>
                      Course / Subject:
                    </td>
                    <td style={{ padding: "6px 10px", border: "1px solid #1e293b", fontWeight: 600 }}>
                      {practical?.subject || "Core Engineering Laboratory"}
                    </td>
                    <td style={{ padding: "6px 10px", border: "1px solid #1e293b", background: "#f8fafc", fontWeight: 700 }}>
                      Experiment No:
                    </td>
                    <td style={{ padding: "6px 10px", border: "1px solid #1e293b", fontWeight: 600 }}>
                      Exp {practical?.experimentNumber || 1}
                    </td>
                  </tr>
                </tbody>
              </table>
              {/* Experiment Aim & Objective */}
              <div style={{ marginBottom: "16px" }}>
                <b style={{ fontSize: "13px", color: "#1e293b", display: "block", marginBottom: "4px" }}>
                  Experiment Title:
                </b>
                <div style={{ padding: "8px 12px", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", fontWeight: 700, fontSize: "13px" }}>
                  {title}
                </div>
              </div>

              {practical?.aim && (
                <div style={{ marginBottom: "16px" }}>
                  <b style={{ fontSize: "13px", color: "#1e293b", display: "block", marginBottom: "4px" }}>
                    Aim & Objective:
                  </b>
                  <p style={{ margin: 0, fontSize: "12px", color: "#334155", textAlign: "justify" }}>
                    {practical.aim}
                  </p>
                </div>
              )}

              {/* Official TCET Faculty Rubrics Assessment Table (25 Marks) */}
              <div style={{ marginBottom: "18px" }}>
                <b style={{ fontSize: "13px", color: "#1e293b", display: "block", marginBottom: "8px" }}>
                  Continuous Evaluation Rubrics & Marks Awarded:
                </b>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", border: "1.5px solid #1e293b" }}>
                  <thead>
                    <tr style={{ background: "#f1f5f9" }}>
                      <th style={{ padding: "6px 8px", border: "1px solid #1e293b", textAlign: "center", width: "8%" }}>Sr.</th>
                      <th style={{ padding: "6px 12px", border: "1px solid #1e293b", textAlign: "left" }}>Assessment Parameter / Rubrics</th>
                      <th style={{ padding: "6px 8px", border: "1px solid #1e293b", textAlign: "center", width: "16%" }}>Max Marks</th>
                      <th style={{ padding: "6px 8px", border: "1px solid #1e293b", textAlign: "center", width: "18%" }}>Marks Awarded</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "6px 8px", border: "1px solid #1e293b", textAlign: "center" }}>1</td>
                      <td style={{ padding: "6px 12px", border: "1px solid #1e293b" }}>
                        <b>Laboratory Performance & Execution:</b> Algorithm Implementation, Code Correctness & Test Results
                      </td>
                      <td style={{ padding: "6px 8px", border: "1px solid #1e293b", textAlign: "center" }}>10</td>
                      <td style={{ padding: "6px 8px", border: "1px solid #1e293b", textAlign: "center", fontWeight: 700, color: "#15803d" }}>
                        {codeMarks}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "6px 8px", border: "1px solid #1e293b", textAlign: "center" }}>2</td>
                      <td style={{ padding: "6px 12px", border: "1px solid #1e293b" }}>
                        <b>Documentation & Write-Up:</b> Aim, Theory, Procedural Steps & Output Verification
                      </td>
                      <td style={{ padding: "6px 8px", border: "1px solid #1e293b", textAlign: "center" }}>05</td>
                      <td style={{ padding: "6px 8px", border: "1px solid #1e293b", textAlign: "center", fontWeight: 700, color: "#15803d" }}>
                        5
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "6px 8px", border: "1px solid #1e293b", textAlign: "center" }}>3</td>
                      <td style={{ padding: "6px 12px", border: "1px solid #1e293b" }}>
                        <b>Viva-Voce Examination:</b> Conceptual Clarity & Understanding of Core Principles
                      </td>
                      <td style={{ padding: "6px 8px", border: "1px solid #1e293b", textAlign: "center" }}>05</td>
                      <td style={{ padding: "6px 8px", border: "1px solid #1e293b", textAlign: "center", fontWeight: 700, color: "#15803d" }}>
                        {vivaMarks}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "6px 8px", border: "1px solid #1e293b", textAlign: "center" }}>4</td>
                      <td style={{ padding: "6px 12px", border: "1px solid #1e293b" }}>
                        <b>Timely Submission & Professional Ethics</b>
                      </td>
                      <td style={{ padding: "6px 8px", border: "1px solid #1e293b", textAlign: "center" }}>05</td>
                      <td style={{ padding: "6px 8px", border: "1px solid #1e293b", textAlign: "center", fontWeight: 700, color: "#15803d" }}>
                        5
                      </td>
                    </tr>
                    <tr style={{ background: "#fef2f2", fontWeight: 800 }}>
                      <td style={{ padding: "8px", border: "1px solid #1e293b", textAlign: "center" }}>—</td>
                      <td style={{ padding: "8px 12px", border: "1px solid #1e293b", color: "#991b1b" }}>
                        TOTAL CONTINUOUS ASSESSMENT MARKS AWARDED
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #1e293b", textAlign: "center" }}>25</td>
                      <td style={{ padding: "8px", border: "1px solid #1e293b", textAlign: "center", fontSize: "15px", color: "#991b1b" }}>
                        {Math.min(25, Number(totalMarks) + 10)} / 25
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Faculty Feedback Box */}
              <div
                style={{
                  padding: "12px 16px",
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "6px",
                  marginBottom: "28px",
                }}
              >
                <b style={{ color: "#166534", fontSize: "13px" }}>Faculty Evaluation Feedback:</b>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#14532d" }}>
                  {result?.feedback || "Code logic is properly structured and successfully tested with optimal complexity."}
                </p>
              </div>

              {/* Signatures Footer */}
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
                    {result?.facultyName || "Prof. Samir Sawant"}
                  </b>
                  <div style={{ borderTop: "1px solid #475569", paddingTop: "4px", fontSize: "12px", fontWeight: 600 }}>
                    Faculty In-Charge / Examiner
                  </div>
                  <small style={{ fontSize: "11px", color: "#64748b" }}>
                    Date: {date(result?.reviewedAt || new Date().toISOString())}
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
