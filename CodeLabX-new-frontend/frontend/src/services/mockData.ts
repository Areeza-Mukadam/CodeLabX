import type { AcademicSubject, Detail, User } from "../types";

export const DEMO_PASSWORD = "CodeLabX123!";

export const DEMO_USERS: Record<string, User> = {
  // Students
  "student@tcetmumbai.in": {
    id: 1,
    name: "Areeza Mukadam",
    email: "student@tcetmumbai.in",
    role: "STUDENT",
    classSection: "SE-B",
    division: "B",
    cohort: "SE",
    department: "Computer Engineering",
    rollNo: "SE-B-42",
  },
  "student2@tcetmumbai.in": {
    id: 2,
    name: "Sagar Mishra",
    email: "student2@tcetmumbai.in",
    role: "STUDENT",
    classSection: "TE-A",
    division: "A",
    cohort: "TE",
    department: "Computer Engineering",
    rollNo: "TE-A-18",
  },
  "rahul.verma.se.b@tcetmumbai.in": {
    id: 3,
    name: "Rahul Verma",
    email: "rahul.verma.se.b@tcetmumbai.in",
    role: "STUDENT",
    classSection: "SE-B",
    division: "B",
    cohort: "SE",
    department: "Computer Engineering",
    rollNo: "SE-B-23",
  },
  "tanvi.patil.se.b@tcetmumbai.in": {
    id: 4,
    name: "Tanvi Patil",
    email: "tanvi.patil.se.b@tcetmumbai.in",
    role: "STUDENT",
    classSection: "SE-B",
    division: "B",
    cohort: "SE",
    department: "Computer Engineering",
    rollNo: "SE-B-55",
  },
  "aarav.mehta.se.a@tcetmumbai.in": {
    id: 5,
    name: "Aarav Mehta",
    email: "aarav.mehta.se.a@tcetmumbai.in",
    role: "STUDENT",
    classSection: "SE-A",
    division: "A",
    cohort: "SE",
    department: "Computer Engineering",
    rollNo: "SE-A-12",
  },
  "sneha.deshmukh.te.a@tcetmumbai.in": {
    id: 6,
    name: "Sneha Deshmukh",
    email: "sneha.deshmukh.te.a@tcetmumbai.in",
    role: "STUDENT",
    classSection: "TE-A",
    division: "A",
    cohort: "TE",
    department: "Computer Engineering",
    rollNo: "TE-A-34",
  },

  // Faculty
  "teacher@tcetmumbai.in": {
    id: 101,
    name: "Prof. Samir Sawant",
    email: "teacher@tcetmumbai.in",
    role: "TEACHER",
    department: "Computer Engineering",
  },
  "faculty.it@tcetmumbai.in": {
    id: 102,
    name: "Prof. Rashmi Thakur",
    email: "faculty.it@tcetmumbai.in",
    role: "TEACHER",
    department: "Information Technology",
  },
  "faculty.aiml@tcetmumbai.in": {
    id: 103,
    name: "Prof. Rajesh Patel",
    email: "faculty.aiml@tcetmumbai.in",
    role: "TEACHER",
    department: "Artificial Intelligence",
  },

  // Admin
  "admin@tcetmumbai.in": {
    id: 201,
    name: "CodeLabX Administrator",
    email: "admin@tcetmumbai.in",
    role: "ADMIN",
    department: "Administration",
  },
  "admin.exam@tcetmumbai.in": {
    id: 202,
    name: "TCET Exam Cell Admin",
    email: "admin.exam@tcetmumbai.in",
    role: "ADMIN",
    department: "Examination Cell",
  },
};

export const DEMO_SUBJECTS: AcademicSubject[] = [
  { code: "DSA", name: "Data Structures & Algorithms", semester: 1 },
  { code: "DS", name: "Data Structures", semester: 3 },
  { code: "IIS", name: "Introduction to Intelligent Systems", semester: 5 },
];

