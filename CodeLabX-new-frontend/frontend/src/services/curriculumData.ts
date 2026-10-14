import type { AcademicSubject, Detail } from "../types";

export type DepartmentInfo = {
  id: string;
  name: string;
  code: string;
  tagline: string;
  icon: string;
};

export const DEPARTMENTS: DepartmentInfo[] = [
  {
    id: "computer-engineering",
    name: "Computer Engineering",
    code: "CMPN",
    tagline: "Algorithms, Distributed Systems, Software Engineering & Systems Architecture",
    icon: "💻",
  },
  {
    id: "information-technology",
    name: "Information Technology",
    code: "IT",
    tagline: "Cloud Computing, DevOps, Cyber Security & Full-Stack Development",
    icon: "🌐",
  },
  {
    id: "aids",
    name: "Artificial Intelligence & Data Science",
    code: "AI&DS",
    tagline: "Big Data, Machine Learning, Deep Neural Networks & Analytics",
    icon: "📊",
  },
  {
    id: "aiml",
    name: "Artificial Intelligence & Machine Learning",
    code: "AIML",
    tagline: "Reinforcement Learning, Generative AI, Robotics & Computer Vision",
    icon: "🤖",
  },
  {
    id: "cse-iot",
    name: "Computer Science & Engineering (IoT)",
    code: "CSE-IoT",
    tagline: "Embedded Systems, Sensors, Smart Infrastructure & Automation",
    icon: "📡",
  },
  {
    id: "encs",
    name: "Electronics & Computer Science",
    code: "ENCS",
    tagline: "VLSI, SoC Architectures, Hardware-Software Co-Design & Microprocessors",
    icon: "⚡",
  },
  {
    id: "entc",
    name: "Electronics & Telecommunication",
    code: "ENTC",
    tagline: "5G & Wireless Networks, Signal Processing, Radar & Satellite Communications",
    icon: "📻",
  },
];

type DeptSubjectDef = {
  code: string;
  name: string;
  experiments: Array<{
    title: string;
    aim: string;
    theory: string;
    algorithm: string;
    instructions: string;
    lang: string;
    practice: string[];
    viva: Array<{ q: string; marks: number }>;
  }>;
};

