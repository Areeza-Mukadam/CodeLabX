import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../state/authStore";
import type { Detail } from "../types";
import { humanStatus, statusClass } from "../utils/formatters";
import { PracticalReportDocument, printReportDocument } from "./PracticalReportDocument";
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
    submissionId?: number;
    marks: number | null;
    feedback: string | null;
    facultyName: string;
    reviewedAt?: string;
    submittedAt?: string;
    codeMarks?: number;
    vivaMarks?: number;
    screenshots?: string[];
    code?: string;
    output?: string;
    conclusionText?: string;
  } | null>(null);

  const [showPdfModal, setShowPdfModal] = useState(false);
  const [printMode, setPrintMode] = useState<"color" | "bw">("color");

  useEffect(() => {
    api<any[]>("/submissions/results")
      .then((items) => {
        const match = (items || []).find(
          (x) =>
            x.practicalTitle?.toLowerCase() === title?.toLowerCase() ||
            x.practicalId === practical?.id,
        );
        if (match) setResult(match);
      })
      .catch(() => {});
  }, [status, title, practical?.id]);

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
              <small className="muted" style={{ display: "block", marginTop: "4px" }}>
                Evaluated by {result.facultyName || "Mr. Sameer Sawant"}
              </small>
              <div style={{ display: "flex", gap: "12px", marginTop: "6px", fontSize: "12px", color: "var(--muted)", flexWrap: "wrap" }}>
                {result.submittedAt && (
                  <span>
                    <b>Submitted:</b> {new Date(result.submittedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                )}
                {result.reviewedAt && (
                  <span>
                    <b>Evaluated:</b> {new Date(result.reviewedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div>
              <p style={{ margin: 0 }}>
                Your code, execution output, and screenshots have been successfully submitted for faculty evaluation.
              </p>
              {result?.submittedAt && (
                <small className="muted" style={{ display: "block", marginTop: "6px" }}>
                  <b>Submission Recorded:</b> {new Date(result.submittedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </small>
              )}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap" }}>
          <button className="button secondary" onClick={() => nav("/")}>
            Return to my practicals
          </button>
          {(status === "EVALUATED" || status === "SUBMITTED") && (
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
              Export Official 7-Page Practical PDF
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
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", background: "#f1f5f9", borderRadius: "6px", padding: "2px", border: "1px solid #cbd5e1" }}>
                  <button
                    type="button"
                    onClick={() => setPrintMode("color")}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: 600,
                      cursor: "pointer",
                      border: "none",
                      background: printMode === "color" ? "#ffffff" : "transparent",
                      color: printMode === "color" ? "#1d4ed8" : "#64748b",
                      boxShadow: printMode === "color" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    }}
                  >
                    Color View
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrintMode("bw")}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: 600,
                      cursor: "pointer",
                      border: "none",
                      background: printMode === "bw" ? "#ffffff" : "transparent",
                      color: printMode === "bw" ? "#0f172a" : "#64748b",
                      boxShadow: printMode === "bw" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    }}
                  >
                    B/W View
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPrintMode("color");
                    printReportDocument("color");
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "7px 14px",
                    borderRadius: "6px",
                    background: "#2563eb",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                  Print Color PDF
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPrintMode("bw");
                    printReportDocument("bw");
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "7px 14px",
                    borderRadius: "6px",
                    background: "#334155",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                  Print B/W PDF
                </button>

                <button
                  type="button"
                  className="button secondary"
                  onClick={() => setShowPdfModal(false)}
                >
                  Close
                </button>
              </div>
            </div>

            {/* Official Laboratory Journal / Evaluation Document */}
            <PracticalReportDocument
              practical={practical}
              result={result}
              user={user}
              screenshots={result?.screenshots || (practical as any)?.screenshots}
              printMode={printMode}
            />
          </div>
        </div>
      )}
    </>
  );
}