export const DEMO_PRACTICALS: Detail[] = [
  {
    id: 1,
    title: "Array Operations",
    subject: "Data Structures & Algorithms",
    semester: 1,
    description: "Traverse and update a one-dimensional array.",
    status: "PUBLISHED",
    updatedAt: "2026-09-15T10:00:00Z",
    assignedCount: 6,
    completedCount: 5,
    progressPercent: 100,
    progressStatus: "EVALUATED",
    aim: "Implement common operations on a fixed-size integer array.",
    theory:
      "An array stores elements of the same type in contiguous indexed positions. Access by index is constant time, while insertion or deletion in the middle requires shifting elements.",
    algorithm:
      "1. Read n and n integer values.\n2. Read the target value.\n3. Traverse the array from index 0 to n - 1.\n4. Print each matching index, or report that the value is absent.",
    codeInstructions:
      "Write a program that reads an integer array and a target value, then prints all matching positions. Use zero-based indices.",
    conclusion:
      "Explain how the number of inspected elements changes as the array grows. Mention one edge case you tested.",
    javaStarterCode:
      "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner input = new Scanner(System.in);\n        // Write your solution\n    }\n}",
    pythonStarterCode:
      "def main():\n    # Write your solution\n    pass\n\nif __name__ == '__main__':\n    main()\n",
    practiceQuestions: [
      {
        id: 1,
        question:
          "What is the time complexity of accessing an array element by index?",
        order: 1,
      },
      {
        id: 2,
        question: "What should your program do when the array is empty?",
        order: 2,
      },
    ],
    vivaQuestions: [
      {
        id: 1,
        question: "Why is array access by index constant time?",
        marks: 2,
        order: 1,
      },
      {
        id: 2,
        question: "What is the cost of inserting at the beginning of an array?",
        marks: 2,
        order: 2,
      },
    ],
  },
  {
    id: 2,
    title: "Searching Algorithms",
    subject: "Data Structures & Algorithms",
    semester: 1,
    description: "Compare linear search with binary search.",
    status: "PUBLISHED",
    updatedAt: "2026-09-18T10:00:00Z",
    assignedCount: 6,
    completedCount: 4,
    progressPercent: 80,
    progressStatus: "IN_PROGRESS",
    aim: "Implement a search and reason about when sorted input is required.",
    theory:
      "Linear search checks items one by one and works on unsorted data. Binary search repeatedly halves a sorted search interval, giving logarithmic comparisons.",
    algorithm:
      "1. Set low = 0 and high = n - 1.\n2. While low <= high, compute mid.\n3. Compare the middle value with the target.\n4. Narrow the interval to the half that may contain the target.\n5. Return the index or -1.",
    codeInstructions:
      "Implement iterative binary search for a sorted integer array. Print the matching index, or -1 if the target is absent.",
    conclusion:
      "State why the input must be sorted for binary search and compare its worst-case complexity with linear search.",
    javaStarterCode:
      "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Iterative binary search\n    }\n}",
    pythonStarterCode:
      "def binary_search(arr, target):\n    # Implement here\n    return -1\n",
    practiceQuestions: [
      {
        id: 3,
        question: "What condition makes binary search valid?",
        order: 1,
      },
      {
        id: 4,
        question:
          "How many elements remain after each binary-search iteration?",
        order: 2,
      },
    ],
    vivaQuestions: [
      {
        id: 3,
        question: "What is binary search's worst-case time complexity?",
        marks: 2,
        order: 1,
      },
      {
        id: 4,
        question: "How would you avoid overflow when calculating mid?",
        marks: 2,
        order: 2,
      },
    ],
  },
  {
    id: 3,
    title: "Sorting Algorithms",
    subject: "Data Structures & Algorithms",
    semester: 1,
    description: "Sort a list using insertion sort.",
    status: "PUBLISHED",
    updatedAt: "2026-09-22T10:00:00Z",
    assignedCount: 6,
    completedCount: 3,
    progressPercent: 50,
    progressStatus: "IN_PROGRESS",
    aim: "Build a sorted sequence by inserting each next value into place.",
    theory:
      "Insertion sort grows a sorted prefix. For each new value, larger items in the prefix shift right until the correct position is found.",
    algorithm:
      "1. Start from the second element.\n2. Store the current value as key.\n3. Shift larger values one position to the right.\n4. Insert key into the gap.\n5. Repeat to the end of the array.",
    codeInstructions:
      "Read n integers, sort them in ascending order using insertion sort, and print the resulting sequence.",
    conclusion:
      "Describe what happens on already sorted input and give the algorithm's best- and worst-case time complexity.",
    javaStarterCode:
      "public class Main {\n    public static void main(String[] args) {\n        // Insertion sort\n    }\n}",
    pythonStarterCode:
      "def insertion_sort(arr):\n    # Insertion sort\n    pass\n",
    practiceQuestions: [
      {
        id: 5,
        question: "Why do we begin at index 1?",
        order: 1,
      },
    ],
    vivaQuestions: [
      {
        id: 5,
        question: "Is insertion sort stable? Explain briefly.",
        marks: 2,
        order: 1,
      },
    ],
  },
  {
    id: 101,
    title: "Experiment 1A: Java data types and operators",
    subject: "Data Structures",
    semester: 3,
    description: "Build a Java program demonstrating data types and operators.",
    status: "PUBLISHED",
    updatedAt: "2026-09-25T11:00:00Z",
    assignedCount: 6,
    completedCount: 4,
    progressPercent: 70,
    progressStatus: "IN_PROGRESS",
    aim: "Practice declaring Java data types and applying operators.",
    theory:
      "Explore primitive and reference types, variable declarations, arithmetic, relational, logical, assignment, and unary operators.",
    algorithm:
      "Create variables of suitable types; read or define sample values; apply operators; print each result.",
    codeInstructions:
      "Write a Java program that demonstrates representative data types and operators with clearly labeled output.",
    conclusion:
      "Summarize how data types and operators affect the values and results in a Java program.",
    javaStarterCode:
      "public class Main {\n    public static void main(String[] args) {\n        // Implement data types demo\n    }\n}",
    pythonStarterCode:
      "def main():\n    pass\nif __name__ == '__main__':\n    main()\n",
    practiceQuestions: [
      {
        id: 101,
        question: "Name 8 primitive data types in Java.",
        order: 1,
      },
    ],
    vivaQuestions: [
      {
        id: 101,
        question: "What is difference between float and double?",
        marks: 2,
        order: 1,
      },
    ],
  },
  {
    id: 102,
    title: "Experiment 2: Stack using an array",
    subject: "Data Structures",
    semester: 3,
    description: "Build a menu-driven stack using an array.",
    status: "PUBLISHED",
    updatedAt: "2026-09-28T11:00:00Z",
    assignedCount: 6,
    completedCount: 5,
    progressPercent: 90,
    progressStatus: "SUBMITTED",
    aim: "Implement push, pop, peek, and display operations.",
    theory:
      "A stack follows last-in, first-out order. A top index tracks the most recently inserted element.",
    algorithm:
      "Initialize top to -1; push after checking capacity; pop after checking emptiness; peek at top; display from top downward.",
    codeInstructions:
      "Implement a menu-driven integer stack using an array, including overflow and underflow handling.",
    conclusion:
      "Describe LIFO behavior and the conditions that cause stack overflow or underflow.",
    javaStarterCode:
      "public class Main {\n    public static void main(String[] args) {\n        // Stack implementation\n    }\n}",
    pythonStarterCode:
      "class Stack:\n    def __init__(self):\n        self.items = []\n",
    practiceQuestions: [
      {
        id: 102,
        question: "State applications of stack in system design.",
        order: 1,
      },
    ],
    vivaQuestions: [
      {
        id: 102,
        question: "How do you detect stack overflow?",
        marks: 2,
        order: 1,
      },
    ],
  },
  {
    id: 201,
    title: "Experiment 01A: Built-in API and Gemini API web app",
    subject: "Introduction to Intelligent Systems",
    semester: 5,
    description: "Integrate an API into a web page with Python Flask.",
    status: "PUBLISHED",
    updatedAt: "2026-10-01T12:00:00Z",
    assignedCount: 6,
    completedCount: 2,
    progressPercent: 40,
    progressStatus: "IN_PROGRESS",
    aim: "Integrate a built-in/API service into a web page and display its response.",
    theory:
      "Integrate browser built-in APIs and AI APIs such as Gemini to create interactive intelligent applications.",
    algorithm:
      "1. Setup Flask server.\n2. Configure API client.\n3. Implement endpoint.\n4. Create frontend UI.",
    codeInstructions:
      "Build and demonstrate the Flask-to-Gemini request and response flow.",
    conclusion:
      "Explain how a browser page sends a prompt to a Flask route and displays the returned response.",
    javaStarterCode:
      "public class Main {\n    public static void main(String[] args) {\n        // API Integration\n    }\n}",
    pythonStarterCode:
      "import os\n\ndef call_api(prompt):\n    return f'Echo: {prompt}'\n",
    practiceQuestions: [
      {
        id: 201,
        question: "Why should API keys not be stored client-side?",
        order: 1,
      },
    ],
    vivaQuestions: [
      {
        id: 201,
        question: "What are browser built-in APIs?",
        marks: 2,
        order: 1,
      },
    ],
  },
];
