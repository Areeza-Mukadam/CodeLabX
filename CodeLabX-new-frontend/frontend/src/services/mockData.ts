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
  "rohan.sharma.se.b@tcetmumbai.in": {
    id: 7,
    name: "Rohan Sharma",
    email: "rohan.sharma.se.b@tcetmumbai.in",
    role: "STUDENT",
    classSection: "SE-B",
    division: "B",
    cohort: "SE",
    department: "Information Technology",
    rollNo: "SE-IT-01",
  },
  "neha.kulkarni.te.b@tcetmumbai.in": {
    id: 8,
    name: "Neha Kulkarni",
    email: "neha.kulkarni.te.b@tcetmumbai.in",
    role: "STUDENT",
    classSection: "TE-B",
    division: "B",
    cohort: "TE",
    department: "Information Technology",
    rollNo: "TE-IT-02",
  },
  "priya.shah.se.b@tcetmumbai.in": {
    id: 9,
    name: "Priya Shah",
    email: "priya.shah.se.b@tcetmumbai.in",
    role: "STUDENT",
    classSection: "SE-B",
    division: "B",
    cohort: "SE",
    department: "Artificial Intelligence & Machine Learning",
    rollNo: "SE-AIML-01",
  },
  "aditya.joshi.te.a@tcetmumbai.in": {
    id: 10,
    name: "Aditya Joshi",
    email: "aditya.joshi.te.a@tcetmumbai.in",
    role: "STUDENT",
    classSection: "TE-B",
    division: "B",
    cohort: "TE",
    department: "Computer Engineering",
    rollNo: "TE-AIML-02",
  },
  "inzamam.khan.te.b@tcetmumbai.in": {
    id: 11,
    name: "Inzamam Khan",
    email: "inzamam.khan.te.b@tcetmumbai.in",
    role: "STUDENT",
    classSection: "TE-B",
    division: "B",
    cohort: "TE",
    department: "Computer Engineering",
    rollNo: "13",
  },
  "inzamam@tcetmumbai.in": {
    id: 11,
    name: "Inzamam Khan",
    email: "inzamam@tcetmumbai.in",
    role: "STUDENT",
    classSection: "TE-B",
    division: "B",
    cohort: "TE",
    department: "Computer Engineering",
    rollNo: "13",
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
  {
    "semester": 1,
    "code": "EM-I",
    "name": "Engineering Mathematics - I"
  },
  {
    "semester": 1,
    "code": "APSD",
    "name": "Applied Physics & Semiconductor Devices"
  },
  {
    "semester": 1,
    "code": "SPC",
    "name": "Structured Programming in C"
  },
  {
    "semester": 1,
    "code": "BEE",
    "name": "Basic Electrical & Electronics Engineering"
  },
  {
    "semester": 1,
    "code": "EWDF",
    "name": "Engineering Workshop & Digital Fabrication"
  },
  {
    "semester": 2,
    "code": "EM-II",
    "name": "Engineering Mathematics - II"
  },
  {
    "semester": 2,
    "code": "ACMS",
    "name": "Applied Chemistry & Material Science"
  },
  {
    "semester": 2,
    "code": "OOP-CPP",
    "name": "Object-Oriented Programming with C++"
  },
  {
    "semester": 2,
    "code": "EMD",
    "name": "Engineering Mechanics & Dynamics"
  },
  {
    "semester": 2,
    "code": "PCSS",
    "name": "Professional Communication & Soft Skills"
  },
  {
    "semester": 3,
    "code": "DS",
    "name": "Data Structures"
  },
  {
    "semester": 3,
    "code": "DSGT",
    "name": "Discrete Structures & Graph Theory"
  },
  {
    "semester": 3,
    "code": "DLCA",
    "name": "Digital Logic & Computer Architecture"
  },
  {
    "semester": 3,
    "code": "CGV",
    "name": "Computer Graphics & Visualization"
  },
  {
    "semester": 3,
    "code": "OOP-JAVA",
    "name": "Object Oriented Programming with Java"
  },
  {
    "semester": 4,
    "code": "DAA",
    "name": "Design and Analysis of Algorithms"
  },
  {
    "semester": 4,
    "code": "DBMS",
    "name": "Database Management Systems"
  },
  {
    "semester": 4,
    "code": "OS",
    "name": "Operating Systems"
  },
  {
    "semester": 4,
    "code": "MPMC",
    "name": "Microprocessors and Microcontrollers"
  },
  {
    "semester": 4,
    "code": "PDS",
    "name": "Python for Data Science"
  },
  {
    "semester": 5,
    "code": "CNS",
    "name": "Computer Networks & Security"
  },
  {
    "semester": 5,
    "code": "IIS",
    "name": "Introduction to Intelligent Systems"
  },
  {
    "semester": 5,
    "code": "SEAM",
    "name": "Software Engineering & Agile Methodology"
  },
  {
    "semester": 5,
    "code": "WDT",
    "name": "Web Development Technologies"
  },
  {
    "semester": 5,
    "code": "TCS",
    "name": "Theory of Computer Science"
  },
  {
    "semester": 6,
    "code": "CCDS",
    "name": "Cloud Computing & Distributed Systems"
  },
  {
    "semester": 6,
    "code": "MLDL",
    "name": "Machine Learning & Deep Learning"
  },
  {
    "semester": 6,
    "code": "CND",
    "name": "Cryptography & Network Defense"
  },
  {
    "semester": 6,
    "code": "SPCC",
    "name": "System Programming & Compiler Construction"
  },
  {
    "semester": 6,
    "code": "MAD",
    "name": "Mobile Application Development"
  },
  {
    "semester": 7,
    "code": "BDA",
    "name": "Big Data Analytics"
  },
  {
    "semester": 7,
    "code": "AIR",
    "name": "Artificial Intelligence & Robotics"
  },
  {
    "semester": 7,
    "code": "BSC",
    "name": "Blockchain & Smart Contracts"
  },
  {
    "semester": 7,
    "code": "NLP",
    "name": "Natural Language Processing"
  },
  {
    "semester": 7,
    "code": "DSRE",
    "name": "DevOps & Site Reliability Engineering"
  },
  {
    "semester": 8,
    "code": "CFIR",
    "name": "Cyber Forensics & Incident Response"
  },
  {
    "semester": 8,
    "code": "HPC",
    "name": "High Performance Computing"
  },
  {
    "semester": 8,
    "code": "IOTEA",
    "name": "Internet of Things & Edge AI"
  },
  {
    "semester": 8,
    "code": "QCI",
    "name": "Quantum Computing & Information"
  },
  {
    "semester": 8,
    "code": "CMP",
    "name": "Capstone Major Project Phase-II"
  }
];

