import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Empty, ErrorBox, Loading } from "../components/Feedback";
import { api } from "../services/api";
import { date } from "../utils/formatters";
import "../styles/pages/teacher-classes.css";

type SubjectOption = {
  subject: string;
  semester: number;
  practicalCount: number;
};

type StudentRow = {
  id: number;
  name: string;
  email: string;
  classSection: string;
};

type StudentSubmission = {
  id: number;
  practicalId: number;
  practicalTitle: string;
  language: string;
  submittedAt: string;
  evaluated: boolean;
  totalMarks: number | null;
};

function query(values: Record<string, string | number>) {
  return new URLSearchParams(
    Object.entries(values).map(([key, value]) => [key, String(value)]),
  ).toString();
}

export function TeacherDashboardPage() {
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [subjectError, setSubjectError] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<SubjectOption | null>(
    null,
  );
  const [classes, setClasses] = useState<string[]>([]);
  const [classesLoading, setClassesLoading] = useState(false);
  const [classError, setClassError] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentError, setStudentError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentRow | null>(
    null,
  );
  const [studentSubmissions, setStudentSubmissions] = useState<
    StudentSubmission[]
  >([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissionsError, setSubmissionsError] = useState("");

  useEffect(() => {
    let active = true;
    api<SubjectOption[]>("/teacher/subjects")
      .then((result) => {
        if (active) setSubjects(result);
      })
      .catch((error: unknown) => {
        if (active)
          setSubjectError(
            error instanceof Error ? error.message : "Could not load subjects",
          );
      })
      .finally(() => {
        if (active) setSubjectsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedSubject) return;
    let active = true;
    setClassesLoading(true);
    setClassError("");
    api<string[]>(
      `/teacher/classes?${query({ subject: selectedSubject.subject, semester: selectedSubject.semester })}`,
    )
      .then((result) => {
        if (active) setClasses(result);
      })
      .catch((error: unknown) => {
        if (active)
          setClassError(
            error instanceof Error ? error.message : "Could not load classes",
          );
      })
      .finally(() => {
        if (active) setClassesLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedSubject]);

  useEffect(() => {
    if (!selectedSubject || !selectedClass) return;
    let active = true;
    setStudentsLoading(true);
    setStudentError("");
    api<StudentRow[]>(
      `/teacher/students?${query({ subject: selectedSubject.subject, semester: selectedSubject.semester, classSection: selectedClass })}`,
    )
      .then((result) => {
        if (active) setStudents(result);
      })
      .catch((error: unknown) => {
        if (active)
          setStudentError(
            error instanceof Error ? error.message : "Could not load students",
          );
      })
      .finally(() => {
        if (active) setStudentsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedSubject, selectedClass]);

  async function chooseStudent(student: StudentRow) {
    if (!selectedSubject) return;
    setSelectedStudent(student);
    setStudentSubmissions([]);
    setSubmissionsLoading(true);
    setSubmissionsError("");
    try {
      const result = await api<StudentSubmission[]>(
        `/teacher/students/${student.id}/submissions?${query({ subject: selectedSubject.subject, semester: selectedSubject.semester, classSection: selectedClass })}`,
      );
      setStudentSubmissions(result);
    } catch (error) {
      setSubmissionsError(
        error instanceof Error
          ? error.message
          : "Could not load this student's submissions",
      );
    } finally {
      setSubmissionsLoading(false);
    }
  }

  function chooseSubject(subject: SubjectOption) {
    setSelectedSubject(subject);
    setSelectedClass("");
    setSelectedStudent(null);
    setClasses([]);
    setStudents([]);
    setStudentSubmissions([]);
  }

  function chooseClass(classSection: string) {
    setSelectedClass(classSection);
    setSelectedStudent(null);
    setStudents([]);
    setStudentSubmissions([]);
  }

  return (
    <section className="teacher-class-page">
      <div className="welcome-row">
        <div>
          <span className="eyebrow">FACULTY WORKSPACE</span>
          <h1>Student submissions</h1>
          <p className="muted">
            Choose a subject and class to find a student’s practical work.
          </p>
        </div>
        <div className="teacher-create-actions">
          <Link
            className="button primary"
            to="/teacher/practicals/new?mode=upload"
          >
            📄 Upload & Make Practical
          </Link>
          <Link
            className="button secondary"
            to="/teacher/practicals/new?mode=manual"
          >
            ＋ Manual Generator
          </Link>
        </div>
      </div>

      <ol className="teacher-flow-steps" aria-label="Submission search steps">
        <li className={!selectedSubject ? "current" : "complete"}>
          1. Subject
        </li>
        <li
          className={
            selectedClass ? "complete" : selectedSubject ? "current" : ""
          }
        >
          2. Class
        </li>
        <li
          className={
            selectedStudent ? "current" : selectedClass ? "current" : ""
          }
        >
          3. Student
        </li>
        <li className={selectedStudent ? "current" : ""}>4. Submissions</li>
      </ol>

      <section className="teacher-flow-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">STEP 1</span>
            <h2>Select a subject</h2>
          </div>
          {selectedSubject && (
            <button
              className="text-link teacher-change"
              onClick={() => chooseSubject(selectedSubject)}
            >
              Change subject
            </button>
          )}
        </div>
        {subjectsLoading ? (
          <Loading />
        ) : subjectError ? (
          <ErrorBox
            message={subjectError}
            retry={() => window.location.reload()}
          />
        ) : subjects.length ? (
          <div className="teacher-choice-grid">
            {subjects.map((subject) => {
              const isSelected =
                selectedSubject?.subject === subject.subject &&
                selectedSubject.semester === subject.semester;
              return (
                <button
                  className={`teacher-choice ${isSelected ? "selected" : ""}`}
                  key={`${subject.semester}-${subject.subject}`}
                  onClick={() => chooseSubject(subject)}
                  aria-pressed={isSelected}
                >
                  <span className="eyebrow">SEMESTER {subject.semester}</span>
                  <b>{subject.subject}</b>
                  <small>{subject.practicalCount} practicals</small>
                </button>
              );
            })}
          </div>
        ) : (
          <Empty
            title="No subjects available"
            text="Published practical subjects will appear here."
          />
        )}
      </section>

      {selectedSubject && (
        <section className="teacher-flow-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                STEP 2 · {selectedSubject.subject}
              </span>
              <h2>Select the class</h2>
            </div>
          </div>
          {classesLoading ? (
            <Loading />
          ) : classError ? (
            <ErrorBox
              message={classError}
              retry={() => chooseSubject(selectedSubject)}
            />
          ) : classes.length ? (
            <div className="teacher-class-options">
              {classes.map((classSection) => (
                <button
                  className={`teacher-class-option ${selectedClass === classSection ? "selected" : ""}`}
                  key={classSection}
                  onClick={() => chooseClass(classSection)}
                  aria-pressed={selectedClass === classSection}
                >
                  {classSection}
                </button>
              ))}
            </div>
          ) : (
            <Empty
              title="No classes found"
              text="Add a class or section to student accounts for this semester."
            />
          )}
        </section>
      )}

      {selectedSubject && selectedClass && (
        <section className="teacher-flow-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">STEP 3 · {selectedClass}</span>
              <h2>Select a student</h2>
            </div>
          </div>
          {studentsLoading ? (
            <Loading />
          ) : studentError ? (
            <ErrorBox
              message={studentError}
              retry={() => chooseClass(selectedClass)}
            />
          ) : students.length ? (
            <div className="teacher-student-list">
              {students.map((student) => (
                <button
                  className={`teacher-student-row ${selectedStudent?.id === student.id ? "selected" : ""}`}
                  key={student.id}
                  onClick={() => void chooseStudent(student)}
                  aria-pressed={selectedStudent?.id === student.id}
                >
                  <span className="teacher-student-avatar" aria-hidden="true">
                    {student.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <span className="teacher-student-info">
                    <b>{student.name}</b>
                    <small>{student.email}</small>
                  </span>
                  <span className="teacher-student-class">
                    {student.classSection}
                  </span>
                  <span className="teacher-student-arrow">
                    View submissions →
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <Empty
              title="No students in this class"
              text="Student accounts assigned to this section will appear here."
            />
          )}
        </section>
      )}

      {selectedStudent && (
        <section className="teacher-flow-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">STEP 4 · {selectedStudent.name}</span>
              <h2>Practical submissions</h2>
              <p className="muted">
                {selectedSubject?.subject} · {selectedClass}
              </p>
            </div>
          </div>
          {submissionsLoading ? (
            <Loading />
          ) : submissionsError ? (
            <ErrorBox
              message={submissionsError}
              retry={() => void chooseStudent(selectedStudent)}
            />
          ) : studentSubmissions.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Practical</th>
                    <th>Language</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Marks</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {studentSubmissions.map((submission) => (
                    <tr key={submission.id}>
                      <td>
                        <b>{submission.practicalTitle}</b>
                      </td>
                      <td>{submission.language}</td>
                      <td>{date(submission.submittedAt)}</td>
                      <td>
                        <span
                          className={`status ${submission.evaluated ? "done" : "active"}`}
                        >
                          {submission.evaluated ? "Evaluated" : "Needs review"}
                        </span>
                      </td>
                      <td>{submission.totalMarks ?? "—"}</td>
                      <td>
                        <Link
                          className="text-link"
                          to={`/teacher/submissions/${submission.id}`}
                        >
                          Review →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty
              title="No submissions yet"
              text="This student has not submitted a practical for the selected subject."
            />
          )}
        </section>
      )}
    </section>
  );
}
