import { useNavigate } from "react-router-dom";
import { humanStatus, statusClass } from "../utils/formatters";

export function SubmittedStatus({
  title,
  status,
}: {
  title: string;
  status: string;
}) {
  const nav = useNavigate();
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
        <p>
          {status === "EVALUATED"
            ? "Your teacher has reviewed this practical. Check with your instructor for feedback."
            : "Your code and conclusion have been submitted for teacher review."}
        </p>
      </div>
      <button className="button secondary" onClick={() => nav("/")}>
        ← Return to my practicals
      </button>
    </div>
  );
}
import "./../styles/pages/submitted-status.css";