export const DEMO_PRACTICALS: Detail[] = [
  {
    "id": 101,
    "title": "Matrix Inversion & System of Linear Equations",
    "subject": "Engineering Mathematics - I",
    "semester": 1,
    "experimentNumber": 1,
    "description": "Calculate rank and inverse of matrices to solve linear systems.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Implement matrix operations to solve Ax = B using Gaussian elimination and matrix inversion.",
    "theory": "Linear algebra forms the backbone of machine learning and 3D computer graphics. A system Ax=B has a unique solution if det(A) != 0.",
    "algorithm": "1. Represent matrix in 2D array.\n2. Compute determinant and check invertibility.\n3. Apply row transformations.\n4. Output solution vector x.",
    "codeInstructions": "Write a program that takes matrix dimension N and values for A and B, then outputs vector x.",
    "conclusion": "Demonstrated matrix inversion and Gauss elimination with O(N^3) polynomial time complexity.",
    "javaStarterCode": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\"=== Matrix Operations Lab ===\");\n        double[][] a = {{2, 1}, {5, 7}};\n        double det = a[0][0]*a[1][1] - a[0][1]*a[1][0];\n        System.out.println(\"Determinant: \" + det);\n        System.out.println(\"Matrix is \" + (det != 0 ? \"Invertible\" : \"Singular\"));\n    }\n}",
    "pythonStarterCode": "def main():\n    print(\"=== Matrix Operations Lab ===\")\n    a = [[2, 1], [5, 7]]\n    det = a[0][0]*a[1][1] - a[0][1]*a[1][0]\n    print(f\"Determinant: {det}\")\n    print(f\"Matrix is {'Invertible' if det != 0 else 'Singular'}\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 1011,
        "question": "Explain condition for matrix invertibility.",
        "order": 1
      },
      {
        "id": 1012,
        "question": "How does rank relate to solution uniqueness?",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 1011,
        "question": "What is time complexity of Gauss Jordan elimination?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 1012,
        "question": "What is condition number of a matrix?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 102,
    "title": "Numerical Solutions of Differential Equations",
    "subject": "Engineering Mathematics - I",
    "semester": 1,
    "experimentNumber": 2,
    "description": "Apply Euler's method and Runge-Kutta 4th order to solve ODEs.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Numerically approximate solutions to initial value problems using Euler and RK-4 methods.",
    "theory": "Ordinary differential equations model physical dynamic systems. RK-4 achieves fourth-order accuracy with O(h^4) error bound.",
    "algorithm": "1. Define derivative f(x, y).\n2. Set step size h and initial condition (x0, y0).\n3. Compute k1, k2, k3, k4 slopes.\n4. Update y = y + (h/6)*(k1 + 2k2 + 2k3 + k4).\n5. Repeat until target x.",
    "codeInstructions": "Compute the value of y(x) at step increments of 0.1 for dy/dx = x + y.",
    "conclusion": "Observed that RK-4 provides orders of magnitude higher accuracy than standard Euler method for the same step size.",
    "javaStarterCode": "import java.util.*;\n\npublic class Main {\n    static double f(double x, double y) { return x + y; }\n    public static void main(String[] args) {\n        double x0 = 0, y0 = 1, h = 0.1, xTarget = 0.5;\n        double x = x0, y = y0;\n        while (x < xTarget) {\n            double k1 = f(x, y);\n            double k2 = f(x + h/2, y + h*k1/2);\n            double k3 = f(x + h/2, y + h*k2/2);\n            double k4 = f(x + h, y + h*k3);\n            y += (h/6.0)*(k1 + 2*k2 + 2*k3 + k4);\n            x += h;\n        }\n        System.out.printf(\"y(%.1f) = %.5f%n\", xTarget, y);\n    }\n}",
    "pythonStarterCode": "def f(x, y):\n    return x + y\n\ndef main():\n    x, y, h, target = 0.0, 1.0, 0.1, 0.5\n    while x < target:\n        k1 = f(x, y)\n        k2 = f(x + h/2, y + h*k1/2)\n        k3 = f(x + h/2, y + h*k2/2)\n        k4 = f(x + h, y + h*k3)\n        y += (h/6.0)*(k1 + 2*k2 + 2*k3 + k4)\n        x += h\n    print(f\"y({target:.1f}) = {y:.5f}\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 1021,
        "question": "Compare truncation error of Euler vs RK-4.",
        "order": 1
      },
      {
        "id": 1022,
        "question": "Why is RK-4 called a predictor-corrector style method?",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 1021,
        "question": "What is the global error order of RK-4?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 1022,
        "question": "What happens if step size h is too large?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 103,
    "title": "Energy Band Gap Determination of a Semiconductor",
    "subject": "Applied Physics & Semiconductor Devices",
    "semester": 1,
    "experimentNumber": 3,
    "description": "Calculate the forbidden energy band gap (Eg) of a Germanium/Silicon diode.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Determine the band gap of a semiconductor by reverse bias saturation current variation with temperature.",
    "theory": "Semiconductor conductivity increases with temperature as electrons cross the forbidden energy gap Eg.",
    "algorithm": "1. Connect diode in reverse bias.\n2. Heat oil bath and record temperature T (Kelvin).\n3. Measure reverse saturation current Is.\n4. Plot ln(Is) vs 10^3/T.\n5. Slope gives Eg / (2 * k).",
    "codeInstructions": "Simulate linear regression over temperature-current data points to calculate Eg in electron-volts.",
    "conclusion": "Calculated band gap Eg for Silicon is approximately 1.12 eV, agreeing with standard reference values.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        double slope = 6.45;\n        double k = 8.617e-5;\n        double eg = 2 * slope * 1000 * k;\n        System.out.printf(\"Calculated Semiconductor Band Gap Eg: %.2f eV%n\", eg);\n    }\n}",
    "pythonStarterCode": "def main():\n    slope = 6.45\n    k = 8.617e-5\n    eg = 2 * slope * 1000 * k\n    print(f\"Calculated Semiconductor Band Gap Eg: {eg:.2f} eV\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 1031,
        "question": "How does doping affect Fermi energy level?",
        "order": 1
      },
      {
        "id": 1032,
        "question": "Why does reverse saturation current double every 10 deg C?",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 1031,
        "question": "What is the value of band gap in Germanium vs Silicon?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 1032,
        "question": "What is an intrinsic semiconductor?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 104,
    "title": "Fundamental Data Types, Bitwise Operators, and Control Structures",
    "subject": "Structured Programming in C",
    "semester": 1,
    "experimentNumber": 4,
    "description": "Work with variables, bit masking, bit shifting, and nested control flow.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Implement bitwise manipulation routines (set, clear, toggle, test bit) and decision logic.",
    "theory": "Bitwise operators operate directly on binary representations, enabling high-performance embedded systems control.",
    "algorithm": "1. Read integer N and bit position K.\n2. Set bit: N | (1 << K).\n3. Clear bit: N & ~(1 << K).\n4. Toggle bit: N ^ (1 << K).\n5. Test bit: (N >> K) & 1.",
    "codeInstructions": "Implement bitwise utility functions and test with sample hexadecimal inputs.",
    "conclusion": "Demonstrated efficient low-level bit operations in constant O(1) execution time.",
    "javaStarterCode": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        int n = 42;\n        int k = 3;\n        System.out.println(\"Original: \" + Integer.toBinaryString(n));\n        System.out.println(\"Set bit \" + k + \": \" + Integer.toBinaryString(n | (1 << k)));\n        System.out.println(\"Clear bit 1: \" + Integer.toBinaryString(n & ~(1 << 1)));\n        System.out.println(\"Toggle bit 0: \" + Integer.toBinaryString(n ^ (1 << 0)));\n    }\n}",
    "pythonStarterCode": "def main():\n    n = 42\n    k = 3\n    print(f\"Original: {bin(n)}\")\n    print(f\"Set bit {k}: {bin(n | (1 << k))}\")\n    print(f\"Clear bit 1: {bin(n & ~(1 << 1))}\")\n    print(f\"Toggle bit 0: {bin(n ^ (1 << 0))}\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 1041,
        "question": "How do you check if a number is a power of 2 using bitwise operators?",
        "order": 1
      },
      {
        "id": 1042,
        "question": "Explain XOR swap.",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 1041,
        "question": "What is two's complement representation?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 1042,
        "question": "What is the result of shifting a signed negative integer?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 105,
    "title": "Verification of Thevenin's and Norton's Theorems",
    "subject": "Basic Electrical & Electronics Engineering",
    "semester": 1,
    "experimentNumber": 5,
    "description": "Analyze resistive circuits by equivalent voltage/current generator models.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Verify Thevenin's equivalent voltage (Vth), Norton's current (In), and equivalent resistance (Rth).",
    "theory": "Any linear two-terminal circuit can be simplified to a voltage source Vth in series with Rth or current source In in parallel with Rth.",
    "algorithm": "1. Disconnect load resistor RL.\n2. Measure open circuit voltage Voc = Vth.\n3. Measure short circuit current Isc = In.\n4. Compute Rth = Vth / In.\n5. Verify load current IL = Vth / (Rth + RL).",
    "codeInstructions": "Calculate the circuit parameters and verify maximum power transfer theorem.",
    "conclusion": "Thevenin and Norton theorems verified with less than 1% experimental deviation.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        double vSource = 12.0, r1 = 100.0, r2 = 150.0, rl = 50.0;\n        double vth = vSource * (r2 / (r1 + r2));\n        double rth = (r1 * r2) / (r1 + r2);\n        double il = vth / (rth + rl);\n        System.out.printf(\"Vth: %.2f V, Rth: %.2f Ohm, Load Current IL: %.4f A%n\", vth, rth, il);\n    }\n}",
    "pythonStarterCode": "def main():\n    v_source, r1, r2, rl = 12.0, 100.0, 150.0, 50.0\n    vth = v_source * (r2 / (r1 + r2))\n    rth = (r1 * r2) / (r1 + r2)\n    il = vth / (rth + rl)\n    print(f\"Vth: {vth:.2f} V, Rth: {rth:.2f} Ohm, Load Current IL: {il:.4f} A\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 1051,
        "question": "State Maximum Power Transfer Theorem.",
        "order": 1
      },
      {
        "id": 1052,
        "question": "What is the relationship between Thevenin and Norton resistance?",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 1051,
        "question": "Can Thevenin's theorem be applied to non-linear circuits?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 1052,
        "question": "What is ideal voltage source internal resistance?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 106,
    "title": "3D CAD Prototype Modeling & Slicing",
    "subject": "Engineering Workshop & Digital Fabrication",
    "semester": 1,
    "experimentNumber": 1,
    "description": "Design geometric models in CAD and generate G-code for 3D additive manufacturing.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Create a 3D mechanical enclosure component and prepare toolpath G-code parameters.",
    "theory": "Additive manufacturing creates objects layer by layer from digital 3D models using FDM (Fused Deposition Modeling).",
    "algorithm": "1. Create 2D sketch with dimensional constraints.\n2. Extrude to form solid body.\n3. Add chamfers, fillets, and mounting holes.\n4. Export to STL and generate slicing layers.\n5. Validate infill density and layer height.",
    "codeInstructions": "Inspect and parse G-code layer height coordinates for printing simulation.",
    "conclusion": "Successfully engineered solid enclosure model and verified toolpath extrusion paths.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        double layerHeight = 0.2;\n        double totalHeight = 25.0;\n        int totalLayers = (int) Math.ceil(totalHeight / layerHeight);\n        System.out.println(\"3D Slicing Parameters:\");\n        System.out.println(\"Total Layers: \" + totalLayers);\n        System.out.println(\"Estimated Infill Material: 34.2 grams\");\n    }\n}",
    "pythonStarterCode": "def main():\n    layer_height = 0.2\n    total_height = 25.0\n    total_layers = int(total_height / layer_height)\n    print(f\"3D Slicing Parameters: Total Layers = {total_layers}, Infill = 34.2g\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 1061,
        "question": "What is the difference between FDM and SLA 3D printing?",
        "order": 1
      },
      {
        "id": 1062,
        "question": "Why is infill pattern important for structural rigidity?",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 1061,
        "question": "What does G-code command G01 represent?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 1062,
        "question": "How does bed temperature prevent warping?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 207,
    "title": "Multiple Integrals & Beta-Gamma Function Evaluation",
    "subject": "Engineering Mathematics - II",
    "semester": 2,
    "experimentNumber": 2,
    "description": "Evaluate double and triple integrals and solve definite integrals with Beta and Gamma.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Compute area and volume using double integrals in Cartesian and Polar coordinates.",
    "theory": "Beta and Gamma functions simplify definite integrals that cannot be integrated using elementary antiderivatives.",
    "algorithm": "1. Set limits of integration for x and y.\n2. Convert to polar if circular symmetry exists.\n3. Integrate with respect to inner variable.\n4. Integrate outer variable.\n5. Output numerical approximation.",
    "codeInstructions": "Compute volume under surface z = 4 - x^2 - y^2 over region x^2 + y^2 <= 4.",
    "conclusion": "Verified conversion between Cartesian and Polar coordinates, reducing integral complexity.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        double volume = 8 * Math.PI;\n        System.out.printf(\"Exact Paraboloid Volume: %.4f%n\", volume);\n    }\n}",
    "pythonStarterCode": "import math\n\ndef main():\n    volume = 8 * math.pi\n    print(f\"Exact Paraboloid Volume: {volume:.4f}\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 2071,
        "question": "State property Gamma(n+1) = n * Gamma(n).",
        "order": 1
      },
      {
        "id": 2072,
        "question": "What is the Jacobian for polar coordinate transformation?",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 2071,
        "question": "What is the value of Gamma(1/2)?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 2072,
        "question": "When is Beta-Gamma substitution applied?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 208,
    "title": "Determination of Total Hardness of Water by EDTA",
    "subject": "Applied Chemistry & Material Science",
    "semester": 2,
    "experimentNumber": 3,
    "description": "Perform complexometric titration to estimate temporary and permanent water hardness.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Determine total, temporary, and permanent hardness of a water sample using standard 0.01M EDTA.",
    "theory": "EDTA forms stable soluble chelate complexes with Ca2+ and Mg2+ ions at pH 10 using Eriochrome Black-T indicator.",
    "algorithm": "1. Pipette 50ml water sample.\n2. Add NH4Cl-NH4OH buffer (pH 10) and EBT indicator (turns wine red).\n3. Titrate against EDTA until color changes to steel blue.\n4. Repeat for boiled sample for permanent hardness.",
    "codeInstructions": "Calculate ppm CaCO3 equivalent hardness from titration burette readings.",
    "conclusion": "Total hardness determined as 240 ppm CaCO3 equivalent, indicating moderately hard water.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        double vEdta = 24.0;\n        double mEdta = 0.01;\n        double vSample = 50.0;\n        double hardnessPpm = (vEdta * mEdta * 100.0 * 1000) / vSample;\n        System.out.printf(\"Total Water Hardness: %.2f ppm CaCO3 equivalent%n\", hardnessPpm);\n    }\n}",
    "pythonStarterCode": "def main():\n    v_edta, m_edta, v_sample = 24.0, 0.01, 50.0\n    hardness = (v_edta * m_edta * 100.0 * 1000) / v_sample\n    print(f\"Total Water Hardness: {hardness:.2f} ppm CaCO3 equivalent\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 2081,
        "question": "Why is buffer solution required in EDTA titration?",
        "order": 1
      },
      {
        "id": 2082,
        "question": "Distinguish between temporary and permanent hardness.",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 2081,
        "question": "Why does Eriochrome Black T turn blue at endpoint?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 2082,
        "question": "What is the chemical formula of EDTA?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 209,
    "title": "Classes, Objects, and Constructor Overloading",
    "subject": "Object-Oriented Programming with C++",
    "semester": 2,
    "experimentNumber": 4,
    "description": "Build object-oriented software demonstrating encapsulation, deep copy, and destructor cleanup.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Create a Student record management system with default, parameterized, and copy constructors.",
    "theory": "Object-oriented programming binds data and functions together into objects, enforcing data abstraction and encapsulation.",
    "algorithm": "1. Define class with private members and public methods.\n2. Implement parameterized constructor and deep copy constructor.\n3. Allocate dynamic memory where required.\n4. Implement destructor to release resources.\n5. Test creation and lifecycle.",
    "codeInstructions": "Instantiate objects using all constructor types and print memory addresses to verify deep copy.",
    "conclusion": "Constructors and destructors properly initialized and deallocated dynamic heap memory without memory leaks.",
    "javaStarterCode": "class Student {\n    private String name;\n    private int rollNo;\n    public Student(String name, int rollNo) {\n        this.name = name; this.rollNo = rollNo;\n    }\n    public Student(Student other) {\n        this.name = other.name; this.rollNo = other.rollNo;\n    }\n    public void display() {\n        System.out.println(\"Roll \" + rollNo + \": \" + name);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Student s1 = new Student(\"Inzamam Khan\", 13);\n        Student s2 = new Student(s1);\n        s1.display();\n        s2.display();\n    }\n}",
    "pythonStarterCode": "class Student:\n    def __init__(self, name, roll_no):\n        self.name = name\n        self.roll_no = roll_no\n\n    def display(self):\n        print(f\"Roll {self.roll_no}: {self.name}\")\n\ndef main():\n    s1 = Student(\"Inzamam Khan\", 13)\n    s2 = Student(s1.name, s1.roll_no)\n    s1.display()\n    s2.display()\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 2091,
        "question": "What is the difference between shallow copy and deep copy?",
        "order": 1
      },
      {
        "id": 2092,
        "question": "Why is copy constructor passed by reference in C++?",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 2091,
        "question": "Can constructors be virtual?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 2092,
        "question": "What is an initialization list?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 210,
    "title": "Equilibrium of Concurrent Coplanar Force System",
    "subject": "Engineering Mechanics & Dynamics",
    "semester": 2,
    "experimentNumber": 5,
    "description": "Verify Lami's theorem and graphical polygon law of concurrent forces.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Verify conditions of equilibrium (Sum Fx = 0, Sum Fy = 0) for coplanar concurrent forces.",
    "theory": "For a body in equilibrium under coplanar concurrent forces, the vector sum of all forces acting at the point must be zero.",
    "algorithm": "1. Suspend weights over frictionless pulleys.\n2. Measure angles between force cords with protractor.\n3. Resolve forces into horizontal (Fx = F * cos theta) and vertical (Fy = F * sin theta) components.\n4. Calculate algebraic sums.\n5. Verify equilibrium.",
    "codeInstructions": "Compute the resultant magnitude and direction of three concurrent forces.",
    "conclusion": "Resultant magnitude converged to zero within acceptable experimental friction threshold.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        double f1 = 10, a1 = 0;\n        double f2 = 10, a2 = 120;\n        double f3 = 10, a3 = 240;\n        double rx = f1*Math.cos(Math.toRadians(a1)) + f2*Math.cos(Math.toRadians(a2)) + f3*Math.cos(Math.toRadians(a3));\n        double ry = f1*Math.sin(Math.toRadians(a1)) + f2*Math.sin(Math.toRadians(a2)) + f3*Math.sin(Math.toRadians(a3));\n        System.out.printf(\"Resultant Force: Rx = %.4f N, Ry = %.4f N%n\", rx, ry);\n    }\n}",
    "pythonStarterCode": "import math\n\ndef main():\n    forces = [(10, 0), (10, 120), (10, 240)]\n    rx = sum(f * math.cos(math.radians(deg)) for f, deg in forces)\n    ry = sum(f * math.sin(math.radians(deg)) for f, deg in forces)\n    print(f\"Resultant Force: Rx = {rx:.4f} N, Ry = {ry:.4f} N\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 2101,
        "question": "State Lami's theorem and its limitations.",
        "order": 1
      },
      {
        "id": 2102,
        "question": "What is Varignon's theorem of moments?",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 2101,
        "question": "What is a concurrent force system?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 2102,
        "question": "What is the difference between scalar and vector equilibrium?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 211,
    "title": "Technical Project Report & Abstract Writing",
    "subject": "Professional Communication & Soft Skills",
    "semester": 2,
    "experimentNumber": 1,
    "description": "Draft professional executive summaries and technical project documentation.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Structure an engineering project report following IEEE conference documentation standards.",
    "theory": "Technical writing communicates complex technical architectures, problem formulations, and quantitative evaluations clearly.",
    "algorithm": "1. Identify problem statement and context.\n2. Summarize proposed methodology and architecture.\n3. Present benchmark results.\n4. Conclude with impact and future scope.",
    "codeInstructions": "Format structured metadata and compute abstract readability index.",
    "conclusion": "Report formatted with clear headings, references, and professional technical terminology.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        String abstractText = \"CodeLabX provides an automated laboratory evaluation system with real-time execution.\";\n        String[] words = abstractText.split(\"\\s+\");\n        System.out.println(\"Abstract Word Count: \" + words.length);\n        System.out.println(\"Status: Approved for Submission\");\n    }\n}",
    "pythonStarterCode": "def main():\n    abstract = \"CodeLabX provides an automated laboratory evaluation system with real-time execution.\"\n    words = abstract.split()\n    print(f\"Abstract Word Count: {len(words)}\")\n    print(\"Status: Approved for Submission\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 2111,
        "question": "What are key components of an IEEE abstract?",
        "order": 1
      },
      {
        "id": 2112,
        "question": "Explain difference between active and passive voice in technical writing.",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 2111,
        "question": "What is plagiarism and citation ethics?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 2112,
        "question": "How do you structure an executive summary?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 312,
    "title": "Stack using Array & Infix to Postfix Conversion",
    "subject": "Data Structures",
    "semester": 3,
    "experimentNumber": 2,
    "description": "Implement stack operations and parse arithmetic expressions to postfix notation.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Implement push, pop, peek stack ADT and convert infix expressions to postfix using precedence rules.",
    "theory": "A stack is a LIFO structure. Infix to postfix conversion uses operator precedence and associativity to produce reverse Polish notation.",
    "algorithm": "1. Initialize operator stack.\n2. Scan expression from left to right.\n3. Output operands directly.\n4. Push operators based on precedence, popping higher precedence operators.\n5. Pop remaining stack operators.",
    "codeInstructions": "Convert expression '(A + B) * (C - D)' to postfix and evaluate postfix with sample numeric values.",
    "conclusion": "Demonstrated expression conversion and evaluation with O(N) linear time complexity.",
    "javaStarterCode": "import java.util.*;\n\npublic class Main {\n    static int prec(char ch) {\n        return switch (ch) { case '+', '-' -> 1; case '*', '/' -> 2; default -> -1; };\n    }\n    public static void main(String[] args) {\n        String exp = \"a+b*(c^d-e)\";\n        StringBuilder result = new StringBuilder();\n        Stack<Character> stack = new Stack<>();\n        for (char c : exp.toCharArray()) {\n            if (Character.isLetterOrDigit(c)) result.append(c);\n            else if (c == '(') stack.push(c);\n            else if (c == ')') {\n                while (!stack.isEmpty() && stack.peek() != '(') result.append(stack.pop());\n                if (!stack.isEmpty()) stack.pop();\n            } else {\n                while (!stack.isEmpty() && prec(c) <= prec(stack.peek())) result.append(stack.pop());\n                stack.push(c);\n            }\n        }\n        while (!stack.isEmpty()) result.append(stack.pop());\n        System.out.println(\"Postfix: \" + result);\n    }\n}",
    "pythonStarterCode": "def prec(c):\n    if c in ('+', '-'): return 1\n    if c in ('*', '/'): return 2\n    return -1\n\ndef main():\n    exp = \"a+b*(c-d)\"\n    stack, res = [], []\n    for c in exp:\n        if c.isalnum(): res.append(c)\n        elif c == '(': stack.append(c)\n        elif c == ')':\n            while stack and stack[-1] != '(': res.append(stack.pop())\n            if stack: stack.pop()\n        else:\n            while stack and prec(c) <= prec(stack[-1]): res.append(stack.pop())\n            stack.append(c)\n    while stack: res.append(stack.pop())\n    print(\"Postfix: \" + \"\".join(res))\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 3121,
        "question": "How does stack enable recursive function call execution?",
        "order": 1
      },
      {
        "id": 3122,
        "question": "Evaluate postfix expression '2 3 1 * + 9 -'.",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 3121,
        "question": "What is stack overflow and stack underflow?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 3122,
        "question": "What is time complexity of infix to postfix conversion?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 313,
    "title": "Binary Search Tree (BST) Operations",
    "subject": "Data Structures",
    "semester": 3,
    "experimentNumber": 3,
    "description": "Construct BST, perform node insertion, deletion, and depth traversals.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Implement BST insertion, search, deletion for leaf/single/double child cases, and inorder traversal.",
    "theory": "BST satisfies the property that keys in the left subtree are smaller and in right subtree are larger than parent.",
    "algorithm": "1. Insert key by comparing with current node.\n2. Traverse left or right recursively.\n3. For deletion: replace with inorder successor when node has two children.\n4. Inorder traversal prints keys in sorted order.",
    "codeInstructions": "Insert [50, 30, 20, 40, 70, 60, 80] and print in-order traversal.",
    "conclusion": "In-order traversal visited all keys in sorted ascending order with O(log n) average search complexity.",
    "javaStarterCode": "class Node {\n    int key; Node left, right;\n    Node(int item) { key = item; }\n}\n\npublic class Main {\n    static Node insert(Node node, int key) {\n        if (node == null) return new Node(key);\n        if (key < node.key) node.left = insert(node.left, key);\n        else if (key > node.key) node.right = insert(node.right, key);\n        return node;\n    }\n    static void inorder(Node root) {\n        if (root != null) {\n            inorder(root.left);\n            System.out.print(root.key + \" \");\n            inorder(root.right);\n        }\n    }\n    public static void main(String[] args) {\n        Node root = null;\n        int[] keys = {50, 30, 20, 40, 70, 60, 80};\n        for (int k : keys) root = insert(root, k);\n        System.out.print(\"Inorder BST: \");\n        inorder(root);\n        System.out.println();\n    }\n}",
    "pythonStarterCode": "class Node:\n    def __init__(self, key):\n        self.key = key\n        self.left = None\n        self.right = None\n\ndef insert(root, key):\n    if not root: return Node(key)\n    if key < root.key: root.left = insert(root.left, key)\n    else: root.right = insert(root.right, key)\n    return root\n\ndef inorder(root):\n    if root:\n        inorder(root.left)\n        print(root.key, end=\" \")\n        inorder(root.right)\n\ndef main():\n    root = None\n    for k in [50, 30, 20, 40, 70, 60, 80]:\n        root = insert(root, k)\n    print(\"Inorder BST:\", end=\" \")\n    inorder(root)\n    print()\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 3131,
        "question": "What causes a BST to degrade to O(N) search complexity?",
        "order": 1
      },
      {
        "id": 3132,
        "question": "How is in-order predecessor identified?",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 3131,
        "question": "What is an AVL tree and how does it prevent skewness?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 3132,
        "question": "What is time complexity of BST deletion?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 314,
    "title": "Shortest Path via Dijkstra's Algorithm",
    "subject": "Discrete Structures & Graph Theory",
    "semester": 3,
    "experimentNumber": 4,
    "description": "Compute single-source shortest paths on weighted directed graph.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Implement Dijkstra's greedy algorithm using adjacency matrix and min-heap priority queue.",
    "theory": "Dijkstra's algorithm finds the shortest path from a source vertex to all other vertices in non-negative edge weight graphs.",
    "algorithm": "1. Initialize dist[src] = 0 and all other dist[v] = infinity.\n2. Maintain min-priority queue of unvisited vertices.\n3. Extract min vertex u.\n4. For each neighbor v of u: relax edge (u, v) if dist[u] + w(u, v) < dist[v].\n5. Repeat until all vertices processed.",
    "codeInstructions": "Compute shortest distances from vertex 0 to all vertices for a 5-node graph.",
    "conclusion": "Calculated optimal path costs in O((V + E) log V) time complexity.",
    "javaStarterCode": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        int n = 5;\n        int[][] graph = {\n            {0, 10, 0, 5, 0},\n            {0, 0, 1, 2, 0},\n            {0, 0, 0, 0, 4},\n            {0, 3, 9, 0, 2},\n            {7, 0, 6, 0, 0}\n        };\n        int[] dist = new int[n];\n        Arrays.fill(dist, Integer.MAX_VALUE);\n        dist[0] = 0;\n        boolean[] visited = new boolean[n];\n        for (int i = 0; i < n; i++) {\n            int u = -1;\n            for (int j = 0; j < n; j++) if (!visited[j] && (u == -1 || dist[j] < dist[u])) u = j;\n            if (dist[u] == Integer.MAX_VALUE) break;\n            visited[u] = true;\n            for (int v = 0; v < n; v++) {\n                if (graph[u][v] != 0 && dist[u] + graph[u][v] < dist[v]) dist[v] = dist[u] + graph[u][v];\n            }\n        }\n        System.out.println(\"Shortest distances: \" + Arrays.toString(dist));\n    }\n}",
    "pythonStarterCode": "def main():\n    n = 5\n    graph = [\n        [0, 10, 0, 5, 0],\n        [0, 0, 1, 2, 0],\n        [0, 0, 0, 0, 4],\n        [0, 3, 9, 0, 2],\n        [7, 0, 6, 0, 0]\n    ]\n    dist = [float('inf')] * n\n    dist[0] = 0\n    visited = [False] * n\n    for _ in range(n):\n        u = min((i for i in range(n) if not visited[i]), key=lambda x: dist[x], default=-1)\n        if u == -1 or dist[u] == float('inf'): break\n        visited[u] = True\n        for v in range(n):\n            if graph[u][v] and dist[u] + graph[u][v] < dist[v]:\n                dist[v] = dist[u] + graph[u][v]\n    print(\"Shortest distances:\", dist)\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 3141,
        "question": "Why does Dijkstra's algorithm fail on negative edge weights?",
        "order": 1
      },
      {
        "id": 3142,
        "question": "Which algorithm is used for all-pairs shortest paths?",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 3141,
        "question": "What is the difference between Prim's and Dijkstra's algorithm?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 3142,
        "question": "What is relaxation in graph algorithms?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 315,
    "title": "4-Bit Arithmetic Logic Unit (ALU) Design",
    "subject": "Digital Logic & Computer Architecture",
    "semester": 3,
    "experimentNumber": 5,
    "description": "Design 4-bit ALU performing arithmetic (ADD, SUB) and logic (AND, OR, XOR) operations.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Model combinational ALU using control select signals S0, S1, S2 and status flags.",
    "theory": "An ALU is a fundamental building block of the CPU that executes elementary arithmetic and bitwise logic operations.",
    "algorithm": "1. Read inputs A[3:0], B[3:0], and 3-bit Opcode.\n2. Decode opcode.\n3. Execute selected operation.\n4. Set Zero, Carry, and Overflow status flags.\n5. Output Result[3:0].",
    "codeInstructions": "Implement ALU functional behavior and test with signed arithmetic cases.",
    "conclusion": "ALU successfully executed all operational opcodes and accurately signaled zero and carry flags.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        int a = 9, b = 5;\n        System.out.println(\"A: \" + a + \", B: \" + b);\n        System.out.println(\"ADD: \" + (a + b));\n        System.out.println(\"SUB: \" + (a - b));\n        System.out.println(\"AND: \" + (a & b));\n        System.out.println(\"OR:  \" + (a | b));\n        System.out.println(\"XOR: \" + (a ^ b));\n    }\n}",
    "pythonStarterCode": "def main():\n    a, b = 9, 5\n    print(f\"A: {a}, B: {b}\")\n    print(f\"ADD: {a + b}\")\n    print(f\"SUB: {a - b}\")\n    print(f\"AND: {a & b}\")\n    print(f\"OR:  {a | b}\")\n    print(f\"XOR: {a ^ b}\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 3151,
        "question": "How is subtraction performed using 2's complement adder?",
        "order": 1
      },
      {
        "id": 3152,
        "question": "Explain significance of Overflow flag in signed arithmetic.",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 3151,
        "question": "What is the purpose of the Accumulator register?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 3152,
        "question": "What is the difference between RISC and CISC architectures?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 316,
    "title": "Bresenham's Line and Circle Drawing Algorithm",
    "subject": "Computer Graphics & Visualization",
    "semester": 3,
    "experimentNumber": 1,
    "description": "Render scan-converted raster graphics primitives using integer arithmetic.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Implement Bresenham's line and midpoint circle algorithm avoiding floating point computations.",
    "theory": "Bresenham's algorithm utilizes incremental integer addition and decision parameters to select nearest pixel grid points.",
    "algorithm": "1. Calculate dx = x2 - x1, dy = y2 - y1.\n2. Initial decision parameter P = 2*dy - dx.\n3. For each x from x1 to x2: plot pixel (x, y).\n4. If P < 0: P = P + 2*dy; else: y = y + 1, P = P + 2*dy - 2*dx.",
    "codeInstructions": "Compute the rasterized pixel sequence from point (2, 3) to (9, 7).",
    "conclusion": "Demonstrated accurate pixel rasterization without floating point performance overhead.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        int x1 = 2, y1 = 3, x2 = 9, y2 = 7;\n        int dx = x2 - x1, dy = y2 - y1;\n        int p = 2 * dy - dx, y = y1;\n        System.out.print(\"Bresenham Pixels: \");\n        for (int x = x1; x <= x2; x++) {\n            System.out.print(\"(\" + x + \",\" + y + \") \");\n            if (p >= 0) { y++; p += 2 * dy - 2 * dx; }\n            else p += 2 * dy;\n        }\n        System.out.println();\n    }\n}",
    "pythonStarterCode": "def main():\n    x1, y1, x2, y2 = 2, 3, 9, 7\n    dx, dy = x2 - x1, y2 - y1\n    p, y = 2 * dy - dx, y1\n    pixels = []\n    for x in range(x1, x2 + 1):\n        pixels.append(f\"({x},{y})\")\n        if p >= 0:\n            y += 1\n            p += 2 * dy - 2 * dx\n        else:\n            p += 2 * dy\n    print(\"Bresenham Pixels:\", \" \".join(pixels))\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 3161,
        "question": "Why is Bresenham preferred over DDA algorithm?",
        "order": 1
      },
      {
        "id": 3162,
        "question": "How does midpoint circle algorithm exploit 8-way symmetry?",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 3161,
        "question": "What is aliasing and anti-aliasing?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 3162,
        "question": "What is frame buffer aspect ratio?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 317,
    "title": "Multithreading and Synchronization",
    "subject": "Object Oriented Programming with Java",
    "semester": 3,
    "experimentNumber": 2,
    "description": "Develop concurrent Java applications with synchronized locks and thread pools.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Implement Producer-Consumer problem using shared bounded buffer and wait()/notify().",
    "theory": "Java provides built-in monitors and synchronization keywords to manage concurrent access to shared mutable resources.",
    "algorithm": "1. Create shared buffer with maximum capacity.\n2. Producer checks if full: calls wait(); else inserts item and calls notify().\n3. Consumer checks if empty: calls wait(); else removes item and calls notify().\n4. Synchronize buffer critical section.",
    "codeInstructions": "Run producer and consumer threads demonstrating race-condition-free handoff.",
    "conclusion": "Thread synchronization prevented race conditions and buffer overruns.",
    "javaStarterCode": "class Buffer {\n    private int val = -1;\n    private boolean hasVal = false;\n    public synchronized void produce(int v) throws InterruptedException {\n        while (hasVal) wait();\n        val = v; hasVal = true;\n        System.out.println(\"Produced: \" + v);\n        notify();\n    }\n    public synchronized void consume() throws InterruptedException {\n        while (!hasVal) wait();\n        System.out.println(\"Consumed: \" + val);\n        hasVal = false;\n        notify();\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Buffer b = new Buffer();\n        Thread t1 = new Thread(() -> { try { for (int i=1;i<=3;i++) b.produce(i); } catch (Exception ignored) {} });\n        Thread t2 = new Thread(() -> { try { for (int i=1;i<=3;i++) b.consume(); } catch (Exception ignored) {} });\n        t1.start(); t2.start();\n        t1.join(); t2.join();\n    }\n}",
    "pythonStarterCode": "import threading, time\n\nclass Buffer:\n    def __init__(self):\n        self.cond = threading.Condition()\n        self.val = None\n\n    def produce(self, v):\n        with self.cond:\n            while self.val is not None: self.cond.wait()\n            self.val = v\n            print(f\"Produced: {v}\")\n            self.cond.notify()\n\n    def consume(self):\n        with self.cond:\n            while self.val is None: self.cond.wait()\n            print(f\"Consumed: {self.val}\")\n            self.val = None\n            self.cond.notify()\n\ndef main():\n    b = Buffer()\n    t1 = threading.Thread(target=lambda: [b.produce(i) for i in range(1, 4)])\n    t2 = threading.Thread(target=lambda: [b.consume() for _ in range(3)])\n    t1.start(); t2.start()\n    t1.join(); t2.join()\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 3171,
        "question": "What causes deadlocks in multi-threaded programs?",
        "order": 1
      },
      {
        "id": 3172,
        "question": "Explain difference between sleep() and wait().",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 3171,
        "question": "What is the volatile keyword in Java?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 3172,
        "question": "What is the difference between Thread and Runnable?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 418,
    "title": "Divide and Conquer - Merge Sort and Quick Sort",
    "subject": "Design and Analysis of Algorithms",
    "semester": 4,
    "experimentNumber": 3,
    "description": "Analyze recurrence relations and implement divide and conquer sorting.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Implement Merge Sort (T(n) = 2T(n/2) + O(n)) and Quick Sort with pivot partitioning.",
    "theory": "Divide and conquer divides a problem into subproblems, solves subproblems recursively, and combines results. Merge sort has guaranteed O(n log n) complexity.",
    "algorithm": "1. Divide array into two halves at mid.\n2. Recursively sort left and right halves.\n3. Merge two sorted halves using two-pointer technique.\n4. Copy merged elements back to original array.",
    "codeInstructions": "Sort array and output comparison count and execution time.",
    "conclusion": "Merge sort achieved stable O(n log n) sorting across best, average, and worst cases.",
    "javaStarterCode": "import java.util.*;\n\npublic class Main {\n    static void mergeSort(int[] a, int l, int r) {\n        if (l < r) {\n            int m = (l + r) / 2;\n            mergeSort(a, l, m);\n            mergeSort(a, m + 1, r);\n            merge(a, l, m, r);\n        }\n    }\n    static void merge(int[] a, int l, int m, int r) {\n        int[] left = Arrays.copyOfRange(a, l, m + 1);\n        int[] right = Arrays.copyOfRange(a, m + 1, r + 1);\n        int i = 0, j = 0, k = l;\n        while (i < left.length && j < right.length) a[k++] = (left[i] <= right[j]) ? left[i++] : right[j++];\n        while (i < left.length) a[k++] = left[i++];\n        while (j < right.length) a[k++] = right[j++];\n    }\n    public static void main(String[] args) {\n        int[] arr = {38, 27, 43, 3, 9, 82, 10};\n        mergeSort(arr, 0, arr.length - 1);\n        System.out.println(\"Sorted: \" + Arrays.toString(arr));\n    }\n}",
    "pythonStarterCode": "def merge_sort(arr):\n    if len(arr) <= 1: return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    res, i, j = [], 0, 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]: res.append(left[i]); i += 1\n        else: res.append(right[j]); j += 1\n    res.extend(left[i:])\n    res.extend(right[j:])\n    return res\n\ndef main():\n    arr = [38, 27, 43, 3, 9, 82, 10]\n    print(\"Sorted:\", merge_sort(arr))\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 4181,
        "question": "State Master Theorem for divide and conquer recurrences.",
        "order": 1
      },
      {
        "id": 4182,
        "question": "How does 3-way Quick Sort handle duplicate keys?",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 4181,
        "question": "Is Merge Sort in-place?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 4182,
        "question": "What is worst-case time complexity of Quick Sort?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 419,
    "title": "DDL, DML, and Complex SQL Joins",
    "subject": "Database Management Systems",
    "semester": 4,
    "experimentNumber": 4,
    "description": "Design normalized schema, define relational integrity, and query multiple tables.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Implement 3NF relational database schema with foreign key constraints, aggregations, and inner/outer joins.",
    "theory": "Relational algebra provides foundational operators (projection, selection, cartesian product, join) implemented in SQL.",
    "algorithm": "1. Create tables with primary and foreign keys.\n2. Insert sample entities.\n3. Execute INNER JOIN, LEFT JOIN, and GROUP BY with HAVING clause.\n4. Analyze execution plan.",
    "codeInstructions": "Write SQL queries to find students whose average submission score exceeds department median.",
    "conclusion": "Demonstrated entity integrity, referential integrity, and efficient relational query execution.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Simulating SQL Query Execution:\");\n        System.out.println(\"SELECT s.name, AVG(sub.score) FROM students s JOIN submissions sub ON s.id = sub.student_id GROUP BY s.id;\");\n        System.out.println(\"Result: Inzamam Khan -> 94.50 marks (Grade: O)\");\n    }\n}",
    "pythonStarterCode": "def main():\n    print(\"Simulating SQL Query Execution:\")\n    print(\"SELECT s.name, AVG(sub.score) FROM students s JOIN submissions sub ON s.id = sub.student_id GROUP BY s.id;\")\n    print(\"Result: Inzamam Khan -> 94.50 marks (Grade: O)\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 4191,
        "question": "Explain difference between 2NF and 3NF.",
        "order": 1
      },
      {
        "id": 4192,
        "question": "What is the difference between WHERE and HAVING clause?",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 4191,
        "question": "What is an index and how does B-Tree indexing work?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 4192,
        "question": "What are ACID properties?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 420,
    "title": "CPU Scheduling (FCFS, SJF, Round Robin, Priority)",
    "subject": "Operating Systems",
    "semester": 4,
    "experimentNumber": 5,
    "description": "Simulate preemptive and non-preemptive process scheduling algorithms.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Calculate turnaround time, waiting time, and CPU utilization under Round Robin (quantum = 2).",
    "theory": "The CPU scheduler chooses from in-memory ready processes to maximize throughput and minimize response latency.",
    "algorithm": "1. Maintain ready queue of arrived processes.\n2. Allocate CPU for time slice Q.\n3. If process completes: record completion time; else preempt and requeue.\n4. Compute Average Waiting Time.",
    "codeInstructions": "Simulate processes P1(burst=5), P2(burst=3), P3(burst=8) with quantum=2.",
    "conclusion": "Round Robin provided equitable interactive response times without process starvation.",
    "javaStarterCode": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        int[] burst = {5, 3, 8};\n        int[] rem = burst.clone();\n        int t = 0, q = 2, done = 0, n = 3;\n        int[] wt = new int[n];\n        while (done < n) {\n            for (int i = 0; i < n; i++) {\n                if (rem[i] > 0) {\n                    if (rem[i] > q) { t += q; rem[i] -= q; }\n                    else { t += rem[i]; wt[i] = t - burst[i]; rem[i] = 0; done++; }\n                }\n            }\n        }\n        System.out.println(\"Average Waiting Time: \" + (wt[0] + wt[1] + wt[2]) / 3.0 + \" ms\");\n    }\n}",
    "pythonStarterCode": "def main():\n    burst = [5, 3, 8]\n    rem = list(burst)\n    t, q, done, n = 0, 2, 0, 3\n    wt = [0] * n\n    while done < n:\n        for i in range(n):\n            if rem[i] > 0:\n                if rem[i] > q:\n                    t += q\n                    rem[i] -= q\n                else:\n                    t += rem[i]\n                    wt[i] = t - burst[i]\n                    rem[i] = 0\n                    done += 1\n    print(f\"Average Waiting Time: {sum(wt) / n:.2f} ms\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 4201,
        "question": "What is Convoy Effect in FCFS scheduling?",
        "order": 1
      },
      {
        "id": 4202,
        "question": "Explain how multilevel feedback queues operate.",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 4201,
        "question": "What is context switching overhead?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 4202,
        "question": "What is aging in priority scheduling?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 421,
    "title": "8086 Assembly - Arithmetic and Array Sorting",
    "subject": "Microprocessors and Microcontrollers",
    "semester": 4,
    "experimentNumber": 1,
    "description": "Program x86 assembly instructions to manipulate memory registers and sort array buffers.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Implement bubble sort on an array of 8-bit hex numbers using 8086 segmented memory instructions.",
    "theory": "Microprocessors execute machine code instructions addressing registers (AX, BX, CX, DX) and flag status bits.",
    "algorithm": "1. Load array offset into SI pointer.\n2. Outer loop counter CX = N - 1.\n3. Inner loop: compare [SI] and [SI+1] via CMP.\n4. If greater: exchange values using XCHG.\n5. Decrement and repeat until CX = 0.",
    "codeInstructions": "Sort array [34H, 12H, 89H, 05H, 47H] in ascending numerical sequence.",
    "conclusion": "Demonstrated register addressing, conditional jumps, and memory pointer traversal in 8086 assembly.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        int[] hex = {0x34, 0x12, 0x89, 0x05, 0x47};\n        java.util.Arrays.sort(hex);\n        System.out.print(\"Sorted 8086 Hex Array: \");\n        for (int h : hex) System.out.printf(\"%02XH \", h);\n        System.out.println();\n    }\n}",
    "pythonStarterCode": "def main():\n    arr = [0x34, 0x12, 0x89, 0x05, 0x47]\n    arr.sort()\n    print(\"Sorted 8086 Hex Array:\", [f\"{x:02X}H\" for x in arr])\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 4211,
        "question": "Explain physical address calculation using Segment:Offset.",
        "order": 1
      },
      {
        "id": 4212,
        "question": "What are the flags in the 8086 Flag register?",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 4211,
        "question": "What is the difference between MOV and LEA?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 4212,
        "question": "Explain pipelining in the 8086 Bus Interface Unit (BIU).",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 422,
    "title": "Pandas & NumPy Data Wrangling Pipeline",
    "subject": "Python for Data Science",
    "semester": 4,
    "experimentNumber": 2,
    "description": "Load datasets, handle missing values, filter outliers, and engineer features.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Build a complete data cleaning and feature engineering pipeline on student academic data.",
    "theory": "Data preprocessing transforms raw, noisy tabular data into normalized matrices suitable for statistical analysis.",
    "algorithm": "1. Read CSV using pandas DataFrame.\n2. Impute null values with column median.\n3. Remove outliers outside 3 interquartile ranges (IQR).\n4. Standardize numerical features using z-score normalization.",
    "codeInstructions": "Compute summary statistics and return filtered correlation matrix.",
    "conclusion": "Transformed dirty tabular data into clean feature tensors ready for model training.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        double[] scores = {75, 82, 90, 88, 95};\n        double mean = java.util.Arrays.stream(scores).average().orElse(0);\n        System.out.println(\"Dataset Samples: \" + scores.length);\n        System.out.printf(\"Computed Feature Mean: %.2f%n\", mean);\n    }\n}",
    "pythonStarterCode": "def main():\n    scores = [75, 82, 90, 88, 95]\n    mean = sum(scores) / len(scores)\n    variance = sum((x - mean)**2 for x in scores) / len(scores)\n    print(f\"Data Samples: {len(scores)}\")\n    print(f\"Computed Feature Mean: {mean:.2f}, StdDev: {variance**0.5:.2f}\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 4221,
        "question": "How do you detect multicollinearity using VIF?",
        "order": 1
      },
      {
        "id": 4222,
        "question": "What is the difference between MinMaxScaling and StandardScaling?",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 4221,
        "question": "What is vectorization in NumPy?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 4222,
        "question": "What is broadcasting in multi-dimensional arrays?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 523,
    "title": "TCP/UDP Socket Programming Client-Server Chat",
    "subject": "Computer Networks & Security",
    "semester": 5,
    "experimentNumber": 3,
    "description": "Implement reliable client-server network socket communication over TCP.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Build multi-client chat server with persistent socket connections and broadcast messaging.",
    "theory": "The Transport layer provides end-to-end communication services. TCP guarantees reliable, in-order delivery via 3-way handshakes.",
    "algorithm": "1. Server binds ServerSocket to port 8080.\n2. Server calls accept() blocking until client connects.\n3. Spawn worker thread per client connection.\n4. Read from InputStream and broadcast to connected client sockets.",
    "codeInstructions": "Demonstrate message exchange between client and server with timestamped echo.",
    "conclusion": "Verified full-duplex socket streaming across network socket interfaces.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"TCP Socket Server Simulator:\");\n        System.out.println(\"Listening on 0.0.0.0:8080 [ESTABLISHED]\");\n        System.out.println(\"Client Connected: /127.0.0.1:54321\");\n        System.out.println(\"Echo Received: 'Hello CodeLabX Lab'\");\n    }\n}",
    "pythonStarterCode": "def main():\n    print(\"TCP Socket Server Simulator:\")\n    print(\"Listening on 0.0.0.0:8080 [ESTABLISHED]\")\n    print(\"Client Connected: 127.0.0.1:54321\")\n    print(\"Echo Received: 'Hello CodeLabX Lab'\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 5231,
        "question": "Explain TCP 3-way handshake SYN, SYN-ACK, ACK.",
        "order": 1
      },
      {
        "id": 5232,
        "question": "Compare TCP sliding window with Stop-and-Wait protocol.",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 5231,
        "question": "What is the difference between TCP and UDP?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 5232,
        "question": "What is subnet masking and CIDR notation?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 524,
    "title": "A* Search Algorithm for 8-Puzzle Problem",
    "subject": "Introduction to Intelligent Systems",
    "semester": 5,
    "experimentNumber": 4,
    "description": "Implement informed heuristic search to solve state-space sliding tile puzzle.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Find optimal state path using A* search evaluation function f(n) = g(n) + h(n) with Manhattan distance.",
    "theory": "A* is complete and optimal when the heuristic function h(n) is admissible (never overestimates true cost).",
    "algorithm": "1. Insert start state into PriorityQueue ordered by f(n).\n2. Expand node with lowest f(n).\n3. Generate valid sliding moves (up, down, left, right).\n4. Compute Manhattan distance heuristic for each successor.\n5. Stop when goal state matched.",
    "codeInstructions": "Output step-by-step tile moves and search node expansion count.",
    "conclusion": "A* found optimal solution in minimum moves, expanding significantly fewer nodes than BFS.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"=== A* Search 8-Puzzle Simulator ===\");\n        System.out.println(\"Initial State: [1, 2, 3, 4, 0, 5, 6, 7, 8]\");\n        System.out.println(\"Goal State:    [1, 2, 3, 4, 5, 6, 7, 8, 0]\");\n        System.out.println(\"Heuristic: Manhattan Distance h = 2\");\n        System.out.println(\"Solution Path Found in 2 Moves!\");\n    }\n}",
    "pythonStarterCode": "def main():\n    print(\"=== A* Search 8-Puzzle Simulator ===\")\n    print(\"Initial State: [1, 2, 3, 4, 0, 5, 6, 7, 8]\")\n    print(\"Goal State:    [1, 2, 3, 4, 5, 6, 7, 8, 0]\")\n    print(\"Heuristic: Manhattan Distance h = 2\")\n    print(\"Solution Path Found in 2 Moves!\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 5241,
        "question": "What is an admissible heuristic?",
        "order": 1
      },
      {
        "id": 5242,
        "question": "Explain difference between A* and Greedy Best-First Search.",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 5241,
        "question": "What is Manhattan distance vs Euclidean distance?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 5242,
        "question": "Can A* get stuck in local optima?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 525,
    "title": "SRS Specification & UML Architectural Diagrams",
    "subject": "Software Engineering & Agile Methodology",
    "semester": 5,
    "experimentNumber": 5,
    "description": "Author IEEE 830 compliant Software Requirements Specification and class/sequence models.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Model functional and non-functional requirements, use cases, and class relationships for CodeLabX.",
    "theory": "Agile methodologies combine user stories, iterative sprint deliveries, and formal UML architecture representations.",
    "algorithm": "1. Capture functional requirements and user persona.\n2. Design Use Case diagram.\n3. Construct Class Diagram with multiplicity and dependencies.\n4. Draw Sequence Diagram illustrating synchronous request flows.",
    "codeInstructions": "Validate requirement traceability matrix against user acceptance criteria.",
    "conclusion": "Complete system architecture formulated, reducing ambiguities during development phases.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Agile Sprint Velocity: 42 Story Points\");\n        System.out.println(\"UML Diagrams: Use Case, Class, Sequence - Verified\");\n        System.out.println(\"Requirement Traceability Matrix: 100% Coverage\");\n    }\n}",
    "pythonStarterCode": "def main():\n    print(\"Agile Sprint Velocity: 42 Story Points\")\n    print(\"UML Diagrams: Use Case, Class, Sequence - Verified\")\n    print(\"Requirement Traceability Matrix: 100% Coverage\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 5251,
        "question": "What are differences between Scrum and Kanban?",
        "order": 1
      },
      {
        "id": 5252,
        "question": "Explain SOLID principles in software architecture.",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 5251,
        "question": "What is a burn-down chart?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 5252,
        "question": "What is the role of the Product Owner in Scrum?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 526,
    "title": "RESTful API with Node.js, Express, and JWT Auth",
    "subject": "Web Development Technologies",
    "semester": 5,
    "experimentNumber": 1,
    "description": "Develop scalable backend REST endpoints secured with JSON Web Tokens.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Implement token-based authentication with bcrypt password hashing and role-based route middleware.",
    "theory": "JWTs enable stateless authentication by encoding claims in a cryptographically signed HMAC or RSA token.",
    "algorithm": "1. Client submits credentials to /api/auth/login.\n2. Server verifies bcrypt hash.\n3. Sign JWT payload with secret key.\n4. Return token to client.\n5. Middleware verifies Authorization Bearer header on protected routes.",
    "codeInstructions": "Test login flow, token verification, and 401 unauthorized rejection scenarios.",
    "conclusion": "Implemented secure stateless authentication across distributed REST endpoints.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"JWT Authentication Middleware:\");\n        System.out.println(\"Header: eyJhbGciOiJIUzI1NiJ9...\");\n        System.out.println(\"Decoded Claims: { sub: 'inzamam@tcetmumbai.in', role: 'STUDENT' }\");\n        System.out.println(\"Status: 200 OK (Authorized)\");\n    }\n}",
    "pythonStarterCode": "def main():\n    print(\"JWT Authentication Middleware:\")\n    print(\"Header: eyJhbGciOiJIUzI1NiJ9...\")\n    print(\"Decoded Claims: {'sub': 'inzamam@tcetmumbai.in', 'role': 'STUDENT'}\")\n    print(\"Status: 200 OK (Authorized)\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 5261,
        "question": "Explain structure of JWT: Header.Payload.Signature.",
        "order": 1
      },
      {
        "id": 5262,
        "question": "What is CSRF and how do SameSite cookies prevent it?",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 5261,
        "question": "What is the difference between stateful sessions and JWTs?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 5262,
        "question": "What HTTP status code is returned for forbidden access?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 527,
    "title": "Deterministic Finite Automata (DFA) Simulator",
    "subject": "Theory of Computer Science",
    "semester": 5,
    "experimentNumber": 2,
    "description": "Construct transition tables and simulate DFA accepting regular languages.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Build a DFA engine accepting strings over {0, 1} having an even number of 0s and odd number of 1s.",
    "theory": "A DFA is a 5-tuple (Q, Sigma, delta, q0, F) recognizing regular languages with no external memory.",
    "algorithm": "1. Define states Q0, Q1, Q2, Q3.\n2. Start at initial state Q0.\n3. Read string symbol by symbol.\n4. Transition to delta(curr_state, symbol).\n5. Check if ending state is in F.",
    "codeInstructions": "Simulate input strings '001', '100', '0101' and verify acceptance.",
    "conclusion": "Simulated DFA transition table accurately parsed regular language inputs.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        int state = 0;\n        String input = \"001\";\n        int[][] delta = {{2, 1}, {3, 0}, {0, 3}, {1, 2}};\n        for (char c : input.toCharArray()) state = delta[state][c - '0'];\n        System.out.println(\"Input: \" + input + \" -> \" + (state == 1 ? \"ACCEPTED\" : \"REJECTED\"));\n    }\n}",
    "pythonStarterCode": "def main():\n    state = 0\n    inp = \"001\"\n    delta = [[2, 1], [3, 0], [0, 3], [1, 2]]\n    for c in inp:\n        state = delta[state][int(c)]\n    print(f\"Input: {inp} -> {'ACCEPTED' if state == 1 else 'REJECTED'}\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 5271,
        "question": "State Pumping Lemma for regular languages.",
        "order": 1
      },
      {
        "id": 5272,
        "question": "Convert NFA with epsilon transitions to equivalent DFA.",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 5271,
        "question": "What is the difference between DFA and Turing Machine?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 5272,
        "question": "What is Chomsky hierarchy?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 628,
    "title": "Containerizing Microservices with Docker and Compose",
    "subject": "Cloud Computing & Distributed Systems",
    "semester": 6,
    "experimentNumber": 3,
    "description": "Build multi-stage Dockerfiles and orchestrate multi-container microservice stacks.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Containerize frontend, Spring Boot backend, and PostgreSQL with health-checks and network bridges.",
    "theory": "Operating-system-level virtualization provides lightweight, isolated execution environments sharing the host kernel.",
    "algorithm": "1. Write Dockerfile with build and runtime stages.\n2. Configure docker-compose.yml with services, ports, and volumes.\n3. Define bridge network.\n4. Spin up containers with docker-compose up.\n5. Verify inter-container DNS discovery.",
    "codeInstructions": "Verify container logs and test inter-service HTTP ping endpoints.",
    "conclusion": "Demonstrated unified multi-container orchestration with rapid startup and zero host dependency contamination.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Docker Compose Cluster Status:\");\n        System.out.println(\"Service 'codelabx-web': UP (port 5173)\");\n        System.out.println(\"Service 'codelabx-api': UP (port 8080)\");\n        System.out.println(\"Bridge Network: codelabx-net ACTIVE\");\n    }\n}",
    "pythonStarterCode": "def main():\n    print(\"Docker Compose Cluster Status:\")\n    print(\"Service 'codelabx-web': UP (port 5173)\")\n    print(\"Service 'codelabx-api': UP (port 8080)\")\n    print(\"Bridge Network: codelabx-net ACTIVE\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 6281,
        "question": "Explain difference between Docker image layer caching and bind mounts.",
        "order": 1
      },
      {
        "id": 6282,
        "question": "What is Kubernetes Pod vs Docker Container?",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 6281,
        "question": "What is the difference between virtualization and containerization?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 6282,
        "question": "What is an ingress controller?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 629,
    "title": "Convolutional Neural Network (CNN) for Image Recognition",
    "subject": "Machine Learning & Deep Learning",
    "semester": 6,
    "experimentNumber": 4,
    "description": "Build deep convolutional neural network for image classification using PyTorch/TensorFlow.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Implement Conv2D, MaxPool2D, Dropout, and Dense layers to classify handwritten digits (MNIST).",
    "theory": "CNNs preserve spatial topology through learned convolution kernels, translation invariance, and pooling hierarchies.",
    "algorithm": "1. Normalize image tensors to [0, 1].\n2. Pass through Conv2D filters (3x3 kernel, ReLU).\n3. Apply MaxPool2D (2x2).\n4. Flatten and pass through Dense layer with Dropout.\n5. Compute CrossEntropyLoss and optimize via Adam.",
    "codeInstructions": "Train model for 5 epochs and compute confusion matrix and test accuracy.",
    "conclusion": "CNN achieved 98.7% test accuracy, outperforming standard dense multilayer perceptrons.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"CNN Model Architecture:\");\n        System.out.println(\"Conv2D(32, 3x3) -> MaxPool(2x2) -> Conv2D(64, 3x3) -> Dense(128) -> Softmax(10)\");\n        System.out.println(\"Epoch 5/5 - Loss: 0.0412 - Accuracy: 98.74%\");\n    }\n}",
    "pythonStarterCode": "def main():\n    print(\"CNN Model Architecture:\")\n    print(\"Conv2D(32, 3x3) -> MaxPool(2x2) -> Conv2D(64, 3x3) -> Dense(128) -> Softmax(10)\")\n    print(\"Epoch 5/5 - Loss: 0.0412 - Accuracy: 98.74%\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 6291,
        "question": "Why do CNNs use pooling layers?",
        "order": 1
      },
      {
        "id": 6292,
        "question": "What is vanishing gradient problem and how does ReLU mitigate it?",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 6291,
        "question": "What is transfer learning?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 6292,
        "question": "Explain precision, recall, and F1-score.",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 630,
    "title": "AES and RSA Cryptographic Algorithms Implementation",
    "subject": "Cryptography & Network Defense",
    "semester": 6,
    "experimentNumber": 5,
    "description": "Implement symmetric AES block encryption and asymmetric RSA public-key cryptosystems.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Demonstrate RSA keypair generation (p, q primes, e, d exponents) and ciphertext signing.",
    "theory": "RSA security relies on the hardness of large integer factorization. Public key (e, n) encrypts while private key (d, n) decrypts.",
    "algorithm": "1. Select primes p and q; compute n = p * q and phi = (p-1)*(q-1).\n2. Choose e coprime to phi.\n3. Compute d = e^-1 mod phi.\n4. Encrypt: C = M^e mod n.\n5. Decrypt: M = C^d mod n.",
    "codeInstructions": "Generate keys, encrypt plaintext message integer, and verify decrypted match.",
    "conclusion": "Asymmetric encryption and mathematical modular inverse properties successfully demonstrated.",
    "javaStarterCode": "import java.math.BigInteger;\n\npublic class Main {\n    public static void main(String[] args) {\n        BigInteger p = BigInteger.valueOf(61), q = BigInteger.valueOf(53);\n        BigInteger n = p.multiply(q);\n        BigInteger phi = p.subtract(BigInteger.ONE).multiply(q.subtract(BigInteger.ONE));\n        BigInteger e = BigInteger.valueOf(17);\n        BigInteger d = e.modInverse(phi);\n        BigInteger msg = BigInteger.valueOf(65);\n        BigInteger cipher = msg.modPow(e, n);\n        BigInteger decrypted = cipher.modPow(d, n);\n        System.out.println(\"Message: \" + msg + \" -> Cipher: \" + cipher + \" -> Decrypted: \" + decrypted);\n    }\n}",
    "pythonStarterCode": "def main():\n    p, q = 61, 53\n    n = p * q\n    phi = (p - 1) * (q - 1)\n    e = 17\n    d = pow(e, -1, phi)\n    msg = 65\n    cipher = pow(msg, e, n)\n    decrypted = pow(cipher, d, n)\n    print(f\"Message: {msg} -> Cipher: {cipher} -> Decrypted: {decrypted}\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 6301,
        "question": "Why must e and phi(n) be coprime in RSA?",
        "order": 1
      },
      {
        "id": 6302,
        "question": "Explain Diffie-Hellman key exchange algorithm.",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 6301,
        "question": "What is the difference between symmetric and asymmetric cryptography?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 6302,
        "question": "What is a Man-In-The-Middle (MITM) attack?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 631,
    "title": "Lexical Analyzer using Lex/Flex",
    "subject": "System Programming & Compiler Construction",
    "semester": 6,
    "experimentNumber": 1,
    "description": "Construct regular expression token parser identifying keywords, identifiers, and literals.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Generate token streams and symbol table entries for a subset of programming language syntax.",
    "theory": "The lexical analyzer reads input characters and groups them into meaningful token sequences according to lexical specifications.",
    "algorithm": "1. Specify regular expressions for tokens.\n2. Construct transition diagram.\n3. Match longest prefix.\n4. Emit token type and attribute value.\n5. Insert new identifiers into Symbol Table.",
    "codeInstructions": "Parse source statement 'int total = sum + 42;' and output token attributes.",
    "conclusion": "Tokens correctly identified and recorded in symbol table with O(N) single-pass scanning.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Lexical Tokens Generated:\");\n        System.out.println(\"<KEYWORD, 'int'> <IDENTIFIER, 'total'> <ASSIGN, '='> <IDENTIFIER, 'sum'> <PLUS, '+'> <NUMBER, 42> <SEMICOLON, ';'>\");\n    }\n}",
    "pythonStarterCode": "def main():\n    print(\"Lexical Tokens Generated:\")\n    print(\"<KEYWORD, 'int'> <IDENTIFIER, 'total'> <ASSIGN, '='> <IDENTIFIER, 'sum'> <PLUS, '+'> <NUMBER, 42> <SEMICOLON, ';'>\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 6311,
        "question": "How does Lex handle ambiguous token prefixes?",
        "order": 1
      },
      {
        "id": 6312,
        "question": "Explain structure and purpose of a Compiler Symbol Table.",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 6311,
        "question": "What are the phases of a compiler?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 6312,
        "question": "What is the difference between an interpreter and a compiler?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 632,
    "title": "Mobile UI Layouts, State Management, and Navigation",
    "subject": "Mobile Application Development",
    "semester": 6,
    "experimentNumber": 2,
    "description": "Develop cross-platform mobile screens with reactive state stores and route stacks.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Build mobile dashboard screen with interactive cards, bottom navigation bar, and dark mode theme toggle.",
    "theory": "Modern mobile frameworks utilize declarative UI components where interface state dictates visual tree re-rendering.",
    "algorithm": "1. Define MaterialApp/Flutter or React Native root.\n2. Implement ChangeNotifier or Context state provider.\n3. Build responsive column/grid view layouts.\n4. Handle gesture touches and route transitions.",
    "codeInstructions": "Simulate mobile state dispatch action and verify UI component re-render.",
    "conclusion": "Reactive mobile components rendered with consistent frame rate and responsive user touch handling.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Mobile UI Framework Initialized:\");\n        System.out.println(\"Screen Resolution: 1080x2400 (DPI 420)\");\n        System.out.println(\"Active Tab: /practicals (State: Synchronized)\");\n    }\n}",
    "pythonStarterCode": "def main():\n    print(\"Mobile UI Framework Initialized:\")\n    print(\"Screen Resolution: 1080x2400\")\n    print(\"Active Tab: /practicals (State: Synchronized)\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 6321,
        "question": "What is the difference between StatefulWidget and StatelessWidget?",
        "order": 1
      },
      {
        "id": 6322,
        "question": "Explain Android activity lifecycle callbacks.",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 6321,
        "question": "What is hot reload in mobile development?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 6322,
        "question": "How do you handle asynchronous network calls in mobile UI?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 733,
    "title": "Hadoop HDFS Operations & WordCount MapReduce",
    "subject": "Big Data Analytics",
    "semester": 7,
    "experimentNumber": 3,
    "description": "Implement distributed MapReduce job processing large unstructured text corpora.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Write Mapper and Reducer functions to count word occurrences across distributed HDFS partitions.",
    "theory": "MapReduce processes big data in parallel by splitting computation into map (key-value emission) and reduce (aggregation) phases.",
    "algorithm": "1. Mapper: parse line, split into words, emit (word, 1).\n2. Hadoop framework shuffles and sorts by key.\n3. Reducer: sum values for each key and emit (word, total_count).\n4. Write partitioned results back to HDFS.",
    "codeInstructions": "Run WordCount simulation on sample document text.",
    "conclusion": "Demonstrated linear scalability and fault-tolerant distributed batch data processing.",
    "javaStarterCode": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        String text = \"big data analytics hadoop mapreduce big data processing\";\n        Map<String, Integer> counts = new HashMap<>();\n        for (String w : text.split(\" \")) counts.put(w, counts.getOrDefault(w, 0) + 1);\n        System.out.println(\"MapReduce WordCount Results: \" + counts);\n    }\n}",
    "pythonStarterCode": "def main():\n    text = \"big data analytics hadoop mapreduce big data processing\"\n    counts = {}\n    for w in text.split(): counts[w] = counts.get(w, 0) + 1\n    print(\"MapReduce WordCount Results:\", counts)\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 7331,
        "question": "What is Hadoop NameNode and DataNode?",
        "order": 1
      },
      {
        "id": 7332,
        "question": "Why is Apache Spark faster than standard MapReduce?",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 7331,
        "question": "What is HDFS replication factor?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 7332,
        "question": "Explain the shuffle and sort phase in MapReduce.",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 734,
    "title": "Minimax Algorithm with Alpha-Beta Pruning",
    "subject": "Artificial Intelligence & Robotics",
    "semester": 7,
    "experimentNumber": 4,
    "description": "Implement game-playing adversarial search algorithm with branch pruning optimization.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Build Tic-Tac-Toe / Chess adversarial search agent selecting optimal utility moves with alpha-beta pruning.",
    "theory": "Alpha-beta pruning eliminates game tree branches that cannot influence the final decision, reducing search complexity from O(b^d) to O(b^(d/2)).",
    "algorithm": "1. Evaluate terminal state utility.\n2. Maximizing player updates alpha = max(alpha, value).\n3. Minimizing player updates beta = min(beta, value).\n4. If beta <= alpha: prune remaining siblings.\n5. Return optimal move.",
    "codeInstructions": "Demonstrate decision values across a game tree with alpha-beta cutoffs.",
    "conclusion": "Alpha-beta pruning skipped redundant evaluations, reducing searched nodes by over 50%.",
    "javaStarterCode": "public class Main {\n    static int minimax(int depth, int nodeIndex, boolean isMax, int[] scores, int h, int alpha, int beta) {\n        if (depth == h) return scores[nodeIndex];\n        if (isMax) {\n            int best = Integer.MIN_VALUE;\n            for (int i = 0; i < 2; i++) {\n                int val = minimax(depth + 1, nodeIndex * 2 + i, false, scores, h, alpha, beta);\n                best = Math.max(best, val); alpha = Math.max(alpha, best);\n                if (beta <= alpha) break;\n            }\n            return best;\n        } else {\n            int best = Integer.MAX_VALUE;\n            for (int i = 0; i < 2; i++) {\n                int val = minimax(depth + 1, nodeIndex * 2 + i, true, scores, h, alpha, beta);\n                best = Math.min(best, val); beta = Math.min(beta, best);\n                if (beta <= alpha) break;\n            }\n            return best;\n        }\n    }\n    public static void main(String[] args) {\n        int[] scores = {3, 5, 6, 9, 1, 2, 0, -1};\n        int optimal = minimax(0, 0, true, scores, 3, Integer.MIN_VALUE, Integer.MAX_VALUE);\n        System.out.println(\"Optimal Minimax Decision Value: \" + optimal);\n    }\n}",
    "pythonStarterCode": "def minimax(depth, node_index, is_max, scores, h, alpha, beta):\n    if depth == h: return scores[node_index]\n    if is_max:\n        best = -float('inf')\n        for i in range(2):\n            val = minimax(depth + 1, node_index * 2 + i, False, scores, h, alpha, beta)\n            best = max(best, val)\n            alpha = max(alpha, best)\n            if beta <= alpha: break\n        return best\n    else:\n        best = float('inf')\n        for i in range(2):\n            val = minimax(depth + 1, node_index * 2 + i, True, scores, h, alpha, beta)\n            best = min(best, val)\n            beta = min(beta, best)\n            if beta <= alpha: break\n        return best\n\ndef main():\n    scores = [3, 5, 6, 9, 1, 2, 0, -1]\n    optimal = minimax(0, 0, True, scores, 3, -float('inf'), float('inf'))\n    print(f\"Optimal Minimax Decision Value: {optimal}\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 7341,
        "question": "Under what conditions does Alpha-Beta pruning achieve optimal O(b^(d/2))?",
        "order": 1
      },
      {
        "id": 7342,
        "question": "What is horizon effect in game playing?",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 7341,
        "question": "What is an evaluation function in chess?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 7342,
        "question": "Explain forward kinematics vs inverse kinematics in robotics.",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 735,
    "title": "Solidity Smart Contract for Decentralized Voting",
    "subject": "Blockchain & Smart Contracts",
    "semester": 7,
    "experimentNumber": 5,
    "description": "Author, deploy, and interact with an Ethereum smart contract using Web3.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Write Solidity smart contract with vote casting, double-voting prevention, and winner calculation.",
    "theory": "Smart contracts are self-executing code stored on immutable distributed ledgers that execute automatically when predefined rules are met.",
    "algorithm": "1. Define chairperson and candidates mapping.\n2. Author giveRightToVote() restricted to chairperson.\n3. Author vote() recording vote and setting hasVoted boolean.\n4. Author winningProposal() computing candidate with max votes.",
    "codeInstructions": "Deploy contract simulation, cast votes from multiple address accounts, and query winner.",
    "conclusion": "Verified transparent, tamper-proof voting logic with cryptographic transaction verification.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Smart Contract: DecentralizedVoting.sol\");\n        System.out.println(\"Contract Address: 0x71C...3a9B (Ethereum Sepolia)\");\n        System.out.println(\"Voter 0x12A... cast vote for Candidate 1 (Alice)\");\n        System.out.println(\"Current Winner: Alice (Votes: 42)\");\n    }\n}",
    "pythonStarterCode": "def main():\n    print(\"Smart Contract: DecentralizedVoting.sol\")\n    print(\"Contract Address: 0x71C...3a9B\")\n    print(\"Voter 0x12A... cast vote for Candidate 1\")\n    print(\"Current Winner: Alice (Votes: 42)\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 7351,
        "question": "What is Gas and Gas Limit in Ethereum?",
        "order": 1
      },
      {
        "id": 7352,
        "question": "What is reentrancy vulnerability in Solidity?",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 7351,
        "question": "What is proof-of-work vs proof-of-stake?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 7352,
        "question": "What is the role of EVM (Ethereum Virtual Machine)?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 736,
    "title": "Text Preprocessing, Tokenization, and TF-IDF",
    "subject": "Natural Language Processing",
    "semester": 7,
    "experimentNumber": 1,
    "description": "Extract linguistic features from text using stopword filtering, lemmatization, and TF-IDF weighting.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Convert document collection into sparse TF-IDF feature matrices for text categorization.",
    "theory": "TF-IDF evaluates how important a word is to a document within a corpus, downweighting common non-discriminative terms.",
    "algorithm": "1. Clean text and remove punctuation.\n2. Tokenize and apply lemmatization.\n3. Compute Term Frequency TF(t, d).\n4. Compute Inverse Document Frequency IDF(t) = log(N / df(t)).\n5. TF-IDF = TF * IDF.",
    "codeInstructions": "Compute TF-IDF scores for query terms across 3 documents.",
    "conclusion": "Extracted high-value discriminative keyword weights for downstream classification.",
    "javaStarterCode": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        double tf = 2.0 / 10.0;\n        double idf = Math.log(100.0 / 5.0);\n        double tfidf = tf * idf;\n        System.out.printf(\"Computed TF-IDF Score for term 'compiler': %.4f%n\", tfidf);\n    }\n}",
    "pythonStarterCode": "import math\n\ndef main():\n    tf = 2.0 / 10.0\n    idf = math.log(100.0 / 5.0)\n    print(f\"Computed TF-IDF Score for term 'compiler': {tf * idf:.4f}\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 7361,
        "question": "What is the difference between stemming and lemmatization?",
        "order": 1
      },
      {
        "id": 7362,
        "question": "How does Word2Vec capture semantic word similarities?",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 7361,
        "question": "What is an n-gram model?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 7362,
        "question": "What is attention mechanism in Transformers?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 737,
    "title": "Infrastructure as Code with Terraform and Docker",
    "subject": "DevOps & Site Reliability Engineering",
    "semester": 7,
    "experimentNumber": 2,
    "description": "Provision cloud infrastructure declaratively and automate deployment pipelines.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Define reproducible infrastructure using Terraform manifests (.tf) and configure health probes.",
    "theory": "Infrastructure as Code (IaC) eliminates configuration drift by managing servers, networks, and storage as version-controlled code.",
    "algorithm": "1. Define provider (AWS / Docker / LocalStack).\n2. Declare resource blocks with desired configuration state.\n3. Run terraform plan to preview execution changes.\n4. Run terraform apply to provision state.\n5. Monitor resources via health check endpoints.",
    "codeInstructions": "Validate Terraform configuration syntax and print resource dependency graph.",
    "conclusion": "Provisioned automated cloud infrastructure with zero manual configuration drift.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Terraform Plan: 3 to add, 0 to change, 0 to destroy.\");\n        System.out.println(\"Resource 'docker_container.codelabx_db': Provisioned.\");\n        System.out.println(\"Infrastructure State: Clean & Monitored.\");\n    }\n}",
    "pythonStarterCode": "def main():\n    print(\"Terraform Plan: 3 to add, 0 to change, 0 to destroy.\")\n    print(\"Resource 'docker_container.codelabx_db': Provisioned.\")\n    print(\"Infrastructure State: Clean & Monitored.\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 7371,
        "question": "Explain difference between mutable and immutable infrastructure.",
        "order": 1
      },
      {
        "id": 7372,
        "question": "What are the core Four Golden Signals in Site Reliability Engineering?",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 7371,
        "question": "What is Blue-Green deployment vs Canary deployment?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 7372,
        "question": "What is terraform.tfstate file?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 838,
    "title": "Memory Dump Analysis & Volatility Forensic Framework",
    "subject": "Cyber Forensics & Incident Response",
    "semester": 8,
    "experimentNumber": 3,
    "description": "Acquire physical memory snapshots and extract volatile forensic evidence of malware artifacts.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Analyze volatile RAM dumps using memory forensics plugins (imageinfo, pslist, netscan, malfind).",
    "theory": "RAM contains ephemeral forensic evidence including active network connections, decrypted encryption keys, and injected DLL processes.",
    "algorithm": "1. Capture raw memory dump (.raw / .dmp).\n2. Identify memory profile using imageinfo.\n3. List processes (pslist / pstree) to spot unlinked hidden PIDs.\n4. Inspect sockets and netscan for C2 callbacks.\n5. Dump suspicious executables with malfind for disassembly.",
    "codeInstructions": "Extract rogue process handles and verify cryptographic hashes of dumped binaries.",
    "conclusion": "Identified injected process and recovered malware payload from volatile memory image.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"=== Volatility Forensics Analysis ===\");\n        System.out.println(\"Profile: Win10x64_19041\");\n        System.out.println(\"Suspicious PID: 4892 (svchost.exe - Unparented)\");\n        System.out.println(\"Established Connection: 198.51.100.42:4444 (ESTABLISHED)\");\n        System.out.println(\"Malfind Alert: PAGE_EXECUTE_READWRITE injected memory section detected!\");\n    }\n}",
    "pythonStarterCode": "def main():\n    print(\"=== Volatility Forensics Analysis ===\")\n    print(\"Profile: Win10x64_19041\")\n    print(\"Suspicious PID: 4892 (svchost.exe - Unparented)\")\n    print(\"Established Connection: 198.51.100.42:4444\")\n    print(\"Malfind Alert: Injected executable code detected!\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 8381,
        "question": "What is Order of Volatility in digital evidence collection?",
        "order": 1
      },
      {
        "id": 8382,
        "question": "Explain Chain of Custody documentation requirements.",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 8381,
        "question": "What is steganography and how is it detected?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 8382,
        "question": "What is anti-forensics?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 839,
    "title": "Parallel Matrix Multiplication using OpenMP Threads",
    "subject": "High Performance Computing",
    "semester": 8,
    "experimentNumber": 4,
    "description": "Parallelize dense matrix multiplication across multi-core processors using OpenMP pragmas.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Implement parallel matrix multiplication and calculate speedup factor over serial execution.",
    "theory": "Amdahl's Law bounds maximum parallel speedup based on the serial fraction of a program. OpenMP distributes loop iterations across worker threads.",
    "algorithm": "1. Allocate matrices A, B, C of size N x N.\n2. Initialize with test values.\n3. Parallelize outer loop with #pragma omp parallel for private(j, k) shared(A, B, C).\n4. Record CPU timestamps.\n5. Compute Speedup S = T_serial / T_parallel.",
    "codeInstructions": "Compute speedup for 1000x1000 matrix multiplication across 4 CPU cores.",
    "conclusion": "Achieved 3.6x speedup on 4-core CPU, demonstrating near-linear parallel scaling.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        int n = 500;\n        System.out.println(\"Parallel Matrix Multiplication (\" + n + \"x\" + n + \")\");\n        System.out.println(\"Threads: 8 Worker Cores\");\n        System.out.println(\"Execution Time: 142 ms (Serial Time: 520 ms)\");\n        System.out.printf(\"Calculated Speedup Factor: %.2fx%n\", 520.0 / 142.0);\n    }\n}",
    "pythonStarterCode": "def main():\n    print(\"Parallel Matrix Multiplication (500x500)\")\n    print(\"Threads: 8 Worker Cores\")\n    print(\"Execution Time: 142 ms (Serial: 520 ms)\")\n    print(f\"Calculated Speedup: {520 / 142:.2f}x\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 8391,
        "question": "State Amdahl's Law and Gustafson's Law.",
        "order": 1
      },
      {
        "id": 8392,
        "question": "Explain false sharing in cache coherence protocols.",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 8391,
        "question": "What is the difference between shared memory and distributed memory architectures?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 8392,
        "question": "What is a GPU warp?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 840,
    "title": "ESP32 / MQTT Telemetry Stream & Sensor Dashboard",
    "subject": "Internet of Things & Edge AI",
    "semester": 8,
    "experimentNumber": 5,
    "description": "Acquire real-time sensor telemetry and publish to MQTT message broker for edge monitoring.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Interface DHT22 temperature/humidity sensor with ESP32 microcontroller and stream JSON telemetry via MQTT.",
    "theory": "MQTT is an ultra-lightweight publish/subscribe messaging protocol designed for constrained IoT devices and low-bandwidth networks.",
    "algorithm": "1. Connect ESP32 to Wi-Fi access point.\n2. Initialize PubSubClient connected to MQTT broker.\n3. Read sensor analog/digital pins every 2000ms.\n4. Serialize telemetry to JSON payload.\n5. Publish to topic 'sensors/lab/telemetry'.",
    "codeInstructions": "Format sensor payload and verify QoS 1 delivery acknowledgment.",
    "conclusion": "Telemetry streamed reliably with sub-50ms latency across MQTT message queues.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"MQTT Telemetry Client Connected:\");\n        System.out.println(\"Broker: mqtt://broker.codelabx.in:1883 [QoS 1]\");\n        System.out.println(\"Published: { 'temperature': 24.6, 'humidity': 58.2, 'unit': 'C' }\");\n        System.out.println(\"Status: Broker ACK Received\");\n    }\n}",
    "pythonStarterCode": "def main():\n    print(\"MQTT Telemetry Client Connected:\")\n    print(\"Broker: mqtt://broker.codelabx.in:1883 [QoS 1]\")\n    print(\"Published: {'temperature': 24.6, 'humidity': 58.2}\")\n    print(\"Status: Broker ACK Received\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 8401,
        "question": "Explain MQTT Quality of Service levels (QoS 0, 1, 2).",
        "order": 1
      },
      {
        "id": 8402,
        "question": "What is Edge Impulse and TinyML optimization?",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 8401,
        "question": "What is the difference between CoAP and MQTT?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 8402,
        "question": "Why are low-power sleep modes critical in battery-powered IoT devices?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 841,
    "title": "Quantum Superposition & Bell State Circuit Simulation",
    "subject": "Quantum Computing & Information",
    "semester": 8,
    "experimentNumber": 1,
    "description": "Simulate quantum circuits, Hadamard superposition, and Einstein-Podolsky-Rosen (EPR) entanglement.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Construct 2-qubit Bell state circuit (|00> + |11>)/sqrt(2) and verify measurement correlations.",
    "theory": "Quantum computers leverage superposition and quantum entanglement to evaluate exponentially large state spaces simultaneously.",
    "algorithm": "1. Initialize 2 qubits to state |00>.\n2. Apply Hadamard gate H to qubit 0: (|0> + |1>)/sqrt(2).\n3. Apply CNOT gate with qubit 0 as control and qubit 1 as target.\n4. Measure both qubits into classical bits.\n5. Sample measurement histogram (50% |00>, 50% |11>).",
    "codeInstructions": "Simulate quantum state vector transformation and output state probabilities.",
    "conclusion": "Verified maximum quantum entanglement; measurements yielded strictly correlated outcomes.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Quantum Circuit Simulation (Qiskit Engine):\");\n        System.out.println(\"q0: --[ H ]--*--\");\n        System.out.println(\"q1: ---------X--\");\n        System.out.println(\"Final State Vector: 0.7071|00> + 0.7071|11>\");\n        System.out.println(\"Measurement Probabilities: |00>: 50.0%, |11>: 50.0%\");\n    }\n}",
    "pythonStarterCode": "def main():\n    print(\"Quantum Circuit Simulation:\")\n    print(\"q0: --[ H ]--*--\")\n    print(\"q1: ---------X--\")\n    print(\"State Vector: 0.7071|00> + 0.7071|11>\")\n    print(\"Probabilities: |00|: 50%, |11|: 50%\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 8411,
        "question": "Explain no-cloning theorem in quantum mechanics.",
        "order": 1
      },
      {
        "id": 8412,
        "question": "How does Grover's search achieve quadratic speedup O(sqrt(N))?",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 8411,
        "question": "What is a Qubit and Bloch Sphere representation?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 8412,
        "question": "What is quantum decoherence?",
        "marks": 2,
        "order": 2
      }
    ]
  },
  {
    "id": 842,
    "title": "System Architecture, Scalability Validation & End-to-End Testing",
    "subject": "Capstone Major Project Phase-II",
    "semester": 8,
    "experimentNumber": 2,
    "description": "Perform comprehensive end-to-end integration validation, load testing, and defense audit.",
    "status": "PUBLISHED",
    "updatedAt": "2026-10-01T10:00:00Z",
    "assignedCount": 6,
    "completedCount": 4,
    "progressPercent": 75,
    "progressStatus": "IN_PROGRESS",
    "aim": "Validate system throughput, automated test coverage, and security defenses for CodeLabX platform.",
    "theory": "Capstone engineering validation synthesizes full-stack engineering, performance benchmarking, and architectural defense.",
    "algorithm": "1. Execute automated test suite (Unit, Integration, E2E).\n2. Run Apache JMeter load test with 500 concurrent virtual users.\n3. Verify 99th percentile response latency < 250ms.\n4. Perform OWASP Top-10 security audit.\n5. Compile final engineering defense deliverables.",
    "codeInstructions": "Validate test metrics and output readiness checklist.",
    "conclusion": "All acceptance criteria verified; system cleared for production deployment and university review.",
    "javaStarterCode": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"CodeLabX Capstone Major Project Validation:\");\n        System.out.println(\"Automated Tests: 48/48 Passing (100%)\");\n        System.out.println(\"Load Benchmark: 500 Virtual Users @ 210ms P99 Latency\");\n        System.out.println(\"Security Audit: OWASP Top-10 Verified (No Vulnerabilities)\");\n        System.out.println(\"Status: APPROVED FOR FINAL DEFENSE\");\n    }\n}",
    "pythonStarterCode": "def main():\n    print(\"CodeLabX Capstone Major Project Validation:\")\n    print(\"Automated Tests: 48/48 Passing (100%)\")\n    print(\"Load Benchmark: 500 Virtual Users @ 210ms P99\")\n    print(\"Security Audit: Clean\")\n    print(\"Status: APPROVED FOR FINAL DEFENSE\")\n\nif __name__ == '__main__':\n    main()",
    "programmingLanguage": "JAVA",
    "practiceQuestions": [
      {
        "id": 8421,
        "question": "How do you conduct Chaos Engineering experiments on distributed systems?",
        "order": 1
      },
      {
        "id": 8422,
        "question": "Explain disaster recovery RPO and RTO metrics.",
        "order": 2
      }
    ],
    "vivaQuestions": [
      {
        "id": 8421,
        "question": "What architectural pattern was used in the capstone project?",
        "marks": 2,
        "order": 1
      },
      {
        "id": 8422,
        "question": "How is data consistency maintained across microservices?",
        "marks": 2,
        "order": 2
      }
    ]
  }
];
