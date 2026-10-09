package com.codelabx.config;

import com.codelabx.practical.*;
import com.codelabx.user.Role;
import com.codelabx.user.UserAccount;
import com.codelabx.user.UserRepository;
import com.codelabx.subject.AcademicSubject;
import com.codelabx.subject.AcademicSubjectRepository;
import com.codelabx.viva.VivaQuestion;
import com.codelabx.viva.VivaQuestionRepository;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.codelabx.execution.CodeLanguage;
import com.codelabx.execution.ProgrammingLanguage;
import com.codelabx.execution.ProgrammingLanguageRepository;
import com.codelabx.progress.PracticalStep;
import com.codelabx.progress.ProgressStatus;
import com.codelabx.progress.StudentProgress;
import com.codelabx.progress.StudentProgressRepository;
import com.codelabx.submission.Submission;
import com.codelabx.submission.SubmissionRepository;
import java.util.ArrayList;
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
                                   SubmissionRepository submissions,
                                   StudentProgressRepository progressRepository,
                                   PasswordEncoder passwordEncoder,
                                   ObjectMapper objectMapper) {
        return args -> {
            seedLanguages(languages);
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
            // Single canonical student account for Inzamam Khan (Roll 13, TE-B, Computer Engineering)
            UserAccount studentInzamam = user(users, passwordEncoder, "Inzamam Khan", "inzamam.khan.te.b@tcetmumbai.in", Role.STUDENT);

            // Clean up any old duplicate account if present
            users.findByEmailIgnoreCase("inzamam@tcetmumbai.in").ifPresent(oldUser -> {
                if (!oldUser.getId().equals(studentInzamam.getId())) {
                    users.delete(oldUser);
                }
            });

            List<UserAccount> allStudents = new ArrayList<>(List.of(
                    student, student2, studentRahul, studentTanvi, studentAarav, studentSneha,
                    studentInzamam
            ));

            roster(student, "SE", "B", "Computer Engineering", "SE-B-42");
            roster(student2, "TE", "A", "Computer Engineering", "TE-A-18");
            roster(studentRahul, "SE", "B", "Computer Engineering", "SE-B-23");
            roster(studentTanvi, "SE", "B", "Computer Engineering", "SE-B-55");
            roster(studentAarav, "SE", "A", "Computer Engineering", "SE-A-12");
            roster(studentSneha, "TE", "A", "Computer Engineering", "TE-A-34");
            roster(studentInzamam, "TE", "B", "Computer Engineering", "13");
            users.saveAll(allStudents);

            teacher.setDepartment("Computer Engineering");
            teacherIt.setDepartment("Information Technology");
            teacherAiml.setDepartment("Artificial Intelligence & Machine Learning");
            users.saveAll(List.of(teacher, teacherIt, teacherAiml));

            seedFromJson(objectMapper, teacher, allStudents, practicals, assignments, practiceQuestions, vivaQuestions);
            seedSampleSubmission(studentInzamam, practicals, submissions, progressRepository);
            seedStudentAreezaSubmission(student, practicals, submissions, progressRepository);
        };
    }

    private void seedLanguages(ProgrammingLanguageRepository languages) {
        seedLang(languages, "JAVA", "Java", "17.x", true);
        seedLang(languages, "PYTHON", "Python", "3.11", true);
        seedLang(languages, "C", "C", "gcc 11.x", true);
        seedLang(languages, "CPP", "C++", "g++ 11.x", true);
        seedLang(languages, "JAVASCRIPT", "JavaScript", "Node.js 20.x", true);
    }

    private void seedLang(ProgrammingLanguageRepository repo, String code, String name, String version, boolean enabled) {
        ProgrammingLanguage lang = repo.findByCodeIgnoreCase(code).orElseGet(ProgrammingLanguage::new);
        lang.setCode(code);
        lang.setName(name);
        lang.setRuntimeVersion(version);
        lang.setEnabled(enabled);
        repo.save(lang);
    }

    private void seedStudentAreezaSubmission(UserAccount student, PracticalRepository practicals,
                                            SubmissionRepository submissions,
                                            StudentProgressRepository progressRepository) {
        practicals.findAllByOrderByUpdatedAtDesc().stream()
                .filter(p -> p.getTitle() != null && p.getTitle().toLowerCase().contains("matrix inversion"))
                .findFirst()
                .ifPresent(p -> {
                    if (submissions.findByStudentIdOrderBySubmittedAtDesc(student.getId()).isEmpty()) {
                        StudentProgress progress = progressRepository.findByStudentIdAndPracticalId(student.getId(), p.getId())
                                .orElseGet(StudentProgress::new);
                        progress.setStudent(student);
                        progress.setPractical(p);
                        progress.setStatus(ProgressStatus.SUBMITTED);
                        progress.setCurrentStep(PracticalStep.CONCLUSION);
                        progress.setConclusionText("Demonstrated matrix inversion and Gauss elimination with O(N^3) polynomial time complexity.");
                        progress.setDraftCode("import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\"=== Matrix Operations Lab ===\");\n        double[][] a = {{2, 1}, {5, 7}};\n        double det = a[0][0]*a[1][1] - a[0][1]*a[1][0];\n        System.out.println(\"Determinant: \" + det);\n        System.out.println(\"Matrix is \" + (det != 0 ? \"Invertible\" : \"Singular\"));\n    }\n}");
                        progress.setDraftLanguage("JAVA");
                        progressRepository.save(progress);

                        Submission sub = new Submission();
                        sub.setStudent(student);
                        sub.setPractical(p);
                        sub.setLanguage(CodeLanguage.JAVA);
                        sub.setCode(progress.getDraftCode());
                        sub.setOutput("=== Matrix Operations Lab ===\nDeterminant: 9.0\nMatrix is Invertible\n");
                        sub.setExecutionStatus("SUCCESS");
                        sub.setConclusionText(progress.getConclusionText());
                        sub.setSubmittedAt(java.time.Instant.now().minus(3, java.time.temporal.ChronoUnit.HOURS));
                        submissions.save(sub);
                    }
                });
    }

    private void seedSampleSubmission(UserAccount student, PracticalRepository practicals,
                                       SubmissionRepository submissions,
                                       StudentProgressRepository progressRepository) {
        practicals.findAllByOrderByUpdatedAtDesc().stream()
                .filter(p -> p.getSubject() != null && p.getSubject().toLowerCase().contains("machine learning"))
                .findFirst()
                .ifPresent(p -> {
                    if (submissions.findByStudentIdOrderBySubmittedAtDesc(student.getId()).isEmpty()) {
                        StudentProgress progress = progressRepository.findByStudentIdAndPracticalId(student.getId(), p.getId())
                                .orElseGet(StudentProgress::new);
                        progress.setStudent(student);
                        progress.setPractical(p);
                        progress.setStatus(ProgressStatus.SUBMITTED);
                        progress.setCurrentStep(PracticalStep.CONCLUSION);
                        progress.setConclusionText("Successfully constructed and evaluated convolutional layers, max-pooling filters, and softmax dense classification head. Training accuracy reached 98.4% on validation dataset.");
                        progress.setDraftCode("import torch\nimport torch.nn as nn\n\nclass SimpleCNN(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.features = nn.Sequential(\n            nn.Conv2d(1, 32, kernel_size=3, padding=1),\n            nn.ReLU(),\n            nn.MaxPool2d(2, 2)\n        )\n        self.classifier = nn.Linear(32 * 14 * 14, 10)\n\n    def forward(self, x):\n        x = self.features(x)\n        x = x.view(x.size(0), -1)\n        return self.classifier(x)\n\nprint('CNN Model Initialized Successfully. Total Parameters: 64,810')");
                        progress.setDraftLanguage("PYTHON");
                        progressRepository.save(progress);

                        Submission sub = new Submission();
                        sub.setStudent(student);
                        sub.setPractical(p);
                        sub.setLanguage(CodeLanguage.PYTHON);
                        sub.setCode(progress.getDraftCode());
                        sub.setOutput("CNN Model Initialized Successfully. Total Parameters: 64,810\nValidation Accuracy: 98.4%\n");
                        sub.setExecutionStatus("SUCCESS");
                        sub.setConclusionText(progress.getConclusionText());
                        sub.setSubmittedAt(java.time.Instant.now().minus(2, java.time.temporal.ChronoUnit.HOURS));
                        submissions.save(sub);
                    }
                });
    }

    private void roster(UserAccount user, String cohort, String division, String department, String rollNo) {
        user.setCohort(cohort);
        user.setDivision(division);
        user.setDepartment(department);
        user.setRollNo(rollNo);
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
        // Semester 1
        subject(subjects, "EM-I", "Engineering Mathematics - I", 1);
        subject(subjects, "APSD", "Applied Physics & Semiconductor Devices", 1);
        subject(subjects, "SPC", "Structured Programming in C", 1);
        subject(subjects, "BEE", "Basic Electrical & Electronics Engineering", 1);
        subject(subjects, "EWDF", "Engineering Workshop & Digital Fabrication", 1);

        // Semester 2
        subject(subjects, "EM-II", "Engineering Mathematics - II", 2);
        subject(subjects, "ACMS", "Applied Chemistry & Material Science", 2);
        subject(subjects, "OOP-CPP", "Object-Oriented Programming with C++", 2);
        subject(subjects, "EMD", "Engineering Mechanics & Dynamics", 2);
        subject(subjects, "PCSS", "Professional Communication & Soft Skills", 2);

        // Semester 3
        subject(subjects, "DS", "Data Structures", 3);
        subject(subjects, "DSGT", "Discrete Structures & Graph Theory", 3);
        subject(subjects, "DLCA", "Digital Logic & Computer Architecture", 3);
        subject(subjects, "CGV", "Computer Graphics & Visualization", 3);
        subject(subjects, "OOP-JAVA", "Object Oriented Programming with Java", 3);

        // Semester 4
        subject(subjects, "DAA", "Design and Analysis of Algorithms", 4);
        subject(subjects, "DBMS", "Database Management Systems", 4);
        subject(subjects, "OS", "Operating Systems", 4);
        subject(subjects, "MPMC", "Microprocessors and Microcontrollers", 4);
        subject(subjects, "PDS", "Python for Data Science", 4);

        // Semester 5
        subject(subjects, "CNS", "Computer Networks & Security", 5);
        subject(subjects, "IIS", "Introduction to Intelligent Systems", 5);
        subject(subjects, "SEAM", "Software Engineering & Agile Methodology", 5);
        subject(subjects, "WDT", "Web Development Technologies", 5);
        subject(subjects, "TCS", "Theory of Computer Science", 5);

        // Semester 6
        subject(subjects, "CCDS", "Cloud Computing & Distributed Systems", 6);
        subject(subjects, "MLDL", "Machine Learning & Deep Learning", 6);
        subject(subjects, "CND", "Cryptography & Network Defense", 6);
        subject(subjects, "SPCC", "System Programming & Compiler Construction", 6);
        subject(subjects, "MAD", "Mobile Application Development", 6);

        // Semester 7
        subject(subjects, "BDA", "Big Data Analytics", 7);
        subject(subjects, "AIR", "Artificial Intelligence & Robotics", 7);
        subject(subjects, "BSC", "Blockchain & Smart Contracts", 7);
        subject(subjects, "NLP", "Natural Language Processing", 7);
        subject(subjects, "DSRE", "DevOps & Site Reliability Engineering", 7);

        // Semester 8
        subject(subjects, "CFIR", "Cyber Forensics & Incident Response", 8);
        subject(subjects, "HPC", "High Performance Computing", 8);
        subject(subjects, "IOTEA", "Internet of Things & Edge AI", 8);
        subject(subjects, "QCI", "Quantum Computing & Information", 8);
        subject(subjects, "CMP", "Capstone Major Project Phase-II", 8);
    }

    private void seedFromJson(
            ObjectMapper mapper,
            UserAccount teacher,
            List<UserAccount> students,
            PracticalRepository practicals,
            PracticalAssignmentRepository assignments,
            PracticeQuestionRepository practiceQuestions,
            VivaQuestionRepository vivaQuestions
    ) {
        try {
            ClassPathResource resource = new ClassPathResource("practicals.json");
            if (!resource.exists()) {
                System.out.println("practicals.json not found in classpath.");
                return;
            }
            JsonNode root = mapper.readTree(resource.getInputStream());
            if (!root.isArray()) return;

            int count = 0;
            for (JsonNode node : root) {
                String title = node.path("title").asText();
                if (title == null || title.isBlank()) continue;

                Practical practical = practicals.findByTitleIgnoreCase(title).orElseGet(Practical::new);
                boolean isNew = practical.getId() == null;
                if (isNew) {
                    practical.setCreatedBy(teacher);
                    practical.setStatus(PracticalStatus.PUBLISHED);
                }
                practical.setTitle(title);
                practical.setSubject(node.path("subject").asText(""));
                practical.setSemester(node.path("semester").asInt(1));
                practical.setExperimentNumber(node.path("experimentNumber").asInt(1));
                practical.setDescription(node.path("description").asText(""));
                practical.setAim(node.path("aim").asText(""));
                practical.setTheory(node.path("theory").asText(""));
                practical.setAlgorithm(node.path("algorithm").asText(""));
                practical.setCodeInstructions(node.path("codeInstructions").asText(""));
                practical.setConclusion(node.path("conclusion").asText(""));
                practical.setJavaStarterCode(node.path("javaStarterCode").asText(""));
                practical.setPythonStarterCode(node.path("pythonStarterCode").asText(""));
                practical.setProgrammingLanguage("JAVA");
                practical.setStatus(PracticalStatus.PUBLISHED);
                practical = practicals.save(practical);

                if (practiceQuestions.findByPracticalIdOrderBySortOrderAsc(practical.getId()).isEmpty()) {
                    JsonNode pqNode = node.path("practiceQuestions");
                    if (pqNode.isArray()) {
                        int order = 1;
                        for (JsonNode qNode : pqNode) {
                            PracticeQuestion q = new PracticeQuestion();
                            q.setPractical(practical);
                            q.setQuestion(qNode.path("question").asText());
                            q.setExpectedAnswer("Answer based on experiment findings and theoretical concepts.");
                            q.setSortOrder(order++);
                            practiceQuestions.save(q);
                        }
                    }
                }

                if (vivaQuestions.findByPracticalIdOrderBySortOrderAsc(practical.getId()).isEmpty()) {
                    JsonNode vqNode = node.path("vivaQuestions");
                    if (vqNode.isArray()) {
                        int order = 1;
                        for (JsonNode qNode : vqNode) {
                            VivaQuestion q = new VivaQuestion();
                            q.setPractical(practical);
                            q.setQuestion(qNode.path("question").asText());
                            q.setMarks(qNode.path("marks").asInt(2));
                            q.setSortOrder(order++);
                            vivaQuestions.save(q);
                        }
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
                count++;
            }
            System.out.println("Seeded " + count + " curriculum practicals successfully from practicals.json!");
        } catch (Exception e) {
            System.err.println("Failed to seed from practicals.json: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private UserAccount user(UserRepository users, PasswordEncoder encoder, String name, String email, Role role) {
        return users.findByEmailIgnoreCase(email).orElseGet(() -> {
            UserAccount u = new UserAccount();
            u.setName(name);
            u.setEmail(email);
            u.setRole(role);
            u.setPassword(encoder.encode("CodeLabX123!"));
            return users.save(u);
        });
    }
}
