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
      const existingCode = data.evaluation?.codeMarks ?? data.submission?.codeMarks ?? 0;
      const existingFeedback = data.evaluation?.feedback ?? data.submission?.feedback ?? "";
      setCodeMarks(existingCode);
      setFeedback(existingFeedback);

      const vivaList = data.evaluation?.viva || data.evaluation?.vivaMarks || [];
      const loadedEntries = (data.vivaQuestions || []).map((q: any) => {
        const match = vivaList.find((x: any) => x.vivaQuestionId === q.id || x.id === q.id);
        return {
          vivaQuestionId: q.id,
          awardedMarks: match?.awardedMarks ?? 0,
          notes: match?.notes ?? match?.studentAnswerNotes ?? "",
        };
      });
      setEntries(loadedEntries);
    }
  }, [data]);

  if (loading) return <Loading />;
  if (error) return <ErrorBox message={error} retry={refresh} />;
  const s = data.submission.submission;

  const isEvaluated = Boolean(
    data?.evaluation ||
    data?.submission?.evaluationId != null ||
    data?.submission?.totalMarks != null,
  );

  const vivaTotal = entries.reduce(
    (sum, item) => sum + (Number(item?.awardedMarks) || 0),
    0,
  );
  const maxViva = (data?.vivaQuestions || []).reduce(
    (sum: number, q: any) => sum + (Number(q?.marks) || 0),
    0,
  );
  const totalScore = (Number(codeMarks) || 0) + vivaTotal;
  const maxTotal = 10 + maxViva;

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      await api("/evaluations", {
        method: "POST",
        body: JSON.stringify({
          submissionId: Number(id),
          codeMarks,
          feedback,
          entries,
        }),
      });
      await api("/evaluations/viva", {
        method: "POST",
        body: JSON.stringify({
          submissionId: Number(id),
          entries,
        }),
      });
      setMessage("Evaluation saved successfully!");
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
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className={`status ${isEvaluated ? "done" : "active"}`}>
            {isEvaluated ? "✓ Evaluated" : "Awaiting review"}
          </span>
          {isEvaluated && (
            <span style={{ fontWeight: 700, fontSize: "13px", padding: "4px 10px", background: "rgba(19, 115, 51, 0.12)", color: "#137333", borderRadius: "4px", border: "1px solid rgba(19, 115, 51, 0.25)" }}>
              Total: {data.evaluation?.totalMarks ?? data.submission?.totalMarks ?? totalScore} / {maxTotal} Marks
            </span>
          )}
        </div>
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

            <div style={{ background: "rgba(0,0,0,0.03)", padding: "12px", borderRadius: "6px", marginBottom: "16px", border: "1px solid var(--line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--muted)" }}>Score Preview</span>
                <b style={{ fontSize: "16px", color: "var(--palette-red)" }}>{totalScore} / {maxTotal}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--muted)" }}>
                <span>Code: {codeMarks} / 10</span>
                <span>Viva: {vivaTotal} / {maxViva}</span>
              </div>
            </div>

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
                  value={entries[i]?.awardedMarks ?? 0}
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
              style={{ marginTop: "14px" }}
            >
              {saving ? "Saving…" : isEvaluated ? "✓ Update Evaluation" : "Save Evaluation"}
            </button>
            {message && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "10px 14px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  background: message.toLowerCase().includes("saved") || message.toLowerCase().includes("success")
                    ? "rgba(19, 115, 51, 0.1)"
                    : "rgba(217, 48, 37, 0.1)",
                  border: `1px solid ${
                    message.toLowerCase().includes("saved") || message.toLowerCase().includes("success")
                      ? "rgba(19, 115, 51, 0.3)"
                      : "rgba(217, 48, 37, 0.3)"
                  }`,
                  color: message.toLowerCase().includes("saved") || message.toLowerCase().includes("success")
                    ? "#137333"
                    : "#d93025",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                }}
              >
                <span><b>✓</b> {message}</span>
                <button
                  type="button"
                  className="text-link"
                  style={{ fontSize: "12px", whiteSpace: "nowrap" }}
                  onClick={() => nav("/teacher/submissions")}
                >
                  All submissions →
                </button>
              </div>
            )}
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
