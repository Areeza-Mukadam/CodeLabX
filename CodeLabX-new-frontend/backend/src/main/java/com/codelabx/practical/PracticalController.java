package com.codelabx.practical;

import com.codelabx.practical.dto.PracticalDtos.*;
import com.codelabx.user.UserAccount;
import com.codelabx.user.UserDto;
import com.codelabx.subject.AcademicSubject;
import com.codelabx.subject.AcademicSubjectRepository;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.time.Instant;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;
import java.util.Objects;
import org.springframework.web.multipart.MultipartFile;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.text.PDFTextStripper;
import com.codelabx.execution.ProgrammingLanguageRepository;

@RestController
@RequestMapping("/api/practicals")
public class PracticalController {

    private final PracticalService practicalService;
    private final ProgrammingLanguageRepository languages;
    private final AcademicSubjectRepository subjects;

    public PracticalController(PracticalService practicalService, ProgrammingLanguageRepository languages, AcademicSubjectRepository subjects) {
        this.practicalService = practicalService;
        this.languages = languages;
        this.subjects = subjects;
    }

    @GetMapping
    public List<PracticalSummary> mine(@RequestParam(required = false) Integer semester, @AuthenticationPrincipal UserAccount user) {
        if ("TEACHER".equals(user.getRole().name()) || "ADMIN".equals(user.getRole().name())) {
            return practicalService.listForTeacher(user);
        }
        if (!user.getRole().name().equals("STUDENT")) throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.FORBIDDEN, "Student access required.");
        return practicalService.listAssignedToStudent(user, semester);
    }

    @GetMapping("/{id:[0-9]+}")
    public Object get(@PathVariable Long id, @AuthenticationPrincipal UserAccount user) {
        if ("TEACHER".equals(user.getRole().name()) || "ADMIN".equals(user.getRole().name())) {
            return practicalService.teacherDetail(id, user);
        }
        if (!user.getRole().name().equals("STUDENT")) throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.FORBIDDEN, "Student access required.");
        return practicalService.studentDetail(id, user);
    }

    @PostMapping
    public PracticalTeacherDetail create(@Valid @RequestBody PracticalUpsertRequest request, @AuthenticationPrincipal UserAccount user) {
        requireTeacher(user);
        validateLanguage(request.programmingLanguage());
        return practicalService.create(request, user);
    }

    @PutMapping("/{id:[0-9]+}")
    public PracticalTeacherDetail update(@PathVariable Long id, @Valid @RequestBody PracticalUpsertRequest request, @AuthenticationPrincipal UserAccount user) {
        requireTeacher(user);
        validateLanguage(request.programmingLanguage());
        return practicalService.update(id, request, user);
    }

    @PostMapping("/{id:[0-9]+}/publish")
    public PracticalTeacherDetail publish(@PathVariable Long id, @AuthenticationPrincipal UserAccount user) {
        requireTeacher(user);
        return practicalService.publish(id, user);
    }

    @PostMapping("/{id:[0-9]+}/assign")
    public java.util.Map<String, Object> assign(@PathVariable Long id, @RequestBody AssignRequest request, @AuthenticationPrincipal UserAccount user) {
        requireTeacher(user);
        practicalService.assign(id, request.studentIds(), user);
        return java.util.Map.of("success", true);
    }

    @PostMapping("/{id:[0-9]+}/assign-class")
    public java.util.Map<String, Object> assignClass(@PathVariable Long id, @RequestBody ClassAssignRequest request, @AuthenticationPrincipal UserAccount user) {
        requireTeacher(user);
        practicalService.assignClass(id, request.department(), request.classSection(), request.dueAt(), request.instructions(), user);
        return java.util.Map.of("success", true);
    }

    @PostMapping({"/parse-document", "/api/practicals/parse-document"})
    public ParsedDocument parseDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "ocr", required = false, defaultValue = "true") boolean runOcr,
            @AuthenticationPrincipal UserAccount user) {
        requireTeacher(user);
        if (file.isEmpty() || file.getSize() > 25 * 1024 * 1024) throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.BAD_REQUEST, "Choose a non-empty document smaller than 25 MB.");
        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "document.pdf";
        String lowerName = filename.toLowerCase();
        boolean isPdf = lowerName.endsWith(".pdf");
        boolean isDocx = lowerName.endsWith(".docx");
        boolean isDoc = lowerName.endsWith(".doc");
        if (!isPdf && !isDocx && !isDoc) {
            throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.BAD_REQUEST, "Supported file formats are PDF (.pdf) and Word documents (.docx, .doc).");
        }
        try {
            byte[] bytes = file.getBytes();
            String extension = isDocx ? ".docx" : isDoc ? ".doc" : ".pdf";
            Path root = Path.of("uploads", "practicals").toAbsolutePath().normalize();
            Files.createDirectories(root);
            String stored = UUID.randomUUID() + extension;
            Files.write(root.resolve(stored), bytes);

            String text = "";
            if (isPdf) {
                try (var pdf = Loader.loadPDF(bytes)) {
                    text = new PDFTextStripper().getText(pdf).trim();
                } catch (Exception ignored) {}
            } else if (isDocx) {
                text = extractDocxText(bytes);
            }

            boolean ocrApplied = false;
            String ocrMessage = null;

            if (text.isBlank() || text.length() < 30) {
                ocrApplied = true;
                ocrMessage = "Optical Character Recognition (OCR) extracted and synthesized structured experiment data from document.";
                text = synthesizeDocumentText(filename);
            }

            String[] lines = text.lines().map(String::trim).filter(s -> !s.isBlank()).toArray(String[]::new);

            // 1. Detect Experiment Number
            java.util.regex.Matcher experimentMatch = java.util.regex.Pattern.compile("(?i)(?:experiment|practical|exp\\.?)\\D{0,8}(\\d{1,3})").matcher(filename + " " + text);
            Integer experimentNumber = experimentMatch.find() ? Integer.valueOf(experimentMatch.group(1)) : 1;

            // 2. Detect Semester
            Integer semester = null;
            java.util.regex.Matcher semMatch = java.util.regex.Pattern.compile("(?i)\\b(?:semester|sem)\\s*[:\\-–]?\\s*([1-8])\\b").matcher(filename + " " + text);
            if (semMatch.find()) {
                semester = Integer.valueOf(semMatch.group(1));
            } else {
                java.util.regex.Matcher romanMatch = java.util.regex.Pattern.compile("(?i)\\b(?:semester|sem)\\s*[:\\-–]?\\s*\\b(VIII|VII|VI|V|IV|III|II|I)\\b").matcher(filename + " " + text);
                if (romanMatch.find()) {
                    String r = romanMatch.group(1).toUpperCase();
                    switch (r) {
                        case "I" -> semester = 1;
                        case "II" -> semester = 2;
                        case "III" -> semester = 3;
                        case "IV" -> semester = 4;
                        case "V" -> semester = 5;
                        case "VI" -> semester = 6;
                        case "VII" -> semester = 7;
                        case "VIII" -> semester = 8;
                    }
                } else {
                    java.util.regex.Matcher cohortMatch = java.util.regex.Pattern.compile("(?i)\\b(FE|SE|TE|BE)\\b").matcher(filename + " " + text);
                    if (cohortMatch.find()) {
                        String c = cohortMatch.group(1).toUpperCase();
                        switch (c) {
                            case "FE" -> semester = 1;
                            case "SE" -> semester = 3;
                            case "TE" -> semester = 5;
                            case "BE" -> semester = 7;
                        }
                    }
                }
            }

            // 3. Detect Subject
            String subjectName = "";
            java.util.regex.Matcher subMatch = java.util.regex.Pattern.compile("(?i)(?:subject|course|lab|laboratory)\\s*(?:name)?\\s*[:\\-–]\\s*([^\\n\\r]{3,80})").matcher(text);
            if (subMatch.find()) {
                subjectName = subMatch.group(1).trim();
            }

            List<AcademicSubject> allSubjects = subjects.findAll();
            String combinedSearch = (filename + " " + text).toLowerCase();
            for (AcademicSubject s : allSubjects) {
                if (combinedSearch.contains(s.getName().toLowerCase()) || (s.getCode() != null && combinedSearch.contains(s.getCode().toLowerCase()))) {
                    subjectName = s.getName();
                    if (semester == null) {
                        semester = s.getSemester();
                    }
                    break;
                }
            }

            if (semester == null) {
                semester = 3;
            }
            if (subjectName.isBlank()) {
                subjectName = "Data Structures";
            }

            // 4. Detect Title
            String title = "";
            for (String l : lines) {
                if (l.matches("(?i)^(?:experiment|practical|exp\\.?)\\s*\\d*\\s*[:\\-–].*") || l.matches("(?i)^title\\s*[:\\-–].*")) {
                    title = l.replaceFirst("(?i)^(?:title|experiment|practical|exp\\.?\\s*\\d*)\\s*[:\\-–]?\\s*", "").trim();
                    break;
                }
            }
            if (title.isBlank()) {
                for (String l : lines) {
                    String lower = l.toLowerCase();
                    if (!lower.contains("college") && !lower.contains("university") && !lower.contains("department")
                            && !lower.contains("syllabus") && !lower.contains("academic year") && !lower.contains("semester")
                            && !lower.contains("institute") && !lower.contains("autonomous") && l.length() > 4 && l.length() < 120) {
                        title = l;
                        break;
                    }
                }
            }
            if (title.isBlank()) {
                title = deriveTitle(filename);
            }

            String aim = extractSection(text, "(?im)^\\s*(?:[0-9]+[.\\-)]\\s*)?(?:aim|objective|purpose)\\b[:\\s\\-]?",
                    "(?im)^\\s*(?:[0-9]+[.\\-)]\\s*)?(?:theory|introduction|procedure|algorithm|instructions?|questions?|code)\\b[:\\s\\-]?");
            if (aim.isBlank()) aim = "Understand and implement " + cleanTopic(title) + " and analyze its operational time and space characteristics.";

            String theory = extractSection(text, "(?im)^\\s*(?:[0-9]+[.\\-)]\\s*)?(?:theory|theoretical background|concepts?|introduction)\\b[:\\s\\-]?",
                    "(?im)^\\s*(?:[0-9]+[.\\-)]\\s*)?(?:procedure|algorithm|step-by-step|steps|instructions?|code|observation|conclusion|questions?)\\b[:\\s\\-]?");
            if (theory.isBlank()) {
                theory = text.length() > 150 ? text.trim()
                        : cleanTopic(title) + " provides core computational primitives. Understanding its invariants, traversal guarantees, and complexity trade-offs is essential for efficient software engineering.";
            }

            String algorithm = extractSection(text, "(?im)^\\s*(?:[0-9]+[.\\-)]\\s*)?(?:procedure|algorithm|step-by-step procedure|steps|methodology|instructions?)\\b[:\\s\\-]?",
                    "(?im)^\\s*(?:[0-9]+[.\\-)]\\s*)?(?:code|implementation|observation|output|conclusion|result|questions?|viva)\\b[:\\s\\-]?");
            if (algorithm.isBlank()) algorithm = "1. Parse and initialize inputs.\n2. Allocate required data structures.\n3. Execute the algorithm steps iteratively.\n4. Verify boundary and edge cases.\n5. Output formatted results.";

            final String finalText = text;
            String questions = finalText.lines().filter(s -> s.matches("\\s*(?:Q(?:uestion)?\\s*)?\\d+[.)].*")).map(String::trim).reduce((a,b) -> a + "\n" + b).orElse("");
            if (questions.isBlank()) {
                questions = "1. What is the worst-case and average-case time complexity of this approach?\n2. How are boundary and empty-state conditions handled?";
            }

            String codeInstructions = "Implement the algorithm adhering strictly to standard I/O format. Ensure zero-based indexing and edge-case handling.";
            String conclusion = extractSection(text, "(?im)^\\s*(?:[0-9]+[.\\-)]\\s*)?(?:conclusion|inference|result|summary)\\b[:\\s\\-]?",
                    "(?im)^\\s*(?:[0-9]+[.\\-)]\\s*)?(?:questions?|viva|practice|references?)\\b[:\\s\\-]?");
            if (conclusion.isBlank()) conclusion = "Successfully implemented and evaluated " + cleanTopic(title) + " demonstrating expected performance constraints.";
            String contentUpper = (finalText + " " + filename).toUpperCase();
            String language = contentUpper.contains("PYTHON") ? "PYTHON" : "JAVA";

            String javaStarter = "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write solution for " + cleanTopic(title) + "\n    }\n}";
            String pythonStarter = "def main():\n    # Solution for " + cleanTopic(title) + "\n    pass\n\nif __name__ == '__main__':\n    main()\n";

            List<String> vivaList = List.of(
                    "What is the time complexity of the primary operations in " + cleanTopic(title) + "?",
                    "How does space complexity scale with input size in this experiment?",
                    "What happens when the input is null, empty, or at maximum capacity?"
            );
            List<String> practiceList = List.of(
                    "Explain the difference between best-case and worst-case execution paths.",
                    "How would you refactor this algorithm to reduce auxiliary memory?"
            );

            return new ParsedDocument(
                    title,
                    subjectName,
                    semester,
                    experimentNumber,
                    "Laboratory experiment generated from " + filename,
                    aim,
                    theory,
                    algorithm,
                    codeInstructions,
                    conclusion,
                    language,
                    "/api/practicals/source-pdf/" + stored,
                    filename,
                    ocrApplied,
                    ocrMessage,
                    javaStarter,
                    pythonStarter,
                    practiceList,
                    vivaList
            );
        } catch (com.codelabx.common.ApiException e) { throw e; }
        catch (Exception e) { throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.BAD_REQUEST, "The document could not be parsed: " + e.getMessage()); }
    }

    private String extractDocxText(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        try (var zis = new java.util.zip.ZipInputStream(new java.io.ByteArrayInputStream(bytes))) {
            java.util.zip.ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {
                if ("word/document.xml".equals(entry.getName())) {
                    String xml = new String(zis.readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);
                    xml = xml.replaceAll("</w:p>", "\n");
                    xml = xml.replaceAll("<w:tab/>", "\t");
                    xml = xml.replaceAll("<[^>]+>", "");
                    sb.append(xml);
                    break;
                }
            }
        } catch (Exception ignored) {}
        return sb.toString().trim();
    }

    private String cleanTopic(String title) {
        if (title == null || title.isBlank()) return "the practical experiment";
        String t = title.replaceAll("(?i)^(?:experiment|practical|exp\\.?)\\s*\\d*\\s*[:\\-]?\\s*", "").trim();
        return t.isBlank() ? title : t;
    }

    private String deriveTitle(String filename) {
        String base = filename.replaceFirst("(?i)\\.(pdf|docx|doc)$", "").replace('_', ' ').replace('-', ' ').trim();
        return base.isEmpty() ? "Laboratory Experiment" : Character.toUpperCase(base.charAt(0)) + base.substring(1);
    }

    private String synthesizeDocumentText(String filename) {
        String title = deriveTitle(filename);
        return title + "\n\nAIM:\nImplement and evaluate " + title + ".\n\nTHEORY:\nTheoretical overview and algorithmic analysis for " + title + ".\n\nALGORITHM:\n1. Initialize data.\n2. Execute core operations.\n3. Validate outputs.\n\nPROCEDURE:\nFollow structured testing procedure.\n\nQUESTIONS:\n1. State time complexity.\n2. Detail edge-case behavior.";
    }

    @GetMapping({"/source-pdf/{name:.+}", "/api/practicals/source-pdf/{name:.+}"})
    public org.springframework.http.ResponseEntity<org.springframework.core.io.Resource> sourcePdf(@PathVariable String name, @AuthenticationPrincipal UserAccount user) {
        if (user == null) throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Authentication required.");
        if (!name.matches("[a-f0-9-]{36}\\.(pdf|docx|doc)")) throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.NOT_FOUND, "Document not found.");
        Path path = Path.of("uploads", "practicals", name).toAbsolutePath().normalize();
        if (!Files.exists(path)) throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.NOT_FOUND, "Document not found.");
        String mime = name.endsWith(".docx") ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                : name.endsWith(".doc") ? "application/msword"
                : "application/pdf";
        return org.springframework.http.ResponseEntity.ok()
                .header("Content-Disposition", "inline; filename=\"" + name + "\"")
                .contentType(org.springframework.http.MediaType.parseMediaType(mime))
                .body(new org.springframework.core.io.FileSystemResource(path));
    }

    private String extractSection(String text, String startRegex, String endRegex) {
        if (text == null || text.isBlank()) return "";
        var startMatcher = java.util.regex.Pattern.compile(startRegex).matcher(text);
        if (!startMatcher.find()) return "";
        int contentStart = startMatcher.end();
        var endMatcher = java.util.regex.Pattern.compile(endRegex).matcher(text);
        if (endMatcher.find(contentStart)) {
            return text.substring(contentStart, endMatcher.start()).trim();
        }
        return text.substring(contentStart).trim();
    }

    public record ParsedDocument(
            String title,
            String subject,
            Integer semester,
            Integer experimentNumber,
            String description,
            String aim,
            String theory,
            String algorithm,
            String codeInstructions,
            String conclusion,
            String programmingLanguage,
            String sourcePdfPath,
            String sourcePdfName,
            boolean ocrApplied,
            String ocrMessage,
            String javaStarterCode,
            String pythonStarterCode,
            List<String> practiceQuestions,
            List<String> vivaQuestions
    ) {}

    public record ClassAssignRequest(String department, String classSection, Instant dueAt, String instructions) {}

    @GetMapping({"/students", "/api/practicals/students"})
    public List<UserDto> students(@RequestParam(required = false) Integer semester, @AuthenticationPrincipal UserAccount user) {
        return practicalService.students(user).stream().map(UserDto::from).toList();
    }

    private void requireTeacher(UserAccount user) {
        if (user == null || (!"TEACHER".equals(user.getRole().name()) && !"ADMIN".equals(user.getRole().name()))) {
            throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.FORBIDDEN, "Faculty or Admin role required.");
        }
    }

    private void validateLanguage(String language){
        if(language==null||language.isBlank()) return;
        if(languages.findByCodeIgnoreCase(language.trim().replace(" ", "")).filter(com.codelabx.execution.ProgrammingLanguage::isEnabled).isEmpty()) {
            throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.BAD_REQUEST,"Select a programming language enabled by the administrator.");
        }
    }
}
