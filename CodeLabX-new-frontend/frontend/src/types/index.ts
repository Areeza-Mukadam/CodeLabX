export type User = {
  id: number;
  name: string;
  email: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  classSection?: string | null;
  division?: string | null;
  cohort?: string | null;
  department?: string | null;
  rollNo?: string | null;
};

export type Practical = {
  id: number;
  title: string;
  subject: string;
  semester: number;
  description: string;
  status: string;
  updatedAt: string;
  assignedCount?: number;
  completedCount?: number;
  progressPercent?: number;
  progressStatus?: string;
};

export type AcademicSubject = {
  code: string;
  name: string;
  semester: number;
};

export type Detail = Practical & {
  aim: string;
  theory: string;
  algorithm: string;
  codeInstructions: string;
  conclusion: string;
  javaStarterCode: string;
  pythonStarterCode: string;
  practiceQuestions: { id: number; question: string; order: number }[];
  vivaQuestions: {
    id: number;
    question: string;
    marks: number;
    order: number;
  }[];
  assignedStudentIds?: number[];
};

export type Progress = {
  practicalId: number;
  currentStep: string;
  completedSteps: string[];
  status: string;
  percent: number;
  practiceAnswers: Record<string, string>;
  conclusionText: string;
  draftCode: string;
  draftLanguage: string;
};

export const steps = [
  ["AIM", "Aim"],
  ["THEORY", "Theory"],
  ["ALGORITHM", "Algorithm"],
  ["PRACTICE", "Practice"],
  ["CODE", "Code"],
  ["CONCLUSION", "Conclusion"],
] as const;
