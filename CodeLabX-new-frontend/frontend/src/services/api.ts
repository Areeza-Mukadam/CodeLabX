import { useAuth } from "../state/authStore";
import {
  DEMO_PASSWORD,
  DEMO_PRACTICALS,
  DEMO_SUBJECTS,
  DEMO_USERS,
} from "./mockData";
import { findDepartmentPracticalById, EXPERIMENT_8_NMAP } from "./curriculumData";
import type { User } from "../types";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
const demoMocksEnabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_MOCK_DATA === "true";

interface StoredSubmission {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  rollNo?: string;
  classSection?: string;
  practicalId: number;
  practicalTitle: string;
  subject: string;
  semester: number;
  language: string;
  code: string;
  output: string;
  executionStatus: string;
  conclusionText: string;
  screenshots?: string[];
  submittedAt: string;
  evaluated: boolean;
  totalMarks?: number | null;
  codeMarks?: number | null;
  vivaMarks?: number | null;
  feedback?: string | null;
  vivaEntries?: Array<{ vivaQuestionId: number; awardedMarks: number; notes: string }>;
}

const DEFAULT_SUBMISSIONS: StoredSubmission[] = [
  {
    id: 808,
    studentId: 11,
    studentName: "Inzamam",
    studentEmail: "inzamam@tcetmumbai.in",
    rollNo: "13",
    classSection: "TE-B",
    practicalId: 8,
    practicalTitle: "Demonstrate the use of NMAP with different options to scan open ports, perform OS fingerprinting, ping scan, TCP port scan and UDP port scan",
    subject: "Cryptography and Network Security",
    semester: 6,
    language: "PYTHON",
    code: `# TCET Security Laboratory - Experiment 8: NMAP Network Scanning
def main():
    target = "192.168.1.10"
    print("=== TCET Network Security Lab - Experiment 8: NMAP Network Scanning ===")
    print(f"Target: {target}")
    scans = [
        ("Host Discovery (Ping)", f"nmap -sn {target}"),
        ("TCP Connect Scan", f"nmap -sT {target}"),
        ("UDP Port Scan", f"nmap -sU {target}"),
        ("OS Fingerprinting", f"nmap -O {target}"),
        ("Aggressive Scan", f"nmap -A -v {target}")
    ]
    for name, cmd in scans:
        print(f"[*] {name}: {cmd}")
    print("[+] Scans completed. Terminal logs and screenshots verified.")

if __name__ == '__main__':
    main()`,
    output: `=== TCET Network Security Lab - Experiment 8: NMAP Network Scanning ===
Target: 192.168.1.10
[*] Host Discovery (Ping): nmap -sn 192.168.1.10
Host is up (0.00042s latency).
[*] TCP Connect Scan: nmap -sT 192.168.1.10
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
8080/tcp open  http-proxy
[*] UDP Port Scan: nmap -sU 192.168.1.10
53/udp   open  domain
123/udp  open  ntp
[*] OS Fingerprinting: nmap -O 192.168.1.10
Running: Linux 5.X
OS CPE: cpe:/o:linux:linux_kernel:5.15
OS details: Linux 5.15 - 6.1 (Ubuntu 22.04 LTS)
[*] Aggressive Scan: nmap -A -v 192.168.1.10
Traceroute completed. 1 hop.
[+] Scans completed. Terminal logs and screenshots verified.`,
    executionStatus: "SUCCESS",
    conclusionText: "The Nmap tool was successfully used to perform different types of network scans. The experiment demonstrated how Ping Scan, TCP Scan, UDP Scan, port scanning, and OS fingerprinting can be performed using appropriate Nmap options. Through this experiment, different Nmap scanning techniques were demonstrated. The Ping Scan identified active hosts, TCP and UDP scans identified port states, and OS fingerprinting provided information about the probable operating system of the target.",
    screenshots: [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&auto=format&fit=crop&q=80"
    ],
    submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    evaluated: true,
    totalMarks: 14,
    codeMarks: 10,
    vivaMarks: 4,
    feedback: "Exceptional practical work by Inzamam! Thorough demonstration of all 5 NMAP scan types (Ping, TCP connect, UDP, OS detection, and Aggressive scan). All terminal output screenshots and observations are accurate. Full marks awarded.",
    vivaEntries: [
      { vivaQuestionId: 801, awardedMarks: 2, notes: "Accurately explained difference between TCP 3-way handshake and SYN stealth probe." },
      { vivaQuestionId: 802, awardedMarks: 2, notes: "Clearly cited Indian IT Act 2000 provisions on network reconnaissance and consent." }
    ],
  },
  {
    id: 501,
    studentId: 11,
    studentName: "Inzamam",
    studentEmail: "inzamam@tcetmumbai.in",
    rollNo: "13",
    classSection: "TE-B",
    practicalId: 601,
    practicalTitle: "Linear Regression & Gradient Descent Optimization",
    subject: "Machine Learning & Deep Learning",
    semester: 6,
    language: "PYTHON",
    code: "import numpy as np\ndef gradient_descent(X, y, lr=0.01, epochs=1000):\n    m, n = X.shape\n    weights = np.zeros(n)\n    bias = 0\n    for _ in range(epochs):\n        y_pred = np.dot(X, weights) + bias\n        dw = -(2/m) * np.dot(X.T, (y - y_pred))\n        db = -(2/m) * np.sum(y - y_pred)\n        weights -= lr * dw\n        bias -= lr * db\n    return weights, bias\n\nprint('Gradient descent converged successfully with MSE 0.042')",
    output: "Gradient descent converged successfully with MSE 0.042\n",
    executionStatus: "SUCCESS",
    conclusionText: "Successfully modeled linear regression from scratch using gradient descent optimization. Mean squared error converged to 0.042 across 1000 epochs.",
    submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    evaluated: true,
    totalMarks: 13,
    codeMarks: 9,
    vivaMarks: 4,
    feedback: "Solid implementation and convergence graph. Mathematical derivation of partial derivatives is correct.",
    vivaEntries: [
      { vivaQuestionId: 1, awardedMarks: 2, notes: "Good explanation of learning rate hyperparameter tuning." },
      { vivaQuestionId: 2, awardedMarks: 2, notes: "Correct understanding of convex loss surface." }
    ],
  },
  {
    id: 3,
    studentId: 1,
    studentName: "Areeza Mukadam",
    studentEmail: "student@tcetmumbai.in",
    rollNo: "SE-B-42",
    classSection: "SE-B",
    practicalId: 1,
    practicalTitle: "Matrix Inversion & System of Linear Equations",
    subject: "Engineering Mathematics - I",
    semester: 1,
    language: "JAVA",
    code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== Matrix Operations Lab ===");
        double[][] a = {{2, 1}, {5, 7}};
        double det = a[0][0]*a[1][1] - a[0][1]*a[1][0];
        System.out.println("Determinant: " + det);
        System.out.println("Matrix is " + (det != 0 ? "Invertible" : "Singular"));
    }
}`,
    output: "=== Matrix Operations Lab ===\nDeterminant: 9.0\nMatrix is Invertible\n",
    executionStatus: "SUCCESS",
    conclusionText: "Demonstrated matrix inversion and Gauss elimination with O(N^3) polynomial time complexity.",
    submittedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    evaluated: true,
    totalMarks: 14,
    codeMarks: 10,
    vivaMarks: 4,
    feedback: "Thorough matrix inversion calculations and clear code implementation.",
    vivaEntries: [],
  },
];

function getMockSubmissions(): StoredSubmission[] {
  try {
    const raw = localStorage.getItem("codelabx_submissions");
    if (raw) {
      const parsed: StoredSubmission[] = JSON.parse(raw);
      DEFAULT_SUBMISSIONS.forEach((def) => {
        if (!parsed.some((s) => s.id === def.id || (s.studentId === def.studentId && s.practicalId === def.practicalId))) {
          parsed.unshift(def);
        }
      });
      return parsed;
    }
  } catch {}
  return [...DEFAULT_SUBMISSIONS];
}

function saveMockSubmissions(subs: StoredSubmission[]) {
  try {
    localStorage.setItem("codelabx_submissions", JSON.stringify(subs));
  } catch {}
}

function getMockResponse<T>(path: string, init: RequestInit = {}): T | null {
  const cleanPath = path.split("?")[0];
  const searchParams = new URLSearchParams(
    path.includes("?") ? path.split("?")[1] : "",
  );
  const method = (init.method || "GET").toUpperCase();

  // /auth/login
  if (cleanPath === "/auth/login" && method === "POST") {
    let body: { email?: string; password?: string } = {};
    try {
      body = JSON.parse((init.body as string) || "{}");
    } catch {
      // ignore
    }
    const email = (body.email || "").trim().toLowerCase();
    if (!email.endsWith("@tcetmumbai.in")) {
      throw new Error("Only @tcetmumbai.in college email addresses are permitted.");
    }
    const user = DEMO_USERS[email];
    if (user) {
      if (body.password === DEMO_PASSWORD) {
        return {
          token: `demo-token-${user.role.toLowerCase()}-${user.id}-${Date.now()}`,
          user,
        } as T;
      }
      throw new Error("Invalid credentials");
    }
  }

  // /auth/register
  if (cleanPath === "/auth/register" && method === "POST") {
    let body: any = {};
    try {
      body = JSON.parse((init.body as string) || "{}");
    } catch {}
    const email = (body.email || "").trim().toLowerCase();
    if (!email.endsWith("@tcetmumbai.in")) {
      throw new Error("Only @tcetmumbai.in college email addresses are permitted.");
    }
    const role = (body.role || "student").toUpperCase() === "TEACHER" || (body.role || "").toUpperCase() === "FACULTY"
      ? "TEACHER"
      : "STUDENT";
    const classSec = body.classSection || "SE-B";
    const cohort = classSec.includes("-") ? classSec.split("-")[0] : "SE";
    const division = body.division || (classSec.includes("-") ? classSec.split("-")[1] : "B");
    const newUser: User = {
      id: Math.floor(Math.random() * 8000) + 500,
      name: body.name || "Student",
      email,
      role: role as "STUDENT" | "TEACHER" | "ADMIN",
      department: body.department || "Computer Engineering",
      classSection: classSec,
      division,
      cohort,
      rollNo: body.rollNo || "01",
    };
    DEMO_USERS[email] = newUser;
    return {
      token: `demo-token-${newUser.role.toLowerCase()}-${newUser.id}-${Date.now()}`,
      user: newUser,
    } as T;
  }

  // /subjects
  if (cleanPath === "/subjects") {
    const sem = searchParams.get("semester");
    if (sem) {
      return DEMO_SUBJECTS.filter((s) => s.semester === Number(sem)) as T;
    }
    return DEMO_SUBJECTS as T;
  }

  // /practicals
  if (cleanPath === "/practicals") {
    if (method === "POST") {
      let body: any = {};
      try { body = JSON.parse((init.body as string) || "{}"); } catch {}
      return {
        id: Math.floor(Math.random() * 1000) + 100,
        title: body.title || "Laboratory Experiment",
        subject: body.subject || "Data Structures",
        semester: body.semester || 3,
        status: body.status || "DRAFT",
        aim: body.aim || "",
        theory: body.theory || "",
        algorithm: body.algorithm || "",
        codeInstructions: body.codeInstructions || "",
        conclusion: body.conclusion || "",
        javaStarterCode: body.javaStarterCode || "",
        pythonStarterCode: body.pythonStarterCode || "",
        programmingLanguage: body.programmingLanguage || "JAVA",
        practiceQuestions: body.practiceQuestions || [],
        vivaQuestions: body.vivaQuestions || [],
      } as T;
    }
    const allPracticals = [EXPERIMENT_8_NMAP, ...DEMO_PRACTICALS];
    const sem = searchParams.get("semester");
    if (sem) {
      return allPracticals.filter((p) => p.semester === Number(sem)) as T;
    }
    return allPracticals as T;
  }

  // /practicals/students
  if (cleanPath === "/practicals/students") {
    const department = useAuth.getState().user?.department;
    const students = Array.from(
      new Map(
        Object.values(DEMO_USERS)
          .filter((u) => u.role === "STUDENT" && u.department === department)
          .map((u) => [u.id, u]),
      ).values(),
    );
    return students as T;
  }

  // /practicals/:id/publish
  if (cleanPath.endsWith("/publish") && method === "POST") {
    return { success: true } as T;
  }

  // /practicals/:id/assign-class
  if (cleanPath.endsWith("/assign-class") && method === "POST") {
    return { success: true } as T;
  }

  // /practicals/:id
  const practicalMatch = cleanPath.match(/^\/practicals\/(\d+)$/);
  if (practicalMatch) {
    const id = Number(practicalMatch[1]);
    if (method === "PUT" || method === "POST") {
      let body: any = {};
      try { body = JSON.parse((init.body as string) || "{}"); } catch {}
      return {
        id,
        title: body.title || "Laboratory Experiment",
        subject: body.subject || "Data Structures",
        semester: body.semester || 3,
        status: body.status || "DRAFT",
        aim: body.aim || "",
        theory: body.theory || "",
        algorithm: body.algorithm || "",
        codeInstructions: body.codeInstructions || "",
        conclusion: body.conclusion || "",
        javaStarterCode: body.javaStarterCode || "",
        pythonStarterCode: body.pythonStarterCode || "",
        programmingLanguage: body.programmingLanguage || "JAVA",
        practiceQuestions: body.practiceQuestions || [],
        vivaQuestions: body.vivaQuestions || [],
      } as T;
    }
    if (id === 8 || id === 808) {
      return EXPERIMENT_8_NMAP as T;
    }
    const found =
      DEMO_PRACTICALS.find((p) => p.id === id) || findDepartmentPracticalById(id) || DEMO_PRACTICALS[0];
    return found as T;
  }

  // /practicals/:id/progress
  const progressMatch = cleanPath.match(/^\/practicals\/(\d+)\/progress$/);
  if (progressMatch) {
    const id = Number(progressMatch[1]);
    if (method === "PUT" || method === "POST") {
      try {
        const body = JSON.parse((init.body as string) || "{}");
        if (body.screenshots) {
          localStorage.setItem(`codelabx.progress.${id}.screenshots`, JSON.stringify(body.screenshots));
        }
      } catch {}
    }
    let savedScreenshots: string[] = [];
    try {
      savedScreenshots = JSON.parse(localStorage.getItem(`codelabx.progress.${id}.screenshots`) || "[]");
    } catch {}
    return {
      practicalId: id,
      currentStep: "AIM",
      completedSteps: [],
      status: "IN_PROGRESS",
      percent: 20,
      practiceAnswers: {},
      conclusionText: "",
      draftCode: "",
      draftLanguage: "java",
      screenshots: savedScreenshots,
    } as T;
  }

  // /students/classmates
  if (cleanPath === "/students/classmates") {
    return Array.from(
      new Map(
        Object.values(DEMO_USERS)
          .filter((u) => u.role === "STUDENT")
          .map((u) => [u.id, u]),
      ).values(),
    ) as T;
  }

  // /teacher/subjects
  if (cleanPath === "/teacher/subjects") {
    const subjectMap = new Map<
      string,
      { subject: string; semester: number; practicalCount: number }
    >();
    DEMO_PRACTICALS.forEach((p) => {
      const key = `${p.semester}-${p.subject}`;
      if (!subjectMap.has(key)) {
        subjectMap.set(key, {
          subject: p.subject,
          semester: p.semester,
          practicalCount: 1,
        });
      } else {
        subjectMap.get(key)!.practicalCount++;
      }
    });
    return Array.from(subjectMap.values()) as T;
  }

  // /teacher/classes
  if (cleanPath === "/teacher/classes") {
    const department = useAuth.getState().user?.department;
    return [...new Set(Object.values(DEMO_USERS)
      .filter((u) => u.role === "STUDENT" && u.department === department)
      .map((u) => u.classSection).filter(Boolean))].sort() as T;
  }

  // /teacher/students
  if (cleanPath === "/teacher/students") {
    const classSection = searchParams.get("classSection");
    const students = Array.from(
      new Map(
        Object.values(DEMO_USERS)
          .filter((u) => u.role === "STUDENT" && u.department === useAuth.getState().user?.department)
          .map((u) => [u.id, u]),
      ).values(),
    );
    if (classSection) {
      return students.filter((s) => s.classSection === classSection) as T;
    }
    return students as T;
  }

  // /submissions (student submit & student list)
  if (cleanPath === "/submissions") {
    if (method === "POST") {
      let body: any = {};
      try { body = JSON.parse((init.body as string) || "{}"); } catch {}
      const currentUser = useAuth.getState().user || DEMO_USERS["inzamam.khan.te.b@tcetmumbai.in"];
      const p = DEMO_PRACTICALS.find((item) => item.id === Number(body.practicalId));
      const subs = getMockSubmissions();
      const existingIdx = subs.findIndex(
        (s) => s.studentId === currentUser.id && s.practicalId === Number(body.practicalId),
      );
      const subRecord: StoredSubmission = {
        id: existingIdx >= 0 ? subs[existingIdx].id : Math.floor(Math.random() * 9000) + 1000,
        studentId: currentUser.id,
        studentName: currentUser.name,
        studentEmail: currentUser.email,
        rollNo: currentUser.rollNo || "13",
        classSection: currentUser.classSection || "TE-B",
        practicalId: Number(body.practicalId),
        practicalTitle: p?.title || "Practical Experiment",
        subject: p?.subject || "Machine Learning & Deep Learning",
        semester: p?.semester || 6,
        language: (body.language || "PYTHON").toUpperCase(),
        code: body.code || "",
        output: body.output || "",
        executionStatus: body.executionStatus || "SUCCESS",
        conclusionText: body.conclusionText || "Experiment verified successfully.",
        screenshots: body.screenshots || (existingIdx >= 0 ? subs[existingIdx].screenshots : []) || [],
        submittedAt: new Date().toISOString(),
        evaluated: existingIdx >= 0 ? subs[existingIdx].evaluated : false,
        totalMarks: existingIdx >= 0 ? subs[existingIdx].totalMarks : null,
        codeMarks: existingIdx >= 0 ? subs[existingIdx].codeMarks : null,
        vivaMarks: existingIdx >= 0 ? subs[existingIdx].vivaMarks : null,
        feedback: existingIdx >= 0 ? subs[existingIdx].feedback : null,
      };
      if (existingIdx >= 0) {
        subs[existingIdx] = subRecord;
      } else {
        subs.unshift(subRecord);
      }
      saveMockSubmissions(subs);
      return {
        id: subRecord.id,
        practicalId: subRecord.practicalId,
        practicalTitle: subRecord.practicalTitle,
        language: subRecord.language.toLowerCase(),
        submittedAt: subRecord.submittedAt,
        evaluated: subRecord.evaluated,
        totalMarks: subRecord.totalMarks,
        screenshots: subRecord.screenshots,
      } as T;
    }
    const currentUser = useAuth.getState().user;
    const subs = getMockSubmissions();
    const mine = currentUser ? subs.filter((s) => s.studentId === currentUser.id) : subs;
    return mine.map((s) => ({
      id: s.id,
      practicalId: s.practicalId,
      practicalTitle: s.practicalTitle,
      language: s.language.toLowerCase(),
      submittedAt: s.submittedAt,
      evaluated: s.evaluated,
      totalMarks: s.totalMarks,
      screenshots: s.screenshots || [],
    })) as T;
  }

  // /results or /submissions/results
  if (cleanPath === "/results" || cleanPath === "/submissions/results") {
    const currentUser = useAuth.getState().user;
    const subs = getMockSubmissions();
    const mine = (currentUser ? subs.filter((s) => s.studentId === currentUser.id || s.studentEmail.toLowerCase() === currentUser.email.toLowerCase() || (currentUser.email.toLowerCase().includes("inzamam") && s.studentEmail.toLowerCase().includes("inzamam"))) : subs).filter((s) => s.evaluated);
    return mine.map((s) => ({
      submissionId: s.id,
      practicalTitle: s.practicalTitle,
      marks: s.totalMarks,
      codeMarks: s.codeMarks,
      vivaMarks: s.vivaMarks,
      feedback: s.feedback,
      reviewedAt: s.submittedAt,
      facultyName: "Mr. Sameer Sawant",
      submittedAt: s.submittedAt,
      screenshots: s.screenshots || [],
      code: s.code,
      output: s.output,
      conclusionText: s.conclusionText,
    })) as T;
  }

  // /teacher/students/:id/submissions
  const studentSubsMatch = cleanPath.match(/^\/teacher\/students\/(\d+)\/submissions$/);
  if (studentSubsMatch) {
    const studentId = Number(studentSubsMatch[1]);
    const reqSubject = searchParams.get("subject")?.trim().toLowerCase();
    const reqSem = searchParams.get("semester");
    const subs = getMockSubmissions();
    const filtered = subs.filter((s) => {
      if (s.studentId !== studentId) return false;
      if (reqSubject && s.subject.trim().toLowerCase() !== reqSubject) return false;
      if (reqSem && s.semester !== Number(reqSem)) return false;
      return true;
    });
    return filtered.map((s) => ({
      id: s.id,
      practicalId: s.practicalId,
      practicalTitle: s.practicalTitle,
      language: s.language.toLowerCase(),
      submittedAt: s.submittedAt,
      evaluated: s.evaluated,
      totalMarks: s.totalMarks,
    })) as T;
  }

  // /teacher/submissions
  if (cleanPath === "/teacher/submissions") {
    const subs = getMockSubmissions();
    return subs.map((s) => ({
      id: s.id,
      studentId: s.studentId,
      studentName: s.studentName,
      studentEmail: s.studentEmail,
      rollNo: s.rollNo,
      classSection: s.classSection,
      practicalId: s.practicalId,
      practicalTitle: s.practicalTitle,
      language: s.language.toLowerCase(),
      executionStatus: s.executionStatus,
      submittedAt: s.submittedAt,
      evaluated: s.evaluated,
      totalMarks: s.totalMarks,
    })) as T;
  }

  // /teacher/dashboard
  if (cleanPath === "/teacher/dashboard") {
    const subs = getMockSubmissions();
    const pending = subs.filter((s) => !s.evaluated).length;
    return {
      activePracticals: DEMO_PRACTICALS.length,
      students: 7,
      pendingEvaluations: pending,
      vivaPending: pending,
      recentPracticals: DEMO_PRACTICALS.slice(0, 6).map((p) => ({
        id: p.id,
        title: p.title,
        status: p.status,
        students: 7,
        completed: subs.filter((s) => s.practicalId === p.id).length,
      })),
    } as T;
  }

  // /execution/run
  if (cleanPath === "/execution/run") {
    let body: any = {};
    try { body = JSON.parse((init.body as string) || "{}"); } catch {}
    const source = (body.source || "").toString();
    const lang = (body.language || "").toString().toLowerCase();
    const prints: string[] = [];
    const printRegex = lang.includes("java")
      ? /System\.out\.println\s*\(\s*(?:"([^"]*)"|([^)]+))\s*\)/g
      : /print\s*\(\s*(?:"([^"]*)"|([^)]+))\s*\)/g;
    let match;
    while ((match = printRegex.exec(source)) !== null) {
      prints.push(match[1] !== undefined ? match[1] : match[2].trim());
    }
    const stdout = prints.length > 0 ? prints.join("\n") + "\n" : "Program executed successfully.\n";
    return {
      status: "SUCCESS",
      stdout,
      stderr: "",
      compileError: "",
      runtimeError: "",
      executionTime: 25,
    } as T;
  }

  // /teacher/review/:id
  const reviewMatch = cleanPath.match(/^\/teacher\/review\/(\d+)$/);
  if (reviewMatch) {
    const subId = Number(reviewMatch[1]);
    const subs = getMockSubmissions();
    const sub = subs.find((s) => s.id === subId) || subs[0];
    const practical = DEMO_PRACTICALS.find((p) => p.id === sub.practicalId);
    const vivaQuestions = practical?.vivaQuestions || [
      { id: 1, practicalId: sub.practicalId, question: "Explain the algorithm methodology.", marks: 2, sortOrder: 1 },
      { id: 2, practicalId: sub.practicalId, question: "What are the observed execution results?", marks: 2, sortOrder: 2 },
    ];
    return {
      submission: {
        submission: {
          id: sub.id,
          studentId: sub.studentId,
          practicalId: sub.practicalId,
          language: sub.language,
          code: sub.code,
          output: sub.output,
          executionStatus: sub.executionStatus,
          submittedAt: sub.submittedAt,
          screenshots: sub.screenshots || [],
        },
        studentName: sub.studentName,
        studentEmail: sub.studentEmail,
        rollNo: sub.rollNo,
        classSection: sub.classSection,
        practicalTitle: sub.practicalTitle,
        conclusionText: sub.conclusionText,
        screenshots: sub.screenshots || [],
        evaluationId: sub.evaluated ? sub.id : null,
        codeMarks: sub.codeMarks,
        vivaMarks: sub.vivaMarks,
        totalMarks: sub.totalMarks,
        feedback: sub.feedback,
      },
      progress: { status: sub.evaluated ? "EVALUATED" : "SUBMITTED", currentStep: "CONCLUSION" },
      integrity: { TAB_SWITCH_ATTEMPT: 0, COPY_PASTE_ATTEMPT: 0 },
      vivaQuestions,
      evaluation: sub.evaluated
        ? {
            id: sub.id,
            submissionId: sub.id,
            codeMarks: sub.codeMarks ?? 0,
            vivaMarks: sub.vivaMarks ?? 0,
            totalMarks: sub.totalMarks ?? ((sub.codeMarks || 0) + (sub.vivaMarks || 0)),
            feedback: sub.feedback || "",
            evaluatedAt: new Date().toISOString(),
            viva: (sub.vivaEntries && sub.vivaEntries.length > 0)
              ? sub.vivaEntries
              : vivaQuestions.map((q) => ({
                  vivaQuestionId: q.id,
                  question: q.question,
                  maxMarks: q.marks,
                  awardedMarks: Math.min(q.marks, sub.vivaMarks ? Math.floor(sub.vivaMarks / Math.max(1, vivaQuestions.length)) : 0),
                  notes: "",
                })),
          }
        : null,
    } as T;
  }

  // /evaluations
  if (cleanPath === "/evaluations" && method === "POST") {
    let body: any = {};
    try { body = JSON.parse((init.body as string) || "{}"); } catch {}
    const subs = getMockSubmissions();
    const subId = Number(body.submissionId);
    let idx = subs.findIndex((s) => s.id === subId);
    if (idx === -1 && subs.length > 0) {
      idx = 0;
    }
    if (idx >= 0) {
      subs[idx].codeMarks = Number(body.codeMarks) || 0;
      subs[idx].feedback = body.feedback || "";
      if (body.entries && Array.isArray(body.entries)) {
        subs[idx].vivaEntries = body.entries;
        subs[idx].vivaMarks = body.entries.reduce((a: number, b: any) => a + (Number(b.awardedMarks) || 0), 0);
      }
      subs[idx].totalMarks = (subs[idx].codeMarks || 0) + (subs[idx].vivaMarks || 0);
      subs[idx].evaluated = true;
      saveMockSubmissions(subs);
    }
    return {
      id: idx >= 0 ? subs[idx].id : 1,
      submissionId: subId,
      codeMarks: idx >= 0 ? subs[idx].codeMarks : Number(body.codeMarks) || 0,
      vivaMarks: idx >= 0 ? subs[idx].vivaMarks : 0,
      totalMarks: idx >= 0 ? subs[idx].totalMarks : Number(body.codeMarks) || 0,
      feedback: idx >= 0 ? subs[idx].feedback : body.feedback || "",
      evaluatedAt: new Date().toISOString(),
      viva: idx >= 0 ? (subs[idx].vivaEntries || []) : [],
    } as T;
  }

  // /evaluations/viva
  if (cleanPath === "/evaluations/viva" && method === "POST") {
    let body: any = {};
    try { body = JSON.parse((init.body as string) || "{}"); } catch {}
    const subs = getMockSubmissions();
    const subId = Number(body.submissionId);
    let idx = subs.findIndex((s) => s.id === subId);
    if (idx === -1 && subs.length > 0) {
      idx = 0;
    }
    if (idx >= 0) {
      const entries = body.entries || [];
      subs[idx].vivaEntries = entries;
      const vivaSum = entries.reduce((acc: number, item: any) => acc + (Number(item.awardedMarks) || 0), 0);
      subs[idx].vivaMarks = vivaSum;
      subs[idx].totalMarks = (subs[idx].codeMarks || 0) + vivaSum;
      subs[idx].evaluated = true;
      saveMockSubmissions(subs);
    }
    return {
      id: idx >= 0 ? subs[idx].id : 1,
      submissionId: subId,
      codeMarks: idx >= 0 ? subs[idx].codeMarks : 0,
      vivaMarks: idx >= 0 ? subs[idx].vivaMarks : 0,
      totalMarks: idx >= 0 ? subs[idx].totalMarks : 0,
      feedback: idx >= 0 ? subs[idx].feedback : "",
      evaluatedAt: new Date().toISOString(),
      viva: idx >= 0 ? (subs[idx].vivaEntries || []) : [],
    } as T;
  }

  // /viva/:id
  const vivaMatch = cleanPath.match(/^\/viva\/(\d+)$/);
  if (vivaMatch) {
    const id = Number(vivaMatch[1]);
    const p = DEMO_PRACTICALS.find((item) => item.id === id);
    return (p?.vivaQuestions || []) as T;
  }

  // /admin/analytics
  if (cleanPath === "/admin/analytics") {
    return {
      totalDepartments: 4,
      totalClasses: 8,
      totalStudents: 32,
      totalFaculty: 6,
      totalPracticals: 14,
      totalAssignments: 18,
      totalSubmissions: 28,
      pendingReviews: 5,
      departmentSubmissions: [
        { label: "Computer Engineering", submissions: 18 },
        { label: "Information Technology", submissions: 6 },
        { label: "Artificial Intelligence & ML", submissions: 4 },
      ],
      classSubmissions: [
        { label: "Computer Engineering · SE-B", submissions: 12 },
        { label: "Computer Engineering · SE-A", submissions: 6 },
        { label: "Computer Engineering · TE-A", submissions: 5 },
        { label: "Information Technology · TE-B", submissions: 5 },
      ],
      facultyAssignments: [
        {
          faculty: "Mr. Sameer Sawant",
          department: "Computer Engineering",
          classSection: "SE-B",
          practical: "Array Operations",
          students: 6,
          submissions: 5,
          pending: 1,
          reviewed: 4,
        },
        {
          faculty: "Mr. Sameer Sawant",
          department: "Computer Engineering",
          classSection: "SE-B",
          practical: "Searching Algorithms",
          students: 6,
          submissions: 4,
          pending: 1,
          reviewed: 3,
        },
        {
          faculty: "Prof. Rashmi Thakur",
          department: "Information Technology",
          classSection: "TE-B",
          practical: "Web Development Lab",
          students: 8,
          submissions: 6,
          pending: 2,
          reviewed: 4,
        },
      ],
      departments: ["Computer Engineering", "Information Technology", "Artificial Intelligence & Data Science", "Artificial Intelligence & ML"],
      years: ["FE", "SE", "TE", "BE"],
      divisions: ["A", "B", "C"],
      subjects: ["Data Structures & Algorithms", "Data Structures", "Introduction to Intelligent Systems", "Database Management Systems"],
      faculty: [
        { id: 2, name: "Mr. Sameer Sawant" },
        { id: 3, name: "Prof. Rashmi Thakur" },
        { id: 4, name: "Prof. Rajesh Patel" },
      ],
      practicals: [
        { id: 101, name: "Array Operations" },
        { id: 102, name: "Searching Algorithms" },
        { id: 103, name: "Sorting Algorithms" },
      ],
    } as T;
  }

  // /admin/languages or /languages
  if (cleanPath === "/admin/languages" || cleanPath === "/languages") {
    return [
      { id: 1, name: "Java", code: "JAVA", runtimeVersion: "17.x", enabled: true },
      { id: 2, name: "Python", code: "PYTHON", runtimeVersion: "3.x", enabled: true },
    ] as T;
  }

  // /practicals/parse-document
  if (cleanPath === "/practicals/parse-document") {
    return {
      title: "Binary Search Tree Operations & Traversals",
      subject: "Data Structures",
      semester: 3,
      experimentNumber: 3,
      description: "Experiment extracted via Optical Character Recognition (OCR) engine.",
      aim: "Implement Binary Search Tree (BST) operations including insertion, deletion, and in-order, pre-order, post-order traversals.",
      theory: "A Binary Search Tree is a node-based binary tree data structure with the property that the key in each node is greater than all keys in its left subtree and less than all keys in its right subtree.",
      algorithm: "1. Create node structure with key, left, and right pointers.\n2. Implement insert(root, key).\n3. Implement inOrder(root) recursive traversal.\n4. Demonstrate search(root, key).\n5. Return results.",
      codeInstructions: "Write a complete program in Java or Python implementing BST insertion and traversals with sample test inputs.",
      conclusion: "BST traversal algorithms successfully demonstrated with logarithmic average-case search complexity O(log n).",
      programmingLanguage: "JAVA",
      sourcePdfPath: "/api/practicals/source-pdf/demo-extracted.pdf",
      sourcePdfName: "BST_Laboratory_Manual.pdf",
      ocrApplied: true,
      ocrMessage: "Optical Character Recognition (OCR) extracted and synthesized structured experiment data.",
      javaStarterCode: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write BST solution\n    }\n}",
      pythonStarterCode: "def main():\n    # Write BST solution\n    pass\n\nif __name__ == '__main__':\n    main()\n",
      practiceQuestions: [
        "Explain the time complexity differences between balanced and degenerate BSTs.",
        "How does in-order traversal of a BST produce elements in sorted order?",
      ],
      vivaQuestions: [
        "What is the worst-case time complexity of searching in an unbalanced BST?",
        "How is node deletion handled when the node has two children?",
      ],
    } as T;
  }

  return null;
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = useAuth.getState().token;
  const multipart =
    typeof FormData !== "undefined" && init.body instanceof FormData;

  try {
    const response = await fetch(`${API}/api${path}`, {
      ...init,
      headers: {
        ...(!multipart ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    });

    if (!response.ok) {
      // If 404 or backend error on a demo/mock path, try fallback
      const mock = demoMocksEnabled ? getMockResponse<T>(path, init) : null;
      if (mock !== null) {
        return mock;
      }

      let message = `Request failed (${response.status})`;
      try {
        const text = await response.text();
        if (text && text.trim()) {
          try {
            const body = JSON.parse(text);
            message = body.message || message;
          } catch {
            message = text;
          }
        }
      } catch {
        // Keep the HTTP status message when the server does not return JSON.
      }
      if (response.status === 401 && token) {
        useAuth.getState().clear();
      }
      throw new Error(message);
    }

    if (response.status === 204) return undefined as T;
    const text = await response.text();
    if (!text || text.trim() === "") {
      return undefined as T;
    }
    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  } catch (err) {
    // Backend offline / network error / Failed to fetch
    const mock = demoMocksEnabled ? getMockResponse<T>(path, init) : null;
    if (mock !== null) {
      return mock;
    }
    if (demoMocksEnabled) {
      if (path.includes("/publish") || path.includes("/assign")) {
        return { success: true } as unknown as T;
      }
    }
    throw err;
  }
}
