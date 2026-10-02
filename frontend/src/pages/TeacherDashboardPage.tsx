import { Link } from "react-router-dom";
import { ErrorBox, Empty, Loading } from "../components/Feedback";
import { useLoad } from "../hooks/useLoad";
import { api } from "../services/api";
import type { Practical } from "../types";
import { humanStatus, statusClass } from "../utils/formatters";

export function TeacherDashboardPage() {
  const { data, error, loading, refresh } = useLoad<any>(
      () => api("/teacher/dashboard"),
      [],
    ),
    practicals = useLoad<Practical[]>(() => api("/practicals"), []);
  if (loading) return <Loading />;
  if (error) return <ErrorBox message={error} retry={refresh} />;
  const d = data!;
  return (
    <>
      <div className="welcome-row">
        <div>
          <span className="eyebrow">FACULTY WORKSPACE</span>
          <h1>Teaching overview</h1>
          <p className="muted">
            Manage practicals, track submissions, and review student work.
          </p>
        </div>
        <Link className="button primary" to="/teacher/practicals/new">
          ＋ Create practical
        </Link>
      </div>
      <div className="metric-strip teacher-metrics">
        <div>
          <small>ACTIVE PRACTICALS</small>
          <b>{d.activePracticals}</b>
        </div>
        <div>
          <small>STUDENTS</small>
          <b>{d.students}</b>
        </div>
        <div>
          <small>AWAITING REVIEW</small>
          <b>{d.pendingEvaluations}</b>
        </div>
        <div>
          <small>VIVA PENDING</small>
          <b>{d.vivaPending}</b>
        </div>
      </div>
      <div className="section-heading">
        <div>
          <span className="eyebrow">COURSE MANAGEMENT</span>
          <h2>Recent practicals</h2>
        </div>
        <Link className="text-link" to="/teacher/practicals/new">
          Manage practicals →
        </Link>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Practical</th>
              <th>Status</th>
              <th>Assigned</th>
              <th>Submissions</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {(practicals.data || []).map((p) => (
              <tr key={p.id}>
                <td>
                  <b>{p.title}</b>
                  <small>{p.description}</small>
                </td>
                <td>
                  <span className={`status ${statusClass(p.status)}`}>
                    {humanStatus(p.status)}
                  </span>
                </td>
                <td>{p.assignedCount || 0} students</td>
                <td>{p.completedCount || 0}</td>
                <td>
                  <Link
                    className="text-link"
                    to={`/teacher/practicals/${p.id}/edit`}
                  >
                    Edit →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!practicals.data || practicals.data.length === 0) && (
          <Empty
            title="No practicals yet"
            text="Create a practical to start building your course."
          />
        )}
      </div>
      <div className="note-banner">
        <div className="note-symbol">✓</div>
        <div>
          <b>Structured learning, clear review</b>
          <p>
            Students complete six sections in sequence before they can submit
            their code for evaluation.
          </p>
        </div>
      </div>
    </>
  );
}
import "../styles/pages/dashboards.css";
