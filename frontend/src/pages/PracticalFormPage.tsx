import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import { blankForm } from "./practicalFormDefaults";
import type { Detail, User } from "../types";
import { humanStatus, statusClass } from "../utils/formatters";

export function PracticalFormPage() {
  const { id } = useParams(),
    edit = !!id,
    nav = useNavigate(),
    [form, setForm] = useState<Detail>(blankForm),
    [students, setStudents] = useState<User[]>([]),
    [selected, setSelected] = useState<number[]>([]),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [savedId, setSavedId] = useState<number | null>(id ? Number(id) : null);
  useEffect(() => {
    if (edit)
      api<Detail>(`/practicals/${id}`)
        .then((x) => {
          setForm(x);
          setSelected(x.assignedStudentIds || []);
        })
        .catch((e) => setError(e.message));
    api<User[]>("/practicals/students")
      .then(setStudents)
      .catch(() => {});
  }, [id]);
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
  return (
    <>
      <div className="welcome-row compact-welcome">
        <div>
          <button className="back-link" onClick={() => nav("/teacher")}>
            ← Teaching overview
          </button>
          <span className="eyebrow">PRACTICAL BUILDER</span>
          <h1>{edit ? "Edit practical" : "Create practical"}</h1>
          <p className="muted">
            Write structured instructions for your next lab session.
          </p>
        </div>
        <span className={`status ${statusClass(form.status)}`}>
          {humanStatus(form.status)}
        </span>
      </div>
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
            <div className="student-picker">
              {students.map((s) => (
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
                    <small>{s.email}</small>
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
    </>
  );
}
import "../styles/pages/practical-builder.css";
