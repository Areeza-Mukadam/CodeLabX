import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../state/authStore";
import type { Detail } from "../types";
import { humanStatus, statusClass } from "../utils/formatters";
import { PracticalReportDocument } from "./PracticalReportDocument";
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
              📄 Export 6-Page Practical PDF
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

            {/* Official 6-Page Laboratory Journal / Evaluation Document */}
            <PracticalReportDocument
              practical={practical}
              result={result}
              user={user}
            />
          </div>
        </div>
      )}
    </>
  );
}
