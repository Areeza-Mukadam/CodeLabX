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
    const grouped = new Map<string, { code: string; items: Practical[] }>();
    for (const subject of data?.subjects ?? []) {
      grouped.set(subject.name.trim(), { code: subject.code, items: [] });
    }
    for (const practical of practicals) {
      const name = practical.subject?.trim() || "Other subjects";
      let key = name;
      for (const k of grouped.keys()) {
        if (k.toLowerCase() === name.toLowerCase()) {
          key = k;
          break;
        }
      }
      const existing = grouped.get(key) ?? {
        code: key
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 5),
        items: [],
      };
      grouped.set(key, { ...existing, items: [...existing.items, practical] });
    }
    return [...grouped.entries()].map(([name, item]) => ({
      name,
      code: item.code,
      items: item.items,
    }));
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
      <div className="semester-quick-bar">
        <span className="semester-quick-label">SWITCH SEMESTER:</span>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
          <button
            key={s}
            type="button"
            className={`semester-quick-pill ${semester === s ? "active" : ""}`}
            onClick={() => chooseSemester(s)}
          >
            Sem {s}
          </button>
        ))}
      </div>

      <aside className="semester-subject-sidebar">
        <button
          type="button"
          className="semester-change-link"
          onClick={() => setSemester(null)}
        >
          ← All Semesters
        </button>
        <div className="semester-sidebar-header">
          <span className="eyebrow">
            {semester <= 2
              ? "1ST YEAR · FE"
              : semester <= 4
                ? "2ND YEAR · SE"
                : semester <= 6
                  ? "3RD YEAR · TE"
                  : "4TH YEAR · BE"}{" "}
            · SEMESTER {semester}
          </span>
          <h2>Subjects ({subjects.length})</h2>
          <p>Choose a subject to view its laboratory experiments.</p>
        </div>
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
                className={`subject-nav-item ${activeSubject === subject.name ? "active" : ""}`}
                aria-current={
                  activeSubject === subject.name ? "page" : undefined
                }
                onClick={() => setActiveSubject(subject.name)}
              >
                <div className="subject-item-top">
                  <span className="subject-code-tag">{subject.code}</span>
                  <span className="subject-count-pill">
                    {subject.items.length}{" "}
                    {subject.items.length === 1 ? "lab" : "labs"}
                  </span>
                </div>
                <span className="subject-item-name">{subject.name}</span>
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
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorBox message={error} retry={refresh} />
        ) : selectedSubject ? (
          <>
            <div className="content-header-banner">
              <div>
                <span className="eyebrow">
                  ACADEMIC YEAR · 2026–27 · SEMESTER {semester}
                </span>
                <h1>{selectedSubject.name}</h1>
                <p>
                  Choose a practical to open the interactive lab IDE, review
                  theory & algorithm, write and execute code, and submit for
                  evaluation.
                </p>
              </div>
              <div className="subject-badge-large">
                <span className="subject-badge-code">
                  {selectedSubject.code}
                </span>
                <span className="subject-badge-count">
                  {selectedSubject.items.length} practical
                  {selectedSubject.items.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>
            {selectedSubject.items.length ? (
              <div className="semester-practical-list">
                {selectedSubject.items.map((practical, idx) => (
                  <Link
                    className="semester-practical-card"
                    key={practical.id}
                    to={`/practicals/${practical.id}`}
                  >
                    <div>
                      <div className="practical-card-topbar">
                        <span className="practical-exp-badge">
                          EXPERIMENT{" "}
                          {String(
                            practical.experimentNumber || idx + 1,
                          ).padStart(2, "0")}
                        </span>
                        <span className="practical-status-badge">
                          {practical.status === "PUBLISHED"
                            ? "Active Lab"
                            : practical.status}
                        </span>
                      </div>
                      <h3 className="practical-card-title">
                        {practical.title}
                      </h3>
                      <p className="practical-card-desc">
                        {practical.description}
                      </p>
                    </div>
                    <div>
                      <div className="practical-card-tags">
                        <span className="practical-card-tag">☕ Java</span>
                        <span className="practical-card-tag">🐍 Python</span>
                        <span className="practical-card-tag">
                          🎯 Theory & Algo
                        </span>
                        <span className="practical-card-tag">📝 Viva</span>
                      </div>
                      <div className="practical-card-footer">
                        <span className="practical-card-cta">
                          Open practical lab →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="semester-subject-empty">
                <strong>
                  Practical materials for {selectedSubject.name} are being
                  prepared.
                </strong>
                <p>
                  Choose another subject from the left list to view active
                  experiments.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="semester-subject-empty">
            <strong>
              No practicals are assigned for Semester {semester} yet.
            </strong>
            <p>
              Choose another semester or check back after your faculty assigns
              practicals.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
