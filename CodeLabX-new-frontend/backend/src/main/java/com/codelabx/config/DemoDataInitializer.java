package com.codelabx.config;

import com.codelabx.practical.*;
import com.codelabx.user.Role;
import com.codelabx.user.UserAccount;
import com.codelabx.user.UserRepository;
import com.codelabx.subject.AcademicSubject;
import com.codelabx.subject.AcademicSubjectRepository;
import com.codelabx.viva.VivaQuestion;
import com.codelabx.viva.VivaQuestionRepository;
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
                                   PasswordEncoder passwordEncoder) {
        return args -> {
            subject(subjects, "IIS", "Introduction to Intelligent Systems", 5);
            user(users, passwordEncoder, "CodeLabX Administrator", "admin@tcetmumbai.in", Role.ADMIN);
            user(users, passwordEncoder, "TCET Exam Cell Admin", "admin.exam@tcetmumbai.in", Role.ADMIN);
            UserAccount teacher = user(users, passwordEncoder, "Samir Sawant", "teacher@tcetmumbai.in", Role.TEACHER);
            user(users, passwordEncoder, "Rashmi Thakur", "faculty.it@tcetmumbai.in", Role.TEACHER);
            user(users, passwordEncoder, "Rajesh Patel", "faculty.aiml@tcetmumbai.in", Role.TEACHER);
            UserAccount student = user(users, passwordEncoder, "Areeza Mukadam", "student@tcetmumbai.in", Role.STUDENT);
            UserAccount student2 = user(users, passwordEncoder, "Sagar Mishra", "student2@tcetmumbai.in", Role.STUDENT);
            UserAccount studentRahul = user(users, passwordEncoder, "Rahul Verma", "rahul.verma.se.b@tcetmumbai.in", Role.STUDENT);
            UserAccount studentTanvi = user(users, passwordEncoder, "Tanvi Patil", "tanvi.patil.se.b@tcetmumbai.in", Role.STUDENT);
            UserAccount studentAarav = user(users, passwordEncoder, "Aarav Mehta", "aarav.mehta.se.a@tcetmumbai.in", Role.STUDENT);
            UserAccount studentSneha = user(users, passwordEncoder, "Sneha Deshmukh", "sneha.deshmukh.te.a@tcetmumbai.in", Role.STUDENT);
            List<UserAccount> allStudents = List.of(student, student2, studentRahul, studentTanvi, studentAarav, studentSneha);

            if (practicals.count() > 0) {
                var demoTitles = List.of("Array Operations", "Searching Algorithms", "Sorting Algorithms");
                for (Practical practical : practicals.findAll()) {
                    if (!demoTitles.contains(practical.getTitle())) continue;
                    practical.setSubject("Data Structures & Algorithms");
                    practical.setSemester(1);
                    practicals.save(practical);
                    for (UserAccount enrolled : allStudents) {
                        if (assignments.existsByPracticalIdAndStudentId(practical.getId(), enrolled.getId())) continue;
                        PracticalAssignment assignment = new PracticalAssignment();
                        assignment.setPractical(practical);
                        assignment.setStudent(enrolled);
                        assignments.save(assignment);
                    }
                }
                seedSemesterThree(teacher, allStudents, practicals, assignments);
                seedSemesterFiveIis(teacher, allStudents, practicals, assignments, practiceQuestions, vivaQuestions);
                return;
            }

            List<PracticalSeed> seeds = List.of(
                    new PracticalSeed("Array Operations", "Traverse and update a one-dimensional array.", "Implement common operations on a fixed-size integer array.", "An array stores elements of the same type in contiguous indexed positions. Access by index is constant time, while insertion or deletion in the middle requires shifting elements.", "1. Read n and n integer values.\n2. Read the target value.\n3. Traverse the array from index 0 to n - 1.\n4. Print each matching index, or report that the value is absent.", "Write a program that reads an integer array and a target value, then prints all matching positions. Use zero-based indices.", "Explain how the number of inspected elements changes as the array grows. Mention one edge case you tested.", List.of("What is the time complexity of accessing an array element by index?", "What should your program do when the array is empty?"), List.of("Why is array access by index constant time?", "What is the cost of inserting at the beginning of an array?")),
                    new PracticalSeed("Searching Algorithms", "Compare linear search with binary search.", "Implement a search and reason about when sorted input is required.", "Linear search checks items one by one and works on unsorted data. Binary search repeatedly halves a sorted search interval, giving logarithmic comparisons.", "1. Set low = 0 and high = n - 1.\n2. While low <= high, compute mid.\n3. Compare the middle value with the target.\n4. Narrow the interval to the half that may contain the target.\n5. Return the index or -1.", "Implement iterative binary search for a sorted integer array. Print the matching index, or -1 if the target is absent.", "State why the input must be sorted for binary search and compare its worst-case complexity with linear search.", List.of("What condition makes binary search valid?", "How many elements remain after each binary-search iteration?"), List.of("What is binary search's worst-case time complexity?", "How would you avoid overflow when calculating mid?")),
                    new PracticalSeed("Sorting Algorithms", "Sort a list using insertion sort.", "Build a sorted sequence by inserting each next value into place.", "Insertion sort grows a sorted prefix. For each new value, larger items in the prefix shift right until the correct position is found. It is simple and effective for small or nearly sorted inputs.", "1. Start from the second element.\n2. Store the current value as key.\n3. Shift larger values one position to the right.\n4. Insert key into the gap.\n5. Repeat to the end of the array.", "Read n integers, sort them in ascending order using insertion sort, and print the resulting sequence.", "Describe what happens on already sorted input and give the algorithm's best- and worst-case time complexity.", List.of("Why do we begin at index 1?", "What is the best-case complexity for already sorted input?"), List.of("Is insertion sort stable? Explain briefly.", "When might insertion sort be preferable to a more complex sort?"))
            );
            for (PracticalSeed seed : seeds) {
                Practical practical = new Practical();
                practical.setCreatedBy(teacher);
                practical.setSubject("Data Structures & Algorithms");
                practical.setSemester(1);
                practical.setTitle(seed.title()); practical.setDescription(seed.description());
                practical.setAim(seed.aim()); practical.setTheory(seed.theory()); practical.setAlgorithm(seed.algorithm());
                practical.setCodeInstructions(seed.instructions()); practical.setConclusion(seed.conclusion());
                practical.setJavaStarterCode("import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner input = new Scanner(System.in);\n        // Write your solution\n    }\n}");
                practical.setPythonStarterCode("def main():\n    # Write your solution\n    pass\n\nif __name__ == '__main__':\n    main()\n");
                practical.setStatus(PracticalStatus.PUBLISHED);
                practical = practicals.save(practical);
                for (int i = 0; i < seed.practice().size(); i++) {
                    PracticeQuestion q = new PracticeQuestion(); q.setPractical(practical); q.setQuestion(seed.practice().get(i)); q.setExpectedAnswer("Discuss the concept accurately with reasoning."); q.setSortOrder(i + 1); practiceQuestions.save(q);
                }
                for (int i = 0; i < seed.viva().size(); i++) {
                    VivaQuestion q = new VivaQuestion(); q.setPractical(practical); q.setQuestion(seed.viva().get(i)); q.setMarks(2); q.setSortOrder(i + 1); vivaQuestions.save(q);
                }
                for (UserAccount enrolled : allStudents) {
                    PracticalAssignment assignment = new PracticalAssignment(); assignment.setPractical(practical); assignment.setStudent(enrolled); assignments.save(assignment);
                }
            }
            seedSemesterThree(teacher, allStudents, practicals, assignments);
            seedSemesterFiveIis(teacher, allStudents, practicals, assignments, practiceQuestions, vivaQuestions);
        };
    }

    private void subject(AcademicSubjectRepository subjects, String code, String name, int semester) {
        AcademicSubject subject = subjects.findByCodeIgnoreCaseAndSemester(code, semester)
                .orElseGet(AcademicSubject::new);
        subject.setCode(code);
        subject.setName(name);
        subject.setSemester(semester);
        subjects.save(subject);
    }

    private void seedSemesterThree(UserAccount teacher, List<UserAccount> students,
                                   PracticalRepository practicals, PracticalAssignmentRepository assignments) {
        List<SemesterThreeSeed> seeds = List.of(
                new SemesterThreeSeed("Experiment 1A: Java data types and operators", "Build a Java program demonstrating data types and operators.", "Practice declaring Java data types and applying operators.", "Explore primitive and reference types, variable declarations, arithmetic, relational, logical, assignment, and unary operators.", "Create variables of suitable types; read or define sample values; apply operators; print each result; observe type conversion and operator precedence.", "Write a Java program that demonstrates representative data types and operators with clearly labeled output.", "Summarize how data types and operators affect the values and results in a Java program."),
                new SemesterThreeSeed("Experiment 1B: Java control statements", "Build a Java program demonstrating control statements.", "Use selection and iteration to control program flow.", "Conditional statements select a branch based on a condition. Loops repeat a block while a condition holds or for a fixed range.", "Demonstrate if/else and switch; demonstrate for, while, or do-while; choose suitable conditions; print results.", "Write a menu or decision-based Java program that demonstrates conditional statements and at least one loop.", "Explain which control statement fits each decision or repetition in your program."),
                new SemesterThreeSeed("Experiment 2: Stack using an array", "Build a menu-driven stack using an array.", "Implement push, pop, peek, and display operations.", "A stack follows last-in, first-out order. A top index tracks the most recently inserted element; bounded arrays require overflow and underflow checks.", "Initialize top to -1; push after checking capacity; pop after checking emptiness; peek at top; display from top downward.", "Implement a menu-driven integer stack using an array, including overflow and underflow handling.", "Describe LIFO behavior and the conditions that cause stack overflow or underflow."),
                new SemesterThreeSeed("Experiment 3: Queue using an array", "Build a menu-driven queue using an array.", "Implement enqueue, dequeue, front, and display operations.", "A queue follows first-in, first-out order. A simple array queue tracks front and rear and must detect full and empty states.", "Initialize front and rear; enqueue at rear; dequeue from front; validate empty/full conditions; display the active items.", "Implement a menu-driven array queue with enqueue, dequeue, peek, and display operations.", "Explain FIFO order and one limitation of a simple linear array queue."),
                new SemesterThreeSeed("Experiment 4: Circular queue", "Develop a menu-driven circular queue.", "Reuse array positions by wrapping front and rear indices.", "A circular queue treats the last array position as adjacent to the first. Modulo arithmetic advances indices and avoids wasted slots after deletions.", "Use (index + 1) % capacity to advance; detect empty and full states; implement enqueue, dequeue, peek, and display.", "Implement a menu-driven circular queue using an array and handle wraparound correctly.", "Explain how modulo arithmetic allows a circular queue to reuse freed positions."),
                new SemesterThreeSeed("Experiment 5: Singly linked list", "Develop a menu-driven singly linked list.", "Create and update a chain of nodes with next references.", "Each singly linked-list node stores data and a reference to the next node. The head identifies the first node; the final node points to null.", "Create a node class; implement insertion, deletion, search, and traversal; update head and links carefully for empty and boundary cases.", "Implement a menu-driven singly linked list with insertion, deletion, search, and display operations.", "Compare insertion at the head of a linked list with insertion at the beginning of an array."),
                new SemesterThreeSeed("Experiment 6: Doubly linked list", "Develop a menu-driven doubly linked list.", "Maintain previous and next links while editing a list.", "A doubly linked-list node references both its predecessor and successor, allowing traversal in either direction at the cost of extra links.", "Create nodes with prev and next; implement insertion, deletion, forward traversal, and reverse traversal; update both neighboring links.", "Implement a menu-driven doubly linked list and demonstrate forward and reverse traversal.", "Why must both neighboring links be updated when inserting or deleting a node?"),
                new SemesterThreeSeed("Experiment 7: Binary search tree", "Develop a menu-driven binary search tree.", "Insert, search, traverse, and delete nodes while preserving the BST order.", "In a binary search tree, keys in the left subtree are smaller and keys in the right subtree are larger than the node key. Inorder traversal visits keys in sorted order.", "Implement node insertion and search; add inorder, preorder, and postorder traversals; implement deletion cases for leaf, one child, and two children.", "Implement a menu-driven binary search tree with insertion, search, traversals, and deletion.", "What property makes inorder traversal of a BST produce sorted keys?"),
                new SemesterThreeSeed("Experiment 8: AVL tree", "Develop a menu-driven AVL tree.", "Keep a binary search tree balanced using rotations.", "An AVL tree is a self-balancing BST. The balance factor is the height difference between a node's left and right subtrees; rotations restore the permitted balance after updates.", "Insert a key; update heights; compute balance factors; identify LL, RR, LR, or RL imbalance; apply the appropriate rotation; traverse the tree.", "Implement a menu-driven AVL tree with insertion, search, and traversal, applying rotations when needed.", "Name the four AVL imbalance cases and the rotation used to correct each."),
                new SemesterThreeSeed("Experiment 9: Breadth-first search", "Develop a menu-driven BFS program.", "Traverse a graph level by level using a queue.", "Breadth-first search visits a starting vertex and then its unvisited neighbors in increasing distance order. A queue manages the frontier.", "Represent the graph; mark the start visited; enqueue it; repeatedly dequeue a vertex and enqueue its unvisited neighbors.", "Implement BFS for a graph represented by an adjacency list or matrix and print the traversal order.", "What data structure does BFS use, and how does BFS differ from DFS?"),
                new SemesterThreeSeed("Experiment 10: Depth-first search", "Develop a menu-driven DFS program.", "Traverse a graph by exploring a path before backtracking.", "Depth-first search explores an unvisited neighbor recursively or with an explicit stack, backtracking when a vertex has no unvisited neighbors.", "Represent the graph; mark the start visited; visit each unvisited neighbor recursively or via a stack; handle disconnected vertices if required.", "Implement DFS for a graph represented by an adjacency list or matrix and print the traversal order.", "Compare recursive DFS with iterative DFS and identify the structure used by each."),
                new SemesterThreeSeed("Experiment 11: Circular doubly linked list", "Develop a circularly linked doubly linked list.", "Connect the first and last nodes in both traversal directions.", "In a circular doubly linked list, each node has previous and next links; the tail's next points to the head and the head's previous points to the tail.", "Implement insertion, deletion, and traversal; maintain circular links for empty, single-node, head, tail, and middle cases.", "Implement a circular doubly linked list and demonstrate insertion, deletion, and traversal in both directions.", "State the link invariants that must hold for the head and tail of a circular doubly linked list."),
                new SemesterThreeSeed("Experiment 12: Data structures mini project", "Choose and build one mini project applying data structures.", "Apply data structures to a small practical problem and explain the design.", "Suggested topics include browser navigation simulator, ticket booking queue, music playlist manager, expression calculator, tree-based file explorer, social network graph analyzer, heap-based task scheduler, hash-based fast dictionary, and large-data sorting visualizer.", "Choose a problem; identify operations and data structures; design the representation; implement core operations; test normal and boundary cases; present the design.", "Build one listed data-structures mini project and document the problem, chosen structures, operations, and test cases.", "Justify your data-structure choices and describe one limitation or possible extension."));

        for (SemesterThreeSeed seed : seeds) {
            Practical practical = practicals.findByTitleIgnoreCase(seed.title()).orElseGet(Practical::new);
            boolean isNew = practical.getId() == null;
            if (isNew) {
                practical.setCreatedBy(teacher);
                practical.setStatus(PracticalStatus.PUBLISHED);
                practical.setJavaStarterCode("import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Implement the experiment here\n    }\n}");
                practical.setPythonStarterCode("def main():\n    # Implement the experiment here\n    pass\n\nif __name__ == '__main__':\n    main()\n");
            }
            practical.setSubject("Data Structures");
            practical.setSemester(3);
            practical.setTitle(seed.title());
            practical.setDescription(seed.description());
            practical.setAim(seed.aim());
            practical.setTheory(seed.theory());
            practical.setAlgorithm(seed.algorithm());
            practical.setCodeInstructions(seed.instructions());
            practical.setConclusion(seed.conclusion());
            practical = practicals.save(practical);
            for (UserAccount enrolled : students) {
                if (assignments.existsByPracticalIdAndStudentId(practical.getId(), enrolled.getId())) continue;
                PracticalAssignment assignment = new PracticalAssignment();
                assignment.setPractical(practical);
                assignment.setStudent(enrolled);
                assignments.save(assignment);
            }
        }
    }

    private void seedSemesterFiveIis(UserAccount teacher, List<UserAccount> students,
                                     PracticalRepository practicals, PracticalAssignmentRepository assignments,
                                     PracticeQuestionRepository practiceQuestions,
                                     VivaQuestionRepository vivaQuestions) {
        List<IisPracticalSeed> seeds = List.of(
                new IisPracticalSeed(
                        "Experiment 01A: Built-in API and Gemini API web app",
                        "Integrate an API into a web page. The handout's implementation steps build a Gemini-powered Python Flask chat application.",
                        "Integrate a built-in/API service into a web page and display its response.",
                        "The handout combines two strands: its objective and viva cover browser built-in APIs, while its implementation guide builds a Python Flask application connected to the Gemini API. The API key must be stored in an environment file and must not be committed or exposed to the browser.",
                        "1. Create a Google AI Studio account and generate a Gemini API key.\n2. Install Flask, the Google Generative AI SDK, and python-dotenv.\n3. Store GEMINI_API_KEY in a .env file.\n4. Create a Flask server and configure routes.\n5. Configure the Gemini SDK and create a model instance.\n6. Add a /chat route that accepts a prompt, calls Gemini, and returns JSON.\n7. Create an HTML page with a prompt field and Send button.\n8. Use JavaScript Fetch to call the Flask route and display the response.\n9. Run the Flask application at http://127.0.0.1:5000.\n10. Test the chat flow in a browser.",
                        "Build and demonstrate the Flask-to-Gemini request and response flow. Keep the API key server-side in .env. Confirm with faculty whether the assessed focus is browser built-in APIs or Gemini API integration, because the handout covers both.",
                        "Explain how a browser page sends a prompt to a Flask route and displays the returned JSON response.",
                        List.of("Trace the request and response path from the Send button to Gemini and back to the page.", "Why must the Gemini API key stay on the server instead of being placed in browser JavaScript?"),
                        List.of("What are built-in browser APIs, and how do they enhance web applications?", "How does the Geolocation API request and display a user's current location?", "Compare localStorage, sessionStorage, and cookies by scope, storage limit, and use case.", "How do browser notifications request permission and display a notification?", "What security and privacy concerns arise when using Geolocation, Camera, or Microphone APIs?")
                ),
                new IisPracticalSeed(
                        "Experiment 02: AI problem formulation and solving",
                        "Formulate an AI problem as a state-space search problem and present a solution path.",
                        "Apply the AI problem-formulation approach to describe and solve a problem.",
                        "A search problem is described by an initial state, actions or successor function, a goal test, and a path-cost function. A solution is a sequence of actions leading from the initial state to a goal state.",
                        "1. Choose the problem assigned by faculty.\n2. State the initial state.\n3. List actions or define the successor function as action-state pairs.\n4. Define an explicit or implicit goal test.\n5. Define the additive path cost and step costs.\n6. Draw the state-space search graph.\n7. Give a sequence of actions from the initial state to a goal and calculate its cost.",
                        "Submit the selected problem, all four formulation elements, the state-space graph, the solution sequence, and the path cost. Use Python to represent or explore the states if required by faculty.",
                        "Relate the final solution path and cost to the initial state, actions, goal test, and path-cost function.",
                        List.of("Choose a problem and identify its initial state, actions, goal test, and path-cost function.", "Draw the state-space graph and show one valid solution path."),
                        List.of("Define a problem-solving agent with an example.", "Give three problems that can be solved using the problem-formulation approach.", "What items must be specified during problem formulation?")
                ),
                new IisPracticalSeed(
                        "Experiment 03: Uninformed search using DFID",
                        "Implement Depth-First Iterative Deepening (DFID), an uninformed search technique.",
                        "Solve a search problem using depth-first iterative deepening and describe its properties.",
                        "DFID repeats depth-limited DFS with limits 0, 1, 2, and so on. It uses DFS-like memory while, for an unweighted graph, finding a shallowest goal like BFS. It is complete and optimal for uniform step costs.",
                        "1. Set the depth limit to zero.\n2. Run depth-limited DFS from the initial state.\n3. Track visited/path states to avoid cycles on the current path.\n4. If the goal is found, return the path.\n5. Otherwise increase the limit and repeat until the goal is found or a defined maximum is reached.\n6. Record the result and analyze completeness, optimality, time, and space for the chosen search space.",
                        "Implement DFID in Python for the graph/problem assigned by faculty. Show the path or failure result at each depth bound and discuss its advantages, disadvantages, applications, completeness, time, space, and optimality.",
                        "Describe when iterative deepening is useful and compare its repeated work and memory use with DFS and BFS.",
                        List.of("Run DFID on a sample graph and report the goal path and depth bound where it is found.", "For the selected search space, state the algorithm's completeness, optimality, time, and space properties."),
                        List.of("Describe a search space where iterative deepening performs much worse than DFS.", "Which algorithm overcomes drawbacks of both DFS and BFS?", "Compare uninformed search strategies for solving the 8-puzzle problem.")
                ),
                new IisPracticalSeed(
                        "Experiment 04: Informed search",
                        "Implement Best-First Search or A* using a heuristic for the selected search problem.",
                        "Solve a search problem using an informed search technique.",
                        "Informed search uses problem-specific heuristic information to guide exploration. The handout allows Best-First Search or A* and asks students to describe algorithm, properties, advantages, disadvantages, and applications. Note: its learning outcomes and viva questions appear copied from the uninformed-search handout; confirm the intended questions with faculty.",
                        "For Best-First Search, order the frontier by heuristic value h(n). For A*, order by f(n) = g(n) + h(n), where g is path cost so far and h estimates remaining cost. Track parent states, update frontier entries when a better path is found, and stop according to the chosen algorithm's goal rule.",
                        "Choose Best-First Search or A* as directed by faculty. Implement it in Python for the selected graph/problem, state the heuristic, show the expansion order and solution path, and discuss completeness, time, space, optimality, advantages, disadvantages, and applications.",
                        "Explain how the selected heuristic affects the nodes explored and, for A*, how admissibility relates to optimality.",
                        List.of("Run the selected informed-search algorithm on a problem with a stated heuristic and show its expansion order.", "Compare the path found by your chosen method with the path cost and explain the role of the heuristic."),
                        List.of("Describe a search space where iterative deepening performs much worse than DFS.", "Which algorithm overcomes drawbacks of both DFS and BFS?", "Compare uninformed search strategies for solving the 8-puzzle problem.")
                ),
                new IisPracticalSeed(
                        "Experiment 07: Genetic algorithm optimization",
                        "Apply a genetic algorithm to an optimization problem.",
                        "Define and use a genetic algorithm to find a high-fitness solution to an optimization problem.",
                        "A genetic algorithm evolves a population of candidate solutions over generations. It requires a representation of candidate solutions and a fitness function. Selection, crossover, and mutation create new candidates; the process ends at a satisfactory fitness or a generation limit.",
                        "1. Define the optimization objective and constraints.\n2. Choose a chromosome representation and population size.\n3. Generate an initial population.\n4. Evaluate each candidate with a fitness function.\n5. Select fitter candidates.\n6. Apply crossover and mutation to form the next generation.\n7. Repeat evaluation and evolution until the termination condition is met.\n8. Report the best candidate and its fitness.",
                        "Implement a genetic algorithm in Python for the optimization problem selected or assigned by faculty. Document the chromosome representation, fitness function, selection, crossover, mutation, termination condition, and best result.",
                        "Summarize the best candidate found, its fitness, and how the genetic operators affected the population.",
                        List.of("Specify a candidate representation and fitness function for your chosen optimization problem.", "Record the best fitness by generation and identify the termination condition."),
                        List.of("Name optimization algorithms other than genetic algorithms.", "What kinds of problems can be solved using optimization algorithms?", "What are the genetic operators?")
                )
        );

        for (IisPracticalSeed seed : seeds) {
            Practical practical = practicals.findByTitleIgnoreCase(seed.title()).orElseGet(Practical::new);
            boolean isNew = practical.getId() == null;
            if (isNew) {
                practical.setCreatedBy(teacher);
                practical.setStatus(PracticalStatus.PUBLISHED);
                practical.setPythonStarterCode("def main():\n    # Implement the assigned IIS practical here\n    pass\n\nif __name__ == '__main__':\n    main()\n");
                practical.setJavaStarterCode("public class Main {\n    public static void main(String[] args) {\n        // Implement the assigned IIS practical here\n    }\n}");
            }
            practical.setSubject("Introduction to Intelligent Systems");
            practical.setSemester(5);
            practical.setTitle(seed.title());
            practical.setDescription(seed.description());
            practical.setAim(seed.aim());
            practical.setTheory(seed.theory());
            practical.setAlgorithm(seed.algorithm());
            practical.setCodeInstructions(seed.instructions());
            practical.setConclusion(seed.conclusion());
            practical = practicals.save(practical);

            if (isNew) {
                for (int i = 0; i < seed.practice().size(); i++) {
                    PracticeQuestion question = new PracticeQuestion();
                    question.setPractical(practical);
                    question.setQuestion(seed.practice().get(i));
                    question.setExpectedAnswer("Answer using the method and evidence from the experiment.");
                    question.setSortOrder(i + 1);
                    practiceQuestions.save(question);
                }
                for (int i = 0; i < seed.viva().size(); i++) {
                    VivaQuestion question = new VivaQuestion();
                    question.setPractical(practical);
                    question.setQuestion(seed.viva().get(i));
                    question.setMarks(2);
                    question.setSortOrder(i + 1);
                    vivaQuestions.save(question);
                }
            }

            for (UserAccount enrolled : students) {
                if (assignments.existsByPracticalIdAndStudentId(practical.getId(), enrolled.getId())) continue;
                PracticalAssignment assignment = new PracticalAssignment();
                assignment.setPractical(practical);
                assignment.setStudent(enrolled);
                assignments.save(assignment);
            }
        }
    }

    private UserAccount user(UserRepository users, PasswordEncoder encoder, String name, String email, Role role) {
        return users.findByEmailIgnoreCase(email).orElseGet(() -> {
            UserAccount u = new UserAccount(); u.setName(name); u.setEmail(email); u.setRole(role);
            u.setPassword(encoder.encode("CodeLabX123!")); return users.save(u);
        });
    }

    private record PracticalSeed(String title, String description, String aim, String theory, String algorithm,
                                 String instructions, String conclusion, List<String> practice, List<String> viva) { }

    private record SemesterThreeSeed(String title, String description, String aim, String theory,
                                     String algorithm, String instructions, String conclusion) { }

    private record IisPracticalSeed(String title, String description, String aim, String theory,
                                    String algorithm, String instructions, String conclusion,
                                    List<String> practice, List<String> viva) { }
}