// Map department key -> semester -> subjects
const CURRICULUM_CATALOG: Record<string, Record<number, DeptSubjectDef[]>> = {
  "information-technology": {
    1: [
      {
        code: "IT-101",
        name: "Programming in C",
        experiments: [
          {
            title: "Control Flow & Decision Making in C",
            aim: "Implement conditional branching (if-else, switch) and looping constructs for algorithmic problem solving.",
            theory: "C programming provides structured control statements allowing conditional execution and repetitive iteration. Efficient looping reduces time complexity.",
            algorithm: "1. Read input numbers from standard input.\n2. Evaluate condition using switch-case.\n3. Iterate using for/while loops.\n4. Display formatted results.",
            instructions: "Write a complete C program with standard header stdio.h demonstrating decision making and loop control.",
            lang: "C",
            practice: [
              "What is the difference between while and do-while loops in C?",
              "Explain the role of break and continue statements.",
            ],
            viva: [
              { q: "What is the return type of main() in C?", marks: 2 },
              { q: "Explain short-circuit evaluation in logical operators.", marks: 2 },
            ],
          },
          {
            title: "Functions, Recursion & Storage Classes",
            aim: "Demonstrate modular code design using user-defined functions and recursion.",
            theory: "Functions enable code reuse and modularity. Recursion is a programming technique where a function calls itself to solve smaller sub-problems.",
            algorithm: "1. Define base case and recursive step.\n2. Pass parameters by value or reference.\n3. Return computed output to caller.",
            instructions: "Implement recursive calculation of Fibonacci numbers or Factorial in C.",
            lang: "C",
            practice: ["How is call stack memory managed during recursive calls?", "Compare auto and static storage classes in C."],
            viva: [{ q: "What causes a stack overflow in recursion?", marks: 2 }, { q: "What is function prototyping?", marks: 2 }],
          },
          {
            title: "Pointers & Dynamic Memory Allocation",
            aim: "Implement dynamic arrays using malloc(), calloc(), realloc(), and free().",
            theory: "Pointers store memory addresses of variables. Dynamic memory allocation allows resizing memory blocks at runtime on the heap.",
            algorithm: "1. Allocate memory pointer via malloc().\n2. Verify allocation success.\n3. Populate data and access via pointer arithmetic.\n4. Free allocated memory.",
            instructions: "Implement dynamic array allocation and reallocation in C.",
            lang: "C",
            practice: ["What is a dangling pointer and how do you avoid it?", "Difference between malloc and calloc."],
            viva: [{ q: "What is a void pointer in C?", marks: 2 }, { q: "Why is memory leak a critical issue in C?", marks: 2 }],
          },
          {
            title: "Structures & File I/O Operations",
            aim: "Read and write structured student records using binary and text file streams in C.",
            theory: "Structures group heterogeneous data types. File operations in C utilize FILE pointers with fopen, fprintf, fscanf, and fclose.",
            algorithm: "1. Declare struct Student.\n2. Open file in append or read mode.\n3. Write and read struct records.\n4. Close file handle.",
            instructions: "Write a C program that stores student marks records in a file and prints summary statistics.",
            lang: "C",
            practice: ["Explain difference between text mode and binary mode file I/O.", "What does feof() do?"],
            viva: [{ q: "How is struct padding handled by compilers?", marks: 2 }, { q: "What does fopen return upon failure?", marks: 2 }],
          },
        ],
      },
      {
        code: "IT-102",
        name: "Basic Electrical & Electronics",
        experiments: [
          {
            title: "Verification of Thevenin's and Norton's Theorems",
            aim: "Simulate and verify Thevenin's and Norton's equivalent electrical network theorems.",
            theory: "Any linear electrical circuit with voltage and current sources and resistances can be replaced by an equivalent circuit with one voltage source and one resistor.",
            algorithm: "1. Measure open circuit voltage Voc.\n2. Measure short circuit current Isc.\n3. Calculate equivalent resistance Rth = Voc / Isc.\n4. Connect load resistance and verify current.",
            instructions: "Write a program in Python or C calculating Thevenin and Norton equivalents from circuit parameters.",
            lang: "PYTHON",
            practice: ["State Maximum Power Transfer Theorem.", "How is Norton theorem dual to Thevenin theorem?"],
            viva: [{ q: "What is open-circuit voltage in a linear network?", marks: 2 }, { q: "How are ideal voltage sources deactivated?", marks: 2 }],
          },
          {
            title: "Analysis of R-L-C Series Resonance Circuit",
            aim: "Compute resonant frequency, quality factor, and bandwidth in an RLC circuit.",
            theory: "At resonant frequency, inductive reactance equals capacitive reactance, causing impedance to be purely resistive and current to reach maximum.",
            algorithm: "1. Input R, L, C parameters.\n2. Compute resonant frequency fr = 1 / (2*pi*sqrt(L*C)).\n3. Calculate quality factor Q and bandwidth.\n4. Print resonance metrics.",
            instructions: "Write a Python script plotting or calculating impedance and resonance curve.",
            lang: "PYTHON",
            practice: ["What happens to impedance at series resonance?", "Define bandwidth in terms of half-power frequencies."],
            viva: [{ q: "What is the power factor at resonance?", marks: 2 }, { q: "Why is series resonance called voltage resonance?", marks: 2 }],
          },
          {
            title: "Single Phase Transformer Efficiency & Regulation",
            aim: "Determine efficiency and voltage regulation of single phase transformer under varying load power factors.",
            theory: "Transformer efficiency depends on core (iron) and copper losses. Voltage regulation indicates the percentage change in secondary terminal voltage from no-load to full-load.",
            algorithm: "1. Read no-load voltage and full-load voltage.\n2. Compute copper and iron losses.\n3. Calculate efficiency = Output / (Output + Losses) * 100.\n4. Calculate regulation.",
            instructions: "Implement transformer calculation formulas in Java or Python.",
            lang: "JAVA",
            practice: ["Why is transformer rating in kVA instead of kW?", "What are eddy current losses?"],
            viva: [{ q: "Which test gives iron losses in a transformer?", marks: 2 }, { q: "What is all-day efficiency?", marks: 2 }],
          },
          {
            title: "Logic Gate Realization & De Morgan's Laws",
            aim: "Realize basic logic gates using universal NAND and NOR gates and verify De Morgan's theorems.",
            theory: "NAND and NOR gates are universal gates because any boolean expression can be realized using only NAND or only NOR gates.",
            algorithm: "1. Define truth table for boolean functions.\n2. Formulate De Morgan equivalence: (A + B)' = A'B' and (AB)' = A' + B'.\n3. Evaluate logic output.",
            instructions: "Implement a digital logic circuit simulator in Java.",
            lang: "JAVA",
            practice: ["Why are NAND and NOR called universal gates?", "State De Morgan's first and second theorems."],
            viva: [{ q: "What is the propagation delay of a gate?", marks: 2 }, { q: "What is fan-out in digital circuits?", marks: 2 }],
          },
        ],
      },
      {
        code: "IT-103",
        name: "Applied Mathematics - I",
        experiments: [
          {
            title: "System of Linear Equations & Gauss Elimination",
            aim: "Solve a system of linear equations using Gaussian elimination and LU decomposition.",
            theory: "Gaussian elimination converts an augmented matrix into upper triangular form via row operations, followed by back-substitution to find unknown variables.",
            algorithm: "1. Form augmented matrix [A|B].\n2. Perform forward elimination to upper triangular matrix.\n3. Check rank consistency.\n4. Compute back substitution for solution vector X.",
            instructions: "Implement Gaussian elimination algorithm with partial pivoting in Python.",
            lang: "PYTHON",
            practice: ["What condition determines infinite solutions in linear systems?", "Why is partial pivoting required in Gaussian elimination?"],
            viva: [{ q: "What is the rank of a matrix?", marks: 2 }, { q: "When is a matrix singular?", marks: 2 }],
          },
          {
            title: "Eigenvalues & Eigenvectors Computation",
            aim: "Compute eigenvalues and corresponding eigenvectors for square matrices.",
            theory: "For a square matrix A, an eigenvector x and eigenvalue lambda satisfy A*x = lambda*x. Found by solving det(A - lambda*I) = 0.",
            algorithm: "1. Compute characteristic polynomial det(A - lambda*I).\n2. Solve roots for eigenvalues.\n3. For each eigenvalue, solve (A - lambda*I)x = 0.\n4. Normalize eigenvectors.",
            instructions: "Write a program in Python to compute eigenvalues of a 3x3 matrix.",
            lang: "PYTHON",
            practice: ["State Cayley-Hamilton theorem.", "What are orthogonal matrices and their eigenvalue properties?"],
            viva: [{ q: "What is the trace of a matrix?", marks: 2 }, { q: "Can a real matrix have complex eigenvalues?", marks: 2 }],
          },
          {
            title: "Numerical Integration using Simpson's Rules",
            aim: "Implement Trapezoidal rule, Simpson's 1/3rd and 3/8th rules for definite numerical integration.",
            theory: "Numerical integration approximates the area under curves by dividing the integration interval into n sub-intervals and approximating each segment by polynomials.",
            algorithm: "1. Define integrand function f(x) and limits a, b.\n2. Divide interval into n even sub-intervals of width h = (b-a)/n.\n3. Apply Simpson formula: (h/3)*[f(a) + 4*sum(odds) + 2*sum(evens) + f(b)].\n4. Output integral value.",
            instructions: "Write a Python script computing definite integrals using Simpson's 1/3 rule.",
            lang: "PYTHON",
            practice: ["Compare order of error between Trapezoidal and Simpson 1/3 rule.", "Why must n be even for Simpson 1/3 rule?"],
            viva: [{ q: "What is numerical quadrature?", marks: 2 }, { q: "Define degree of precision for quadrature formulas.", marks: 2 }],
          },
          {
            title: "Taylor and Maclaurin Series Expansions",
            aim: "Approximate trigonometric and exponential functions using Taylor series expansion to required tolerance.",
            theory: "Taylor series represents a smooth function as an infinite sum of polynomial terms calculated from derivatives at a single point.",
            algorithm: "1. Input variable x and number of terms N.\n2. Compute term i = (-1)^i * x^(2i+1) / (2i+1)! for sin(x).\n3. Accumulate terms until error < epsilon.\n4. Display computed value and library comparison.",
            instructions: "Implement Taylor expansion for sin(x) and exp(x) in Java or Python.",
            lang: "PYTHON",
            practice: ["What is the remainder term in Taylor's theorem?", "Define convergence radius of power series."],
            viva: [{ q: "What is the Maclaurin series for e^x?", marks: 2 }, { q: "How many terms are needed for 4-decimal accuracy in sin(pi/6)?", marks: 2 }],
          },
        ],
      },
      {
        code: "IT-104",
        name: "Applied Physics - I",
        experiments: [
          {
            title: "Determination of Wavelength via Newton's Rings",
            aim: "Determine wavelength of sodium light using Newton's rings interference pattern.",
            theory: "Newton's rings are formed due to interference between light reflected from top and bottom surfaces of an air film between a plano-convex lens and glass plate.",
            algorithm: "1. Measure diameters of n-th and (n+p)-th dark rings.\n2. Calculate D^2_(n+p) - D^2_n.\n3. Compute wavelength lambda = (D^2_(n+p) - D^2_n) / (4*p*R).\n4. Output wavelength in Angstroms.",
            instructions: "Implement Newton's ring calculation and error analysis in Python.",
            lang: "PYTHON",
            practice: ["Why is central spot in Newton's rings dark in reflected light?", "How does diameter of rings change if liquid is introduced?"],
            viva: [{ q: "What condition produces destructive interference in thin films?", marks: 2 }, { q: "What is the radius of curvature of the lens?", marks: 2 }],
          },
          {
            title: "Diffraction Grating & Laser Beam Divergence",
            aim: "Measure grating pitch and laser beam divergence using diffraction experiments.",
            theory: "A diffraction grating consists of numerous closely spaced parallel slits that disperse light into a diffraction pattern governed by d*sin(theta) = m*lambda.",
            algorithm: "1. Record distances between central and diffraction maxima.\n2. Calculate diffraction angles theta for order m.\n3. Determine grating element d.\n4. Measure beam spot size at two distances to calculate divergence.",
            instructions: "Write a program in Python to calculate grating parameters and beam divergence.",
            lang: "PYTHON",
            practice: ["What is resolving power of a diffraction grating?", "Explain monochromatic coherence of lasers."],
            viva: [{ q: "What is grating element (d)?", marks: 2 }, { q: "Why is a laser source used in modern diffraction labs?", marks: 2 }],
          },
          {
            title: "Ultrasonic Interferometer & Velocity of Sound in Liquids",
            aim: "Determine ultrasonic velocity and compressibility of liquids using an ultrasonic interferometer.",
            theory: "Standing sound waves set up in liquid by piezoelectric crystal form nodes and antinodes, creating diffraction grating for light, yielding sound velocity v = lambda*f.",
            algorithm: "1. Record micrometer displacements for successive current maxima.\n2. Calculate acoustic wavelength lambda = 2*d.\n3. Calculate velocity v = f * lambda.\n4. Compute adiabatic compressibility beta = 1 / (rho * v^2).",
            instructions: "Write a calculation script for ultrasonic interferometer data.",
            lang: "PYTHON",
            practice: ["Define cavitation in ultrasonic liquids.", "How does temperature affect sound velocity in water?"],
            viva: [{ q: "What is the piezoelectric effect?", marks: 2 }, { q: "Define adiabatic compressibility.", marks: 2 }],
          },
          {
            title: "Hall Effect & Carrier Concentration in Semiconductors",
            aim: "Determine Hall coefficient, charge carrier density, and carrier mobility in a semiconductor specimen.",
            theory: "When a current-carrying conductor is placed in a transverse magnetic field, a potential difference (Hall voltage) is developed perpendicular to current and magnetic field.",
            algorithm: "1. Measure Hall voltage Vh for varying magnetic field B and current I.\n2. Plot Vh vs B.\n3. Compute Hall coefficient Rh = (Vh * t) / (I * B).\n4. Compute carrier density n = 1 / (Rh * q).",
            instructions: "Write a program calculating Hall coefficient and semiconductor carrier type.",
            lang: "PYTHON",
            practice: ["How does Hall coefficient sign distinguish p-type and n-type semiconductors?", "Define Hall mobility."],
            viva: [{ q: "What is Lorentz force?", marks: 2 }, { q: "Why is Hall effect significant in modern sensor engineering?", marks: 2 }],
          },
        ],
      },
    ],
    3: [
      {
        code: "IT-301",
        name: "Data Structures & Algorithms",
        experiments: [
          {
            title: "Stack Applications: Infix to Postfix Conversion",
            aim: "Implement stack data structure to convert infix arithmetic expressions to postfix and evaluate them.",
            theory: "A stack is a Last-In-First-Out (LIFO) data structure. Postfix expressions eliminate parenthesis ambiguity and allow single-pass linear time evaluation.",
            algorithm: "1. Scan infix tokens from left to right.\n2. If operand, output to postfix string.\n3. If operator, pop higher or equal precedence operators to output, then push.\n4. Pop remaining operators.",
            instructions: "Implement InfixToPostfix converter in Java with full operator precedence handling.",
            lang: "JAVA",
            practice: ["Why are postfix expressions preferred for compiler expression parsing?", "Explain stack overflow and underflow conditions."],
            viva: [{ q: "What is the time complexity of infix to postfix conversion?", marks: 2 }, { q: "How do you evaluate a postfix expression using a stack?", marks: 2 }],
          },
          {
            title: "Circular Queue Implementation using Arrays",
            aim: "Implement circular queue data structure with enqueue, dequeue, peek, and display operations.",
            theory: "A circular queue overcomes memory wastage in linear queues by wrapping rear and front pointers using modulo arithmetic: (rear + 1) % capacity.",
            algorithm: "1. Check if queue full: (rear + 1) % SIZE == front.\n2. For enqueue: rear = (rear + 1) % SIZE, insert element.\n3. For dequeue: item = arr[front], front = (front + 1) % SIZE.",
            instructions: "Write a complete Java program for Circular Queue operations.",
            lang: "JAVA",
            practice: ["How does circular queue differ from linear queue?", "What is priority queue?"],
            viva: [{ q: "What is the condition for circular queue empty?", marks: 2 }, { q: "State two applications of circular queues.", marks: 2 }],
          },
          {
            title: "Doubly Linked List & Polynomial Arithmetic",
            aim: "Implement a Doubly Linked List and perform polynomial addition and multiplication.",
            theory: "A doubly linked list contains nodes with two pointers: next and prev, facilitating bidirectional traversal and constant-time node deletion given pointer.",
            algorithm: "1. Create node structure {coeff, exp, next, prev}.\n2. Compare exponents of two polynomial lists.\n3. Add coefficients with matching exponents.\n4. Append remaining terms.",
            instructions: "Implement Doubly Linked List polynomial addition in Java.",
            lang: "JAVA",
            practice: ["Compare singly vs doubly linked list memory overhead.", "How do you detect a cycle in a linked list?"],
            viva: [{ q: "What is the advantage of a dummy head node?", marks: 2 }, { q: "What is the time complexity of inserting at head in DLL?", marks: 2 }],
          },
          {
            title: "Binary Search Tree Operations & Traversals",
            aim: "Implement Binary Search Tree (BST) insertion, search, deletion, and in-order, pre-order, post-order traversals.",
            theory: "In a BST, keys in left subtree are smaller than root, and keys in right subtree are greater. In-order traversal yields elements in sorted ascending order.",
            algorithm: "1. Insert key recursively according to BST invariant.\n2. In-order: left -> root -> right.\n3. Pre-order: root -> left -> right.\n4. Post-order: left -> right -> root.",
            instructions: "Implement BST with recursive traversals in Java.",
            lang: "JAVA",
            practice: ["Explain time complexity of BST operations in worst and average cases.", "What is an AVL tree and why is it needed?"],
            viva: [{ q: "What traversal of a BST gives sorted output?", marks: 2 }, { q: "How is deletion of a node with two children executed in BST?", marks: 2 }],
          },
          {
            title: "Divide & Conquer: Merge Sort and Quick Sort",
            aim: "Implement Merge Sort and Quick Sort with partition analysis and execution time comparison.",
            theory: "Merge sort divides input into halves, recursively sorts, and merges in O(n log n) time. Quick sort partitions around a pivot element with average O(n log n).",
            algorithm: "1. QuickSort: select pivot, partition elements into smaller and larger subsets, recurse.\n2. MergeSort: split array at mid, recurse on left and right, merge sorted sub-arrays.\n3. Print sorted outputs.",
            instructions: "Implement MergeSort and QuickSort in Java and measure runtime.",
            lang: "JAVA",
            practice: ["Is Merge Sort in-place or stable?", "What is worst-case time complexity of Quick Sort and how can it be avoided?"],
            viva: [{ q: "What is the space complexity of Merge Sort?", marks: 2 }, { q: "Explain Lomuto vs Hoare partition schemes.", marks: 2 }],
          },
        ],
      },
      {
        code: "IT-302",
        name: "Database Management Systems",
        experiments: [
          {
            title: "DDL, DML & Schema Definition in SQL",
            aim: "Design relational database schema with primary key, foreign key, check constraints and execute DDL/DML statements.",
            theory: "Data Definition Language (DDL) creates and alters database schemas. Data Manipulation Language (DML) queries, inserts, updates, and deletes records.",
            algorithm: "1. CREATE TABLE departments, students, courses.\n2. Add constraints (PK, FK, UNIQUE, NOT NULL).\n3. INSERT sample records.\n4. Execute queries.",
            instructions: "Write SQL schema creation and manipulation script.",
            lang: "SQL",
            practice: ["Difference between DROP, TRUNCATE, and DELETE.", "What are referential integrity constraints?"],
            viva: [{ q: "What is candidate key?", marks: 2 }, { q: "Explain CASCADE ON DELETE in foreign keys.", marks: 2 }],
          },
          {
            title: "Complex SQL Joins, Aggregations & Nested Subqueries",
            aim: "Formulate complex queries utilizing INNER JOIN, LEFT JOIN, GROUP BY, HAVING, and correlated subqueries.",
            theory: "Relational joins combine tuples from multiple relations based on predicate conditions. Grouping aggregates summarized records matching filtering conditions.",
            algorithm: "1. Join students and marks tables on student_id.\n2. Group by department and compute average, min, max.\n3. Filter departments where avg > 75 using HAVING.",
            instructions: "Write SQL queries demonstrating inner/outer joins and aggregation.",
            lang: "SQL",
            practice: ["Difference between WHERE and HAVING clause.", "What is a correlated subquery?"],
            viva: [{ q: "What is full outer join?", marks: 2 }, { q: "How does GROUP BY interact with aggregate functions?", marks: 2 }],
          },
          {
            title: "Database Triggers & Stored Procedures (PL/SQL)",
            aim: "Implement database triggers for audit logging and stored procedures with exception handling.",
            theory: "A trigger is procedural SQL code automatically executed in response to database events (INSERT, UPDATE, DELETE). Stored procedures encapsulate business logic.",
            algorithm: "1. Create audit log table.\n2. CREATE TRIGGER before_employee_update.\n3. Record old and new values into audit table.\n4. Test trigger by updating records.",
            instructions: "Write a PL/SQL trigger and stored procedure.",
            lang: "SQL",
            practice: ["What are row-level and statement-level triggers?", "Explain ACID properties of database transactions."],
            viva: [{ q: "What is the difference between procedure and function in PL/SQL?", marks: 2 }, { q: "What is transaction isolation level?", marks: 2 }],
          },
          {
            title: "Database Normalization & Functional Dependencies",
            aim: "Decompose unnormalized relational schema into First (1NF), Second (2NF), and Third Normal Form (3NF).",
            theory: "Normalization minimizes redundancy and eliminates insertion, deletion, and update anomalies through functional dependency decomposition.",
            algorithm: "1. Identify functional dependencies.\n2. Check 1NF: atomic attributes.\n3. Check 2NF: no partial dependency on composite key.\n4. Check 3NF: no transitive dependencies X -> Y where Y is non-prime.",
            instructions: "Write SQL schema reflecting 3NF decomposition for college administration.",
            lang: "SQL",
            practice: ["Explain BCNF (Boyce-Codd Normal Form).", "What is loss-less join decomposition?"],
            viva: [{ q: "What is a transitive functional dependency?", marks: 2 }, { q: "What anomalies occur in unnormalized relations?", marks: 2 }],
          },
        ],
      },
      {
        code: "IT-303",
        name: "Python Programming Lab",
        experiments: [
          {
            title: "Advanced Python Data Structures & Comprehensions",
            aim: "Demonstrate lists, tuples, sets, dictionaries, and list/dict/generator comprehensions in Python.",
            theory: "Python provides built-in mutable and immutable collections. Comprehensions offer concise declarative syntax for mapping and filtering iterable sequences.",
            algorithm: "1. Create collections with heterogeneous elements.\n2. Apply list and dict comprehensions with conditional filters.\n3. Perform set union, intersection, difference.\n4. Print transformed datasets.",
            instructions: "Implement comprehensive data structure operations in Python.",
            lang: "PYTHON",
            practice: ["Compare list vs tuple in memory efficiency and mutability.", "What is the difference between shallow copy and deep copy?"],
            viva: [{ q: "How are dictionaries implemented internally in Python?", marks: 2 }, { q: "What is a generator function and how does yield work?", marks: 2 }],
          },
          {
            title: "Object-Oriented Programming & Magic Methods in Python",
            aim: "Implement classes, inheritance, polymorphism, encapsulation, and dunder methods (__str__, __repr__, __add__).",
            theory: "Python supports object-oriented principles with dynamic typing. Magic methods allow overloading operators and customizing object representation.",
            algorithm: "1. Define base class Vector with __init__.\n2. Overload operator + using __add__.\n3. Override __str__ for formatted printing.\n4. Demonstrate inheritance and method overriding.",
            instructions: "Write a Python program implementing 2D/3D Vector arithmetic with operator overloading.",
            lang: "PYTHON",
            practice: ["Explain Method Resolution Order (MRO) in Python multiple inheritance.", "What is the purpose of @property decorator?"],
            viva: [{ q: "What is duck typing in Python?", marks: 2 }, { q: "Explain the purpose of self parameter in Python methods.", marks: 2 }],
          },
          {
            title: "File Handling, JSON Parsing & Regular Expressions",
            aim: "Read and process unstructured log files using regular expressions and serialize structured reports to JSON.",
            theory: "The re module enables regex matching and token extraction. The json module handles serialization and deserialization between Python dicts and JSON text.",
            algorithm: "1. Open and read server log file line by line.\n2. Compile regex pattern for IP, timestamp, HTTP status.\n3. Extract matched groups.\n4. Serialize statistics to JSON output.",
            instructions: "Write a Python log parser using regex and output JSON summary.",
            lang: "PYTHON",
            practice: ["Explain greedy vs non-greedy matching in regex.", "What is context manager 'with' statement in Python?"],
            viva: [{ q: "What does re.search() vs re.match() do?", marks: 2 }, { q: "How do you handle JSON decode exceptions?", marks: 2 }],
          },
          {
            title: "Web Scraping & Data Extraction with BeautifulSoup",
            aim: "Scrape tabular data and headlines from web pages using requests and BeautifulSoup libraries.",
            theory: "Web scraping extracts structured information from HTML DOM trees by inspecting CSS selectors and XPath elements.",
            algorithm: "1. Fetch URL content using requests.get().\n2. Parse HTML tree with BeautifulSoup parser.\n3. Select table rows via soup.find_all('tr').\n4. Extract text and export to CSV.",
            instructions: "Implement web scraper for weather or financial table data.",
            lang: "PYTHON",
            practice: ["Explain robots.txt and ethical web scraping guidelines.", "How do you handle HTTP rate limiting during scraping?"],
            viva: [{ q: "What is DOM tree structure in HTML?", marks: 2 }, { q: "Difference between find() and find_all() in BeautifulSoup.", marks: 2 }],
          },
        ],
      },
      {
        code: "IT-304",
        name: "Digital Logic & Computer Organization",
        experiments: [
          {
            title: "Arithmetic Logic Unit (ALU) Simulation",
            aim: "Simulate 4-bit Arithmetic Logic Unit performing addition, subtraction, AND, OR, XOR, and NOT operations.",
            theory: "The ALU is the core computational component of the CPU executing arithmetic operations and bitwise logic based on control select lines.",
            algorithm: "1. Input 4-bit binary operands A and B.\n2. Input 3-bit control selection code.\n3. Execute selected arithmetic/logic operation.\n4. Output result and condition flags (Zero, Carry, Overflow).",
            instructions: "Implement 4-bit ALU simulation in Java or Python.",
            lang: "JAVA",
            practice: ["What is 2's complement representation in digital arithmetic?", "Explain carry look-ahead adder advantage over ripple carry adder."],
            viva: [{ q: "What flags are set by an ALU?", marks: 2 }, { q: "How is subtraction performed using 2's complement addition?", marks: 2 }],
          },
          {
            title: "Cache Memory Mapping Techniques (Direct, Associative)",
            aim: "Simulate Direct Mapped and 2-Way Set Associative cache memory hit/miss calculation.",
            theory: "Cache memory bridges the speed gap between high-speed CPU registers and main memory. Memory addresses are divided into Tag, Set/Index, and Block Offset fields.",
            algorithm: "1. Define cache size, block size, and associativity.\n2. Parse memory address into Tag and Set bits.\n3. Check if Tag matches in cache set.\n4. On hit: increment hits; on miss: load block and update LRU.",
            instructions: "Write a cache simulator program in Python or Java.",
            lang: "PYTHON",
            practice: ["Compare Direct Mapped, Fully Associative, and Set Associative cache.", "Explain spatial vs temporal locality of reference."],
            viva: [{ q: "What is cache hit ratio?", marks: 2 }, { q: "Explain Write-Through vs Write-Back cache write policies.", marks: 2 }],
          },
          {
            title: "Memory Organization & Virtual Memory Simulation",
            aim: "Simulate paging, page table address translation, and FIFO/LRU page fault calculation.",
            theory: "Virtual memory decouples logical program addresses from physical RAM addresses using page tables and Memory Management Unit (MMU) hardware.",
            algorithm: "1. Split logical address into Page Number and Offset.\n2. Lookup Page Table for physical Frame Number.\n3. If valid bit is 0, trigger page fault exception.\n4. Replace page using FIFO/LRU and update table.",
            instructions: "Implement virtual memory address translation simulator in Python.",
            lang: "PYTHON",
            practice: ["What is Translation Lookaside Buffer (TLB)?", "Explain thrashing in virtual memory."],
            viva: [{ q: "What is page fault?", marks: 2 }, { q: "Difference between paging and segmentation.", marks: 2 }],
          },
          {
            title: "Booth's Multiplication Algorithm for Signed Numbers",
            aim: "Implement Booth's multiplication algorithm for signed binary integers.",
            theory: "Booth's algorithm multiplies two signed binary numbers in 2's complement representation by detecting runs of 1s and replacing multiple additions with addition and subtraction.",
            algorithm: "1. Initialize accumulator A = 0, Q-1 = 0, count = N.\n2. Inspect Q0 and Q-1.\n3. If 10: A = A - M; if 01: A = A + M.\n4. Arithmetic right shift [A, Q, Q-1].\n5. Decrement count until 0.",
            instructions: "Implement Booth's multiplication algorithm in Java or Python.",
            lang: "JAVA",
            practice: ["Why is arithmetic right shift used instead of logical shift?", "What is the worst-case cycle count in Booth's algorithm?"],
            viva: [{ q: "State Booth's recording rule.", marks: 2 }, { q: "What is modified Booth's algorithm (Radix-4)?", marks: 2 }],
          },
        ],
      },
    ],
  },
};

