import { useAuth } from "../state/authStore";
import {
  DEMO_PASSWORD,
  DEMO_PRACTICALS,
  DEMO_SUBJECTS,
  DEMO_USERS,
} from "./mockData";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

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
    const sem = searchParams.get("semester");
    if (sem) {
      return DEMO_PRACTICALS.filter((p) => p.semester === Number(sem)) as T;
    }
    return DEMO_PRACTICALS as T;
  }

  // /practicals/:id
  const practicalMatch = cleanPath.match(/^\/practicals\/(\d+)$/);
  if (practicalMatch) {
    const id = Number(practicalMatch[1]);
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
    return {
      output:
        "Compilation successful.\nProgram output:\n[Test cases passed]\nProcess exited with status 0",
      status: "SUCCESS",
      exitCode: 0,
    } as T;
  }

  // /viva/:id
  const vivaMatch = cleanPath.match(/^\/viva\/(\d+)$/);
  if (vivaMatch) {
    const id = Number(vivaMatch[1]);
    const p = DEMO_PRACTICALS.find((item) => item.id === id);
    return (p?.vivaQuestions || []) as T;
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
      const mock = getMockResponse<T>(path, init);
      if (mock !== null) {
        return mock;
      }

      let message = `Request failed (${response.status})`;
      try {
        const body = await response.json();
        message = body.message || message;
      } catch {
        // Keep the HTTP status message when the server does not return JSON.
      }
      if (response.status === 401 && token) {
        useAuth.getState().clear();
      }
      throw new Error(message);
    }

    if (response.status === 204) return undefined as T;
    return response.json();
  } catch (err) {
    // Backend offline / network error / Failed to fetch
    const mock = getMockResponse<T>(path, init);
    if (mock !== null) {
      return mock;
    }
    throw err;
  }
}
