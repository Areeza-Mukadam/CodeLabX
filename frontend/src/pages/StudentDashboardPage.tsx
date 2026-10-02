import { Link } from "react-router-dom";
import { ErrorBox, Empty, Loading } from "../components/Feedback";
import { useLoad } from "../hooks/useLoad";
import { api } from "../services/api";
import { useAuth } from "../state/authStore";
import type { Practical } from "../types";
import { date, humanStatus, statusClass } from "../utils/formatters";

export function StudentDashboardPage() {
  const user = useAuth((s) => s.user),
    { data, error, loading, refresh } = useLoad(
      () => api<Practical[]>("/practicals"),
      [],
    );
  if (loading) return <Loading />;
  if (error) return <ErrorBox message={error} retry={refresh} />;
  const list = data || [];
  return (
    <>
      <div className="welcome-row">
        <div>
          <span className="eyebrow">STUDENT WORKSPACE</span>
          <h1>Good to see you, {user?.name?.split(" ")[0]}.</h1>
          <p className="muted">
            Pick up where you left off in your assigned practicals.
          </p>
        </div>
        <div className="date-chip">⌑ &nbsp; AY 2026–27</div>
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
              .filter((x) => x.status !== "SUBMITTED")
              .length.toString()
              .padStart(2, "0")}
          </b>
        </div>
        <div>
          <small>SUBMITTED</small>
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
          <span className="live-dot" /> Your progress saves automatically
        </div>
      </div>
      <div className="section-heading">
        <div>
          <span className="eyebrow">YOUR COURSEWORK</span>
          <h2>
            My practicals <span className="count-pill">{list.length}</span>
          </h2>
        </div>
        <span className="muted small">Sorted by recent activity</span>
      </div>
      {list.length === 0 ? (
        <Empty
          title="Nothing assigned yet"
          text="Your teacher’s published practicals will appear here."
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
              <p>{p.description || "Structured programming practical"}</p>
              <div className="progress-label">
                <span>Progress</span>
                <b>{`${p.progressPercent || 0}%`}</b>
              </div>
              <div className="progress-track">
                <span style={{ width: `${p.progressPercent || 0}%` }} />
              </div>
              <div className="card-bottom">
                <span className="muted small">Updated {date(p.updatedAt)}</span>
                <Link className="button secondary" to={`/practicals/${p.id}`}>
                  {p.status === "SUBMITTED" ? "View status" : "Continue"}{" "}
                  <span>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
      <div className="note-banner">
        <div className="note-symbol">i</div>
        <div>
          <b>One step at a time</b>
          <p>
            Each practical follows the same six sections. Complete them in order
            to unlock the coding environment.
          </p>
        </div>
      </div>
    </>
  );
}
import "../styles/pages/dashboards.css";
