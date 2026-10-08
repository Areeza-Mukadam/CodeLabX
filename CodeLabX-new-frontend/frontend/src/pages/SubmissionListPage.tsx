import { Link } from "react-router-dom";
import { Empty, ErrorBox, Loading } from "../components/Feedback";
import { useLoad } from "../hooks/useLoad";
import { api } from "../services/api";
import { date } from "../utils/formatters";

export function SubmissionListPage() {
  const { data, error, loading, refresh } = useLoad<any[]>(
    () => api("/teacher/submissions"),
    [],
  );
  if (loading) return <Loading />;
  if (error) return <ErrorBox message={error} retry={refresh} />;
  return (
    <>
      <div className="welcome-row">
        <div>
          <span className="eyebrow">ASSESSMENT</span>
          <h1>Submission review</h1>
          <p className="muted">
            Review student code and record practical marks.
          </p>
        </div>
        <button
          className="button secondary"
          onClick={() => void refresh()}
          disabled={loading}
        >
          {loading ? "Refreshing…" : "Refresh submissions"}
        </button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Roll no.</th>
              <th>Class</th>
              <th>Practical</th>
              <th>Language</th>
              <th>Submitted</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {(data || []).map((s) => (
              <tr key={s.id}>
                <td>
                  <b>{s.studentName}</b>
                  <small>{s.studentEmail}</small>
                </td>
                <td>{s.rollNo || "—"}</td>
                <td>{s.classSection || "—"}</td>
                <td>{s.practicalTitle}</td>
                <td>{s.language}</td>
                <td>{date(s.submittedAt)}</td>
                <td>
                  <span className={`status ${s.evaluated ? "done" : "active"}`}>
                    {s.evaluated ? "Evaluated" : "Needs review"}
                  </span>
                </td>
                <td>
                  <Link
                    className="text-link"
                    to={`/teacher/submissions/${s.id}`}
                  >
                    Review →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data?.length && (
          <Empty
            title="No submissions to review"
            text="Student submissions will appear here."
          />
        )}
      </div>
    </>
  );
}
