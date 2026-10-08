import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorBox, Loading } from "../components/Feedback";
import { useLoad } from "../hooks/useLoad";
import { api } from "../services/api";

export { SubmissionListPage } from "./SubmissionListPage";

export function SubmissionReviewPage() {
  const { id } = useParams(),
    nav = useNavigate(),
    { data, error, loading, refresh } = useLoad<any>(
      () => api(`/teacher/review/${id}`),
      [id],
    ),
    [codeMarks, setCodeMarks] = useState(0),
    [feedback, setFeedback] = useState(""),
    [entries, setEntries] = useState<any[]>([]),
    [saving, setSaving] = useState(false),
    [message, setMessage] = useState("");
  useEffect(() => {
    if (data) {
      setCodeMarks(data.evaluation?.codeMarks || 0);
      setFeedback(data.evaluation?.feedback || "");
      setEntries(
        (data.vivaQuestions || []).map((q: any) => ({
          vivaQuestionId: q.id,
          awardedMarks:
            data.evaluation?.viva?.find((x: any) => x.vivaQuestionId === q.id)
              ?.awardedMarks || 0,
          notes:
            data.evaluation?.viva?.find((x: any) => x.vivaQuestionId === q.id)
              ?.notes || "",
        })),
      );
    }
  }, [data]);
  if (loading) return <Loading />;
  if (error) return <ErrorBox message={error} retry={refresh} />;
  const s = data.submission.submission;
  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      await api("/evaluations", {
        method: "POST",
        body: JSON.stringify({ submissionId: Number(id), codeMarks, feedback }),
      });
      await api("/evaluations/viva", {
        method: "POST",
        body: JSON.stringify({ submissionId: Number(id), entries }),
      });
      setMessage("Evaluation saved");
      await refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not save evaluation");
    } finally {
      setSaving(false);
    }
  };
  return (
    <>
      <button className="back-link" onClick={() => nav("/teacher/submissions")}>
        ← All submissions
      </button>
      <div className="welcome-row review-header">
        <div>
          <span className="eyebrow">SUBMISSION · {s.id}</span>
          <h1>{data.submission.studentName}</h1>
          <p className="muted">
            {data.submission.practicalTitle} · {data.submission.rollNo || "No roll number"} · {data.submission.classSection || "No class"} · {s.language}
          </p>
        </div>
        <span className={`status ${data.evaluation ? "done" : "active"}`}>
          {data.evaluation ? "Evaluated" : "Awaiting review"}
        </span>
      </div>
      <div className="review-grid">
        <section className="review-code">
          <h2>Submitted code</h2>
          <pre>{s.code}</pre>
          <h3>Program output</h3>
          <pre>{s.output || "No output was recorded."}</pre>
        </section>
        <aside className="review-side">
          <div className="rail-card">
            <span className="eyebrow">CODE EVALUATION</span>
            <label>
              Code marks <span className="mark-max">/ 10</span>
              <input
                type="number"
                min="0"
                max="10"
                value={codeMarks}
                onChange={(e) =>
                  setCodeMarks(
                    Math.min(10, Math.max(0, Number(e.target.value))),
                  )
                }
              />
            </label>
            <label>
              Feedback
              <textarea
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Feedback for the student"
              />
            </label>
            <div className="rail-divider" />
            <span className="eyebrow">VIVA ASSESSMENT</span>
            {data.vivaQuestions.map((q: any, i: number) => (
              <div className="viva-entry" key={q.id}>
                <b>
                  Q{i + 1}. {q.question}
                </b>
                <small>Maximum {q.marks} marks</small>
                <input
                  type="number"
                  min="0"
                  max={q.marks}
                  value={entries[i]?.awardedMarks || 0}
                  onChange={(e) =>
                    setEntries(
                      entries.map((x, j) =>
                        j === i
                          ? {
                              ...x,
                              awardedMarks: Math.min(
                                q.marks,
                                Math.max(0, Number(e.target.value)),
                              ),
                            }
                          : x,
                      ),
                    )
                  }
                />
                <textarea
                  rows={2}
                  placeholder="Answer notes"
                  value={entries[i]?.notes || ""}
                  onChange={(e) =>
                    setEntries(
                      entries.map((x, j) =>
                        j === i ? { ...x, notes: e.target.value } : x,
                      ),
                    )
                  }
                />
              </div>
            ))}
            <button
              className="button primary full"
              onClick={save}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save evaluation"}
            </button>
            {message && <small className="muted">{message}</small>}
          </div>
          <div className="rail-card">
            <span className="eyebrow">INTEGRITY EVENTS</span>
            {Object.entries(data.integrity || {}).map(([k, v]) => (
              <div className="rail-row" key={k}>
                <span>{k.replace("_ATTEMPT", "").toLowerCase()}</span>
                <b>{String(v)}</b>
              </div>
            ))}
            {!Object.keys(data.integrity || {}).length && (
              <p>No recorded events.</p>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
import "../styles/pages/submission-review.css";