// Generates dynamic fallback subjects and practicals for any department and semester!
export function getCurriculumSubjects(deptName: string, semester: number): AcademicSubject[] {
  const normDept = deptName.toLowerCase();
  
  // Custom definitions for IT
  if (normDept.includes("information technology") || normDept === "it") {
    if (CURRICULUM_CATALOG["information-technology"]?.[semester]) {
      return CURRICULUM_CATALOG["information-technology"][semester].map((s) => ({
        code: s.code,
        name: s.name,
        semester,
      }));
    }
  }

  // Authentic subject generator by department
  const subjectPresets: Record<string, Record<number, Array<{ code: string; name: string }>>> = {
    aids: {
      1: [
        { code: "DS-101", name: "Engineering Mathematics - I" },
        { code: "DS-102", name: "Python for Data Science Foundations" },
        { code: "DS-103", name: "Applied Physics - I" },
        { code: "DS-104", name: "Basic Electrical Engineering" },
      ],
      2: [
        { code: "DS-201", name: "Engineering Mathematics - II" },
        { code: "DS-202", name: "Object Oriented Programming in Java" },
        { code: "DS-203", name: "Engineering Chemistry" },
        { code: "DS-204", name: "Data Exploration & Visualization" },
      ],
      3: [
        { code: "DS-301", name: "Data Structures for Data Science" },
        { code: "DS-302", name: "Relational & NoSQL Database Systems" },
        { code: "DS-303", name: "Discrete Structures & Graph Theory" },
        { code: "DS-304", name: "Statistical Methods & Probability" },
      ],
      4: [
        { code: "DS-401", name: "Operating Systems & Linux Shell" },
        { code: "DS-402", name: "Design & Analysis of Algorithms" },
        { code: "DS-403", name: "Linear Algebra & Optimization for AI" },
        { code: "DS-404", name: "R Programming & Statistical Modeling" },
      ],
      5: [
        { code: "DS-501", name: "Machine Learning Foundations" },
        { code: "DS-502", name: "Big Data Technologies (Hadoop & Spark)" },
        { code: "DS-503", name: "Data Warehousing & Mining" },
        { code: "DS-504", name: "Natural Language Processing Lab" },
      ],
      6: [
        { code: "DS-601", name: "Deep Learning Architectures" },
        { code: "DS-602", name: "Computer Vision & Image Processing" },
        { code: "DS-603", name: "Data Engineering on Cloud" },
        { code: "DS-604", name: "Business Intelligence & Visualization" },
      ],
      7: [
        { code: "DS-701", name: "Reinforcement Learning & Game AI" },
        { code: "DS-702", name: "Generative AI & Large Language Models" },
        { code: "DS-703", name: "Distributed Data Processing Systems" },
        { code: "DS-704", name: "Time Series Analysis & Forecasting" },
      ],
      8: [
        { code: "DS-801", name: "Autonomous Systems & Robotics" },
        { code: "DS-802", name: "MLOps & Production AI Pipelines" },
        { code: "DS-803", name: "Graph Neural Networks & Social Graphs" },
        { code: "DS-804", name: "AI Ethics, Governance & Security" },
      ],
    },
    aiml: {
      1: [
        { code: "AI-101", name: "Mathematics for AI - I" },
        { code: "AI-102", name: "Procedural Programming in Python" },
        { code: "AI-103", name: "Applied Physics & Sensors" },
        { code: "AI-104", name: "Basic Electrical & Electronics" },
      ],
      2: [
        { code: "AI-201", name: "Mathematics for AI - II" },
        { code: "AI-202", name: "Data Structures & OOP in C++" },
        { code: "AI-203", name: "Digital Electronics & Logic Design" },
        { code: "AI-204", name: "Applied Chemistry & Materials" },
      ],
      3: [
        { code: "AI-301", name: "Data Structures & Algorithms" },
        { code: "AI-302", name: "Mathematical Foundations of Machine Learning" },
        { code: "AI-303", name: "Database Management Systems" },
        { code: "AI-304", name: "Scientific Computing & NumPy/Pandas Lab" },
      ],
      4: [
        { code: "AI-401", name: "Operating Systems" },
        { code: "AI-402", name: "Probability & Random Processes" },
        { code: "AI-403", name: "Design & Analysis of Algorithms" },
        { code: "AI-404", name: "Statistical Machine Learning Lab" },
      ],
      5: [
        { code: "AI-501", name: "Supervised & Unsupervised Learning" },
        { code: "AI-502", name: "Optimization Techniques for ML" },
        { code: "AI-503", name: "Neural Networks & Deep Learning" },
        { code: "AI-504", name: "AI Search Algorithms & Heuristics" },
      ],
      6: [
        { code: "AI-601", name: "Computer Vision Systems" },
        { code: "AI-602", name: "Natural Language Understanding" },
        { code: "AI-603", name: "Deep Reinforcement Learning" },
        { code: "AI-604", name: "Edge AI & Embedded Machine Learning" },
      ],
      7: [
        { code: "AI-701", name: "Transformers & LLM Architectures" },
        { code: "AI-702", name: "Speech & Audio Processing" },
        { code: "AI-703", name: "Cognitive AI Systems" },
        { code: "AI-704", name: "Model Explainability & Trustworthy AI" },
      ],
      8: [
        { code: "AI-801", name: "Advanced MLOps & Continuous Training" },
        { code: "AI-802", name: "Quantum Machine Learning" },
        { code: "AI-803", name: "Scalable Distributed Machine Learning" },
        { code: "AI-804", name: "AI Capstone Project & Deployment" },
      ],
    },
    "cse-iot": {
      1: [
        { code: "IOT-101", name: "Engineering Mathematics - I" },
        { code: "IOT-102", name: "C Programming for Embedded Systems" },
        { code: "IOT-103", name: "Engineering Physics" },
        { code: "IOT-104", name: "Basic Electrical Engineering" },
      ],
      2: [
        { code: "IOT-201", name: "Engineering Mathematics - II" },
        { code: "IOT-202", name: "Object Oriented Programming in Python" },
        { code: "IOT-203", name: "Electronic Devices & Circuit Theory" },
        { code: "IOT-204", name: "Engineering Chemistry" },
      ],
      3: [
        { code: "IOT-301", name: "Data Structures & Algorithms" },
        { code: "IOT-302", name: "Digital Logic & Circuit Design" },
        { code: "IOT-303", name: "Database Management Systems" },
        { code: "IOT-304", name: "Sensors, Actuators & Interfacing" },
      ],
      4: [
        { code: "IOT-401", name: "Microcontrollers & Embedded C" },
        { code: "IOT-402", name: "Operating Systems & RTOS" },
        { code: "IOT-403", name: "Computer Networks & Protocols" },
        { code: "IOT-404", name: "Signals & Signal Conditioning Lab" },
      ],
      5: [
        { code: "IOT-501", name: "IoT Architecture & Wireless Protocols" },
        { code: "IOT-502", name: "Embedded Linux on Raspberry Pi" },
        { code: "IOT-503", name: "Cloud Platforms for IoT (AWS/Azure)" },
        { code: "IOT-504", name: "IoT Security & Cryptography" },
      ],
      6: [
        { code: "IOT-601", name: "Industrial IoT (IIoT) & Automation" },
        { code: "IOT-602", name: "Edge Computing & TinyML" },
        { code: "IOT-603", name: "Wireless Sensor Networks (WSN)" },
        { code: "IOT-604", name: "Smart Cities & Infrastructure IoT" },
      ],
      7: [
        { code: "IOT-701", name: "5G & Next-Gen Cellular IoT" },
        { code: "IOT-702", name: "IoT Data Stream Analytics" },
        { code: "IOT-703", name: "Wearable & Healthcare Telematics" },
        { code: "IOT-704", name: "Smart Grid & Energy Automation" },
      ],
      8: [
        { code: "IOT-801", name: "Autonomous Vehicle Telematics & V2X" },
        { code: "IOT-802", name: "Cyber-Physical Systems Engineering" },
        { code: "IOT-803", name: "Ubiquitous & Pervasive Computing" },
        { code: "IOT-804", name: "IoT Product Design & Certification" },
      ],
    },
    encs: {
      1: [
        { code: "ECS-101", name: "Engineering Mathematics - I" },
        { code: "ECS-102", name: "Programming in C & Data Handling" },
        { code: "ECS-103", name: "Applied Physics - I" },
        { code: "ECS-104", name: "Basic Electrical Engineering" },
      ],
      2: [
        { code: "ECS-201", name: "Engineering Mathematics - II" },
        { code: "ECS-202", name: "OOP with C++ & Design Patterns" },
        { code: "ECS-203", name: "Electronic Devices & Circuit Analysis" },
        { code: "ECS-204", name: "Digital Logic Design" },
      ],
      3: [
        { code: "ECS-301", name: "Data Structures & Algorithms" },
        { code: "ECS-302", name: "Analog Electronic Circuits" },
        { code: "ECS-303", name: "Digital System Design with Verilog" },
        { code: "ECS-304", name: "Signals & Linear Systems" },
      ],
      4: [
        { code: "ECS-401", name: "Microprocessors & ARM Microcontrollers" },
        { code: "ECS-402", name: "Computer Organization & Architecture" },
        { code: "ECS-403", name: "Database Management Systems" },
        { code: "ECS-404", name: "Python for Scientific & Hardware Control" },
      ],
      5: [
        { code: "ECS-501", name: "Operating Systems & RTOS" },
        { code: "ECS-502", name: "VLSI Design & CMOS Technology" },
        { code: "ECS-503", name: "Computer Communication Networks" },
        { code: "ECS-504", name: "Embedded System Design" },
      ],
      6: [
        { code: "ECS-601", name: "Internet of Things & Embedded Hardware" },
        { code: "ECS-602", name: "Digital Signal Processors & Architecture" },
        { code: "ECS-603", name: "Machine Learning for Hardware Accelerators" },
        { code: "ECS-604", name: "Hardware Security & Cryptographic Chips" },
      ],
      7: [
        { code: "ECS-701", name: "System on Chip (SoC) Design & Verification" },
        { code: "ECS-702", name: "Robotics & Embedded Control Systems" },
        { code: "ECS-703", name: "High-Speed Digital System Design" },
        { code: "ECS-704", name: "Cloud & Distributed Embedded Systems" },
      ],
      8: [
        { code: "ECS-801", name: "High-Performance Computer Architecture" },
        { code: "ECS-802", name: "Advanced Embedded Automotive Systems" },
        { code: "ECS-803", name: "Wireless Sensor & Optical Networks" },
        { code: "ECS-804", name: "Real-Time Embedded Firmware" },
      ],
    },
    entc: {
      1: [
        { code: "ETC-101", name: "Applied Mathematics - I" },
        { code: "ETC-102", name: "C Programming for Engineers" },
        { code: "ETC-103", name: "Engineering Physics - I" },
        { code: "ETC-104", name: "Basic Electrical & Network Analysis" },
      ],
      2: [
        { code: "ETC-201", name: "Applied Mathematics - II" },
        { code: "ETC-202", name: "Object Oriented Programming Lab" },
        { code: "ETC-203", name: "Electronic Devices & Components" },
        { code: "ETC-204", name: "Applied Chemistry & Semiconductor Physics" },
      ],
      3: [
        { code: "ETC-301", name: "Electronic Circuit Analysis & Design" },
        { code: "ETC-302", name: "Digital System Design & Logic Families" },
        { code: "ETC-303", name: "Network Theory & Synthesis" },
        { code: "ETC-304", name: "Electronic Instrumentation & Measurements" },
      ],
      4: [
        { code: "ETC-401", name: "Analog Communication Systems" },
        { code: "ETC-402", name: "Microcontrollers & Embedded Applications" },
        { code: "ETC-403", name: "Signals & Communication Systems" },
        { code: "ETC-404", name: "Linear Integrated Circuits (Op-Amps)" },
      ],
      5: [
        { code: "ETC-501", name: "Digital Communication Systems" },
        { code: "ETC-502", name: "Electromagnetic Waves & Transmission Lines" },
        { code: "ETC-503", name: "Digital Signal Processing (DSP)" },
        { code: "ETC-504", name: "Antenna & Microwave Engineering" },
      ],
      6: [
        { code: "ETC-601", name: "Cellular & Mobile Communication (4G/5G)" },
        { code: "ETC-602", name: "Optical Fiber Communication & Photonics" },
        { code: "ETC-603", name: "Computer Communication Networks" },
        { code: "ETC-604", name: "Satellite Communication & Radar" },
      ],
      7: [
        { code: "ETC-701", name: "Wireless Networks & Ad-Hoc Systems" },
        { code: "ETC-702", name: "Microwave Integrated Circuits & RF" },
        { code: "ETC-703", name: "Embedded IoT & Telematics" },
        { code: "ETC-704", name: "Audio & Video Signal Processing" },
      ],
      8: [
        { code: "ETC-801", name: "Telecom Network Management & QoS" },
        { code: "ETC-802", name: "Software Defined Radio (SDR) & Cognitive Radio" },
        { code: "ETC-803", name: "Broadband Optical Access Networks" },
        { code: "ETC-804", name: "Satellite & Deep Space Communications" },
      ],
    },
  };

  let key = "aids";
  if (normDept.includes("intelligence") && normDept.includes("data")) key = "aids";
  else if (normDept.includes("machine") || normDept.includes("aiml")) key = "aiml";
  else if (normDept.includes("iot") || normDept.includes("internet of things")) key = "cse-iot";
  else if (normDept.includes("electronics") && normDept.includes("computer")) key = "encs";
  else if (normDept.includes("telecommunication") || normDept.includes("entc") || normDept.includes("extc")) key = "entc";

  const list = subjectPresets[key]?.[semester] || [
    { code: `${key.toUpperCase().slice(0, 3)}-${semester}01`, name: "Core Laboratory Practicals - I" },
    { code: `${key.toUpperCase().slice(0, 3)}-${semester}02`, name: "Advanced Engineering Systems Lab" },
    { code: `${key.toUpperCase().slice(0, 3)}-${semester}03`, name: "Domain Specialization Lab" },
    { code: `${key.toUpperCase().slice(0, 3)}-${semester}04`, name: "Applied Project Laboratory" },
  ];

  return list.map((s) => ({
    code: s.code,
    name: s.name,
    semester,
  }));
}

