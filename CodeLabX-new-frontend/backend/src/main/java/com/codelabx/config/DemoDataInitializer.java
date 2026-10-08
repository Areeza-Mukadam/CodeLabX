package com.codelabx.config;

import com.codelabx.practical.*;
import com.codelabx.user.Role;
import com.codelabx.user.UserAccount;
import com.codelabx.user.UserRepository;
import com.codelabx.subject.AcademicSubject;
import com.codelabx.subject.AcademicSubjectRepository;
import com.codelabx.viva.VivaQuestion;
import com.codelabx.viva.VivaQuestionRepository;
import com.codelabx.execution.ProgrammingLanguage;
import com.codelabx.execution.ProgrammingLanguageRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DemoDataInitializer {
    @Bean
    CommandLineRunner seedDemoData(UserRepository users, PracticalRepository practicals,
                                   AcademicSubjectRepository subjects,
                                   PracticalAssignmentRepository assignments,
                                   PracticeQuestionRepository practiceQuestions,
                                   VivaQuestionRepository vivaQuestions,
                                   ProgrammingLanguageRepository languages,
                                   PasswordEncoder passwordEncoder) {
        return args -> {
            seedLanguage(languages,"Java","JAVA","17.x");
            seedLanguage(languages,"Python","PYTHON","3.x");

            seedAllSubjects(subjects);

            user(users, passwordEncoder, "CodeLabX Administrator", "admin@tcetmumbai.in", Role.ADMIN);
            user(users, passwordEncoder, "TCET Exam Cell Admin", "admin.exam@tcetmumbai.in", Role.ADMIN);
            UserAccount teacher = user(users, passwordEncoder, "Samir Sawant", "teacher@tcetmumbai.in", Role.TEACHER);
            UserAccount teacherIt = user(users, passwordEncoder, "Rashmi Thakur", "faculty.it@tcetmumbai.in", Role.TEACHER);
            UserAccount teacherAiml = user(users, passwordEncoder, "Rajesh Patel", "faculty.aiml@tcetmumbai.in", Role.TEACHER);
            UserAccount student = user(users, passwordEncoder, "Areeza Mukadam", "student@tcetmumbai.in", Role.STUDENT);
            UserAccount student2 = user(users, passwordEncoder, "Sagar Mishra", "student2@tcetmumbai.in", Role.STUDENT);
            UserAccount studentRahul = user(users, passwordEncoder, "Rahul Verma", "rahul.verma.se.b@tcetmumbai.in", Role.STUDENT);
            UserAccount studentTanvi = user(users, passwordEncoder, "Tanvi Patil", "tanvi.patil.se.b@tcetmumbai.in", Role.STUDENT);
            UserAccount studentAarav = user(users, passwordEncoder, "Aarav Mehta", "aarav.mehta.se.a@tcetmumbai.in", Role.STUDENT);
            UserAccount studentSneha = user(users, passwordEncoder, "Sneha Deshmukh", "sneha.deshmukh.te.a@tcetmumbai.in", Role.STUDENT);
            UserAccount studentIt1 = user(users, passwordEncoder, "Rohan Sharma", "rohan.sharma.se.b@tcetmumbai.in", Role.STUDENT);
            UserAccount studentIt2 = user(users, passwordEncoder, "Neha Kulkarni", "neha.kulkarni.te.b@tcetmumbai.in", Role.STUDENT);
            UserAccount studentAiml1 = user(users, passwordEncoder, "Priya Shah", "priya.shah.se.b@tcetmumbai.in", Role.STUDENT);
            UserAccount studentAiml2 = user(users, passwordEncoder, "Aditya Joshi", "aditya.joshi.te.a@tcetmumbai.in", Role.STUDENT);
            UserAccount studentInzamam = user(users, passwordEncoder, "Inzamam Khan", "inzamam.khan.te.b@tcetmumbai.in", Role.STUDENT);
            UserAccount studentInzamamShort = user(users, passwordEncoder, "Inzamam Khan", "inzamam@tcetmumbai.in", Role.STUDENT);
            List<UserAccount> allStudents = List.of(student, student2, studentRahul, studentTanvi, studentAarav, studentSneha, studentIt1, studentIt2, studentAiml1, studentAiml2, studentInzamam, studentInzamamShort);
            roster(student, "SE", "B", "Computer Engineering", "SE-B-01");
            roster(student2, "TE", "A", "Computer Engineering", "TE-A-18");
            roster(studentRahul, "SE", "B", "Computer Engineering", "SE-B-03");
            roster(studentTanvi, "SE", "B", "Computer Engineering", "SE-B-04");
            roster(studentAarav, "SE", "A", "Computer Engineering", "SE-A-01");
            roster(studentSneha, "TE", "A", "Computer Engineering", "TE-A-01");
            roster(studentIt1, "SE", "B", "Information Technology", "SE-IT-01");
            roster(studentIt2, "TE", "B", "Information Technology", "TE-IT-02");
            roster(studentAiml1, "SE", "B", "Artificial Intelligence & Machine Learning", "SE-AIML-01");
            roster(studentAiml2, "TE", "A", "Artificial Intelligence & Machine Learning", "TE-AIML-02");
            roster(studentInzamam, "TE", "B", "Computer Engineering", "13");
            roster(studentInzamamShort, "TE", "B", "Computer Engineering", "13");
            users.saveAll(allStudents);
            teacher.setDepartment("Computer Engineering"); teacherIt.setDepartment("Information Technology"); teacherAiml.setDepartment("Artificial Intelligence & Machine Learning");
            users.saveAll(List.of(teacher,teacherIt,teacherAiml));

            seedAllCurriculum(teacher, allStudents, practicals, assignments, practiceQuestions, vivaQuestions);
        };
    }

    private void seedLanguage(ProgrammingLanguageRepository languages,String name,String code,String version){
        if(languages.findByCodeIgnoreCase(code).isEmpty()){var l=new ProgrammingLanguage();l.setName(name);l.setCode(code);l.setRuntimeVersion(version);l.setEnabled(true);languages.save(l);}
    }

    private void roster(UserAccount user, String cohort, String division, String department, String rollNo) {
        user.setCohort(cohort); user.setDivision(division); user.setDepartment(department); user.setRollNo(rollNo);
    }

    private void subject(AcademicSubjectRepository subjects, String code, String name, int semester) {
        AcademicSubject subject = subjects.findByCodeIgnoreCaseAndSemester(code, semester)
                .orElseGet(AcademicSubject::new);
        subject.setCode(code);
        subject.setName(name);
        subject.setSemester(semester);
        subjects.save(subject);
    }

    private void seedAllSubjects(AcademicSubjectRepository subjects) {
        subject(subjects, "EM-I", "Engineering Mathematics - I", 1);
        subject(subjects, "APSD", "Applied Physics & Semiconductor Devices", 1);
        subject(subjects, "SPC", "Structured Programming in C", 1);
        subject(subjects, "BEE", "Basic Electrical & Electronics Engineering", 1);
        subject(subjects, "EWDF", "Engineering Workshop & Digital Fabrication", 1);
        subject(subjects, "EM-II", "Engineering Mathematics - II", 2);
        subject(subjects, "ACMS", "Applied Chemistry & Material Science", 2);
        subject(subjects, "OOP-CPP", "Object-Oriented Programming with C++", 2);
        subject(subjects, "EMD", "Engineering Mechanics & Dynamics", 2);
        subject(subjects, "PCSS", "Professional Communication & Soft Skills", 2);
        subject(subjects, "DS", "Data Structures", 3);
        subject(subjects, "DSGT", "Discrete Structures & Graph Theory", 3);
        subject(subjects, "DLCA", "Digital Logic & Computer Architecture", 3);
        subject(subjects, "CGV", "Computer Graphics & Visualization", 3);
        subject(subjects, "OOP-JAVA", "Object Oriented Programming with Java", 3);
        subject(subjects, "DAA", "Design and Analysis of Algorithms", 4);
        subject(subjects, "DBMS", "Database Management Systems", 4);
        subject(subjects, "OS", "Operating Systems", 4);
        subject(subjects, "MPMC", "Microprocessors and Microcontrollers", 4);
        subject(subjects, "PDS", "Python for Data Science", 4);
        subject(subjects, "CNS", "Computer Networks & Security", 5);
        subject(subjects, "IIS", "Introduction to Intelligent Systems", 5);
        subject(subjects, "SEAM", "Software Engineering & Agile Methodology", 5);
        subject(subjects, "WDT", "Web Development Technologies", 5);
        subject(subjects, "TCS", "Theory of Computer Science", 5);
        subject(subjects, "CCDS", "Cloud Computing & Distributed Systems", 6);
        subject(subjects, "MLDL", "Machine Learning & Deep Learning", 6);
        subject(subjects, "CND", "Cryptography & Network Defense", 6);
        subject(subjects, "SPCC", "System Programming & Compiler Construction", 6);
        subject(subjects, "MAD", "Mobile Application Development", 6);
        subject(subjects, "BDA", "Big Data Analytics", 7);
        subject(subjects, "AIR", "Artificial Intelligence & Robotics", 7);
        subject(subjects, "BSC", "Blockchain & Smart Contracts", 7);
        subject(subjects, "NLP", "Natural Language Processing", 7);
        subject(subjects, "DSRE", "DevOps & Site Reliability Engineering", 7);
        subject(subjects, "CFIR", "Cyber Forensics & Incident Response", 8);
        subject(subjects, "HPC", "High Performance Computing", 8);
        subject(subjects, "IOTEA", "Internet of Things & Edge AI", 8);
        subject(subjects, "QCI", "Quantum Computing & Information", 8);
        subject(subjects, "CMP", "Capstone Major Project Phase-II", 8);
    }

    private void seedExp(
            PracticalRepository practicals,
            PracticalAssignmentRepository assignments,
            PracticeQuestionRepository practiceQuestions,
            VivaQuestionRepository vivaQuestions,
            UserAccount teacher,
            List<UserAccount> students,
            int semester,
            String subject,
            String title,
            int expNo,
            String description,
            String aim,
            String theory,
            String algorithm,
            String instructions,
            String conclusion,
            String javaCode,
            String pyCode,
            List<String> practice,
            List<String> viva
    ) {
        Practical practical = practicals.findByTitleIgnoreCase(title).orElseGet(Practical::new);
        boolean isNew = practical.getId() == null;
        if (isNew) {
            practical.setCreatedBy(teacher);
            practical.setStatus(PracticalStatus.PUBLISHED);
        }
        practical.setSemester(semester);
        practical.setSubject(subject);
        practical.setTitle(title);
        practical.setExperimentNumber(expNo);
        practical.setDescription(description);
        practical.setAim(aim);
        practical.setTheory(theory);
        practical.setAlgorithm(algorithm);
        practical.setCodeInstructions(instructions);
        practical.setConclusion(conclusion);
        practical.setProgrammingLanguage("JAVA");
        if (javaCode != null && !javaCode.isBlank()) practical.setJavaStarterCode(javaCode);
        if (pyCode != null && !pyCode.isBlank()) practical.setPythonStarterCode(pyCode);
        practical.setStatus(PracticalStatus.PUBLISHED);
        practical = practicals.save(practical);

        if (practiceQuestions.findByPracticalIdOrderBySortOrderAsc(practical.getId()).isEmpty()) {
            for (int i = 0; i < practice.size(); i++) {
                PracticeQuestion q = new PracticeQuestion();
                q.setPractical(practical);
                q.setQuestion(practice.get(i));
                q.setExpectedAnswer("Explain clearly based on theoretical principles and observed outputs.");
                q.setSortOrder(i + 1);
                practiceQuestions.save(q);
            }
        }
        if (vivaQuestions.findByPracticalIdOrderBySortOrderAsc(practical.getId()).isEmpty()) {
            for (int i = 0; i < viva.size(); i++) {
                VivaQuestion q = new VivaQuestion();
                q.setPractical(practical);
                q.setQuestion(viva.get(i));
                q.setMarks(2);
                q.setSortOrder(i + 1);
                vivaQuestions.save(q);
            }
        }
        for (UserAccount enrolled : students) {
            if (!assignments.existsByPracticalIdAndStudentId(practical.getId(), enrolled.getId())) {
                PracticalAssignment assignment = new PracticalAssignment();
                assignment.setPractical(practical);
                assignment.setStudent(enrolled);
                assignments.save(assignment);
            }
        }
    }

    private void seedAllCurriculum(
            UserAccount teacher,
            List<UserAccount> students,
            PracticalRepository practicals,
            PracticalAssignmentRepository assignments,
            PracticeQuestionRepository practiceQuestions,
            VivaQuestionRepository vivaQuestions
    ) {
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            1,
            "Engineering Mathematics - I",
            "Matrix Inversion & System of Linear Equations",
            1,
            "Calculate rank and inverse of matrices to solve linear systems.",
            "Implement matrix operations to solve Ax = B using Gaussian elimination and matrix inversion.",
            "Linear algebra forms the backbone of machine learning and 3D computer graphics. A system Ax=B has a unique solution if det(A) != 0.",
            "1. Represent matrix in 2D array.\n2. Compute determinant and check invertibility.\n3. Apply row transformations.\n4. Output solution vector x.",
            "Write a program that takes matrix dimension N and values for A and B, then outputs vector x.",
            "Demonstrated matrix inversion and Gauss elimination with O(N^3) polynomial time complexity.",
            "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\"=== Matrix Operations Lab ===\");\n        double[][] a = {{2, 1}, {5, 7}};\n        double det = a[0][0]*a[1][1] - a[0][1]*a[1][0];\n        System.out.println(\"Determinant: \" + det);\n        System.out.println(\"Matrix is \" + (det != 0 ? \"Invertible\" : \"Singular\"));\n    }\n}",
            "def main():\n    print(\"=== Matrix Operations Lab ===\")\n    a = [[2, 1], [5, 7]]\n    det = a[0][0]*a[1][1] - a[0][1]*a[1][0]\n    print(f\"Determinant: {det}\")\n    print(f\"Matrix is {'Invertible' if det != 0 else 'Singular'}\")\n\nif __name__ == '__main__':\n    main()",
            List.of("Explain condition for matrix invertibility.", "How does rank relate to solution uniqueness?"),
            List.of("What is time complexity of Gauss Jordan elimination?", "What is condition number of a matrix?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            1,
            "Engineering Mathematics - I",
            "Numerical Solutions of Differential Equations",
            2,
            "Apply Euler's method and Runge-Kutta 4th order to solve ODEs.",
            "Numerically approximate solutions to initial value problems using Euler and RK-4 methods.",
            "Ordinary differential equations model physical dynamic systems. RK-4 achieves fourth-order accuracy with O(h^4) error bound.",
            "1. Define derivative f(x, y).\n2. Set step size h and initial condition (x0, y0).\n3. Compute k1, k2, k3, k4 slopes.\n4. Update y = y + (h/6)*(k1 + 2k2 + 2k3 + k4).\n5. Repeat until target x.",
            "Compute the value of y(x) at step increments of 0.1 for dy/dx = x + y.",
            "Observed that RK-4 provides orders of magnitude higher accuracy than standard Euler method for the same step size.",
            "import java.util.*;\n\npublic class Main {\n    static double f(double x, double y) { return x + y; }\n    public static void main(String[] args) {\n        double x0 = 0, y0 = 1, h = 0.1, xTarget = 0.5;\n        double x = x0, y = y0;\n        while (x < xTarget) {\n            double k1 = f(x, y);\n            double k2 = f(x + h/2, y + h*k1/2);\n            double k3 = f(x + h/2, y + h*k2/2);\n            double k4 = f(x + h, y + h*k3);\n            y += (h/6.0)*(k1 + 2*k2 + 2*k3 + k4);\n            x += h;\n        }\n        System.out.printf(\"y(%.1f) = %.5f%n\", xTarget, y);\n    }\n}",
            "def f(x, y):\n    return x + y\n\ndef main():\n    x, y, h, target = 0.0, 1.0, 0.1, 0.5\n    while x < target:\n        k1 = f(x, y)\n        k2 = f(x + h/2, y + h*k1/2)\n        k3 = f(x + h/2, y + h*k2/2)\n        k4 = f(x + h, y + h*k3)\n        y += (h/6.0)*(k1 + 2*k2 + 2*k3 + k4)\n        x += h\n    print(f\"y({target:.1f}) = {y:.5f}\")\n\nif __name__ == '__main__':\n    main()",
            List.of("Compare truncation error of Euler vs RK-4.", "Why is RK-4 called a predictor-corrector style method?"),
            List.of("What is the global error order of RK-4?", "What happens if step size h is too large?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            1,
            "Applied Physics & Semiconductor Devices",
            "Energy Band Gap Determination of a Semiconductor",
            3,
            "Calculate the forbidden energy band gap (Eg) of a Germanium/Silicon diode.",
            "Determine the band gap of a semiconductor by reverse bias saturation current variation with temperature.",
            "Semiconductor conductivity increases with temperature as electrons cross the forbidden energy gap Eg.",
            "1. Connect diode in reverse bias.\n2. Heat oil bath and record temperature T (Kelvin).\n3. Measure reverse saturation current Is.\n4. Plot ln(Is) vs 10^3/T.\n5. Slope gives Eg / (2 * k).",
            "Simulate linear regression over temperature-current data points to calculate Eg in electron-volts.",
            "Calculated band gap Eg for Silicon is approximately 1.12 eV, agreeing with standard reference values.",
            "public class Main {\n    public static void main(String[] args) {\n        double slope = 6.45;\n        double k = 8.617e-5;\n        double eg = 2 * slope * 1000 * k;\n        System.out.printf(\"Calculated Semiconductor Band Gap Eg: %.2f eV%n\", eg);\n    }\n}",
            "def main():\n    slope = 6.45\n    k = 8.617e-5\n    eg = 2 * slope * 1000 * k\n    print(f\"Calculated Semiconductor Band Gap Eg: {eg:.2f} eV\")\n\nif __name__ == '__main__':\n    main()",
            List.of("How does doping affect Fermi energy level?", "Why does reverse saturation current double every 10 deg C?"),
            List.of("What is the value of band gap in Germanium vs Silicon?", "What is an intrinsic semiconductor?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            1,
            "Structured Programming in C",
            "Fundamental Data Types, Bitwise Operators, and Control Structures",
            4,
            "Work with variables, bit masking, bit shifting, and nested control flow.",
            "Implement bitwise manipulation routines (set, clear, toggle, test bit) and decision logic.",
            "Bitwise operators operate directly on binary representations, enabling high-performance embedded systems control.",
            "1. Read integer N and bit position K.\n2. Set bit: N | (1 << K).\n3. Clear bit: N & ~(1 << K).\n4. Toggle bit: N ^ (1 << K).\n5. Test bit: (N >> K) & 1.",
            "Implement bitwise utility functions and test with sample hexadecimal inputs.",
            "Demonstrated efficient low-level bit operations in constant O(1) execution time.",
            "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        int n = 42;\n        int k = 3;\n        System.out.println(\"Original: \" + Integer.toBinaryString(n));\n        System.out.println(\"Set bit \" + k + \": \" + Integer.toBinaryString(n | (1 << k)));\n        System.out.println(\"Clear bit 1: \" + Integer.toBinaryString(n & ~(1 << 1)));\n        System.out.println(\"Toggle bit 0: \" + Integer.toBinaryString(n ^ (1 << 0)));\n    }\n}",
            "def main():\n    n = 42\n    k = 3\n    print(f\"Original: {bin(n)}\")\n    print(f\"Set bit {k}: {bin(n | (1 << k))}\")\n    print(f\"Clear bit 1: {bin(n & ~(1 << 1))}\")\n    print(f\"Toggle bit 0: {bin(n ^ (1 << 0))}\")\n\nif __name__ == '__main__':\n    main()",
            List.of("How do you check if a number is a power of 2 using bitwise operators?", "Explain XOR swap."),
            List.of("What is two's complement representation?", "What is the result of shifting a signed negative integer?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            1,
            "Basic Electrical & Electronics Engineering",
            "Verification of Thevenin's and Norton's Theorems",
            5,
            "Analyze resistive circuits by equivalent voltage/current generator models.",
            "Verify Thevenin's equivalent voltage (Vth), Norton's current (In), and equivalent resistance (Rth).",
            "Any linear two-terminal circuit can be simplified to a voltage source Vth in series with Rth or current source In in parallel with Rth.",
            "1. Disconnect load resistor RL.\n2. Measure open circuit voltage Voc = Vth.\n3. Measure short circuit current Isc = In.\n4. Compute Rth = Vth / In.\n5. Verify load current IL = Vth / (Rth + RL).",
            "Calculate the circuit parameters and verify maximum power transfer theorem.",
            "Thevenin and Norton theorems verified with less than 1% experimental deviation.",
            "public class Main {\n    public static void main(String[] args) {\n        double vSource = 12.0, r1 = 100.0, r2 = 150.0, rl = 50.0;\n        double vth = vSource * (r2 / (r1 + r2));\n        double rth = (r1 * r2) / (r1 + r2);\n        double il = vth / (rth + rl);\n        System.out.printf(\"Vth: %.2f V, Rth: %.2f Ohm, Load Current IL: %.4f A%n\", vth, rth, il);\n    }\n}",
            "def main():\n    v_source, r1, r2, rl = 12.0, 100.0, 150.0, 50.0\n    vth = v_source * (r2 / (r1 + r2))\n    rth = (r1 * r2) / (r1 + r2)\n    il = vth / (rth + rl)\n    print(f\"Vth: {vth:.2f} V, Rth: {rth:.2f} Ohm, Load Current IL: {il:.4f} A\")\n\nif __name__ == '__main__':\n    main()",
            List.of("State Maximum Power Transfer Theorem.", "What is the relationship between Thevenin and Norton resistance?"),
            List.of("Can Thevenin's theorem be applied to non-linear circuits?", "What is ideal voltage source internal resistance?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            1,
            "Engineering Workshop & Digital Fabrication",
            "3D CAD Prototype Modeling & Slicing",
            1,
            "Design geometric models in CAD and generate G-code for 3D additive manufacturing.",
            "Create a 3D mechanical enclosure component and prepare toolpath G-code parameters.",
            "Additive manufacturing creates objects layer by layer from digital 3D models using FDM (Fused Deposition Modeling).",
            "1. Create 2D sketch with dimensional constraints.\n2. Extrude to form solid body.\n3. Add chamfers, fillets, and mounting holes.\n4. Export to STL and generate slicing layers.\n5. Validate infill density and layer height.",
            "Inspect and parse G-code layer height coordinates for printing simulation.",
            "Successfully engineered solid enclosure model and verified toolpath extrusion paths.",
            "public class Main {\n    public static void main(String[] args) {\n        double layerHeight = 0.2;\n        double totalHeight = 25.0;\n        int totalLayers = (int) Math.ceil(totalHeight / layerHeight);\n        System.out.println(\"3D Slicing Parameters:\");\n        System.out.println(\"Total Layers: \" + totalLayers);\n        System.out.println(\"Estimated Infill Material: 34.2 grams\");\n    }\n}",
            "def main():\n    layer_height = 0.2\n    total_height = 25.0\n    total_layers = int(total_height / layer_height)\n    print(f\"3D Slicing Parameters: Total Layers = {total_layers}, Infill = 34.2g\")\n\nif __name__ == '__main__':\n    main()",
            List.of("What is the difference between FDM and SLA 3D printing?", "Why is infill pattern important for structural rigidity?"),
            List.of("What does G-code command G01 represent?", "How does bed temperature prevent warping?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            2,
            "Engineering Mathematics - II",
            "Multiple Integrals & Beta-Gamma Function Evaluation",
            2,
            "Evaluate double and triple integrals and solve definite integrals with Beta and Gamma.",
            "Compute area and volume using double integrals in Cartesian and Polar coordinates.",
            "Beta and Gamma functions simplify definite integrals that cannot be integrated using elementary antiderivatives.",
            "1. Set limits of integration for x and y.\n2. Convert to polar if circular symmetry exists.\n3. Integrate with respect to inner variable.\n4. Integrate outer variable.\n5. Output numerical approximation.",
            "Compute volume under surface z = 4 - x^2 - y^2 over region x^2 + y^2 <= 4.",
            "Verified conversion between Cartesian and Polar coordinates, reducing integral complexity.",
            "public class Main {\n    public static void main(String[] args) {\n        double volume = 8 * Math.PI;\n        System.out.printf(\"Exact Paraboloid Volume: %.4f%n\", volume);\n    }\n}",
            "import math\n\ndef main():\n    volume = 8 * math.pi\n    print(f\"Exact Paraboloid Volume: {volume:.4f}\")\n\nif __name__ == '__main__':\n    main()",
            List.of("State property Gamma(n+1) = n * Gamma(n).", "What is the Jacobian for polar coordinate transformation?"),
            List.of("What is the value of Gamma(1/2)?", "When is Beta-Gamma substitution applied?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            2,
            "Applied Chemistry & Material Science",
            "Determination of Total Hardness of Water by EDTA",
            3,
            "Perform complexometric titration to estimate temporary and permanent water hardness.",
            "Determine total, temporary, and permanent hardness of a water sample using standard 0.01M EDTA.",
            "EDTA forms stable soluble chelate complexes with Ca2+ and Mg2+ ions at pH 10 using Eriochrome Black-T indicator.",
            "1. Pipette 50ml water sample.\n2. Add NH4Cl-NH4OH buffer (pH 10) and EBT indicator (turns wine red).\n3. Titrate against EDTA until color changes to steel blue.\n4. Repeat for boiled sample for permanent hardness.",
            "Calculate ppm CaCO3 equivalent hardness from titration burette readings.",
            "Total hardness determined as 240 ppm CaCO3 equivalent, indicating moderately hard water.",
            "public class Main {\n    public static void main(String[] args) {\n        double vEdta = 24.0;\n        double mEdta = 0.01;\n        double vSample = 50.0;\n        double hardnessPpm = (vEdta * mEdta * 100.0 * 1000) / vSample;\n        System.out.printf(\"Total Water Hardness: %.2f ppm CaCO3 equivalent%n\", hardnessPpm);\n    }\n}",
            "def main():\n    v_edta, m_edta, v_sample = 24.0, 0.01, 50.0\n    hardness = (v_edta * m_edta * 100.0 * 1000) / v_sample\n    print(f\"Total Water Hardness: {hardness:.2f} ppm CaCO3 equivalent\")\n\nif __name__ == '__main__':\n    main()",
            List.of("Why is buffer solution required in EDTA titration?", "Distinguish between temporary and permanent hardness."),
            List.of("Why does Eriochrome Black T turn blue at endpoint?", "What is the chemical formula of EDTA?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            2,
            "Object-Oriented Programming with C++",
            "Classes, Objects, and Constructor Overloading",
            4,
            "Build object-oriented software demonstrating encapsulation, deep copy, and destructor cleanup.",
            "Create a Student record management system with default, parameterized, and copy constructors.",
            "Object-oriented programming binds data and functions together into objects, enforcing data abstraction and encapsulation.",
            "1. Define class with private members and public methods.\n2. Implement parameterized constructor and deep copy constructor.\n3. Allocate dynamic memory where required.\n4. Implement destructor to release resources.\n5. Test creation and lifecycle.",
            "Instantiate objects using all constructor types and print memory addresses to verify deep copy.",
            "Constructors and destructors properly initialized and deallocated dynamic heap memory without memory leaks.",
            "class Student {\n    private String name;\n    private int rollNo;\n    public Student(String name, int rollNo) {\n        this.name = name; this.rollNo = rollNo;\n    }\n    public Student(Student other) {\n        this.name = other.name; this.rollNo = other.rollNo;\n    }\n    public void display() {\n        System.out.println(\"Roll \" + rollNo + \": \" + name);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Student s1 = new Student(\"Inzamam Khan\", 13);\n        Student s2 = new Student(s1);\n        s1.display();\n        s2.display();\n    }\n}",
            "class Student:\n    def __init__(self, name, roll_no):\n        self.name = name\n        self.roll_no = roll_no\n\n    def display(self):\n        print(f\"Roll {self.roll_no}: {self.name}\")\n\ndef main():\n    s1 = Student(\"Inzamam Khan\", 13)\n    s2 = Student(s1.name, s1.roll_no)\n    s1.display()\n    s2.display()\n\nif __name__ == '__main__':\n    main()",
            List.of("What is the difference between shallow copy and deep copy?", "Why is copy constructor passed by reference in C++?"),
            List.of("Can constructors be virtual?", "What is an initialization list?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            2,
            "Engineering Mechanics & Dynamics",
            "Equilibrium of Concurrent Coplanar Force System",
            5,
            "Verify Lami's theorem and graphical polygon law of concurrent forces.",
            "Verify conditions of equilibrium (Sum Fx = 0, Sum Fy = 0) for coplanar concurrent forces.",
            "For a body in equilibrium under coplanar concurrent forces, the vector sum of all forces acting at the point must be zero.",
            "1. Suspend weights over frictionless pulleys.\n2. Measure angles between force cords with protractor.\n3. Resolve forces into horizontal (Fx = F * cos theta) and vertical (Fy = F * sin theta) components.\n4. Calculate algebraic sums.\n5. Verify equilibrium.",
            "Compute the resultant magnitude and direction of three concurrent forces.",
            "Resultant magnitude converged to zero within acceptable experimental friction threshold.",
            "public class Main {\n    public static void main(String[] args) {\n        double f1 = 10, a1 = 0;\n        double f2 = 10, a2 = 120;\n        double f3 = 10, a3 = 240;\n        double rx = f1*Math.cos(Math.toRadians(a1)) + f2*Math.cos(Math.toRadians(a2)) + f3*Math.cos(Math.toRadians(a3));\n        double ry = f1*Math.sin(Math.toRadians(a1)) + f2*Math.sin(Math.toRadians(a2)) + f3*Math.sin(Math.toRadians(a3));\n        System.out.printf(\"Resultant Force: Rx = %.4f N, Ry = %.4f N%n\", rx, ry);\n    }\n}",
            "import math\n\ndef main():\n    forces = [(10, 0), (10, 120), (10, 240)]\n    rx = sum(f * math.cos(math.radians(deg)) for f, deg in forces)\n    ry = sum(f * math.sin(math.radians(deg)) for f, deg in forces)\n    print(f\"Resultant Force: Rx = {rx:.4f} N, Ry = {ry:.4f} N\")\n\nif __name__ == '__main__':\n    main()",
            List.of("State Lami's theorem and its limitations.", "What is Varignon's theorem of moments?"),
            List.of("What is a concurrent force system?", "What is the difference between scalar and vector equilibrium?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            2,
            "Professional Communication & Soft Skills",
            "Technical Project Report & Abstract Writing",
            1,
            "Draft professional executive summaries and technical project documentation.",
            "Structure an engineering project report following IEEE conference documentation standards.",
            "Technical writing communicates complex technical architectures, problem formulations, and quantitative evaluations clearly.",
            "1. Identify problem statement and context.\n2. Summarize proposed methodology and architecture.\n3. Present benchmark results.\n4. Conclude with impact and future scope.",
            "Format structured metadata and compute abstract readability index.",
            "Report formatted with clear headings, references, and professional technical terminology.",
            "public class Main {\n    public static void main(String[] args) {\n        String abstractText = \"CodeLabX provides an automated laboratory evaluation system with real-time execution.\";\n        String[] words = abstractText.split(\"\\s+\");\n        System.out.println(\"Abstract Word Count: \" + words.length);\n        System.out.println(\"Status: Approved for Submission\");\n    }\n}",
            "def main():\n    abstract = \"CodeLabX provides an automated laboratory evaluation system with real-time execution.\"\n    words = abstract.split()\n    print(f\"Abstract Word Count: {len(words)}\")\n    print(\"Status: Approved for Submission\")\n\nif __name__ == '__main__':\n    main()",
            List.of("What are key components of an IEEE abstract?", "Explain difference between active and passive voice in technical writing."),
            List.of("What is plagiarism and citation ethics?", "How do you structure an executive summary?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            3,
            "Data Structures",
            "Stack using Array & Infix to Postfix Conversion",
            2,
            "Implement stack operations and parse arithmetic expressions to postfix notation.",
            "Implement push, pop, peek stack ADT and convert infix expressions to postfix using precedence rules.",
            "A stack is a LIFO structure. Infix to postfix conversion uses operator precedence and associativity to produce reverse Polish notation.",
            "1. Initialize operator stack.\n2. Scan expression from left to right.\n3. Output operands directly.\n4. Push operators based on precedence, popping higher precedence operators.\n5. Pop remaining stack operators.",
            "Convert expression '(A + B) * (C - D)' to postfix and evaluate postfix with sample numeric values.",
            "Demonstrated expression conversion and evaluation with O(N) linear time complexity.",
            "import java.util.*;\n\npublic class Main {\n    static int prec(char ch) {\n        return switch (ch) { case '+', '-' -> 1; case '*', '/' -> 2; default -> -1; };\n    }\n    public static void main(String[] args) {\n        String exp = \"a+b*(c^d-e)\";\n        StringBuilder result = new StringBuilder();\n        Stack<Character> stack = new Stack<>();\n        for (char c : exp.toCharArray()) {\n            if (Character.isLetterOrDigit(c)) result.append(c);\n            else if (c == '(') stack.push(c);\n            else if (c == ')') {\n                while (!stack.isEmpty() && stack.peek() != '(') result.append(stack.pop());\n                if (!stack.isEmpty()) stack.pop();\n            } else {\n                while (!stack.isEmpty() && prec(c) <= prec(stack.peek())) result.append(stack.pop());\n                stack.push(c);\n            }\n        }\n        while (!stack.isEmpty()) result.append(stack.pop());\n        System.out.println(\"Postfix: \" + result);\n    }\n}",
            "def prec(c):\n    if c in ('+', '-'): return 1\n    if c in ('*', '/'): return 2\n    return -1\n\ndef main():\n    exp = \"a+b*(c-d)\"\n    stack, res = [], []\n    for c in exp:\n        if c.isalnum(): res.append(c)\n        elif c == '(': stack.append(c)\n        elif c == ')':\n            while stack and stack[-1] != '(': res.append(stack.pop())\n            if stack: stack.pop()\n        else:\n            while stack and prec(c) <= prec(stack[-1]): res.append(stack.pop())\n            stack.append(c)\n    while stack: res.append(stack.pop())\n    print(\"Postfix: \" + \"\".join(res))\n\nif __name__ == '__main__':\n    main()",
            List.of("How does stack enable recursive function call execution?", "Evaluate postfix expression '2 3 1 * + 9 -'."),
            List.of("What is stack overflow and stack underflow?", "What is time complexity of infix to postfix conversion?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            3,
            "Data Structures",
            "Binary Search Tree (BST) Operations",
            3,
            "Construct BST, perform node insertion, deletion, and depth traversals.",
            "Implement BST insertion, search, deletion for leaf/single/double child cases, and inorder traversal.",
            "BST satisfies the property that keys in the left subtree are smaller and in right subtree are larger than parent.",
            "1. Insert key by comparing with current node.\n2. Traverse left or right recursively.\n3. For deletion: replace with inorder successor when node has two children.\n4. Inorder traversal prints keys in sorted order.",
            "Insert [50, 30, 20, 40, 70, 60, 80] and print in-order traversal.",
            "In-order traversal visited all keys in sorted ascending order with O(log n) average search complexity.",
            "class Node {\n    int key; Node left, right;\n    Node(int item) { key = item; }\n}\n\npublic class Main {\n    static Node insert(Node node, int key) {\n        if (node == null) return new Node(key);\n        if (key < node.key) node.left = insert(node.left, key);\n        else if (key > node.key) node.right = insert(node.right, key);\n        return node;\n    }\n    static void inorder(Node root) {\n        if (root != null) {\n            inorder(root.left);\n            System.out.print(root.key + \" \");\n            inorder(root.right);\n        }\n    }\n    public static void main(String[] args) {\n        Node root = null;\n        int[] keys = {50, 30, 20, 40, 70, 60, 80};\n        for (int k : keys) root = insert(root, k);\n        System.out.print(\"Inorder BST: \");\n        inorder(root);\n        System.out.println();\n    }\n}",
            "class Node:\n    def __init__(self, key):\n        self.key = key\n        self.left = None\n        self.right = None\n\ndef insert(root, key):\n    if not root: return Node(key)\n    if key < root.key: root.left = insert(root.left, key)\n    else: root.right = insert(root.right, key)\n    return root\n\ndef inorder(root):\n    if root:\n        inorder(root.left)\n        print(root.key, end=\" \")\n        inorder(root.right)\n\ndef main():\n    root = None\n    for k in [50, 30, 20, 40, 70, 60, 80]:\n        root = insert(root, k)\n    print(\"Inorder BST:\", end=\" \")\n    inorder(root)\n    print()\n\nif __name__ == '__main__':\n    main()",
            List.of("What causes a BST to degrade to O(N) search complexity?", "How is in-order predecessor identified?"),
            List.of("What is an AVL tree and how does it prevent skewness?", "What is time complexity of BST deletion?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            3,
            "Discrete Structures & Graph Theory",
            "Shortest Path via Dijkstra's Algorithm",
            4,
            "Compute single-source shortest paths on weighted directed graph.",
            "Implement Dijkstra's greedy algorithm using adjacency matrix and min-heap priority queue.",
            "Dijkstra's algorithm finds the shortest path from a source vertex to all other vertices in non-negative edge weight graphs.",
            "1. Initialize dist[src] = 0 and all other dist[v] = infinity.\n2. Maintain min-priority queue of unvisited vertices.\n3. Extract min vertex u.\n4. For each neighbor v of u: relax edge (u, v) if dist[u] + w(u, v) < dist[v].\n5. Repeat until all vertices processed.",
            "Compute shortest distances from vertex 0 to all vertices for a 5-node graph.",
            "Calculated optimal path costs in O((V + E) log V) time complexity.",
            "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        int n = 5;\n        int[][] graph = {\n            {0, 10, 0, 5, 0},\n            {0, 0, 1, 2, 0},\n            {0, 0, 0, 0, 4},\n            {0, 3, 9, 0, 2},\n            {7, 0, 6, 0, 0}\n        };\n        int[] dist = new int[n];\n        Arrays.fill(dist, Integer.MAX_VALUE);\n        dist[0] = 0;\n        boolean[] visited = new boolean[n];\n        for (int i = 0; i < n; i++) {\n            int u = -1;\n            for (int j = 0; j < n; j++) if (!visited[j] && (u == -1 || dist[j] < dist[u])) u = j;\n            if (dist[u] == Integer.MAX_VALUE) break;\n            visited[u] = true;\n            for (int v = 0; v < n; v++) {\n                if (graph[u][v] != 0 && dist[u] + graph[u][v] < dist[v]) dist[v] = dist[u] + graph[u][v];\n            }\n        }\n        System.out.println(\"Shortest distances: \" + Arrays.toString(dist));\n    }\n}",
            "def main():\n    n = 5\n    graph = [\n        [0, 10, 0, 5, 0],\n        [0, 0, 1, 2, 0],\n        [0, 0, 0, 0, 4],\n        [0, 3, 9, 0, 2],\n        [7, 0, 6, 0, 0]\n    ]\n    dist = [float('inf')] * n\n    dist[0] = 0\n    visited = [False] * n\n    for _ in range(n):\n        u = min((i for i in range(n) if not visited[i]), key=lambda x: dist[x], default=-1)\n        if u == -1 or dist[u] == float('inf'): break\n        visited[u] = True\n        for v in range(n):\n            if graph[u][v] and dist[u] + graph[u][v] < dist[v]:\n                dist[v] = dist[u] + graph[u][v]\n    print(\"Shortest distances:\", dist)\n\nif __name__ == '__main__':\n    main()",
            List.of("Why does Dijkstra's algorithm fail on negative edge weights?", "Which algorithm is used for all-pairs shortest paths?"),
            List.of("What is the difference between Prim's and Dijkstra's algorithm?", "What is relaxation in graph algorithms?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            3,
            "Digital Logic & Computer Architecture",
            "4-Bit Arithmetic Logic Unit (ALU) Design",
            5,
            "Design 4-bit ALU performing arithmetic (ADD, SUB) and logic (AND, OR, XOR) operations.",
            "Model combinational ALU using control select signals S0, S1, S2 and status flags.",
            "An ALU is a fundamental building block of the CPU that executes elementary arithmetic and bitwise logic operations.",
            "1. Read inputs A[3:0], B[3:0], and 3-bit Opcode.\n2. Decode opcode.\n3. Execute selected operation.\n4. Set Zero, Carry, and Overflow status flags.\n5. Output Result[3:0].",
            "Implement ALU functional behavior and test with signed arithmetic cases.",
            "ALU successfully executed all operational opcodes and accurately signaled zero and carry flags.",
            "public class Main {\n    public static void main(String[] args) {\n        int a = 9, b = 5;\n        System.out.println(\"A: \" + a + \", B: \" + b);\n        System.out.println(\"ADD: \" + (a + b));\n        System.out.println(\"SUB: \" + (a - b));\n        System.out.println(\"AND: \" + (a & b));\n        System.out.println(\"OR:  \" + (a | b));\n        System.out.println(\"XOR: \" + (a ^ b));\n    }\n}",
            "def main():\n    a, b = 9, 5\n    print(f\"A: {a}, B: {b}\")\n    print(f\"ADD: {a + b}\")\n    print(f\"SUB: {a - b}\")\n    print(f\"AND: {a & b}\")\n    print(f\"OR:  {a | b}\")\n    print(f\"XOR: {a ^ b}\")\n\nif __name__ == '__main__':\n    main()",
            List.of("How is subtraction performed using 2's complement adder?", "Explain significance of Overflow flag in signed arithmetic."),
            List.of("What is the purpose of the Accumulator register?", "What is the difference between RISC and CISC architectures?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            3,
            "Computer Graphics & Visualization",
            "Bresenham's Line and Circle Drawing Algorithm",
            1,
            "Render scan-converted raster graphics primitives using integer arithmetic.",
            "Implement Bresenham's line and midpoint circle algorithm avoiding floating point computations.",
            "Bresenham's algorithm utilizes incremental integer addition and decision parameters to select nearest pixel grid points.",
            "1. Calculate dx = x2 - x1, dy = y2 - y1.\n2. Initial decision parameter P = 2*dy - dx.\n3. For each x from x1 to x2: plot pixel (x, y).\n4. If P < 0: P = P + 2*dy; else: y = y + 1, P = P + 2*dy - 2*dx.",
            "Compute the rasterized pixel sequence from point (2, 3) to (9, 7).",
            "Demonstrated accurate pixel rasterization without floating point performance overhead.",
            "public class Main {\n    public static void main(String[] args) {\n        int x1 = 2, y1 = 3, x2 = 9, y2 = 7;\n        int dx = x2 - x1, dy = y2 - y1;\n        int p = 2 * dy - dx, y = y1;\n        System.out.print(\"Bresenham Pixels: \");\n        for (int x = x1; x <= x2; x++) {\n            System.out.print(\"(\" + x + \",\" + y + \") \");\n            if (p >= 0) { y++; p += 2 * dy - 2 * dx; }\n            else p += 2 * dy;\n        }\n        System.out.println();\n    }\n}",
            "def main():\n    x1, y1, x2, y2 = 2, 3, 9, 7\n    dx, dy = x2 - x1, y2 - y1\n    p, y = 2 * dy - dx, y1\n    pixels = []\n    for x in range(x1, x2 + 1):\n        pixels.append(f\"({x},{y})\")\n        if p >= 0:\n            y += 1\n            p += 2 * dy - 2 * dx\n        else:\n            p += 2 * dy\n    print(\"Bresenham Pixels:\", \" \".join(pixels))\n\nif __name__ == '__main__':\n    main()",
            List.of("Why is Bresenham preferred over DDA algorithm?", "How does midpoint circle algorithm exploit 8-way symmetry?"),
            List.of("What is aliasing and anti-aliasing?", "What is frame buffer aspect ratio?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            3,
            "Object Oriented Programming with Java",
            "Multithreading and Synchronization",
            2,
            "Develop concurrent Java applications with synchronized locks and thread pools.",
            "Implement Producer-Consumer problem using shared bounded buffer and wait()/notify().",
            "Java provides built-in monitors and synchronization keywords to manage concurrent access to shared mutable resources.",
            "1. Create shared buffer with maximum capacity.\n2. Producer checks if full: calls wait(); else inserts item and calls notify().\n3. Consumer checks if empty: calls wait(); else removes item and calls notify().\n4. Synchronize buffer critical section.",
            "Run producer and consumer threads demonstrating race-condition-free handoff.",
            "Thread synchronization prevented race conditions and buffer overruns.",
            "class Buffer {\n    private int val = -1;\n    private boolean hasVal = false;\n    public synchronized void produce(int v) throws InterruptedException {\n        while (hasVal) wait();\n        val = v; hasVal = true;\n        System.out.println(\"Produced: \" + v);\n        notify();\n    }\n    public synchronized void consume() throws InterruptedException {\n        while (!hasVal) wait();\n        System.out.println(\"Consumed: \" + val);\n        hasVal = false;\n        notify();\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Buffer b = new Buffer();\n        Thread t1 = new Thread(() -> { try { for (int i=1;i<=3;i++) b.produce(i); } catch (Exception ignored) {} });\n        Thread t2 = new Thread(() -> { try { for (int i=1;i<=3;i++) b.consume(); } catch (Exception ignored) {} });\n        t1.start(); t2.start();\n        t1.join(); t2.join();\n    }\n}",
            "import threading, time\n\nclass Buffer:\n    def __init__(self):\n        self.cond = threading.Condition()\n        self.val = None\n\n    def produce(self, v):\n        with self.cond:\n            while self.val is not None: self.cond.wait()\n            self.val = v\n            print(f\"Produced: {v}\")\n            self.cond.notify()\n\n    def consume(self):\n        with self.cond:\n            while self.val is None: self.cond.wait()\n            print(f\"Consumed: {self.val}\")\n            self.val = None\n            self.cond.notify()\n\ndef main():\n    b = Buffer()\n    t1 = threading.Thread(target=lambda: [b.produce(i) for i in range(1, 4)])\n    t2 = threading.Thread(target=lambda: [b.consume() for _ in range(3)])\n    t1.start(); t2.start()\n    t1.join(); t2.join()\n\nif __name__ == '__main__':\n    main()",
            List.of("What causes deadlocks in multi-threaded programs?", "Explain difference between sleep() and wait()."),
            List.of("What is the volatile keyword in Java?", "What is the difference between Thread and Runnable?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            4,
            "Design and Analysis of Algorithms",
            "Divide and Conquer - Merge Sort and Quick Sort",
            3,
            "Analyze recurrence relations and implement divide and conquer sorting.",
            "Implement Merge Sort (T(n) = 2T(n/2) + O(n)) and Quick Sort with pivot partitioning.",
            "Divide and conquer divides a problem into subproblems, solves subproblems recursively, and combines results. Merge sort has guaranteed O(n log n) complexity.",
            "1. Divide array into two halves at mid.\n2. Recursively sort left and right halves.\n3. Merge two sorted halves using two-pointer technique.\n4. Copy merged elements back to original array.",
            "Sort array and output comparison count and execution time.",
            "Merge sort achieved stable O(n log n) sorting across best, average, and worst cases.",
            "import java.util.*;\n\npublic class Main {\n    static void mergeSort(int[] a, int l, int r) {\n        if (l < r) {\n            int m = (l + r) / 2;\n            mergeSort(a, l, m);\n            mergeSort(a, m + 1, r);\n            merge(a, l, m, r);\n        }\n    }\n    static void merge(int[] a, int l, int m, int r) {\n        int[] left = Arrays.copyOfRange(a, l, m + 1);\n        int[] right = Arrays.copyOfRange(a, m + 1, r + 1);\n        int i = 0, j = 0, k = l;\n        while (i < left.length && j < right.length) a[k++] = (left[i] <= right[j]) ? left[i++] : right[j++];\n        while (i < left.length) a[k++] = left[i++];\n        while (j < right.length) a[k++] = right[j++];\n    }\n    public static void main(String[] args) {\n        int[] arr = {38, 27, 43, 3, 9, 82, 10};\n        mergeSort(arr, 0, arr.length - 1);\n        System.out.println(\"Sorted: \" + Arrays.toString(arr));\n    }\n}",
            "def merge_sort(arr):\n    if len(arr) <= 1: return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    res, i, j = [], 0, 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]: res.append(left[i]); i += 1\n        else: res.append(right[j]); j += 1\n    res.extend(left[i:])\n    res.extend(right[j:])\n    return res\n\ndef main():\n    arr = [38, 27, 43, 3, 9, 82, 10]\n    print(\"Sorted:\", merge_sort(arr))\n\nif __name__ == '__main__':\n    main()",
            List.of("State Master Theorem for divide and conquer recurrences.", "How does 3-way Quick Sort handle duplicate keys?"),
            List.of("Is Merge Sort in-place?", "What is worst-case time complexity of Quick Sort?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            4,
            "Database Management Systems",
            "DDL, DML, and Complex SQL Joins",
            4,
            "Design normalized schema, define relational integrity, and query multiple tables.",
            "Implement 3NF relational database schema with foreign key constraints, aggregations, and inner/outer joins.",
            "Relational algebra provides foundational operators (projection, selection, cartesian product, join) implemented in SQL.",
            "1. Create tables with primary and foreign keys.\n2. Insert sample entities.\n3. Execute INNER JOIN, LEFT JOIN, and GROUP BY with HAVING clause.\n4. Analyze execution plan.",
            "Write SQL queries to find students whose average submission score exceeds department median.",
            "Demonstrated entity integrity, referential integrity, and efficient relational query execution.",
            "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Simulating SQL Query Execution:\");\n        System.out.println(\"SELECT s.name, AVG(sub.score) FROM students s JOIN submissions sub ON s.id = sub.student_id GROUP BY s.id;\");\n        System.out.println(\"Result: Inzamam Khan -> 94.50 marks (Grade: O)\");\n    }\n}",
            "def main():\n    print(\"Simulating SQL Query Execution:\")\n    print(\"SELECT s.name, AVG(sub.score) FROM students s JOIN submissions sub ON s.id = sub.student_id GROUP BY s.id;\")\n    print(\"Result: Inzamam Khan -> 94.50 marks (Grade: O)\")\n\nif __name__ == '__main__':\n    main()",
            List.of("Explain difference between 2NF and 3NF.", "What is the difference between WHERE and HAVING clause?"),
            List.of("What is an index and how does B-Tree indexing work?", "What are ACID properties?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            4,
            "Operating Systems",
            "CPU Scheduling (FCFS, SJF, Round Robin, Priority)",
            5,
            "Simulate preemptive and non-preemptive process scheduling algorithms.",
            "Calculate turnaround time, waiting time, and CPU utilization under Round Robin (quantum = 2).",
            "The CPU scheduler chooses from in-memory ready processes to maximize throughput and minimize response latency.",
            "1. Maintain ready queue of arrived processes.\n2. Allocate CPU for time slice Q.\n3. If process completes: record completion time; else preempt and requeue.\n4. Compute Average Waiting Time.",
            "Simulate processes P1(burst=5), P2(burst=3), P3(burst=8) with quantum=2.",
            "Round Robin provided equitable interactive response times without process starvation.",
            "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        int[] burst = {5, 3, 8};\n        int[] rem = burst.clone();\n        int t = 0, q = 2, done = 0, n = 3;\n        int[] wt = new int[n];\n        while (done < n) {\n            for (int i = 0; i < n; i++) {\n                if (rem[i] > 0) {\n                    if (rem[i] > q) { t += q; rem[i] -= q; }\n                    else { t += rem[i]; wt[i] = t - burst[i]; rem[i] = 0; done++; }\n                }\n            }\n        }\n        System.out.println(\"Average Waiting Time: \" + (wt[0] + wt[1] + wt[2]) / 3.0 + \" ms\");\n    }\n}",
            "def main():\n    burst = [5, 3, 8]\n    rem = list(burst)\n    t, q, done, n = 0, 2, 0, 3\n    wt = [0] * n\n    while done < n:\n        for i in range(n):\n            if rem[i] > 0:\n                if rem[i] > q:\n                    t += q\n                    rem[i] -= q\n                else:\n                    t += rem[i]\n                    wt[i] = t - burst[i]\n                    rem[i] = 0\n                    done += 1\n    print(f\"Average Waiting Time: {sum(wt) / n:.2f} ms\")\n\nif __name__ == '__main__':\n    main()",
            List.of("What is Convoy Effect in FCFS scheduling?", "Explain how multilevel feedback queues operate."),
            List.of("What is context switching overhead?", "What is aging in priority scheduling?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            4,
            "Microprocessors and Microcontrollers",
            "8086 Assembly - Arithmetic and Array Sorting",
            1,
            "Program x86 assembly instructions to manipulate memory registers and sort array buffers.",
            "Implement bubble sort on an array of 8-bit hex numbers using 8086 segmented memory instructions.",
            "Microprocessors execute machine code instructions addressing registers (AX, BX, CX, DX) and flag status bits.",
            "1. Load array offset into SI pointer.\n2. Outer loop counter CX = N - 1.\n3. Inner loop: compare [SI] and [SI+1] via CMP.\n4. If greater: exchange values using XCHG.\n5. Decrement and repeat until CX = 0.",
            "Sort array [34H, 12H, 89H, 05H, 47H] in ascending numerical sequence.",
            "Demonstrated register addressing, conditional jumps, and memory pointer traversal in 8086 assembly.",
            "public class Main {\n    public static void main(String[] args) {\n        int[] hex = {0x34, 0x12, 0x89, 0x05, 0x47};\n        java.util.Arrays.sort(hex);\n        System.out.print(\"Sorted 8086 Hex Array: \");\n        for (int h : hex) System.out.printf(\"%02XH \", h);\n        System.out.println();\n    }\n}",
            "def main():\n    arr = [0x34, 0x12, 0x89, 0x05, 0x47]\n    arr.sort()\n    print(\"Sorted 8086 Hex Array:\", [f\"{x:02X}H\" for x in arr])\n\nif __name__ == '__main__':\n    main()",
            List.of("Explain physical address calculation using Segment:Offset.", "What are the flags in the 8086 Flag register?"),
            List.of("What is the difference between MOV and LEA?", "Explain pipelining in the 8086 Bus Interface Unit (BIU).")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            4,
            "Python for Data Science",
            "Pandas & NumPy Data Wrangling Pipeline",
            2,
            "Load datasets, handle missing values, filter outliers, and engineer features.",
            "Build a complete data cleaning and feature engineering pipeline on student academic data.",
            "Data preprocessing transforms raw, noisy tabular data into normalized matrices suitable for statistical analysis.",
            "1. Read CSV using pandas DataFrame.\n2. Impute null values with column median.\n3. Remove outliers outside 3 interquartile ranges (IQR).\n4. Standardize numerical features using z-score normalization.",
            "Compute summary statistics and return filtered correlation matrix.",
            "Transformed dirty tabular data into clean feature tensors ready for model training.",
            "public class Main {\n    public static void main(String[] args) {\n        double[] scores = {75, 82, 90, 88, 95};\n        double mean = java.util.Arrays.stream(scores).average().orElse(0);\n        System.out.println(\"Dataset Samples: \" + scores.length);\n        System.out.printf(\"Computed Feature Mean: %.2f%n\", mean);\n    }\n}",
            "def main():\n    scores = [75, 82, 90, 88, 95]\n    mean = sum(scores) / len(scores)\n    variance = sum((x - mean)**2 for x in scores) / len(scores)\n    print(f\"Data Samples: {len(scores)}\")\n    print(f\"Computed Feature Mean: {mean:.2f}, StdDev: {variance**0.5:.2f}\")\n\nif __name__ == '__main__':\n    main()",
            List.of("How do you detect multicollinearity using VIF?", "What is the difference between MinMaxScaling and StandardScaling?"),
            List.of("What is vectorization in NumPy?", "What is broadcasting in multi-dimensional arrays?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            5,
            "Computer Networks & Security",
            "TCP/UDP Socket Programming Client-Server Chat",
            3,
            "Implement reliable client-server network socket communication over TCP.",
            "Build multi-client chat server with persistent socket connections and broadcast messaging.",
            "The Transport layer provides end-to-end communication services. TCP guarantees reliable, in-order delivery via 3-way handshakes.",
            "1. Server binds ServerSocket to port 8080.\n2. Server calls accept() blocking until client connects.\n3. Spawn worker thread per client connection.\n4. Read from InputStream and broadcast to connected client sockets.",
            "Demonstrate message exchange between client and server with timestamped echo.",
            "Verified full-duplex socket streaming across network socket interfaces.",
            "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"TCP Socket Server Simulator:\");\n        System.out.println(\"Listening on 0.0.0.0:8080 [ESTABLISHED]\");\n        System.out.println(\"Client Connected: /127.0.0.1:54321\");\n        System.out.println(\"Echo Received: 'Hello CodeLabX Lab'\");\n    }\n}",
            "def main():\n    print(\"TCP Socket Server Simulator:\")\n    print(\"Listening on 0.0.0.0:8080 [ESTABLISHED]\")\n    print(\"Client Connected: 127.0.0.1:54321\")\n    print(\"Echo Received: 'Hello CodeLabX Lab'\")\n\nif __name__ == '__main__':\n    main()",
            List.of("Explain TCP 3-way handshake SYN, SYN-ACK, ACK.", "Compare TCP sliding window with Stop-and-Wait protocol."),
            List.of("What is the difference between TCP and UDP?", "What is subnet masking and CIDR notation?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            5,
            "Introduction to Intelligent Systems",
            "A* Search Algorithm for 8-Puzzle Problem",
            4,
            "Implement informed heuristic search to solve state-space sliding tile puzzle.",
            "Find optimal state path using A* search evaluation function f(n) = g(n) + h(n) with Manhattan distance.",
            "A* is complete and optimal when the heuristic function h(n) is admissible (never overestimates true cost).",
            "1. Insert start state into PriorityQueue ordered by f(n).\n2. Expand node with lowest f(n).\n3. Generate valid sliding moves (up, down, left, right).\n4. Compute Manhattan distance heuristic for each successor.\n5. Stop when goal state matched.",
            "Output step-by-step tile moves and search node expansion count.",
            "A* found optimal solution in minimum moves, expanding significantly fewer nodes than BFS.",
            "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"=== A* Search 8-Puzzle Simulator ===\");\n        System.out.println(\"Initial State: [1, 2, 3, 4, 0, 5, 6, 7, 8]\");\n        System.out.println(\"Goal State:    [1, 2, 3, 4, 5, 6, 7, 8, 0]\");\n        System.out.println(\"Heuristic: Manhattan Distance h = 2\");\n        System.out.println(\"Solution Path Found in 2 Moves!\");\n    }\n}",
            "def main():\n    print(\"=== A* Search 8-Puzzle Simulator ===\")\n    print(\"Initial State: [1, 2, 3, 4, 0, 5, 6, 7, 8]\")\n    print(\"Goal State:    [1, 2, 3, 4, 5, 6, 7, 8, 0]\")\n    print(\"Heuristic: Manhattan Distance h = 2\")\n    print(\"Solution Path Found in 2 Moves!\")\n\nif __name__ == '__main__':\n    main()",
            List.of("What is an admissible heuristic?", "Explain difference between A* and Greedy Best-First Search."),
            List.of("What is Manhattan distance vs Euclidean distance?", "Can A* get stuck in local optima?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            5,
            "Software Engineering & Agile Methodology",
            "SRS Specification & UML Architectural Diagrams",
            5,
            "Author IEEE 830 compliant Software Requirements Specification and class/sequence models.",
            "Model functional and non-functional requirements, use cases, and class relationships for CodeLabX.",
            "Agile methodologies combine user stories, iterative sprint deliveries, and formal UML architecture representations.",
            "1. Capture functional requirements and user persona.\n2. Design Use Case diagram.\n3. Construct Class Diagram with multiplicity and dependencies.\n4. Draw Sequence Diagram illustrating synchronous request flows.",
            "Validate requirement traceability matrix against user acceptance criteria.",
            "Complete system architecture formulated, reducing ambiguities during development phases.",
            "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Agile Sprint Velocity: 42 Story Points\");\n        System.out.println(\"UML Diagrams: Use Case, Class, Sequence - Verified\");\n        System.out.println(\"Requirement Traceability Matrix: 100% Coverage\");\n    }\n}",
            "def main():\n    print(\"Agile Sprint Velocity: 42 Story Points\")\n    print(\"UML Diagrams: Use Case, Class, Sequence - Verified\")\n    print(\"Requirement Traceability Matrix: 100% Coverage\")\n\nif __name__ == '__main__':\n    main()",
            List.of("What are differences between Scrum and Kanban?", "Explain SOLID principles in software architecture."),
            List.of("What is a burn-down chart?", "What is the role of the Product Owner in Scrum?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            5,
            "Web Development Technologies",
            "RESTful API with Node.js, Express, and JWT Auth",
            1,
            "Develop scalable backend REST endpoints secured with JSON Web Tokens.",
            "Implement token-based authentication with bcrypt password hashing and role-based route middleware.",
            "JWTs enable stateless authentication by encoding claims in a cryptographically signed HMAC or RSA token.",
            "1. Client submits credentials to /api/auth/login.\n2. Server verifies bcrypt hash.\n3. Sign JWT payload with secret key.\n4. Return token to client.\n5. Middleware verifies Authorization Bearer header on protected routes.",
            "Test login flow, token verification, and 401 unauthorized rejection scenarios.",
            "Implemented secure stateless authentication across distributed REST endpoints.",
            "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"JWT Authentication Middleware:\");\n        System.out.println(\"Header: eyJhbGciOiJIUzI1NiJ9...\");\n        System.out.println(\"Decoded Claims: { sub: 'inzamam@tcetmumbai.in', role: 'STUDENT' }\");\n        System.out.println(\"Status: 200 OK (Authorized)\");\n    }\n}",
            "def main():\n    print(\"JWT Authentication Middleware:\")\n    print(\"Header: eyJhbGciOiJIUzI1NiJ9...\")\n    print(\"Decoded Claims: {'sub': 'inzamam@tcetmumbai.in', 'role': 'STUDENT'}\")\n    print(\"Status: 200 OK (Authorized)\")\n\nif __name__ == '__main__':\n    main()",
            List.of("Explain structure of JWT: Header.Payload.Signature.", "What is CSRF and how do SameSite cookies prevent it?"),
            List.of("What is the difference between stateful sessions and JWTs?", "What HTTP status code is returned for forbidden access?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            5,
            "Theory of Computer Science",
            "Deterministic Finite Automata (DFA) Simulator",
            2,
            "Construct transition tables and simulate DFA accepting regular languages.",
            "Build a DFA engine accepting strings over {0, 1} having an even number of 0s and odd number of 1s.",
            "A DFA is a 5-tuple (Q, Sigma, delta, q0, F) recognizing regular languages with no external memory.",
            "1. Define states Q0, Q1, Q2, Q3.\n2. Start at initial state Q0.\n3. Read string symbol by symbol.\n4. Transition to delta(curr_state, symbol).\n5. Check if ending state is in F.",
            "Simulate input strings '001', '100', '0101' and verify acceptance.",
            "Simulated DFA transition table accurately parsed regular language inputs.",
            "public class Main {\n    public static void main(String[] args) {\n        int state = 0;\n        String input = \"001\";\n        int[][] delta = {{2, 1}, {3, 0}, {0, 3}, {1, 2}};\n        for (char c : input.toCharArray()) state = delta[state][c - '0'];\n        System.out.println(\"Input: \" + input + \" -> \" + (state == 1 ? \"ACCEPTED\" : \"REJECTED\"));\n    }\n}",
            "def main():\n    state = 0\n    inp = \"001\"\n    delta = [[2, 1], [3, 0], [0, 3], [1, 2]]\n    for c in inp:\n        state = delta[state][int(c)]\n    print(f\"Input: {inp} -> {'ACCEPTED' if state == 1 else 'REJECTED'}\")\n\nif __name__ == '__main__':\n    main()",
            List.of("State Pumping Lemma for regular languages.", "Convert NFA with epsilon transitions to equivalent DFA."),
            List.of("What is the difference between DFA and Turing Machine?", "What is Chomsky hierarchy?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            6,
            "Cloud Computing & Distributed Systems",
            "Containerizing Microservices with Docker and Compose",
            3,
            "Build multi-stage Dockerfiles and orchestrate multi-container microservice stacks.",
            "Containerize frontend, Spring Boot backend, and PostgreSQL with health-checks and network bridges.",
            "Operating-system-level virtualization provides lightweight, isolated execution environments sharing the host kernel.",
            "1. Write Dockerfile with build and runtime stages.\n2. Configure docker-compose.yml with services, ports, and volumes.\n3. Define bridge network.\n4. Spin up containers with docker-compose up.\n5. Verify inter-container DNS discovery.",
            "Verify container logs and test inter-service HTTP ping endpoints.",
            "Demonstrated unified multi-container orchestration with rapid startup and zero host dependency contamination.",
            "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Docker Compose Cluster Status:\");\n        System.out.println(\"Service 'codelabx-web': UP (port 5173)\");\n        System.out.println(\"Service 'codelabx-api': UP (port 8080)\");\n        System.out.println(\"Bridge Network: codelabx-net ACTIVE\");\n    }\n}",
            "def main():\n    print(\"Docker Compose Cluster Status:\")\n    print(\"Service 'codelabx-web': UP (port 5173)\")\n    print(\"Service 'codelabx-api': UP (port 8080)\")\n    print(\"Bridge Network: codelabx-net ACTIVE\")\n\nif __name__ == '__main__':\n    main()",
            List.of("Explain difference between Docker image layer caching and bind mounts.", "What is Kubernetes Pod vs Docker Container?"),
            List.of("What is the difference between virtualization and containerization?", "What is an ingress controller?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            6,
            "Machine Learning & Deep Learning",
            "Convolutional Neural Network (CNN) for Image Recognition",
            4,
            "Build deep convolutional neural network for image classification using PyTorch/TensorFlow.",
            "Implement Conv2D, MaxPool2D, Dropout, and Dense layers to classify handwritten digits (MNIST).",
            "CNNs preserve spatial topology through learned convolution kernels, translation invariance, and pooling hierarchies.",
            "1. Normalize image tensors to [0, 1].\n2. Pass through Conv2D filters (3x3 kernel, ReLU).\n3. Apply MaxPool2D (2x2).\n4. Flatten and pass through Dense layer with Dropout.\n5. Compute CrossEntropyLoss and optimize via Adam.",
            "Train model for 5 epochs and compute confusion matrix and test accuracy.",
            "CNN achieved 98.7% test accuracy, outperforming standard dense multilayer perceptrons.",
            "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"CNN Model Architecture:\");\n        System.out.println(\"Conv2D(32, 3x3) -> MaxPool(2x2) -> Conv2D(64, 3x3) -> Dense(128) -> Softmax(10)\");\n        System.out.println(\"Epoch 5/5 - Loss: 0.0412 - Accuracy: 98.74%\");\n    }\n}",
            "def main():\n    print(\"CNN Model Architecture:\")\n    print(\"Conv2D(32, 3x3) -> MaxPool(2x2) -> Conv2D(64, 3x3) -> Dense(128) -> Softmax(10)\")\n    print(\"Epoch 5/5 - Loss: 0.0412 - Accuracy: 98.74%\")\n\nif __name__ == '__main__':\n    main()",
            List.of("Why do CNNs use pooling layers?", "What is vanishing gradient problem and how does ReLU mitigate it?"),
            List.of("What is transfer learning?", "Explain precision, recall, and F1-score.")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            6,
            "Cryptography & Network Defense",
            "AES and RSA Cryptographic Algorithms Implementation",
            5,
            "Implement symmetric AES block encryption and asymmetric RSA public-key cryptosystems.",
            "Demonstrate RSA keypair generation (p, q primes, e, d exponents) and ciphertext signing.",
            "RSA security relies on the hardness of large integer factorization. Public key (e, n) encrypts while private key (d, n) decrypts.",
            "1. Select primes p and q; compute n = p * q and phi = (p-1)*(q-1).\n2. Choose e coprime to phi.\n3. Compute d = e^-1 mod phi.\n4. Encrypt: C = M^e mod n.\n5. Decrypt: M = C^d mod n.",
            "Generate keys, encrypt plaintext message integer, and verify decrypted match.",
            "Asymmetric encryption and mathematical modular inverse properties successfully demonstrated.",
            "import java.math.BigInteger;\n\npublic class Main {\n    public static void main(String[] args) {\n        BigInteger p = BigInteger.valueOf(61), q = BigInteger.valueOf(53);\n        BigInteger n = p.multiply(q);\n        BigInteger phi = p.subtract(BigInteger.ONE).multiply(q.subtract(BigInteger.ONE));\n        BigInteger e = BigInteger.valueOf(17);\n        BigInteger d = e.modInverse(phi);\n        BigInteger msg = BigInteger.valueOf(65);\n        BigInteger cipher = msg.modPow(e, n);\n        BigInteger decrypted = cipher.modPow(d, n);\n        System.out.println(\"Message: \" + msg + \" -> Cipher: \" + cipher + \" -> Decrypted: \" + decrypted);\n    }\n}",
            "def main():\n    p, q = 61, 53\n    n = p * q\n    phi = (p - 1) * (q - 1)\n    e = 17\n    d = pow(e, -1, phi)\n    msg = 65\n    cipher = pow(msg, e, n)\n    decrypted = pow(cipher, d, n)\n    print(f\"Message: {msg} -> Cipher: {cipher} -> Decrypted: {decrypted}\")\n\nif __name__ == '__main__':\n    main()",
            List.of("Why must e and phi(n) be coprime in RSA?", "Explain Diffie-Hellman key exchange algorithm."),
            List.of("What is the difference between symmetric and asymmetric cryptography?", "What is a Man-In-The-Middle (MITM) attack?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            6,
            "System Programming & Compiler Construction",
            "Lexical Analyzer using Lex/Flex",
            1,
            "Construct regular expression token parser identifying keywords, identifiers, and literals.",
            "Generate token streams and symbol table entries for a subset of programming language syntax.",
            "The lexical analyzer reads input characters and groups them into meaningful token sequences according to lexical specifications.",
            "1. Specify regular expressions for tokens.\n2. Construct transition diagram.\n3. Match longest prefix.\n4. Emit token type and attribute value.\n5. Insert new identifiers into Symbol Table.",
            "Parse source statement 'int total = sum + 42;' and output token attributes.",
            "Tokens correctly identified and recorded in symbol table with O(N) single-pass scanning.",
            "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Lexical Tokens Generated:\");\n        System.out.println(\"<KEYWORD, 'int'> <IDENTIFIER, 'total'> <ASSIGN, '='> <IDENTIFIER, 'sum'> <PLUS, '+'> <NUMBER, 42> <SEMICOLON, ';'>\");\n    }\n}",
            "def main():\n    print(\"Lexical Tokens Generated:\")\n    print(\"<KEYWORD, 'int'> <IDENTIFIER, 'total'> <ASSIGN, '='> <IDENTIFIER, 'sum'> <PLUS, '+'> <NUMBER, 42> <SEMICOLON, ';'>\")\n\nif __name__ == '__main__':\n    main()",
            List.of("How does Lex handle ambiguous token prefixes?", "Explain structure and purpose of a Compiler Symbol Table."),
            List.of("What are the phases of a compiler?", "What is the difference between an interpreter and a compiler?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            6,
            "Mobile Application Development",
            "Mobile UI Layouts, State Management, and Navigation",
            2,
            "Develop cross-platform mobile screens with reactive state stores and route stacks.",
            "Build mobile dashboard screen with interactive cards, bottom navigation bar, and dark mode theme toggle.",
            "Modern mobile frameworks utilize declarative UI components where interface state dictates visual tree re-rendering.",
            "1. Define MaterialApp/Flutter or React Native root.\n2. Implement ChangeNotifier or Context state provider.\n3. Build responsive column/grid view layouts.\n4. Handle gesture touches and route transitions.",
            "Simulate mobile state dispatch action and verify UI component re-render.",
            "Reactive mobile components rendered with consistent frame rate and responsive user touch handling.",
            "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Mobile UI Framework Initialized:\");\n        System.out.println(\"Screen Resolution: 1080x2400 (DPI 420)\");\n        System.out.println(\"Active Tab: /practicals (State: Synchronized)\");\n    }\n}",
            "def main():\n    print(\"Mobile UI Framework Initialized:\")\n    print(\"Screen Resolution: 1080x2400\")\n    print(\"Active Tab: /practicals (State: Synchronized)\")\n\nif __name__ == '__main__':\n    main()",
            List.of("What is the difference between StatefulWidget and StatelessWidget?", "Explain Android activity lifecycle callbacks."),
            List.of("What is hot reload in mobile development?", "How do you handle asynchronous network calls in mobile UI?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            7,
            "Big Data Analytics",
            "Hadoop HDFS Operations & WordCount MapReduce",
            3,
            "Implement distributed MapReduce job processing large unstructured text corpora.",
            "Write Mapper and Reducer functions to count word occurrences across distributed HDFS partitions.",
            "MapReduce processes big data in parallel by splitting computation into map (key-value emission) and reduce (aggregation) phases.",
            "1. Mapper: parse line, split into words, emit (word, 1).\n2. Hadoop framework shuffles and sorts by key.\n3. Reducer: sum values for each key and emit (word, total_count).\n4. Write partitioned results back to HDFS.",
            "Run WordCount simulation on sample document text.",
            "Demonstrated linear scalability and fault-tolerant distributed batch data processing.",
            "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        String text = \"big data analytics hadoop mapreduce big data processing\";\n        Map<String, Integer> counts = new HashMap<>();\n        for (String w : text.split(\" \")) counts.put(w, counts.getOrDefault(w, 0) + 1);\n        System.out.println(\"MapReduce WordCount Results: \" + counts);\n    }\n}",
            "def main():\n    text = \"big data analytics hadoop mapreduce big data processing\"\n    counts = {}\n    for w in text.split(): counts[w] = counts.get(w, 0) + 1\n    print(\"MapReduce WordCount Results:\", counts)\n\nif __name__ == '__main__':\n    main()",
            List.of("What is Hadoop NameNode and DataNode?", "Why is Apache Spark faster than standard MapReduce?"),
            List.of("What is HDFS replication factor?", "Explain the shuffle and sort phase in MapReduce.")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            7,
            "Artificial Intelligence & Robotics",
            "Minimax Algorithm with Alpha-Beta Pruning",
            4,
            "Implement game-playing adversarial search algorithm with branch pruning optimization.",
            "Build Tic-Tac-Toe / Chess adversarial search agent selecting optimal utility moves with alpha-beta pruning.",
            "Alpha-beta pruning eliminates game tree branches that cannot influence the final decision, reducing search complexity from O(b^d) to O(b^(d/2)).",
            "1. Evaluate terminal state utility.\n2. Maximizing player updates alpha = max(alpha, value).\n3. Minimizing player updates beta = min(beta, value).\n4. If beta <= alpha: prune remaining siblings.\n5. Return optimal move.",
            "Demonstrate decision values across a game tree with alpha-beta cutoffs.",
            "Alpha-beta pruning skipped redundant evaluations, reducing searched nodes by over 50%.",
            "public class Main {\n    static int minimax(int depth, int nodeIndex, boolean isMax, int[] scores, int h, int alpha, int beta) {\n        if (depth == h) return scores[nodeIndex];\n        if (isMax) {\n            int best = Integer.MIN_VALUE;\n            for (int i = 0; i < 2; i++) {\n                int val = minimax(depth + 1, nodeIndex * 2 + i, false, scores, h, alpha, beta);\n                best = Math.max(best, val); alpha = Math.max(alpha, best);\n                if (beta <= alpha) break;\n            }\n            return best;\n        } else {\n            int best = Integer.MAX_VALUE;\n            for (int i = 0; i < 2; i++) {\n                int val = minimax(depth + 1, nodeIndex * 2 + i, true, scores, h, alpha, beta);\n                best = Math.min(best, val); beta = Math.min(beta, best);\n                if (beta <= alpha) break;\n            }\n            return best;\n        }\n    }\n    public static void main(String[] args) {\n        int[] scores = {3, 5, 6, 9, 1, 2, 0, -1};\n        int optimal = minimax(0, 0, true, scores, 3, Integer.MIN_VALUE, Integer.MAX_VALUE);\n        System.out.println(\"Optimal Minimax Decision Value: \" + optimal);\n    }\n}",
            "def minimax(depth, node_index, is_max, scores, h, alpha, beta):\n    if depth == h: return scores[node_index]\n    if is_max:\n        best = -float('inf')\n        for i in range(2):\n            val = minimax(depth + 1, node_index * 2 + i, False, scores, h, alpha, beta)\n            best = max(best, val)\n            alpha = max(alpha, best)\n            if beta <= alpha: break\n        return best\n    else:\n        best = float('inf')\n        for i in range(2):\n            val = minimax(depth + 1, node_index * 2 + i, True, scores, h, alpha, beta)\n            best = min(best, val)\n            beta = min(beta, best)\n            if beta <= alpha: break\n        return best\n\ndef main():\n    scores = [3, 5, 6, 9, 1, 2, 0, -1]\n    optimal = minimax(0, 0, True, scores, 3, -float('inf'), float('inf'))\n    print(f\"Optimal Minimax Decision Value: {optimal}\")\n\nif __name__ == '__main__':\n    main()",
            List.of("Under what conditions does Alpha-Beta pruning achieve optimal O(b^(d/2))?", "What is horizon effect in game playing?"),
            List.of("What is an evaluation function in chess?", "Explain forward kinematics vs inverse kinematics in robotics.")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            7,
            "Blockchain & Smart Contracts",
            "Solidity Smart Contract for Decentralized Voting",
            5,
            "Author, deploy, and interact with an Ethereum smart contract using Web3.",
            "Write Solidity smart contract with vote casting, double-voting prevention, and winner calculation.",
            "Smart contracts are self-executing code stored on immutable distributed ledgers that execute automatically when predefined rules are met.",
            "1. Define chairperson and candidates mapping.\n2. Author giveRightToVote() restricted to chairperson.\n3. Author vote() recording vote and setting hasVoted boolean.\n4. Author winningProposal() computing candidate with max votes.",
            "Deploy contract simulation, cast votes from multiple address accounts, and query winner.",
            "Verified transparent, tamper-proof voting logic with cryptographic transaction verification.",
            "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Smart Contract: DecentralizedVoting.sol\");\n        System.out.println(\"Contract Address: 0x71C...3a9B (Ethereum Sepolia)\");\n        System.out.println(\"Voter 0x12A... cast vote for Candidate 1 (Alice)\");\n        System.out.println(\"Current Winner: Alice (Votes: 42)\");\n    }\n}",
            "def main():\n    print(\"Smart Contract: DecentralizedVoting.sol\")\n    print(\"Contract Address: 0x71C...3a9B\")\n    print(\"Voter 0x12A... cast vote for Candidate 1\")\n    print(\"Current Winner: Alice (Votes: 42)\")\n\nif __name__ == '__main__':\n    main()",
            List.of("What is Gas and Gas Limit in Ethereum?", "What is reentrancy vulnerability in Solidity?"),
            List.of("What is proof-of-work vs proof-of-stake?", "What is the role of EVM (Ethereum Virtual Machine)?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            7,
            "Natural Language Processing",
            "Text Preprocessing, Tokenization, and TF-IDF",
            1,
            "Extract linguistic features from text using stopword filtering, lemmatization, and TF-IDF weighting.",
            "Convert document collection into sparse TF-IDF feature matrices for text categorization.",
            "TF-IDF evaluates how important a word is to a document within a corpus, downweighting common non-discriminative terms.",
            "1. Clean text and remove punctuation.\n2. Tokenize and apply lemmatization.\n3. Compute Term Frequency TF(t, d).\n4. Compute Inverse Document Frequency IDF(t) = log(N / df(t)).\n5. TF-IDF = TF * IDF.",
            "Compute TF-IDF scores for query terms across 3 documents.",
            "Extracted high-value discriminative keyword weights for downstream classification.",
            "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        double tf = 2.0 / 10.0;\n        double idf = Math.log(100.0 / 5.0);\n        double tfidf = tf * idf;\n        System.out.printf(\"Computed TF-IDF Score for term 'compiler': %.4f%n\", tfidf);\n    }\n}",
            "import math\n\ndef main():\n    tf = 2.0 / 10.0\n    idf = math.log(100.0 / 5.0)\n    print(f\"Computed TF-IDF Score for term 'compiler': {tf * idf:.4f}\")\n\nif __name__ == '__main__':\n    main()",
            List.of("What is the difference between stemming and lemmatization?", "How does Word2Vec capture semantic word similarities?"),
            List.of("What is an n-gram model?", "What is attention mechanism in Transformers?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            7,
            "DevOps & Site Reliability Engineering",
            "Infrastructure as Code with Terraform and Docker",
            2,
            "Provision cloud infrastructure declaratively and automate deployment pipelines.",
            "Define reproducible infrastructure using Terraform manifests (.tf) and configure health probes.",
            "Infrastructure as Code (IaC) eliminates configuration drift by managing servers, networks, and storage as version-controlled code.",
            "1. Define provider (AWS / Docker / LocalStack).\n2. Declare resource blocks with desired configuration state.\n3. Run terraform plan to preview execution changes.\n4. Run terraform apply to provision state.\n5. Monitor resources via health check endpoints.",
            "Validate Terraform configuration syntax and print resource dependency graph.",
            "Provisioned automated cloud infrastructure with zero manual configuration drift.",
            "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Terraform Plan: 3 to add, 0 to change, 0 to destroy.\");\n        System.out.println(\"Resource 'docker_container.codelabx_db': Provisioned.\");\n        System.out.println(\"Infrastructure State: Clean & Monitored.\");\n    }\n}",
            "def main():\n    print(\"Terraform Plan: 3 to add, 0 to change, 0 to destroy.\")\n    print(\"Resource 'docker_container.codelabx_db': Provisioned.\")\n    print(\"Infrastructure State: Clean & Monitored.\")\n\nif __name__ == '__main__':\n    main()",
            List.of("Explain difference between mutable and immutable infrastructure.", "What are the core Four Golden Signals in Site Reliability Engineering?"),
            List.of("What is Blue-Green deployment vs Canary deployment?", "What is terraform.tfstate file?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            8,
            "Cyber Forensics & Incident Response",
            "Memory Dump Analysis & Volatility Forensic Framework",
            3,
            "Acquire physical memory snapshots and extract volatile forensic evidence of malware artifacts.",
            "Analyze volatile RAM dumps using memory forensics plugins (imageinfo, pslist, netscan, malfind).",
            "RAM contains ephemeral forensic evidence including active network connections, decrypted encryption keys, and injected DLL processes.",
            "1. Capture raw memory dump (.raw / .dmp).\n2. Identify memory profile using imageinfo.\n3. List processes (pslist / pstree) to spot unlinked hidden PIDs.\n4. Inspect sockets and netscan for C2 callbacks.\n5. Dump suspicious executables with malfind for disassembly.",
            "Extract rogue process handles and verify cryptographic hashes of dumped binaries.",
            "Identified injected process and recovered malware payload from volatile memory image.",
            "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"=== Volatility Forensics Analysis ===\");\n        System.out.println(\"Profile: Win10x64_19041\");\n        System.out.println(\"Suspicious PID: 4892 (svchost.exe - Unparented)\");\n        System.out.println(\"Established Connection: 198.51.100.42:4444 (ESTABLISHED)\");\n        System.out.println(\"Malfind Alert: PAGE_EXECUTE_READWRITE injected memory section detected!\");\n    }\n}",
            "def main():\n    print(\"=== Volatility Forensics Analysis ===\")\n    print(\"Profile: Win10x64_19041\")\n    print(\"Suspicious PID: 4892 (svchost.exe - Unparented)\")\n    print(\"Established Connection: 198.51.100.42:4444\")\n    print(\"Malfind Alert: Injected executable code detected!\")\n\nif __name__ == '__main__':\n    main()",
            List.of("What is Order of Volatility in digital evidence collection?", "Explain Chain of Custody documentation requirements."),
            List.of("What is steganography and how is it detected?", "What is anti-forensics?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            8,
            "High Performance Computing",
            "Parallel Matrix Multiplication using OpenMP Threads",
            4,
            "Parallelize dense matrix multiplication across multi-core processors using OpenMP pragmas.",
            "Implement parallel matrix multiplication and calculate speedup factor over serial execution.",
            "Amdahl's Law bounds maximum parallel speedup based on the serial fraction of a program. OpenMP distributes loop iterations across worker threads.",
            "1. Allocate matrices A, B, C of size N x N.\n2. Initialize with test values.\n3. Parallelize outer loop with #pragma omp parallel for private(j, k) shared(A, B, C).\n4. Record CPU timestamps.\n5. Compute Speedup S = T_serial / T_parallel.",
            "Compute speedup for 1000x1000 matrix multiplication across 4 CPU cores.",
            "Achieved 3.6x speedup on 4-core CPU, demonstrating near-linear parallel scaling.",
            "public class Main {\n    public static void main(String[] args) {\n        int n = 500;\n        System.out.println(\"Parallel Matrix Multiplication (\" + n + \"x\" + n + \")\");\n        System.out.println(\"Threads: 8 Worker Cores\");\n        System.out.println(\"Execution Time: 142 ms (Serial Time: 520 ms)\");\n        System.out.printf(\"Calculated Speedup Factor: %.2fx%n\", 520.0 / 142.0);\n    }\n}",
            "def main():\n    print(\"Parallel Matrix Multiplication (500x500)\")\n    print(\"Threads: 8 Worker Cores\")\n    print(\"Execution Time: 142 ms (Serial: 520 ms)\")\n    print(f\"Calculated Speedup: {520 / 142:.2f}x\")\n\nif __name__ == '__main__':\n    main()",
            List.of("State Amdahl's Law and Gustafson's Law.", "Explain false sharing in cache coherence protocols."),
            List.of("What is the difference between shared memory and distributed memory architectures?", "What is a GPU warp?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            8,
            "Internet of Things & Edge AI",
            "ESP32 / MQTT Telemetry Stream & Sensor Dashboard",
            5,
            "Acquire real-time sensor telemetry and publish to MQTT message broker for edge monitoring.",
            "Interface DHT22 temperature/humidity sensor with ESP32 microcontroller and stream JSON telemetry via MQTT.",
            "MQTT is an ultra-lightweight publish/subscribe messaging protocol designed for constrained IoT devices and low-bandwidth networks.",
            "1. Connect ESP32 to Wi-Fi access point.\n2. Initialize PubSubClient connected to MQTT broker.\n3. Read sensor analog/digital pins every 2000ms.\n4. Serialize telemetry to JSON payload.\n5. Publish to topic 'sensors/lab/telemetry'.",
            "Format sensor payload and verify QoS 1 delivery acknowledgment.",
            "Telemetry streamed reliably with sub-50ms latency across MQTT message queues.",
            "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"MQTT Telemetry Client Connected:\");\n        System.out.println(\"Broker: mqtt://broker.codelabx.in:1883 [QoS 1]\");\n        System.out.println(\"Published: { 'temperature': 24.6, 'humidity': 58.2, 'unit': 'C' }\");\n        System.out.println(\"Status: Broker ACK Received\");\n    }\n}",
            "def main():\n    print(\"MQTT Telemetry Client Connected:\")\n    print(\"Broker: mqtt://broker.codelabx.in:1883 [QoS 1]\")\n    print(\"Published: {'temperature': 24.6, 'humidity': 58.2}\")\n    print(\"Status: Broker ACK Received\")\n\nif __name__ == '__main__':\n    main()",
            List.of("Explain MQTT Quality of Service levels (QoS 0, 1, 2).", "What is Edge Impulse and TinyML optimization?"),
            List.of("What is the difference between CoAP and MQTT?", "Why are low-power sleep modes critical in battery-powered IoT devices?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            8,
            "Quantum Computing & Information",
            "Quantum Superposition & Bell State Circuit Simulation",
            1,
            "Simulate quantum circuits, Hadamard superposition, and Einstein-Podolsky-Rosen (EPR) entanglement.",
            "Construct 2-qubit Bell state circuit (|00> + |11>)/sqrt(2) and verify measurement correlations.",
            "Quantum computers leverage superposition and quantum entanglement to evaluate exponentially large state spaces simultaneously.",
            "1. Initialize 2 qubits to state |00>.\n2. Apply Hadamard gate H to qubit 0: (|0> + |1>)/sqrt(2).\n3. Apply CNOT gate with qubit 0 as control and qubit 1 as target.\n4. Measure both qubits into classical bits.\n5. Sample measurement histogram (50% |00>, 50% |11>).",
            "Simulate quantum state vector transformation and output state probabilities.",
            "Verified maximum quantum entanglement; measurements yielded strictly correlated outcomes.",
            "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Quantum Circuit Simulation (Qiskit Engine):\");\n        System.out.println(\"q0: --[ H ]--*--\");\n        System.out.println(\"q1: ---------X--\");\n        System.out.println(\"Final State Vector: 0.7071|00> + 0.7071|11>\");\n        System.out.println(\"Measurement Probabilities: |00>: 50.0%, |11>: 50.0%\");\n    }\n}",
            "def main():\n    print(\"Quantum Circuit Simulation:\")\n    print(\"q0: --[ H ]--*--\")\n    print(\"q1: ---------X--\")\n    print(\"State Vector: 0.7071|00> + 0.7071|11>\")\n    print(\"Probabilities: |00|: 50%, |11|: 50%\")\n\nif __name__ == '__main__':\n    main()",
            List.of("Explain no-cloning theorem in quantum mechanics.", "How does Grover's search achieve quadratic speedup O(sqrt(N))?"),
            List.of("What is a Qubit and Bloch Sphere representation?", "What is quantum decoherence?")
        );
        seedExp(
            practicals, assignments, practiceQuestions, vivaQuestions, teacher, students,
            8,
            "Capstone Major Project Phase-II",
            "System Architecture, Scalability Validation & End-to-End Testing",
            2,
            "Perform comprehensive end-to-end integration validation, load testing, and defense audit.",
            "Validate system throughput, automated test coverage, and security defenses for CodeLabX platform.",
            "Capstone engineering validation synthesizes full-stack engineering, performance benchmarking, and architectural defense.",
            "1. Execute automated test suite (Unit, Integration, E2E).\n2. Run Apache JMeter load test with 500 concurrent virtual users.\n3. Verify 99th percentile response latency < 250ms.\n4. Perform OWASP Top-10 security audit.\n5. Compile final engineering defense deliverables.",
            "Validate test metrics and output readiness checklist.",
            "All acceptance criteria verified; system cleared for production deployment and university review.",
            "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"CodeLabX Capstone Major Project Validation:\");\n        System.out.println(\"Automated Tests: 48/48 Passing (100%)\");\n        System.out.println(\"Load Benchmark: 500 Virtual Users @ 210ms P99 Latency\");\n        System.out.println(\"Security Audit: OWASP Top-10 Verified (No Vulnerabilities)\");\n        System.out.println(\"Status: APPROVED FOR FINAL DEFENSE\");\n    }\n}",
            "def main():\n    print(\"CodeLabX Capstone Major Project Validation:\")\n    print(\"Automated Tests: 48/48 Passing (100%)\")\n    print(\"Load Benchmark: 500 Virtual Users @ 210ms P99\")\n    print(\"Security Audit: Clean\")\n    print(\"Status: APPROVED FOR FINAL DEFENSE\")\n\nif __name__ == '__main__':\n    main()",
            List.of("How do you conduct Chaos Engineering experiments on distributed systems?", "Explain disaster recovery RPO and RTO metrics."),
            List.of("What architectural pattern was used in the capstone project?", "How is data consistency maintained across microservices?")
        );
    }

    private UserAccount user(UserRepository users, PasswordEncoder encoder, String name, String email, Role role) {
        return users.findByEmailIgnoreCase(email).orElseGet(() -> {
            UserAccount u = new UserAccount(); u.setName(name); u.setEmail(email); u.setRole(role);
            u.setPassword(encoder.encode("CodeLabX123!")); return users.save(u);
        });
    }
}
