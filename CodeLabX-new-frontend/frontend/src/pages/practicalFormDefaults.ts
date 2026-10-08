import type { Detail } from "../types";

export const blankForm: Detail = {
  id: 0,
  title: "",
  subject: "Programming Fundamentals",
  semester: 1,
  description: "",
  aim: "",
  theory: "",
  algorithm: "",
  codeInstructions: "",
  conclusion: "",
  javaStarterCode:
    "public class Main {\n    public static void main(String[] args) {\n        // Write your solution\n    }\n}",
  pythonStarterCode:
    'def main():\n    # Write your solution\n    pass\n\nif __name__ == "__main__":\n    main()',
  status: "DRAFT",
  updatedAt: "",
  practiceQuestions: [],
  vivaQuestions: [],
  assignedStudentIds: [],
};
