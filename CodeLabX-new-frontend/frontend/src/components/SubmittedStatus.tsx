import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { humanStatus, statusClass } from "../utils/formatters";

export function SubmittedStatus({
  title,
  status,
}: {
  title: string;
  status: string;
}) {
  const nav = useNavigate();
  const [result, setResult] = useState<{ marks: number | null; feedback: string | null; facultyName: string } | null>(null);

  useEffect(() => {
    if (status === "EVALUATED") {
      api<any[]>("/submissions/results")
        .then((items) => {
          const match = (items || []).find((x) => x.practicalTitle?.toLowerCase() === title?.toLowerCase());
          if (match) setResult(match);
        })
        .catch(() => {});
    }
  }, [status, title]);

  return (
    <div className="submitted-panel">
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
            <p style={{ margin: "4px 0", fontSize: "15px", fontWeight: 700, color: "var(--palette-red, #c02040)" }}>
              Marks Awarded: {result.marks ?? "—"} / 14
            </p>
            <p style={{ margin: "4px 0", color: "var(--text)" }}>
              <b>Faculty Feedback:</b> {result.feedback || "Good laboratory submission."}
            </p>
            <small className="muted">Evaluated by {result.facultyName || "Faculty instructor"}</small>
          </div>
        ) : (
          <p>
            {status === "EVALUATED"
              ? "Your teacher has reviewed this practical. Check your dashboard for detailed feedback."
              : "Your code and conclusion have been submitted for teacher review."}
          </p>
        )}
      </div>
      <button className="button secondary" onClick={() => nav("/")}>
        ← Return to my practicals
      </button>
    </div>
  );
}
import "./../styles/pages/submitted-status.css";
