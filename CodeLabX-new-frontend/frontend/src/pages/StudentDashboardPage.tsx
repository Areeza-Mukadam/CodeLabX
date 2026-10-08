import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ErrorBox, Empty, Loading } from "../components/Feedback";
import { useLoad } from "../hooks/useLoad";
import { api } from "../services/api";
import { useAuth } from "../state/authStore";
import type { Practical, User } from "../types";
import { date, humanStatus, statusClass } from "../utils/formatters";
import "../styles/pages/dashboards.css";

export function StudentDashboardPage() {
  const user = useAuth((s) => s.user);
  const [classmates, setClassmates] = useState<User[]>([]);
  const [classmatesLoading, setClassmatesLoading] = useState(false);
  const [results, setResults] = useState<Array<{submissionId:number; practicalTitle:string; marks:number|null; feedback:string|null; reviewedAt:string; facultyName:string; submittedAt:string}>>([]);

  const { data, error, loading, refresh } = useLoad(
    () => api<Practical[]>("/practicals"),
    [],
  );

  useEffect(() => {
    let active = true;
    setClassmatesLoading(true);
    api<User[]>("/students/classmates")
      .then((res) => {
        if (active) setClassmates(res);
      })
      .catch(() => {
        if (active) setClassmates([]);
      })
      .finally(() => {
        if (active) setClassmatesLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user?.classSection]);

  useEffect(() => { api<typeof results>("/submissions/results").then(setResults).catch(() => setResults([])); }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorBox message={error} retry={refresh} />;
  const list = data || [];

  const divisionName =
    user?.division ||
    (user?.classSection?.includes("-") ? user.classSection.split("-")[1] : "B");
  const cohortName =
    user?.cohort ||
    (user?.classSection?.includes("-")
      ? user.classSection.split("-")[0]
      : "SE");
  const yearTitle =
    cohortName === "FE"
      ? "First Year"
      : cohortName === "TE"
        ? "Third Year"
        : cohortName === "BE"
          ? "Final Year"
          : "Second Year";

  return (
    <>
      <div className="welcome-row">
        <div>
          <span className="eyebrow">
            STUDENT PORTAL · THAKUR COLLEGE OF ENGINEERING & TECHNOLOGY
          </span>
          <h1>Welcome, {user?.name}.</h1>
          <p className="muted">
            {user?.classSection
              ? `Enrolled in Class ${user.classSection} · Division ${divisionName} · `
              : ""}
            TCET Academic Programming Laboratory Workspace
          </p>
        </div>
        <div className="date-chip">⌑ &nbsp; AY 2026–27</div>
      </div>

      <div className="student-profile-banner">
        <div className="student-profile-avatar">
          {user?.name
            ?.split(" ")
            .map((x) => x[0])
            .join("")
            .slice(0, 2) || "ST"}
        </div>
        <div className="student-profile-main">
          <div className="profile-identity">
            <h2>{user?.name}</h2>
            <span className="badge-class">
              Class {user?.classSection || "SE-B"}
            </span>
            <span className="badge-div">Division {divisionName}</span>
          </div>
          <div className="profile-details-grid">
            <div>
              <small>COLLEGE EMAIL</small>
              <b>{user?.email}</b>
            </div>
            <div>
              <small>ACADEMIC YEAR</small>
              <b>
                {yearTitle} ({cohortName})
              </b>
            </div>
            <div>
              <small>DEPARTMENT</small>
              <b>{user?.department || "Computer Engineering"}</b>
            </div>
            <div>
              <small>DIVISION CLASSMATES</small>
              <b>{classmates.length} Students</b>
            </div>
          </div>
        </div>
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
              .filter(
                (x) => x.status !== "SUBMITTED" && x.status !== "EVALUATED",
              )
              .length.toString()
              .padStart(2, "0")}
          </b>
        </div>
        <div>
          <small>SUBMITTED / EVALUATED</small>
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
          <span className="live-dot" /> Division roster synced with faculty
        </div>
      </div>

      {classmatesLoading ? (
        <Loading />
      ) : classmates.length > 0 ? (
        <section className="classmates-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">RESPECTED CLASS ROSTER</span>
              <h2>
                Classmates in your division ({user?.classSection || "SE-B"})
                <span className="count-pill">{classmates.length}</span>
              </h2>
            </div>
            <span className="muted small">
              All students assigned to division {divisionName}
            </span>
          </div>

          <div className="classmates-grid">
            {classmates.map((peer) => {
              const isCurrent =
                peer.email.toLowerCase() === user?.email.toLowerCase();
              return (
                <div
                  key={peer.id}
                  className={`classmate-card ${isCurrent ? "current-student" : ""}`}
                >
                  <div className="classmate-avatar">
                    {peer.name
                      ?.split(" ")
                      .map((x) => x[0])
                      .join("")
                      .slice(0, 2) || "S"}
                  </div>
                  <div className="classmate-info">
                    <strong>
                      {peer.name}{" "}
                      {isCurrent && <span className="you-pill">You</span>}
                    </strong>
                    <span className="classmate-email">{peer.email}</span>
                    <span className="classmate-class">
                      Class {peer.classSection || user?.classSection} · Div{" "}
                      {divisionName}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <div className="section-heading">
        <div>
          <span className="eyebrow">YOUR COURSEWORK</span>
          <h2>
            My practicals <span className="count-pill">{list.length}</span>
          </h2>
        </div>
        <span className="muted small">Assigned practical laboratory work</span>
      </div>
      <section className="classmates-section">
        <div className="section-heading"><div><span className="eyebrow">ASSESSMENT</span><h2>My Results & Feedback</h2></div></div>
        {results.length ? <div className="practical-grid">{results.map((result) => <article className="practical-card" key={result.submissionId}>
          <span className="status done">Reviewed</span><h3>{result.practicalTitle}</h3>
          <p><b>Marks:</b> {result.marks ?? "—"}</p><p>{result.feedback || "No written feedback."}</p>
          <small className="muted">Reviewed by {result.facultyName} · {date(result.reviewedAt)}</small>
        </article>)}</div> : <p className="muted">No reviewed submissions yet. Feedback appears here after faculty submits a review.</p>}
      </section>
      {list.length === 0 ? (
        <Empty
          title="Nothing assigned yet"
          text="Your teacher’s published practicals for this class and division will appear here."
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
              <p><b>{p.subject}</b>{p.facultyName ? ` · ${p.facultyName}` : ""}</p>
              <p>{p.description || "Structured programming practical"}</p>
              <div className="progress-label">
                <span>Progress</span>
                <b>{`${p.progressPercent || 0}%`}</b>
              </div>
              <div className="progress-track">
                <span style={{ width: `${p.progressPercent || 0}%` }} />
              </div>
              <div className="card-bottom">
                <span className="muted small">Assigned {date(p.assignedAt || p.updatedAt)}{p.dueAt ? ` · Due ${date(p.dueAt)}` : ""}</span>
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
            Each practical follows the structured laboratory progression: Aim →
            Theory → Algorithm → Practice → Code → Conclusion.
          </p>
        </div>
      </div>
    </>
  );
}
