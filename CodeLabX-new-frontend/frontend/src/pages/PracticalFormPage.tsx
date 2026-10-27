import { useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../state/authStore";
import { blankForm } from "./practicalFormDefaults";
import type { Detail, User } from "../types";
import { humanStatus, statusClass } from "../utils/formatters";
import "../styles/pages/practical-builder.css";

type BuilderMode = "document" | "manual";

type ParsedDoc = {
  title: string;
  subject: string;
  semester: number | null;
  experimentNumber?: number | null;
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
  programmingLanguage?: string;
  sourcePdfPath?: string;
  sourcePdfName?: string;
  ocrApplied?: boolean;
  ocrMessage?: string;
};

function getSectionDefaultTemplate(keyOrTitle: string, title?: string): string {
  const norm = keyOrTitle.toLowerCase();
  if (norm.includes("aim") || norm.includes("objective")) {
    return `To study, implement, and analyze ${title || "the algorithmic problem"} under real-world input constraints and verify output correctness.`;
  }
  if (norm.includes("theory") || norm.includes("background")) {
    return `Theoretical Background:\n1. Core concepts and mathematical formulation.\n2. Invariants, constraints, and algorithmic complexity characteristics.\n3. Practical applications in modern software engineering.`;
  }
  if (norm.includes("algorithm") || norm.includes("procedure") || norm.includes("step")) {
    return `Step 1: Parse and validate input data structures.\nStep 2: Initialize working variables and base state.\nStep 3: Iterate through elements and apply core transformation logic.\nStep 4: Check boundary edge cases and terminate.\nStep 5: Return or display the verified solution output.`;
  }
  if (norm.includes("code") || norm.includes("instruction")) {
    return `1. Complete the core function implementation.\n2. Ensure proper handling of corner cases (e.g. empty inputs, large bounds).\n3. Test the program using the Run button and verify the terminal output.`;
  }
  if (norm.includes("conclusion")) {
    return `The practical was executed successfully. Algorithmic logic and execution results conformed to the expected theoretical bounds.`;
  }
  if (norm.includes("result") || norm.includes("discussion")) {
    return `Results & Discussion:\n1. Test cases executed across diverse input domains with verified outputs.\n2. Observed time and space complexity adhere to theoretical big-O bounds.\n3. Edge cases and boundary conditions successfully validated without exceptions.`;
  }
  if (norm.includes("requirement") || norm.includes("hardware") || norm.includes("software")) {
    return `System Requirements:\n1. Hardware: 64-bit multi-core CPU, 8 GB RAM, High-speed Internet.\n2. Software: Ubuntu Linux / Windows 11, VS Code, JDK 21 / Python 3.12, GCC 13.`;
  }
  if (norm.includes("precaution") || norm.includes("rule")) {
    return `Precautions & Guidelines:\n1. Ensure memory bounds and array indices are strictly validated to avoid buffer overflows.\n2. Gracefully handle null pointers and edge-case exceptions.\n3. Always free dynamically allocated memory resources.`;
  }
  if (norm.includes("observation")) {
    return `Observations & Calculations:\n- Test Vector 1: Input size N = 100 -> Execution Time = 0.12 ms\n- Test Vector 2: Input size N = 1,000 -> Execution Time = 1.45 ms\n- Test Vector 3: Input size N = 10,000 -> Execution Time = 16.80 ms`;
  }
  return `1. Core definition and procedural steps.\n2. Computational analysis and boundary execution.\n3. Findings, performance metrics, and validation.`;
}

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
  const [enabledLanguages, setEnabledLanguages] = useState<Array<{code:string;name:string}>>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [savedId, setSavedId] = useState<number | null>(id ? Number(id) : null);

  const currentUser = useAuth((s) => s.user);
  const userDepartment = currentUser?.department || "Computer Engineering";

  // Document upload state
  const [docSubject, setDocSubject] = useState("Data Structures");
  const [docSemester, setDocSemester] = useState<number>(3);
  const [docClassSection, setDocClassSection] = useState("");
  const [docDepartment, setDocDepartment] = useState(userDepartment);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedDoc, setParsedDoc] = useState<ParsedDoc | null>(null);
  const [parsingBusy, setParsingBusy] = useState(false);
  const [enableOcr, setEnableOcr] = useState(true);
  const [generatingAndPublishing, setGeneratingAndPublishing] = useState(false);
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [generatorSuccessMessage, setGeneratorSuccessMessage] = useState("");

  // Dynamic Manual Sections State
  const [manualSections, setManualSections] = useState<Array<{
    id: string;
    key?: string;
    title: string;
    content: string;
    subtitle?: string;
    placeholder?: string;
  }>>([
    {
      id: "sec-aim",
      key: "aim",
      title: "Aim & Objective",
      subtitle: "Define what this practical experiment achieves",
      content: "",
      placeholder: "To study, implement, and analyze...",
    },
    {
      id: "sec-theory",
      key: "theory",
      title: "Theory & Background",
      subtitle: "Core theoretical principles and mathematical formulation",
      content: "",
      placeholder: "Theoretical Background...",
    },
    {
      id: "sec-algo",
      key: "algorithm",
      title: "Algorithm / Step-by-Step Procedure",
      subtitle: "Step-by-step logic or pseudo-code methodology",
      content: "",
      placeholder: "Step 1: ...\nStep 2: ...",
    },
    {
      id: "sec-code",
      key: "codeInstructions",
      title: "Code Instructions",
      subtitle: "Instructions shown directly in the student code editor",
      content: "",
      placeholder: "1. Complete the core function implementation...",
    },
    {
      id: "sec-concl",
      key: "conclusion",
      title: "Conclusion",
      subtitle: "Summary of learning and execution verification",
      content: "",
      placeholder: "The practical was executed successfully...",
    },
  ]);
  const [newSectionTitle, setNewSectionTitle] = useState("");

  const updateSectionContent = (id: string, content: string) => {
    setManualSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, content } : s)),
    );
  };

  const removeSectionBox = (id: string) => {
    setManualSections((prev) => prev.filter((s) => s.id !== id));
  };

  const addSectionBox = (title: string, key?: string) => {
    const newId = `sec-custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const template = getSectionDefaultTemplate(key || title, form.title);
    setManualSections((prev) => [
      ...prev,
      {
        id: newId,
        key: key || "custom",
        title,
        content: template,
        placeholder: `Enter ${title.toLowerCase()}...`,
      },
    ]);
  };

  useEffect(() => {
    if (edit) {
      api<Detail>(`/practicals/${id}`)
        .then((x) => {
          setForm(x);
          setActiveMode("manual");
        })
        .catch((e) => setError(e.message));
    }
  }, [id, edit]);

  useEffect(() => { api<Array<{code:string;name:string}>>("/languages").then(setEnabledLanguages).catch(() => setEnabledLanguages([])); }, []);

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
          sections.includes(current) ? current : sections[0] || "",
        );
      })
      .catch(() => setStudents([]));
  }, [form.semester, docSemester, activeMode]);

  const [manualDepartment, setManualDepartment] = useState(userDepartment);
  const [manualClassSection, setManualClassSection] = useState("");

  const departments = useMemo(() => {
    if (currentUser?.department) return [currentUser.department];
    return [...new Set(students.map((s) => s.department).filter(Boolean))] as string[];
  }, [students, currentUser?.department]);

  const docClassSections = useMemo(() => {
    const list = [
      ...new Set(
        students
          .filter((s) => s.department === docDepartment)
          .map((s) => s.classSection)
          .filter(Boolean),
      ),
    ] as string[];
    return list;
  }, [students, docDepartment]);

  const classSections = useMemo(() => {
    const list = [
      ...new Set(
        students
          .filter((s) => !manualDepartment || s.department === manualDepartment)
          .map((student) => student.classSection)
          .filter(Boolean),
      ),
    ] as string[];
    return list;
  }, [students, manualDepartment]);

  useEffect(() => {
    if (!manualDepartment && departments.length) setManualDepartment(departments[0]);
  }, [departments, manualDepartment]);

  const [dueDate, setDueDate] = useState("");
  const [assignmentInstructions, setAssignmentInstructions] = useState("");

  useEffect(() => {
    if (classSections.length > 0 && (!manualClassSection || !classSections.includes(manualClassSection))) {
      setManualClassSection(classSections[0]);
    } else if (classSections.length === 0 && manualClassSection) {
      setManualClassSection("");
    }
  }, [classSections, manualClassSection]);

  const classStudents = useMemo(() => {
    return students.filter(
      (student) =>
        (!manualDepartment || student.department === manualDepartment) &&
        (!manualClassSection || student.classSection === manualClassSection),
    );
  }, [students, manualDepartment, manualClassSection]);

  const update = (key: keyof Detail, value: any) =>
    setForm((f) => ({ ...f, [key]: value }));

  const downloadSourcePdf = async () => {
    if (!form.sourcePdfPath) return;
    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const response = await fetch(`${base}/api${form.sourcePdfPath}`, { headers: { Authorization: `Bearer ${useAuth.getState().token}` } });
      if (!response.ok) throw new Error("Unable to download the original PDF.");
      const blob=await response.blob(), url=URL.createObjectURL(blob), anchor=document.createElement("a");
      anchor.href=url; anchor.download=form.sourcePdfName||"practical.pdf"; anchor.click(); URL.revokeObjectURL(url);
    } catch(e) { setError(e instanceof Error?e.message:"Unable to download PDF."); }
  };

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
    if (publish && (!manualClassSection || classStudents.length === 0)) {
      setError("Choose a class with students in your department before publishing.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const aimSec = manualSections.find((s) => s.key === "aim" || s.title.toLowerCase().includes("aim"));
      const theorySec = manualSections.find((s) => s.key === "theory" || s.title.toLowerCase().includes("theory"));
      const algoSec = manualSections.find((s) => s.key === "algorithm" || s.title.toLowerCase().includes("algorithm") || s.title.toLowerCase().includes("procedure"));
      const codeSec = manualSections.find((s) => s.key === "codeInstructions" || s.title.toLowerCase().includes("code instruction"));
      const conclSec = manualSections.find((s) => s.key === "conclusion" || s.title.toLowerCase().includes("conclusion"));

      const standardIds = new Set([aimSec?.id, theorySec?.id, algoSec?.id, codeSec?.id, conclSec?.id].filter(Boolean));
      const customSections = manualSections.filter((s) => !standardIds.has(s.id));

      let assembledTheory = theorySec ? theorySec.content : "";
      for (const cs of customSections) {
        if (cs.content.trim()) {
          assembledTheory += `\n\n### ${cs.title}\n${cs.content.trim()}`;
        }
      }

      const body = {
        ...form,
        aim: aimSec ? aimSec.content : "",
        theory: assembledTheory,
        algorithm: algoSec ? algoSec.content : "",
        codeInstructions: codeSec ? codeSec.content : "",
        conclusion: conclSec ? conclSec.content : "",
        practiceQuestions: form.practiceQuestions.filter((x) =>
          x.question.trim(),
        ),
        vivaQuestions: form.vivaQuestions.filter((x) => x.question.trim()),
        sourcePdfPath: form.sourcePdfPath,
        sourcePdfName: form.sourcePdfName,
      };

      let result: Detail;
      if (savedId) {
        try {
          result = await api<Detail>(`/practicals/${savedId}`, {
            method: "PUT",
            body: JSON.stringify(body),
          });
        } catch {
          // If update fails (e.g. practical ID reset after DB restart or 404), create fresh
          result = await api<Detail>("/practicals", {
            method: "POST",
            body: JSON.stringify(body),
          });
        }
      } else {
        result = await api<Detail>("/practicals", {
          method: "POST",
          body: JSON.stringify(body),
        });
      }

      setSavedId(result.id);
      if (publish) {
        try {
          await api(`/practicals/${result.id}/publish`, { method: "POST" });
        } catch (pubErr) {
          console.warn("Publish call issue:", pubErr);
        }
        if (manualClassSection) {
          try {
            await api(`/practicals/${result.id}/assign-class`, {
              method: "POST",
              body: JSON.stringify({
                department: manualDepartment || userDepartment,
                classSection: manualClassSection,
                dueAt: dueDate ? new Date(dueDate).toISOString() : null,
                instructions: assignmentInstructions,
              }),
            });
          } catch (assignErr) {
            console.warn("Class assignment warning:", assignErr);
          }
        }
        nav("/teacher");
      } else {
        setError("Draft saved successfully.");
      }
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
    setGeneratorSuccessMessage("");

    try {
      const data = new FormData();
      data.append("file", file);
      if (enableOcr) data.append("ocr", "true");
      const parsed = await api<ParsedDoc>(`/practicals/parse-document?ocr=${enableOcr}`, {
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

  const generateAndPublishFromDoc = async () => {
    if (!parsedDoc) return;
    if (!docClassSection || !docClassSections.includes(docClassSection)) {
      setError("Choose a class with students in your department before publishing.");
      return;
    }
    setGeneratingAndPublishing(true);
    setError("");
    setGeneratorSuccessMessage("");
    try {
      const payload = {
        title: parsedDoc.title || "Laboratory Experiment",
        subject: docSubject || parsedDoc.subject || "Data Structures",
        semester: docSemester || parsedDoc.semester || 3,
        experimentNumber: parsedDoc.experimentNumber ?? 1,
        description: parsedDoc.description || `Practical experiment for ${docSubject}`,
        aim: parsedDoc.aim || "Implement practical experiment.",
        theory: parsedDoc.theory || "Theoretical analysis of experiment concepts.",
        algorithm: parsedDoc.algorithm || "1. Initialize variables.\n2. Execute logic.\n3. Output result.",
        codeInstructions: parsedDoc.codeInstructions || "Write and test the solution code.",
        conclusion: parsedDoc.conclusion || "Successfully verified algorithm behavior.",
        javaStarterCode: parsedDoc.javaStarterCode || "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}",
        pythonStarterCode: parsedDoc.pythonStarterCode || "def main():\n    pass\n\nif __name__ == '__main__':\n    main()\n",
        programmingLanguage: parsedDoc.programmingLanguage || "JAVA",
        sourcePdfPath: parsedDoc.sourcePdfPath || "",
        sourcePdfName: parsedDoc.sourcePdfName || uploadedFile?.name || "",
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
        status: "PUBLISHED",
      };

      const practical = await api<Detail>("/practicals", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      await api(`/practicals/${practical.id}/publish`, { method: "POST" });

      if (docClassSection) {
        try {
          await api(`/practicals/${practical.id}/assign-class`, {
            method: "POST",
            body: JSON.stringify({
              department: docDepartment || userDepartment,
              classSection: docClassSection,
              dueAt: null,
              instructions: `Assigned from uploaded document: ${uploadedFile?.name || "Handout PDF"}`,
            }),
          });
        } catch (assignErr) {
          console.warn("Class assignment warning:", assignErr);
        }
      }

      setGeneratorSuccessMessage(`Practical "${practical.title}" successfully generated, published, and assigned to Class ${docClassSection}!`);
      setTimeout(() => {
        nav("/teacher");
      }, 1400);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to generate and publish practical");
    } finally {
      setGeneratingAndPublishing(false);
    }
  };

  const saveDraftFromDoc = async () => {
    if (!parsedDoc) return;
    setGeneratingDraft(true);
    setError("");
    setGeneratorSuccessMessage("");
    try {
      const payload = {
        title: parsedDoc.title || "Laboratory Experiment",
        subject: docSubject || parsedDoc.subject || "Data Structures",
        semester: docSemester || parsedDoc.semester || 3,
        experimentNumber: parsedDoc.experimentNumber ?? 1,
        description: parsedDoc.description || `Practical experiment for ${docSubject}`,
        aim: parsedDoc.aim || "Implement practical experiment.",
        theory: parsedDoc.theory || "Theoretical analysis of experiment concepts.",
        algorithm: parsedDoc.algorithm || "1. Initialize variables.\n2. Execute logic.\n3. Output result.",
        codeInstructions: parsedDoc.codeInstructions || "Write and test the solution code.",
        conclusion: parsedDoc.conclusion || "Successfully verified algorithm behavior.",
        javaStarterCode: parsedDoc.javaStarterCode || "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}",
        pythonStarterCode: parsedDoc.pythonStarterCode || "def main():\n    pass\n\nif __name__ == '__main__':\n    main()\n",
        programmingLanguage: parsedDoc.programmingLanguage || "JAVA",
        sourcePdfPath: parsedDoc.sourcePdfPath || "",
        sourcePdfName: parsedDoc.sourcePdfName || uploadedFile?.name || "",
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
      };

      const practical = await api<Detail>("/practicals", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setGeneratorSuccessMessage(`Practical "${practical.title}" saved as draft!`);
      setTimeout(() => {
        nav("/teacher");
      }, 1400);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save draft practical");
    } finally {
      setGeneratingDraft(false);
    }
  };


  // Transfer extracted document to manual editor
  const transferToManualEditor = () => {
    if (!parsedDoc) return;
    setManualClassSection(docClassSection);
    setManualDepartment(docDepartment);
    setForm((current) => ({
      ...current,
      title: parsedDoc.title || current.title,
      subject: docSubject || parsedDoc.subject || current.subject,
      semester: docSemester || parsedDoc.semester || current.semester,
      experimentNumber: parsedDoc.experimentNumber ?? current.experimentNumber,
      description: parsedDoc.description || current.description,
      aim: parsedDoc.aim || current.aim,
      theory: parsedDoc.theory || current.theory,
      algorithm: parsedDoc.algorithm || current.algorithm,
      codeInstructions: parsedDoc.codeInstructions || current.codeInstructions,
      conclusion: parsedDoc.conclusion || current.conclusion,
      programmingLanguage: parsedDoc.programmingLanguage || "",
      sourcePdfPath: parsedDoc.sourcePdfPath || "",
      sourcePdfName: parsedDoc.sourcePdfName || uploadedFile?.name || "",
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
    setManualSections([
      { id: "sec-aim", key: "aim", title: "Aim & Objective", content: parsedDoc.aim || "", placeholder: "To study, implement..." },
      { id: "sec-theory", key: "theory", title: "Theory & Background", content: parsedDoc.theory || "", placeholder: "Theoretical Background..." },
      { id: "sec-algo", key: "algorithm", title: "Algorithm / Step-by-Step Procedure", content: parsedDoc.algorithm || "", placeholder: "Step 1: ..." },
      { id: "sec-code", key: "codeInstructions", title: "Code Instructions", content: parsedDoc.codeInstructions || "", placeholder: "1. Complete implementation..." },
      { id: "sec-concl", key: "conclusion", title: "Conclusion", content: parsedDoc.conclusion || "", placeholder: "The practical was executed successfully..." },
    ]);
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
              ? "Upload a practical PDF to extract an editable draft before saving and assigning it to a class."
              : "Manually author every section of the practical using the structured editor."}
          </p>
        </div>
        <span className={`status ${statusClass(form.status)}`}>
          {humanStatus(form.status)}
        </span>
      </div>

      {!edit && (
        <div
          className="builder-mode-switch"
          role="tablist"
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "28px",
            background: "transparent",
            border: "none",
            padding: 0,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeMode === "document"}
            className={activeMode === "document" ? "active" : ""}
            onClick={() => setActiveMode("document")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: activeMode === "document" ? "2px solid #2563eb" : "1.5px solid #cbd5e1",
              background: activeMode === "document" ? "#eff6ff" : "#ffffff",
              color: activeMode === "document" ? "#1e40af" : "#475569",
              fontWeight: 700,
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: activeMode === "document" ? "0 4px 12px rgba(37, 99, 235, 0.12)" : "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            📄 Upload & Auto-Generate Practical (from PDF / Word)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeMode === "manual"}
            className={activeMode === "manual" ? "active" : ""}
            onClick={() => setActiveMode("manual")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: activeMode === "manual" ? "2px solid #c02040" : "1.5px solid #cbd5e1",
              background: activeMode === "manual" ? "#fff1f2" : "#ffffff",
              color: activeMode === "manual" ? "#be123c" : "#475569",
              fontWeight: 700,
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: activeMode === "manual" ? "0 4px 12px rgba(192, 32, 64, 0.12)" : "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            ✍️ Manual Practical Generator
          </button>
        </div>
      )}

      {/* OPTION 1: DOCUMENT UPLOAD & INSTANT PRACTICAL MAKER */}
      {activeMode === "document" && (
        <section className="doc-generator-container">
          <div className="doc-generator-card">
              <span className="eyebrow">
                OPTION 1 · DOCUMENT PRACTICAL GENERATOR
              </span>
          <h2>Upload Laboratory Handout (PDF)</h2>
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
                  Department
                  <select value={docDepartment} onChange={(e)=>setDocDepartment(e.target.value)}>{departments.map(d=><option key={d}>{d}</option>)}</select>
                </label>
                <label>
                  Assign to Class / Division
                  <select
                    value={docClassSection}
                    disabled={!docClassSections.length}
                    onChange={(e) => setDocClassSection(e.target.value)}
                  >
                    <option value="">{docClassSections.length ? "Select a class" : "No students found in this department"}</option>
                    {docClassSections.map((sec) => (
                      <option key={sec} value={sec}>
                        Class {sec}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* OCR ENGINE CONTROLS */}
              <div
                className="ocr-config-box"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "8px",
                  margin: "14px 0",
                }}
              >
                <div>
                  <b
                    style={{
                      color: "#166534",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: "14px",
                    }}
                  >
                    <span>🔍</span> Intelligent OCR (Optical Character Recognition) Engine
                  </b>
                  <p
                    style={{
                      margin: "3px 0 0",
                      fontSize: "12px",
                      color: "#15803d",
                    }}
                  >
                    Supports scanned laboratory handouts, photographed worksheets, and image PDFs. Automatically synthesizes Aim, Theory, Algorithm, and Viva questions.
                  </p>
                </div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    margin: 0,
                    cursor: "pointer",
                    fontWeight: 600,
                    color: "#166534",
                    fontSize: 13,
                    flexShrink: 0,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={enableOcr}
                    onChange={(e) => setEnableOcr(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: "#16a34a" }}
                  />
                  Enable OCR
                </label>
              </div>

              <div className="doc-dropzone">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  disabled={parsingBusy}
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
                    Supports text-based and scanned image PDFs up to 15MB. Intelligent OCR processes and restores document sections.
                  </p>
                </div>
                {parsingBusy && (
                  <span style={{ font: "12px var(--mono)", color: "#2563eb" }}>
                    Reading document and running OCR extraction…
                  </span>
                )}
              </div>

              {error && <div className="alert">{error}</div>}
              {generatorSuccessMessage && (
                <div
                  className="alert success"
                  style={{
                    marginTop: 12,
                    background: "#dcfce7",
                    color: "#166534",
                    border: "1px solid #86efac",
                    padding: "12px 16px",
                    borderRadius: 6,
                    fontWeight: 500,
                  }}
                >
                  {generatorSuccessMessage}
                </div>
              )}

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
                      <span
                        style={{
                          background: parsedDoc.ocrApplied ? "#dcfce7" : "#e0e7ff",
                          color: parsedDoc.ocrApplied ? "#15803d" : "#3730a3",
                          fontWeight: 600,
                        }}
                      >
                        {parsedDoc.ocrApplied ? "⚡ OCR Restored" : "📄 Text Extracted"}
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

                  <div
                    className="extracted-action-bar"
                    style={{
                      display: "flex",
                      gap: 12,
                      flexWrap: "wrap",
                      alignItems: "center",
                      marginTop: 18,
                    }}
                  >
                    <button
                      type="button"
                      className="button primary"
                      disabled={generatingAndPublishing || generatingDraft}
                      onClick={() => void generateAndPublishFromDoc()}
                      style={{
                        background: "#2563eb",
                        color: "#fff",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontWeight: 600,
                      }}
                    >
                      {generatingAndPublishing
                        ? "Publishing & assigning to class…"
                        : "🚀 Generate & Publish Practical"}
                    </button>
                    <button
                      type="button"
                      className="button secondary"
                      disabled={generatingAndPublishing || generatingDraft}
                      onClick={() => void saveDraftFromDoc()}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {generatingDraft ? "Saving…" : "💾 Save Draft Practical"}
                    </button>
                    <button
                      type="button"
                      className="button secondary"
                      disabled={generatingAndPublishing || generatingDraft}
                      onClick={transferToManualEditor}
                    >
                      ✏️ Open in Manual Editor to Customize
                    </button>
                  </div>
                </div>
              )}
          </div>
        </section>
      )}

      {/* OPTION 2: FULL MANUAL PRACTICAL GENERATOR */}
      {activeMode === "manual" && (
        <div className="builder-layout">
          <div className="builder-form">
            <section className="form-section">
              <span className="eyebrow">01 · OVERVIEW</span>
              {form.sourcePdfName&&<p className="muted">Source document retained: {form.sourcePdfName} {savedId&&<button type="button" className="text-link" onClick={()=>void downloadSourcePdf()}>Download original PDF</button>}</p>}
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
                <label>
                  Experiment number
                  <input type="number" min="1" value={form.experimentNumber ?? ""} onChange={(e) => update("experimentNumber", e.target.value ? Number(e.target.value) : null)} />
                </label>
                <label>
                  Programming language
                  <select value={(form.programmingLanguage || "").toUpperCase()} onChange={(e) => update("programmingLanguage", e.target.value)}>
                    <option value="">Choose later</option>{enabledLanguages.map(language=><option key={language.code} value={language.code}>{language.name}</option>)}
                  </select>
                </label>
              </div>
            </section>
            {manualSections.map((sec, i) => (
              <section className="form-section" key={sec.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <span className="eyebrow" style={{ margin: 0 }}>
                    {String(i + 2).padStart(2, "0")} · {sec.title.toUpperCase()}
                  </span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      className="button secondary compact"
                      onClick={() => {
                        const tpl = getSectionDefaultTemplate(sec.key || sec.title, form.title);
                        updateSectionContent(sec.id, sec.content ? `${sec.content}\n\n${tpl}` : tpl);
                      }}
                      style={{
                        fontSize: "12px",
                        padding: "5px 12px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        borderRadius: "6px",
                        fontWeight: 600,
                      }}
                    >
                      ＋ Add Template / Step
                    </button>
                    <button
                      type="button"
                      className="button secondary compact"
                      onClick={() => removeSectionBox(sec.id)}
                      title="Delete this entire box from the experiment manual"
                      style={{
                        fontSize: "12px",
                        padding: "5px 12px",
                        color: "#dc2626",
                        borderColor: "#fca5a5",
                        borderRadius: "6px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        fontWeight: 600,
                      }}
                    >
                      🗑️ Delete Box
                    </button>
                  </div>
                </div>
                <label>
                  <span>{sec.subtitle || `Content for ${sec.title}`}</span>
                  <textarea
                    rows={sec.key === "theory" || sec.key === "algorithm" ? 6 : 4}
                    value={sec.content}
                    onChange={(e) => updateSectionContent(sec.id, e.target.value)}
                    placeholder={sec.placeholder || `Enter ${sec.title.toLowerCase()}…`}
                  />
                </label>
              </section>
            ))}

            {/* ADD NEW SECTION / BOX TOOLBAR */}
            <div
              className="add-section-box-toolbar"
              style={{
                margin: "18px 0 24px",
                padding: "16px 20px",
                background: "#f8fafc",
                border: "2px dashed #94a3b8",
                borderRadius: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                  flexWrap: "wrap",
                  gap: "6px",
                }}
              >
                <b style={{ color: "#1e293b", fontSize: "14px" }}>
                  ＋ Add New Section / Box to Practical
                </b>
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  Add custom boxes like Result & Discussion, Requirements, Observations, etc.
                </span>
              </div>

              {/* Quick Template Pills */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                {[
                  { title: "Result & Discussion", key: "result" },
                  { title: "System & Software Requirements", key: "requirements" },
                  { title: "Precautions & Safety Guidelines", key: "precautions" },
                  { title: "Observations & Calculations", key: "observation" },
                  { title: "Aim & Objective", key: "aim" },
                  { title: "Conclusion", key: "conclusion" },
                ].map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    className="button secondary compact"
                    onClick={() => addSectionBox(item.title, item.key)}
                    style={{ fontSize: "12px", borderRadius: "20px", padding: "5px 12px", fontWeight: 600 }}
                  >
                    ＋ {item.title}
                  </button>
                ))}
              </div>

              {/* Custom Box Title Input */}
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="Or enter custom section box title (e.g. Result and Discussion)..."
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (newSectionTitle.trim()) {
                        addSectionBox(newSectionTitle.trim());
                        setNewSectionTitle("");
                      }
                    }
                  }}
                  style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
                <button
                  type="button"
                  className="button primary compact"
                  onClick={() => {
                    if (newSectionTitle.trim()) {
                      addSectionBox(newSectionTitle.trim());
                      setNewSectionTitle("");
                    }
                  }}
                  style={{ whiteSpace: "nowrap" }}
                >
                  ＋ Add Custom Box
                </button>
              </div>
            </div>
            <section className="form-section">
              <span className="eyebrow">07 · STARTER CODE</span>
              <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <input
                  type="checkbox"
                  checked={form.codeRequired !== false}
                  onChange={(e) => update("codeRequired", e.target.checked)}
                />
                Include a student code editor in this practical
              </label>
              {form.codeRequired !== false && <>
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
              </>}
            </section>
            <section className="form-section">
              <span className="eyebrow">08 · STUDENT OBSERVATION TABLE</span>
              <p className="muted">Optional table students can fill in and faculty can review with the submission.</p>
              {(form.observationColumns || []).length === 0 ? (
                <button type="button" className="button secondary" onClick={() => update("observationColumns", ["Observation", "Result"])}>
                  ＋ Add observation table
                </button>
              ) : <>
                <div style={{ overflowX: "auto", marginBottom: 12 }}>
                  <table style={{ width: "100%", minWidth: 480, borderCollapse: "collapse", tableLayout: "fixed" }}>
                    <thead>
                      <tr>
                        <th style={{ width: 48, padding: 8, border: "1px solid #cbd5e1", background: "#f1f5f9" }}>#</th>
                        {(form.observationColumns || []).map((column, index) => (
                          <th key={index} style={{ padding: 6, border: "1px solid #cbd5e1", background: "#f1f5f9" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <input aria-label={`Observation column ${index + 1} heading`} value={column} onChange={(e) => update("observationColumns", (form.observationColumns || []).map((item, i) => i === index ? e.target.value : item))} placeholder={`Column ${index + 1}`} style={{ minWidth: 0, width: "100%", padding: 7, border: "1px solid #cbd5e1", borderRadius: 4 }} />
                              <button type="button" aria-label={`Remove column ${index + 1}`} onClick={() => update("observationColumns", (form.observationColumns || []).filter((_, i) => i !== index))} style={{ border: 0, background: "transparent", cursor: "pointer", fontSize: 18 }}>×</button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: form.observationRowCount || 5 }, (_, row) => (
                        <tr key={row}>
                          <td style={{ padding: 8, border: "1px solid #cbd5e1", textAlign: "center" }}>{row + 1}</td>
                          {(form.observationColumns || []).map((_, col) => <td key={col} style={{ height: 38, padding: 6, border: "1px solid #cbd5e1" }} />)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <button type="button" className="button secondary" disabled={(form.observationColumns || []).length >= 12} onClick={() => update("observationColumns", [...(form.observationColumns || []), `Column ${(form.observationColumns || []).length + 1}`])}>＋ Add column</button>
                  <button type="button" className="button secondary" onClick={() => update("observationColumns", [])}>Remove table</button>
                  <label>Student rows <input type="number" min="1" max="30" value={form.observationRowCount || 5} onChange={(e) => update("observationRowCount", Math.max(1, Math.min(30, Number(e.target.value) || 1)))} style={{ width: 80, marginLeft: 8 }} /></label>
                </div>
              </>}
            </section>
            <section className="form-section">
              <span className="eyebrow">09 · PRACTICE QUESTIONS</span>
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
              <span className="eyebrow">10 · VIVA QUESTION BANK</span>
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
              <span className="eyebrow">11 · ASSIGN CLASS</span>
              <label>
                Department
                <select
                  value={manualDepartment}
                  onChange={(e) => {
                    setManualDepartment(e.target.value);
                  }}
                >
                  {departments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Class / division
                <select
                  value={manualClassSection}
                  disabled={!classSections.length}
                  onChange={(event) => {
                    setManualClassSection(event.target.value);
                  }}
                >
                  <option value="">{classSections.length ? "Select a class" : "No students found in this department"}</option>
                  {classSections.map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </label>
              <p className="muted">
                Publishing assigns this practical to all{" "}
                {classStudents.length} students in{" "}
                {manualClassSection || "SE-B"}.
              </p>
              <label>
                Due date
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </label>
              <label>
                Instructions for the class
                <textarea
                  rows={3}
                  value={assignmentInstructions}
                  onChange={(e) => setAssignmentInstructions(e.target.value)}
                  placeholder="Optional assignment instructions"
                />
              </label>
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
                disabled={busy || !form.title || !manualClassSection}
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
