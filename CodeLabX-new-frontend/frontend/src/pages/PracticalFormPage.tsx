import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { api } from "../services/api";
import { blankForm } from "./practicalFormDefaults";
import type { Detail, User } from "../types";
import { humanStatus, statusClass } from "../utils/formatters";
import "../styles/pages/practical-builder.css";

type BuilderMode = "document" | "manual";

type ParsedDoc = {
  title: string;
  subject: string;
  semester: number | null;
  description: string;
  aim: string;
  theory: string;
  algorithm: string;
  codeInstructions: string;
  conclusion: string;
  javaStarterCode?: string;
  pythonStarterCode?: string;
  practiceQuestions?: string[];
  vivaQuestions?: string[];
};

export function PracticalFormPage() {
  const { id } = useParams();
  const edit = !!id;
  const nav = useNavigate();
  const [searchParams] = useSearchParams();

  const initialMode: BuilderMode = edit
    ? "manual"
    : searchParams.get("mode") === "manual"
      ? "manual"
      : "document";

  const [activeMode, setActiveMode] = useState<BuilderMode>(initialMode);
  const [form, setForm] = useState<Detail>(blankForm);
  const [students, setStudents] = useState<User[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [savedId, setSavedId] = useState<number | null>(id ? Number(id) : null);

  // Document upload state
  const [docSubject, setDocSubject] = useState("Data Structures");
  const [docSemester, setDocSemester] = useState<number>(3);
  const [docClassSection, setDocClassSection] = useState("SE-B");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedDoc, setParsedDoc] = useState<ParsedDoc | null>(null);
  const [parsingBusy, setParsingBusy] = useState(false);
  const [generatingBusy, setGeneratingBusy] = useState(false);
  const [createdResult, setCreatedResult] = useState<Detail | null>(null);

  useEffect(() => {
    if (edit) {
      api<Detail>(`/practicals/${id}`)
        .then((x) => {
          setForm(x);
          setSelected(x.assignedStudentIds || []);
          setActiveMode("manual");
        })
        .catch((e) => setError(e.message));
    }
  }, [id, edit]);

  // Load students for manual generator
  useEffect(() => {
    const sem = activeMode === "document" ? docSemester : form.semester;
    api<User[]>(`/practicals/students?semester=${sem}`)
      .then((result) => {
        setStudents(result);
        const sections = [
          ...new Set(result.map((s) => s.classSection).filter(Boolean)),
        ] as string[];
        setDocClassSection((current) =>
          sections.includes(current) ? current : sections[0] || "SE-B",
        );
      })
      .catch(() => setStudents([]));
  }, [form.semester, docSemester, activeMode]);

  const classSections = useMemo(
    () =>
      [
        ...new Set(
          students.map((student) => student.classSection).filter(Boolean),
        ),
      ] as string[],
    [students],
  );

  const [manualClassSection, setManualClassSection] = useState("");
  useEffect(() => {
    if (classSections.length > 0 && !manualClassSection) {
      setManualClassSection(classSections[0]);
    }
  }, [classSections, manualClassSection]);

  const classStudents = students.filter(
    (student) =>
      !manualClassSection || student.classSection === manualClassSection,
  );

  const update = (key: keyof Detail, value: any) =>
    setForm((f) => ({ ...f, [key]: value }));

  const add = (kind: "practiceQuestions" | "vivaQuestions") =>
    update(kind, [
      ...form[kind],
      kind === "practiceQuestions"
        ? {
            id: 0,
            question: "",
            expectedAnswer: "",
            order: form[kind].length + 1,
          }
        : { id: 0, question: "", marks: 2, order: form[kind].length + 1 },
    ]);

  // Manual save
  const save = async (publish = false) => {
    setBusy(true);
    setError("");
    try {
      const body = {
        ...form,
        practiceQuestions: form.practiceQuestions.filter((x) =>
          x.question.trim(),
        ),
        vivaQuestions: form.vivaQuestions.filter((x) => x.question.trim()),
      };
      const result = await api<Detail>(
        savedId ? `/practicals/${savedId}` : "/practicals",
        { method: savedId ? "PUT" : "POST", body: JSON.stringify(body) },
      );
      setSavedId(result.id);
      if (selected.length)
        await api(`/practicals/${result.id}/assign`, {
          method: "POST",
          body: JSON.stringify({ studentIds: selected }),
        });
      if (publish) {
        await api(`/practicals/${result.id}/publish`, { method: "POST" });
        nav("/teacher");
      } else setError("Draft saved successfully.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save practical");
    } finally {
      setBusy(false);
    }
  };

  // Document file selection & automatic parse
  const handleFileChange = async (file?: File) => {
    if (!file) return;
    setUploadedFile(file);
    setParsingBusy(true);
    setError("");
    setCreatedResult(null);

    try {
      const data = new FormData();
      data.append("file", file);
      const parsed = await api<ParsedDoc>("/practicals/parse-document", {
        method: "POST",
        body: data,
      });
      setParsedDoc(parsed);
      if (parsed.subject) setDocSubject(parsed.subject);
      if (parsed.semester) setDocSemester(parsed.semester);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not read this document.",
      );
    } finally {
      setParsingBusy(false);
    }
  };

  // Instant practical creation directly from document
  const handleMakePracticalFromDoc = async () => {
    if (!uploadedFile) {
      setError("Please choose a PDF or Word document first.");
      return;
    }
    setGeneratingBusy(true);
    setError("");

    try {
      const data = new FormData();
      data.append("file", uploadedFile);

      const queryParams = new URLSearchParams({
        subject: docSubject,
        semester: String(docSemester),
        classSection: docClassSection,
        publish: "true",
      });

      const result = await api<Detail>(
        `/practicals/create-from-document?${queryParams.toString()}`,
        {
          method: "POST",
          body: data,
        },
      );

      setCreatedResult(result);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Failed to create practical from document.",
      );
    } finally {
      setGeneratingBusy(false);
    }
  };

  // Transfer extracted document to manual editor
  const transferToManualEditor = () => {
    if (!parsedDoc) return;
    setForm((current) => ({
      ...current,
      title: parsedDoc.title || current.title,
      subject: docSubject || parsedDoc.subject || current.subject,
      semester: docSemester || parsedDoc.semester || current.semester,
      description: parsedDoc.description || current.description,
      aim: parsedDoc.aim || current.aim,
      theory: parsedDoc.theory || current.theory,
      algorithm: parsedDoc.algorithm || current.algorithm,
      codeInstructions: parsedDoc.codeInstructions || current.codeInstructions,
      conclusion: parsedDoc.conclusion || current.conclusion,
      javaStarterCode: parsedDoc.javaStarterCode || current.javaStarterCode,
      pythonStarterCode:
        parsedDoc.pythonStarterCode || current.pythonStarterCode,
      practiceQuestions: (parsedDoc.practiceQuestions || []).map((q, i) => ({
        id: 0,
        question: q,
        expectedAnswer: "Explain clearly with reasoning.",
        order: i + 1,
      })),
      vivaQuestions: (parsedDoc.vivaQuestions || []).map((q, i) => ({
        id: 0,
        question: q,
        marks: 2,
        order: i + 1,
      })),
      status: "DRAFT",
    }));
    setActiveMode("manual");
  };

  return (
    <>
      <div className="welcome-row compact-welcome">
        <div>
          <button className="back-link" onClick={() => nav("/teacher")}>
            ← Teaching overview
          </button>
          <span className="eyebrow">FACULTY LABORATORY WORKSPACE</span>
          <h1>{edit ? "Edit practical" : "Create practical"}</h1>
          <p className="muted">
            {activeMode === "document"
              ? "Upload a practical document (PDF or Word) to instantly create and publish practicals to a class."
              : "Manually author every section of the practical using the structured editor."}
          </p>
        </div>
        <span className={`status ${statusClass(form.status)}`}>
          {humanStatus(form.status)}
        </span>
      </div>

      {!edit && (
        <div className="builder-mode-switch" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeMode === "document"}
            className={activeMode === "document" ? "active" : ""}
            onClick={() => setActiveMode("document")}
          >
            📄 Upload & Auto-Generate Practical (from PDF / Word)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeMode === "manual"}
            className={activeMode === "manual" ? "active" : ""}
            onClick={() => setActiveMode("manual")}
          >
            ✍️ Manual Practical Generator
          </button>
        </div>
      )}

      {/* OPTION 1: DOCUMENT UPLOAD & INSTANT PRACTICAL MAKER */}
      {activeMode === "document" && (
        <section className="doc-generator-container">
          {createdResult ? (
            <div className="success-creation-card">
              <span style={{ fontSize: "42px" }}>🎉</span>
              <h2>Practical Created & Published!</h2>
              <p>
                <strong>{createdResult.title}</strong> has been created directly
                from your document, published to Semester {docSemester} (
                {docSubject}), and assigned to all students in{" "}
                <strong>Class {docClassSection}</strong>.
              </p>
              <div className="success-actions">
                <Link
                  className="button primary"
                  to={`/practicals/${createdResult.id}`}
                >
                  View in Practical Lab →
                </Link>
                <Link className="button secondary" to="/teacher">
                  Back to Teaching Overview
                </Link>
                <button
                  className="button secondary"
                  onClick={() => {
                    setCreatedResult(null);
                    setParsedDoc(null);
                    setUploadedFile(null);
                  }}
                >
                  Upload Another Document
                </button>
              </div>
            </div>
          ) : (
            <div className="doc-generator-card">
              <span className="eyebrow">
                OPTION 1 · DOCUMENT PRACTICAL GENERATOR
              </span>
              <h2>Upload Laboratory Handout (.pdf, .doc, .docx)</h2>
              <p className="muted" style={{ margin: "0 0 12px" }}>
                The platform reads the document text in real time, extracts Aim,
                Theory, Algorithm, Procedure, Code, and Questions, and directly
                generates the practical for your class.
              </p>

              <div className="doc-meta-grid">
                <label>
                  Academic Subject
                  <input
                    value={docSubject}
                    onChange={(e) => setDocSubject(e.target.value)}
                    placeholder="e.g. Data Structures"
                  />
                </label>
                <label>
                  Semester
                  <select
                    value={docSemester}
                    onChange={(e) => setDocSemester(Number(e.target.value))}
                  >
                    {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Assign to Class / Division
                  <select
                    value={docClassSection}
                    onChange={(e) => setDocClassSection(e.target.value)}
                  >
                    {classSections.length === 0 && (
                      <option value="SE-B">SE-B (Default)</option>
                    )}
                    {classSections.map((sec) => (
                      <option key={sec} value={sec}>
                        Class {sec}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="doc-dropzone">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  disabled={parsingBusy || generatingBusy}
                  onChange={(e) => void handleFileChange(e.target.files?.[0])}
                />
                <span className="dropzone-icon">📄</span>
                <div className="dropzone-text">
                  <b>
                    {uploadedFile
                      ? `Selected: ${uploadedFile.name}`
                      : "Drop PDF or Word document here, or click to browse"}
                  </b>
                  <p>
                    Supports .pdf, .docx, and .doc format (up to 10MB text-based
                    laboratory sheets)
                  </p>
                </div>
                {parsingBusy && (
                  <span style={{ font: "12px var(--mono)", color: "#2563eb" }}>
                    Reading document and extracting sections…
                  </span>
                )}
              </div>

              {error && <div className="alert">{error}</div>}

              {/* EXTRACTED PREVIEW CARD */}
              {parsedDoc && (
                <div className="doc-extracted-card">
                  <div className="extracted-header">
                    <div>
                      <span className="eyebrow">
                        DOCUMENT EXTRACTED SUCCESSFULLY
                      </span>
                      <h3>{parsedDoc.title}</h3>
                      <p
                        className="muted"
                        style={{ margin: 0, fontSize: "12px" }}
                      >
                        {parsedDoc.description ||
                          `Practical experiment for ${docSubject}`}
                      </p>
                    </div>
                    <div className="extracted-badges">
                      <span>Sem {docSemester}</span>
                      <span>Target: Class {docClassSection}</span>
                      <span>
                        {(parsedDoc.vivaQuestions?.length || 0) + 2} Questions
                      </span>
                    </div>
                  </div>

                  <div className="extracted-preview-grid">
                    <div className="extracted-preview-item">
                      <span className="item-title">AIM & OBJECTIVE</span>
                      <p>{parsedDoc.aim}</p>
                    </div>
                    <div className="extracted-preview-item">
                      <span className="item-title">ALGORITHM / PROCEDURE</span>
                      <p>{parsedDoc.algorithm}</p>
                    </div>
                    <div className="extracted-preview-item">
                      <span className="item-title">THEORETICAL CONCEPTS</span>
                      <p>{parsedDoc.theory}</p>
                    </div>
                    <div className="extracted-preview-item">
                      <span className="item-title">CODE INSTRUCTIONS</span>
                      <p>{parsedDoc.codeInstructions}</p>
                    </div>
                  </div>

                  <div className="extracted-action-bar">
                    <button
                      type="button"
                      className="button secondary"
                      onClick={transferToManualEditor}
                    >
                      ✏️ Open in Manual Editor to Customize
                    </button>
                    <button
                      type="button"
                      className="button primary"
                      disabled={generatingBusy}
                      onClick={handleMakePracticalFromDoc}
                    >
                      {generatingBusy
                        ? "Making & Publishing practical…"
                        : `⚡ Make & Publish Practical to Class ${docClassSection}`}{" "}
                      →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* OPTION 2: FULL MANUAL PRACTICAL GENERATOR */}
      {activeMode === "manual" && (
        <div className="builder-layout">
          <div className="builder-form">
            <section className="form-section">
              <span className="eyebrow">01 · OVERVIEW</span>
              <div className="field-grid">
                <label>
                  Title
                  <input
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                    placeholder="e.g. Array Operations"
                  />
                </label>
                <label>
                  Subject
                  <input
                    required
                    value={form.subject}
                    onChange={(e) => update("subject", e.target.value)}
                    placeholder="e.g. Data Structures & Algorithms"
                  />
                </label>
                <label>
                  Semester
                  <select
                    value={form.semester}
                    onChange={(e) => update("semester", Number(e.target.value))}
                  >
                    {Array.from({ length: 8 }, (_, index) => index + 1).map(
                      (semester) => (
                        <option key={semester} value={semester}>
                          Semester {semester}
                        </option>
                      ),
                    )}
                  </select>
                </label>
                <label>
                  Description
                  <input
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="A short summary for students"
                  />
                </label>
              </div>
            </section>
            {(
              [
                "aim",
                "theory",
                "algorithm",
                "codeInstructions",
                "conclusion",
              ] as const
            ).map((k, i) => (
              <section className="form-section" key={k}>
                <span className="eyebrow">
                  {String(i + 2).padStart(2, "0")} ·{" "}
                  {k.replace(/[A-Z]/g, (m) => ` ${m}`).toUpperCase()}
                </span>
                <label>
                  <span>
                    {k === "codeInstructions"
                      ? "Instructions shown in the editor"
                      : k === "conclusion"
                        ? "Completion requirements"
                        : "Learning material"}
                  </span>
                  <textarea
                    rows={k === "theory" || k === "algorithm" ? 6 : 4}
                    value={form[k]}
                    onChange={(e) => update(k, e.target.value)}
                    placeholder={`Enter ${k.replace(/[A-Z]/g, " $&").toLowerCase()}…`}
                  />
                </label>
              </section>
            ))}
            <section className="form-section">
              <span className="eyebrow">07 · STARTER CODE</span>
              <label>
                Java
                <textarea
                  className="code-textarea"
                  rows={7}
                  value={form.javaStarterCode}
                  onChange={(e) => update("javaStarterCode", e.target.value)}
                />
              </label>
              <label>
                Python
                <textarea
                  className="code-textarea"
                  rows={7}
                  value={form.pythonStarterCode}
                  onChange={(e) => update("pythonStarterCode", e.target.value)}
                />
              </label>
            </section>
            <section className="form-section">
              <span className="eyebrow">08 · PRACTICE QUESTIONS</span>
              {form.practiceQuestions.map((q, i) => (
                <div className="inline-question" key={i}>
                  <span>Q{i + 1}</span>
                  <input
                    value={q.question}
                    onChange={(e) =>
                      update(
                        "practiceQuestions",
                        form.practiceQuestions.map((x, j) =>
                          j === i ? { ...x, question: e.target.value } : x,
                        ),
                      )
                    }
                    placeholder="Question text"
                  />
                  <button
                    className="icon-button"
                    onClick={() =>
                      update(
                        "practiceQuestions",
                        form.practiceQuestions.filter((_, j) => j !== i),
                      )
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                className="button secondary"
                onClick={() => add("practiceQuestions")}
              >
                ＋ Add question
              </button>
            </section>
            <section className="form-section">
              <span className="eyebrow">09 · VIVA QUESTION BANK</span>
              {form.vivaQuestions.map((q, i) => (
                <div className="inline-question" key={i}>
                  <span>Q{i + 1}</span>
                  <input
                    value={q.question}
                    onChange={(e) =>
                      update(
                        "vivaQuestions",
                        form.vivaQuestions.map((x, j) =>
                          j === i ? { ...x, question: e.target.value } : x,
                        ),
                      )
                    }
                    placeholder="Viva question"
                  />
                  <input
                    className="mark-input"
                    type="number"
                    min="1"
                    value={q.marks}
                    onChange={(e) =>
                      update(
                        "vivaQuestions",
                        form.vivaQuestions.map((x, j) =>
                          j === i ? { ...x, marks: Number(e.target.value) } : x,
                        ),
                      )
                    }
                  />
                  <button
                    className="icon-button"
                    onClick={() =>
                      update(
                        "vivaQuestions",
                        form.vivaQuestions.filter((_, j) => j !== i),
                      )
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                className="button secondary"
                onClick={() => add("vivaQuestions")}
              >
                ＋ Add viva question
              </button>
            </section>
            <section className="form-section">
              <span className="eyebrow">10 · ASSIGN STUDENTS</span>
              <label>
                Class / division
                <select
                  value={manualClassSection}
                  onChange={(event) => {
                    setManualClassSection(event.target.value);
                    setSelected([]);
                  }}
                >
                  {classSections.length === 0 && (
                    <option value="">
                      No rostered students for this semester
                    </option>
                  )}
                  {classSections.map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </label>
              <div className="student-picker">
                {classStudents.map((s) => (
                  <label key={s.id}>
                    <input
                      type="checkbox"
                      checked={selected.includes(s.id)}
                      onChange={(e) =>
                        setSelected(
                          e.target.checked
                            ? [...selected, s.id]
                            : selected.filter((x) => x !== s.id),
                        )
                      }
                    />
                    <span>
                      {s.name}
                      <small>
                        {s.email} · {s.classSection}
                      </small>
                    </span>
                  </label>
                ))}
              </div>
            </section>
            {error && (
              <div
                className={
                  error.includes("successfully") ? "success-box" : "alert"
                }
              >
                {error}
              </div>
            )}
            <div className="builder-actions">
              <button
                className="button secondary"
                disabled={busy}
                onClick={() => save(false)}
              >
                Save draft
              </button>
              <button
                className="button primary"
                disabled={busy || !form.title}
                onClick={() => save(true)}
              >
                {busy ? "Saving…" : "Save & publish"} →
              </button>
            </div>
          </div>
          <aside className="builder-aside">
            <div className="rail-card">
              <span className="eyebrow">PUBLISH CHECKLIST</span>
              <p>
                Aim, theory, algorithm, code instructions and conclusion
                requirements are required.
              </p>
              <div className="checkline">✓ &nbsp; Six-step student flow</div>
              <div className="checkline">
                ✓ &nbsp; Java and Python starter code
              </div>
              <div className="checkline">
                ✓ &nbsp; Optional practice and viva questions
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
