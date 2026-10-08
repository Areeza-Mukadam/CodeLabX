import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ErrorBox, Loading } from "../components/Feedback";
import { useLoad } from "../hooks/useLoad";
import { api } from "../services/api";
import type { AcademicSubject, Practical } from "../types";
import SemesterSelection from "./SemesterSelection";
import "../styles/pages/semester-selection.css";

export function SemesterSelectionPage() {
  const [semester, setSemester] = useState<number | null>(null);
  const [activeSubject, setActiveSubject] = useState("");
  const { data, error, loading, refresh } = useLoad(
    () =>
      semester === null
        ? Promise.resolve({ practicals: [], subjects: [] })
        : Promise.all([
            api<Practical[]>(`/practicals?semester=${semester}`),
            api<AcademicSubject[]>(`/subjects?semester=${semester}`),
          ]).then(([practicals, subjects]) => ({ practicals, subjects })),
    [semester],
  );
  const practicals = data?.practicals ?? [];
  const subjects = useMemo(() => {
    const grouped = new Map<string, Practical[]>();
    for (const subject of data?.subjects ?? []) {
      grouped.set(subject.name, []);
    }
    for (const practical of practicals) {
      const name = practical.subject?.trim() || "Other subjects";
      grouped.set(name, [...(grouped.get(name) ?? []), practical]);
    }
    return [...grouped.entries()].map(([name, items]) => ({ name, items }));
  }, [data?.subjects, practicals]);

  useEffect(() => {
    if (
      subjects.length &&
      !subjects.some((subject) => subject.name === activeSubject)
    ) {
      setActiveSubject(subjects[0].name);
    }
  }, [activeSubject, subjects]);

  function chooseSemester(value: number) {
    localStorage.setItem("codelabx.selectedSemester", String(value));
    setActiveSubject("");
    setSemester(value);
  }

  if (semester === null) return <SemesterSelection onSelect={chooseSemester} />;

  const selectedSubject = subjects.find(
    (subject) => subject.name === activeSubject,
  );
  return (
    <section className="semester-subject-layout">
      <aside className="semester-subject-sidebar">
        <button
          type="button"
          className="semester-change-link"
          onClick={() => setSemester(null)}
        >
          ← Change semester
        </button>
        <span className="eyebrow">SEMESTER {semester}</span>
        <h2>Subjects</h2>
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorBox message={error} retry={refresh} />
        ) : subjects.length ? (
          <nav className="subject-nav" aria-label="Subjects">
            {subjects.map((subject) => (
              <button
                key={subject.name}
                type="button"
                className={activeSubject === subject.name ? "active" : ""}
                aria-current={
                  activeSubject === subject.name ? "page" : undefined
                }
                onClick={() => setActiveSubject(subject.name)}
              >
                <span>{subject.name}</span>
                <small>{subject.items.length}</small>
              </button>
            ))}
          </nav>
        ) : (
          <p className="subject-empty">
            No subjects are available for this semester yet.
          </p>
        )}
      </aside>

      <div className="semester-subject-content">
        <span className="eyebrow">ACADEMIC YEAR · 2026–27</span>
        <h1>Semester {semester}</h1>
        <p className="muted">
          Choose a practical from one of your available subjects.
        </p>
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorBox message={error} retry={refresh} />
        ) : selectedSubject ? (
          <>
            <div className="section-heading">
              <h2>{selectedSubject.name}</h2>
              <span className="count-pill">
                {selectedSubject.items.length} practical
                {selectedSubject.items.length === 1 ? "" : "s"}
              </span>
            </div>
            {selectedSubject.items.length ? (
              <div className="semester-practical-list">
                {selectedSubject.items.map((practical) => (
                  <Link
                    className="semester-practical-card"
                    key={practical.id}
                    to={`/practicals/${practical.id}`}
                  >
                    <span className="eyebrow">PRACTICAL</span>
                    <strong>{practical.title}</strong>
                    <span className="muted">{practical.description}</span>
                    <span className="semester-practical-arrow">
                      Open practical →
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="semester-subject-empty">
                <strong>
                  Practical materials for {selectedSubject.name} are not added
                  yet.
                </strong>
                <p>Your faculty can publish them when they are ready.</p>
              </div>
            )}
          </>
        ) : (
          <div className="semester-subject-empty">
            <strong>
              No practicals are assigned for Semester {semester} yet.
            </strong>
            <p>
              Choose another semester or check back after your teacher assigns
              practicals.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
