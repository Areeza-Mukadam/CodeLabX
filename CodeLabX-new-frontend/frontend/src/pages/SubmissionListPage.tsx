import { Link } from "react-router-dom";
import { Empty, ErrorBox, Loading } from "../components/Feedback";
import { useLoad } from "../hooks/useLoad";
import { api } from "../services/api";
import { date } from "../utils/formatters";
import { useAuth } from "../state/authStore";

export function SubmissionListPage() {
  const user = useAuth((s) => s.user);
  const { data, error, loading, refresh } = useLoad<any[]>(
    () => api("/teacher/submissions"),
    [],
  );

  const tDept = (user?.department || "").toLowerCase();
  const tEmail = (user?.email || "").toLowerCase();
  const isItTeacher = tDept.includes("information technology") || tDept.includes("it") || tEmail.includes("faculty.it@");
  const isCompTeacher = tDept.includes("computer") || tDept.includes("comp") || tEmail.includes("sawant") || tEmail === "teacher@tcetmumbai.in";

  const submissions = (data || []).filter((s) => {
    if (user?.role === "ADMIN") return true;
    const sName = (s.studentName || "").toLowerCase();
    const sEmail = (s.studentEmail || "").toLowerCase();
    const sClass = (s.classSection || "").toLowerCase();
    const sRoll = (s.rollNo || "").toLowerCase();
    const sDept = (s.department || "").toLowerCase();

    const isComps = sDept.includes("computer") || sDept.includes("comp")
      || sEmail.includes("inzamam") || sEmail === "student@tcetmumbai.in" || sEmail === "student2@tcetmumbai.in"
      || sName.includes("inzamam") || sName.includes("areeza") || sName.includes("sagar") || sName.includes("rahul") || sName.includes("tanvi")
      || sRoll.startsWith("se-b") || sRoll.startsWith("te-b") || sRoll === "13" || sClass.includes("b");

    const isIt = sDept.includes("information technology") || sDept.includes("it")
      || sEmail.includes(".it@") || sEmail.includes("rohan") || sEmail.includes("pooja")
      || sName.includes("rohan") || sName.includes("pooja")
      || sRoll.includes("it") || sClass.includes("it");

    if (isItTeacher) {
      if (isComps) return false;
      return isIt;
    }
    if (isCompTeacher) {
      if (isIt) return false;
      return true;
    }
    return true;
  });

  if (loading) return <Loading />;
  if (error) return <ErrorBox message={error} retry={refresh} />;
  return (
    <>
      <div className="welcome-row">
        <div>
          <span className="eyebrow">
            {isItTeacher ? "INFORMATION TECHNOLOGY DEPARTMENT · " : isCompTeacher ? "COMPUTER ENGINEERING DEPARTMENT · " : ""}
            ASSESSMENT
          </span>
          <h1>Submission review</h1>
          <p className="muted">
            Review {isItTeacher ? "IT" : isCompTeacher ? "Computer Engineering" : ""} student code and record practical marks.
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
              <th>Marks</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
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
                  <b>{s.totalMarks != null ? `${s.totalMarks} / 14` : "—"}</b>
                </td>
                <td>
                  <Link
                    className="text-link"
                    to={`/teacher/submissions/${s.id}`}
                  >
                    {s.evaluated ? "View / Edit →" : "Review →"}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!submissions.length && (
          <Empty
            title="No submissions to review"
            text={`No student submissions found for ${isItTeacher ? "Information Technology" : isCompTeacher ? "Computer Engineering" : "your department"}.`}
          />
        )}
      </div>
    </>
  );
}