// Generate 4-5 experiments for any subject
export function getPracticalsForSubject(subjectName: string, semester: number, deptName: string): Detail[] {
  const normDept = deptName.toLowerCase();
  
  // Check if explicit practicals exist in CURRICULUM_CATALOG
  if (normDept.includes("information technology") || normDept === "it") {
    const semList = CURRICULUM_CATALOG["information-technology"]?.[semester];
    if (semList) {
      const foundSub = semList.find((s) => s.name.toLowerCase() === subjectName.toLowerCase() || s.code.toLowerCase() === subjectName.toLowerCase());
      if (foundSub) {
        return foundSub.experiments.map((exp, idx) => ({
          id: 50000 + semester * 1000 + idx * 10 + Math.abs(hashString(subjectName)) % 500,
          title: exp.title,
          subject: foundSub.name,
          semester,
          experimentNumber: idx + 1,
          description: `Laboratory Experiment ${idx + 1} for ${foundSub.name}.`,
          status: "PUBLISHED",
          updatedAt: new Date().toISOString(),
          aim: exp.aim,
          theory: exp.theory,
          algorithm: exp.algorithm,
          codeInstructions: exp.instructions,
          conclusion: "Experiment verified and outputs matched expected results.",
          javaStarterCode: exp.lang === "JAVA" ? `// ${exp.title}\npublic class Solution {\n    public static void main(String[] args) {\n        // Write solution here\n        System.out.println("Result: Verified");\n    }\n}` : "",
          pythonStarterCode: exp.lang === "PYTHON" ? `# ${exp.title}\ndef main():\n    # Write solution here\n    print("Result: Verified")\n\nif __name__ == '__main__':\n    main()` : "",
          programmingLanguage: exp.lang,
          practiceQuestions: exp.practice.map((q, qIdx) => ({ id: qIdx + 1, question: q, order: qIdx + 1 })),
          vivaQuestions: exp.viva.map((v, vIdx) => ({ id: vIdx + 1, question: v.q, marks: v.marks, order: vIdx + 1 })),
        }));
      }
    }
  }

  // General authentic generator for all departments
  const expTopics = [
    {
      title: `${subjectName}: Fundamental Implementation & Setup`,
      aim: `Understand the foundational principles, setup environment, and implement core primitives of ${subjectName}.`,
      theory: `${subjectName} forms a core component of modern engineering. Mastering fundamental implementations establishes algorithmic competency and analytical reasoning.`,
      algorithm: "1. Initialize execution parameters.\n2. Configure input data vectors.\n3. Execute primary transformation logic.\n4. Validate output against theoretical benchmarks.",
      instructions: "Implement the foundational algorithm in Python or Java with comprehensive test cases.",
      lang: "PYTHON",
      practice: [
        `Explain the core mathematical model governing ${subjectName}.`,
        "Analyze the time and space complexity of the implementation.",
      ],
      viva: [
        { q: `What are the primary performance trade-offs in ${subjectName}?`, marks: 2 },
        { q: "How are boundary conditions handled in this setup?", marks: 2 },
      ],
    },
    {
      title: `${subjectName}: Algorithmic Optimization & Processing`,
      aim: `Optimize data throughput, reduce algorithmic latency, and handle edge cases for ${subjectName}.`,
      theory: "Optimization in engineering balances computational complexity, memory footprints, and convergence velocity under real-world constraints.",
      algorithm: "1. Profile baseline execution metrics.\n2. Apply algorithmic refactoring and caching.\n3. Execute stress testing with edge inputs.\n4. Measure execution time improvements.",
      instructions: "Write optimized production-grade code adhering to Clean Code standards.",
      lang: "JAVA",
      practice: [
        "What asymptotic improvements were achieved by the optimized algorithm?",
        "Explain memory hierarchy effects on performance.",
      ],
      viva: [
        { q: "What is Amdahl's Law in algorithmic acceleration?", marks: 2 },
        { q: "How do you detect and mitigate race conditions in concurrent processing?", marks: 2 },
      ],
    },
    {
      title: `${subjectName}: Data Modeling & Simulation Analysis`,
      aim: `Construct simulation models, perform empirical testing, and evaluate experimental accuracy for ${subjectName}.`,
      theory: "Simulations model physical and computational behaviors, enabling quantitative evaluation of complex systems prior to physical deployment.",
      algorithm: "1. Define state variables and transition equations.\n2. Run iterative Monte Carlo or step-wise simulation.\n3. Log observational telemetry.\n4. Plot performance curves.",
      instructions: "Implement simulation model and output structured statistical summaries.",
      lang: "PYTHON",
      practice: [
        "Explain the sensitivity of the model to parameter variations.",
        "How is empirical variance minimized across runs?",
      ],
      viva: [
        { q: "What is validation vs verification in simulation modeling?", marks: 2 },
        { q: "How are confidence intervals computed for experimental measurements?", marks: 2 },
      ],
    },
    {
      title: `${subjectName}: Comprehensive Practical Application & Case Study`,
      aim: `Apply learned principles to solve an authentic end-to-end industrial case study in ${subjectName}.`,
      theory: "Translating theoretical models into working production systems requires robust exception handling, modularity, and reproducible verification.",
      algorithm: "1. Ingest input dataset from standard format.\n2. Apply preprocessing and normalization.\n3. Execute end-to-end processing pipeline.\n4. Emit verified report and diagnostic metrics.",
      instructions: "Complete the end-to-end solution and demonstrate correct execution on all test cases.",
      lang: "JAVA",
      practice: [
        "What architectural choices made the solution scalable?",
        "How is data integrity maintained throughout the pipeline?",
      ],
      viva: [
        { q: "Explain the failure recovery strategy in your implementation.", marks: 2 },
        { q: "What industry standards apply to this category of systems?", marks: 2 },
      ],
    },
  ];

  const subHash = Math.abs(hashString(subjectName + deptName));

  return expTopics.map((exp, idx) => ({
    id: 60000 + semester * 1000 + (subHash % 800) * 10 + idx + 1,
    title: exp.title,
    subject: subjectName,
    semester,
    experimentNumber: idx + 1,
    description: `Laboratory Experiment ${idx + 1} for ${subjectName} (${deptName}).`,
    status: "PUBLISHED",
    updatedAt: new Date().toISOString(),
    aim: exp.aim,
    theory: exp.theory,
    algorithm: exp.algorithm,
    codeInstructions: exp.instructions,
    conclusion: "Experiment executed and validated against laboratory standards.",
    javaStarterCode: `// TCET CodeLabX - ${exp.title}\npublic class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n        System.out.println("Completed successfully.");\n    }\n}`,
    pythonStarterCode: `# TCET CodeLabX - ${exp.title}\ndef main():\n    # Write your solution here\n    print("Completed successfully.")\n\nif __name__ == '__main__':\n    main()`,
    programmingLanguage: exp.lang,
    practiceQuestions: exp.practice.map((q, qIdx) => ({ id: qIdx + 1, question: q, order: qIdx + 1 })),
    vivaQuestions: exp.viva.map((v, vIdx) => ({ id: vIdx + 1, question: v.q, marks: v.marks, order: vIdx + 1 })),
  }));
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

const practicalsCache = new Map<number, Detail>();

export function cachePractical(p: Detail) {
  practicalsCache.set(p.id, p);
}

export function findDepartmentPracticalById(id: number): Detail | null {
  if (practicalsCache.has(id)) {
    return practicalsCache.get(id)!;
  }
  for (const dept of DEPARTMENTS) {
    for (let sem = 1; sem <= 8; sem++) {
      const subjects = getCurriculumSubjects(dept.name, sem);
      for (const sub of subjects) {
        const practicals = getPracticalsForSubject(sub.name, sem, dept.name);
        for (const p of practicals) {
          practicalsCache.set(p.id, p);
          if (p.id === id) return p;
        }
      }
    }
  }
  return null;
}
