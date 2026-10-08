import { useAuth } from "../state/authStore";
import {
  DEMO_PASSWORD,
  DEMO_PRACTICALS,
  DEMO_SUBJECTS,
  DEMO_USERS,
} from "./mockData";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
const demoMocksEnabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_MOCK_DATA === "true";

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
    const sem = searchParams.get("semester");
    if (sem) {
      return DEMO_PRACTICALS.filter((p) => p.semester === Number(sem)) as T;
    }
    return DEMO_PRACTICALS as T;
  }

  // /practicals/students
  if (cleanPath === "/practicals/students") {
    return Object.values(DEMO_USERS).filter((u) => u.role === "STUDENT") as T;
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
    const found =
      DEMO_PRACTICALS.find((p) => p.id === id) || DEMO_PRACTICALS[0];
    return found as T;
  }

  // /practicals/:id/progress
  const progressMatch = cleanPath.match(/^\/practicals\/(\d+)\/progress$/);
  if (progressMatch) {
    const id = Number(progressMatch[1]);
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
    } as T;
  }

  // /students/classmates
  if (cleanPath === "/students/classmates") {
    return Object.values(DEMO_USERS).filter((u) => u.role === "STUDENT") as T;
  }

  // /teacher/subjects
  if (cleanPath === "/teacher/subjects") {
    return [
      { subject: "Data Structures", semester: 3, practicalCount: 12 },
      {
        subject: "Introduction to Intelligent Systems",
        semester: 5,
        practicalCount: 5,
      },
      {
        subject: "Data Structures & Algorithms",
        semester: 1,
        practicalCount: 3,
      },
    ] as T;
  }

  // /teacher/classes
  if (cleanPath === "/teacher/classes") {
    return ["SE-B", "SE-A", "TE-A"] as T;
  }

  // /teacher/students
  if (cleanPath === "/teacher/students") {
    const classSection = searchParams.get("classSection");
    const students = Object.values(DEMO_USERS).filter(
      (u) => u.role === "STUDENT",
    );
    if (classSection) {
      return students.filter((s) => s.classSection === classSection) as T;
    }
    return students as T;
  }

  // /teacher/students/:id/submissions or /teacher/submissions
  if (cleanPath.includes("/submissions")) {
    return [
      {
        id: 1,
        practicalId: 101,
        practicalTitle: "Experiment 1A: Java data types and operators",
        language: "java",
        submittedAt: new Date().toISOString(),
        evaluated: true,
        totalMarks: 10,
      },
    ] as T;
  }

  // /teacher/dashboard
  if (cleanPath === "/teacher/dashboard") {
    return {
      activePracticals: 20,
      students: 6,
      pendingEvaluations: 2,
      vivaPending: 1,
      recentPracticals: [
        {
          id: 101,
          title: "Experiment 1A: Java data types and operators",
          status: "PUBLISHED",
          students: 6,
          completed: 4,
        },
        {
          id: 102,
          title: "Experiment 2: Stack using an array",
          status: "PUBLISHED",
          students: 6,
          completed: 5,
        },
      ],
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
    return {
      submission: {
        submission: {
          id: subId,
          studentId: 1,
          practicalId: 1,
          language: "JAVA",
          code: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Solution\n        System.out.println(\"7\");\n    }\n}",
          output: "7\n",
          executionStatus: "SUCCESS",
          submittedAt: new Date().toISOString(),
        },
        studentName: "Areeza Mukadam",
        studentEmail: "student@tcetmumbai.in",
        rollNo: "SE-B-42",
        classSection: "SE-B",
        practicalTitle: "EXPERIMENT NO. 8",
        conclusionText: "Successfully executed experiment.",
        evaluationId: null,
        codeMarks: null,
        vivaMarks: null,
        totalMarks: null,
        feedback: null,
      },
      progress: { status: "SUBMITTED", currentStep: "CONCLUSION" },
      integrity: {},
      vivaQuestions: [
        { id: 1, practicalId: 1, question: "What is the time complexity of the algorithm?", marks: 2, sortOrder: 1 },
        { id: 2, practicalId: 1, question: "How are boundary conditions handled?", marks: 2, sortOrder: 2 },
      ],
      evaluation: null,
    } as T;
  }

  // /evaluations
  if (cleanPath === "/evaluations" && method === "POST") {
    return { success: true } as T;
  }

  // /evaluations/viva
  if (cleanPath === "/evaluations/viva" && method === "POST") {
    return { success: true } as T;
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
          faculty: "Prof. Samir Sawant",
          department: "Computer Engineering",
          classSection: "SE-B",
          practical: "Array Operations",
          students: 6,
          submissions: 5,
          pending: 1,
          reviewed: 4,
        },
        {
          faculty: "Prof. Samir Sawant",
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
        { id: 2, name: "Prof. Samir Sawant" },
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
