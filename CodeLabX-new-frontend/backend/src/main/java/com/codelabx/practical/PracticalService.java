package com.codelabx.practical;

import com.codelabx.common.ApiException;
import com.codelabx.practical.dto.PracticalDtos;
import com.codelabx.practical.dto.PracticalDtos.*;
import com.codelabx.progress.ProgressStatus;
import com.codelabx.progress.StudentProgressRepository;
import com.codelabx.user.Role;
import com.codelabx.user.UserAccount;
import com.codelabx.user.UserRepository;
import com.codelabx.submission.SubmissionRepository;
import com.codelabx.viva.VivaQuestion;
import com.codelabx.viva.VivaQuestionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class PracticalService {

    private final PracticalRepository practicals;
    private final PracticeQuestionRepository practiceQuestions;
    private final VivaQuestionRepository vivaQuestions;
    private final PracticalAssignmentRepository assignments;
    private final StudentProgressRepository progress;
    private final UserRepository users;
    private final SubmissionRepository submissions;

    public PracticalService(
            PracticalRepository practicals,
            PracticeQuestionRepository practiceQuestions,
            VivaQuestionRepository vivaQuestions,
            PracticalAssignmentRepository assignments,
            StudentProgressRepository progress,
            UserRepository users,
            SubmissionRepository submissions
    ) {
        this.practicals = practicals;
        this.practiceQuestions = practiceQuestions;
        this.vivaQuestions = vivaQuestions;
        this.assignments = assignments;
        this.progress = progress;
        this.users = users;
        this.submissions = submissions;
    }

    @Transactional(readOnly = true)
    public List<PracticalSummary> listForTeacher() {
        return practicals.findAllByOrderByUpdatedAtDesc().stream()
                .map(p -> PracticalDtos.toSummary(
                        p,
                        (int) assignments.countByPracticalId(p.getId()),
                        (int) progress.countByPracticalIdAndStatus(p.getId(), ProgressStatus.SUBMITTED)
                                + (int) progress.countByPracticalIdAndStatus(p.getId(), ProgressStatus.EVALUATED)
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PracticalSummary> listForTeacher(UserAccount teacher) {
        return practicals.findAllByOrderByUpdatedAtDesc().stream().filter(p -> p.getCreatedBy().getId().equals(teacher.getId()))
                .map(p -> PracticalDtos.toSummary(p, (int) assignments.countByPracticalId(p.getId()),
                        (int) progress.countByPracticalIdAndStatus(p.getId(), ProgressStatus.SUBMITTED) + (int) progress.countByPracticalIdAndStatus(p.getId(), ProgressStatus.EVALUATED))).toList();
    }

    @Transactional(readOnly = true)
    public List<PracticalSummary> listAssignedToStudent(UserAccount student, Integer semester) {
        var direct = assignments.findByStudentId(student.getId()).stream().map(PracticalAssignment::getPractical).toList();
        var classWide = classSection(student) == null ? List.<Practical>of() : assignments.findByClassSection(classSection(student)).stream()
                .filter(a -> a.getClassDepartment() == null || Objects.equals(a.getClassDepartment(), student.getDepartment()))
                .map(PracticalAssignment::getPractical).toList();
        var publishedAll = practicals.findAll().stream()
                .filter(p -> p.getStatus() == PracticalStatus.PUBLISHED)
                .toList();

        return java.util.stream.Stream.concat(
                    java.util.stream.Stream.concat(direct.stream(), classWide.stream()),
                    publishedAll.stream()
                ).distinct()
                .filter(p -> p.getStatus() == PracticalStatus.PUBLISHED)
                .filter(p -> semester == null || Objects.equals(p.getSemester(), semester))
                .map(p -> {
                    var prog = progress.findByStudentIdAndPracticalId(student.getId(), p.getId()).orElse(null);
                    int completed = prog == null || prog.getCompletedSteps().isBlank()
                            ? 0
                            : prog.getCompletedSteps().split(",").length;
                    int percent = (int) Math.round(completed * 100.0 / 6.0);
                    String progressStatus = prog == null ? "NOT_STARTED" : prog.getStatus().name();
                    var assignment = assignments.findByPracticalIdAndStudentId(p.getId(), student.getId())
                            .orElseGet(() -> classSection(student) == null ? null : assignments.findByPracticalIdAndClassSection(p.getId(), classSection(student)).stream().filter(a -> a.getClassDepartment() == null || Objects.equals(a.getClassDepartment(),student.getDepartment())).findFirst().orElse(null));
                    java.time.Instant activityAt=progressStatus.equals("SUBMITTED")||progressStatus.equals("EVALUATED")
                            ? submissions.findFirstByStudentIdAndPracticalIdOrderBySubmittedAtDesc(student.getId(),p.getId()).map(com.codelabx.submission.Submission::getSubmittedAt).orElse(java.time.Instant.now())
                            : java.time.Instant.now();
                    String displayStatus = assignment != null && assignment.getDueAt() != null && assignment.getDueAt().isBefore(activityAt) ? "LATE" : progressStatus;
                    return new PracticalSummary(p.getId(), p.getTitle(), p.getSubject(), p.getSemester(), p.getDescription(), displayStatus, p.getUpdatedAt(), 0, completed, percent, displayStatus,
                            assignment == null ? p.getCreatedAt() : assignment.getAssignedAt(), assignment == null ? null : assignment.getDueAt(), p.getCreatedBy() != null ? p.getCreatedBy().getName() : "Faculty");
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public PracticalDetail studentDetail(Long id, UserAccount student) {
        Practical practical = requireAssignedPublished(id, student);
        PracticalDetail detail=toStudentDetail(practical);
        PracticalAssignment assignment=assignments.findByPracticalIdAndStudentId(id,student.getId()).orElseGet(()->classSection(student)==null?null:assignments.findByPracticalIdAndClassSection(id,classSection(student)).stream().filter(a->a.getClassDepartment()==null||Objects.equals(a.getClassDepartment(),student.getDepartment())).findFirst().orElse(null));
        return new PracticalDetail(detail.id(),detail.title(),detail.subject(),detail.semester(),detail.description(),detail.aim(),detail.theory(),detail.algorithm(),detail.codeInstructions(),detail.conclusion(),detail.javaStarterCode(),detail.pythonStarterCode(),detail.status(),detail.createdAt(),detail.updatedAt(),detail.practiceQuestions(),detail.vivaQuestions(),assignment==null?practical.getCreatedAt():assignment.getAssignedAt(),assignment==null?null:assignment.getDueAt(),assignment==null?null:assignment.getInstructions(),practical.getCreatedBy().getName(),practical.getExperimentNumber(),practical.getProgrammingLanguage());
    }

    @Transactional(readOnly = true)
    public PracticalTeacherDetail teacherDetail(Long id) {
        Practical practical = practicals.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Practical not found."));
        return toTeacherDetail(practical);
    }

    @Transactional(readOnly = true)
    public PracticalTeacherDetail teacherDetail(Long id, UserAccount teacher) {
        Practical practical = owned(id, teacher);
        return toTeacherDetail(practical);
    }

    @Transactional
    public PracticalTeacherDetail create(PracticalUpsertRequest request, UserAccount teacher) {
        Practical practical = new Practical();
        practical.setCreatedBy(teacher);
        apply(practical, request);
        practical.setStatus(PracticalStatus.DRAFT);
        practicals.save(practical);
        replaceQuestions(practical, request);
        return toTeacherDetail(practical);
    }

    @Transactional
    public PracticalTeacherDetail update(Long id, PracticalUpsertRequest request, UserAccount teacher) {
        Practical practical = owned(id, teacher);
        apply(practical, request);
        replaceQuestions(practical, request);
        return toTeacherDetail(practical);
    }

    @Transactional
    public PracticalTeacherDetail publish(Long id, UserAccount teacher) {
        Practical practical = owned(id, teacher);
        if (isBlank(practical.getTitle()) || isBlank(practical.getAim()) || isBlank(practical.getTheory())
                || isBlank(practical.getAlgorithm()) || isBlank(practical.getCodeInstructions())
                || isBlank(practical.getConclusion())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Fill aim, theory, algorithm, code instructions and conclusion before publishing.");
        }
        practical.setStatus(PracticalStatus.PUBLISHED);
        return toTeacherDetail(practical);
    }

    @Transactional
    public void assign(Long practicalId, List<Long> studentIds, UserAccount teacher) {
        Practical practical = owned(practicalId, teacher);
        if (studentIds == null) {
            return;
        }
        for (Long studentId : studentIds) {
            UserAccount student = users.findById(studentId)
                    .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Unknown student: " + studentId));
            if (student.getRole() != Role.STUDENT) {
                throw new ApiException(HttpStatus.BAD_REQUEST, student.getEmail() + " is not a student.");
            }
            if (teacher.getDepartment()!=null&&!Objects.equals(teacher.getDepartment(),student.getDepartment())) throw new ApiException(HttpStatus.FORBIDDEN,"You cannot assign this practical outside your department.");
            if (assignments.existsByPracticalIdAndStudentId(practicalId, studentId)) {
                continue;
            }
            PracticalAssignment assignment = new PracticalAssignment();
            assignment.setPractical(practical);
            assignment.setStudent(student);
            assignments.save(assignment);
        }
    }

    public Practical requireAssignedPublished(Long id, UserAccount student) {
        Practical practical = practicals.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Practical not found."));
        if (practical.getStatus() != PracticalStatus.PUBLISHED) {
            throw new ApiException(HttpStatus.FORBIDDEN, "This practical is not available.");
        }
        return practical;
    }

    public List<UserAccount> students() {
        return users.findByRole(Role.STUDENT);
    }

    public List<UserAccount> students(UserAccount teacher) {
        List<UserAccount> all = users.findByRole(Role.STUDENT);
        if (teacher == null || teacher.getDepartment() == null) {
            return all;
        }
        List<UserAccount> matching = all.stream().filter(s -> Objects.equals(teacher.getDepartment(), s.getDepartment())).toList();
        return matching.isEmpty() ? all : matching;
    }

    private void apply(Practical practical, PracticalUpsertRequest request) {
        practical.setTitle(request.title());
        practical.setSubject(request.subject().trim());
        practical.setSemester(request.semester());
        practical.setExperimentNumber(request.experimentNumber());
        practical.setProgrammingLanguage(request.programmingLanguage());
        if (request.sourcePdfPath() != null && !request.sourcePdfPath().isBlank()) {
            practical.setSourcePdfPath(request.sourcePdfPath());
            practical.setSourcePdfName(request.sourcePdfName());
        }
        practical.setDescription(clip(request.description(), 4000));
        practical.setAim(clip(request.aim(), 8000));
        practical.setTheory(clip(request.theory(), 16000));
        practical.setAlgorithm(clip(request.algorithm(), 8000));
        practical.setCodeInstructions(clip(request.codeInstructions(), 8000));
        practical.setConclusion(clip(request.conclusion(), 8000));
        practical.setJavaStarterCode(clip(request.javaStarterCode(), 8000));
        practical.setPythonStarterCode(clip(request.pythonStarterCode(), 8000));
    }

    private void replaceQuestions(Practical practical, PracticalUpsertRequest request) {
        practiceQuestions.deleteByPracticalId(practical.getId());
        vivaQuestions.deleteByPracticalId(practical.getId());
        int order = 1;
        if (request.practiceQuestions() != null) {
            for (PracticeQuestionInput input : request.practiceQuestions()) {
                PracticeQuestion q = new PracticeQuestion();
                q.setPractical(practical);
                q.setQuestion(input.question());
                q.setExpectedAnswer(nvl(input.expectedAnswer()));
                q.setSortOrder(input.order() == 0 ? order : input.order());
                practiceQuestions.save(q);
                order++;
            }
        }
        order = 1;
        if (request.vivaQuestions() != null) {
            for (VivaQuestionInput input : request.vivaQuestions()) {
                VivaQuestion q = new VivaQuestion();
                q.setPractical(practical);
                q.setQuestion(input.question());
                q.setMarks(input.marks() <= 0 ? 2 : input.marks());
                q.setSortOrder(input.order() == 0 ? order : input.order());
                vivaQuestions.save(q);
                order++;
            }
        }
    }

    private PracticalDetail toStudentDetail(Practical practical) {
        List<PracticeQuestionView> questions = practiceQuestions.findByPracticalIdOrderBySortOrderAsc(practical.getId())
                .stream()
                .map(q -> new PracticeQuestionView(q.getId(), q.getQuestion(), q.getSortOrder()))
                .toList();
        List<VivaQuestionView> viva = vivaQuestions.findByPracticalIdOrderBySortOrderAsc(practical.getId())
                .stream()
                .map(q -> new VivaQuestionView(q.getId(), q.getQuestion(), q.getMarks(), q.getSortOrder()))
                .toList();
        return new PracticalDetail(
                practical.getId(), practical.getTitle(), practical.getSubject(), practical.getSemester(), practical.getDescription(), practical.getAim(),
                practical.getTheory(), practical.getAlgorithm(), practical.getCodeInstructions(),
                practical.getConclusion(), practical.getJavaStarterCode(), practical.getPythonStarterCode(),
                practical.getStatus(), practical.getCreatedAt(), practical.getUpdatedAt(), questions, viva, practical.getCreatedAt(), null, null, practical.getCreatedBy() != null ? practical.getCreatedBy().getName() : "Faculty", practical.getExperimentNumber(), practical.getProgrammingLanguage()
        );
    }

    private PracticalTeacherDetail toTeacherDetail(Practical practical) {
        List<PracticeQuestionTeacherView> questions = practiceQuestions.findByPracticalIdOrderBySortOrderAsc(practical.getId())
                .stream()
                .map(q -> new PracticeQuestionTeacherView(q.getId(), q.getQuestion(), q.getExpectedAnswer(), q.getSortOrder()))
                .toList();
        List<VivaQuestionView> viva = vivaQuestions.findByPracticalIdOrderBySortOrderAsc(practical.getId())
                .stream()
                .map(q -> new VivaQuestionView(q.getId(), q.getQuestion(), q.getMarks(), q.getSortOrder()))
                .toList();
        List<Long> assigned = assignments.findByPracticalId(practical.getId()).stream()
                .filter(a -> a.getStudent() != null)
                .map(a -> a.getStudent().getId())
                .toList();
        return new PracticalTeacherDetail(
                practical.getId(), practical.getTitle(), practical.getSubject(), practical.getSemester(), practical.getDescription(), practical.getAim(),
                practical.getTheory(), practical.getAlgorithm(), practical.getCodeInstructions(),
                practical.getConclusion(), practical.getJavaStarterCode(), practical.getPythonStarterCode(),
                practical.getStatus(), practical.getCreatedAt(), practical.getUpdatedAt(), questions, viva, assigned,
                practical.getExperimentNumber(), practical.getProgrammingLanguage(), practical.getSourcePdfName(), practical.getSourcePdfPath()
        );
    }

    @Transactional
    public void assignClass(Long practicalId, String classDepartment, String classSection, java.time.Instant dueAt, String instructions, UserAccount teacher) {
        if (classSection == null || classSection.isBlank()) throw new ApiException(HttpStatus.BAD_REQUEST, "Class is required.");
        String normalizedSection = classSection.trim();
        Practical practical = owned(practicalId, teacher);
        if (practical.getStatus() != PracticalStatus.PUBLISHED) {
            practical.setStatus(PracticalStatus.PUBLISHED);
            practicals.save(practical);
        }
        if (classDepartment == null || classDepartment.isBlank()) {
            classDepartment = teacher.getDepartment() != null ? teacher.getDepartment() : "Computer Engineering";
        }
        String normalizedDepartment = classDepartment.trim();
        if (teacher.getRole() != Role.ADMIN && teacher.getDepartment() != null && !teacher.getDepartment().isBlank()) {
            normalizedDepartment = teacher.getDepartment().trim();
        }
        var existing = assignments.findByPracticalIdAndClassSectionAndClassDepartment(practicalId, normalizedSection, normalizedDepartment);
        PracticalAssignment assignment = existing.orElseGet(PracticalAssignment::new);
        assignment.setPractical(practical);
        assignment.setClassSection(normalizedSection);
        assignment.setClassDepartment(normalizedDepartment);
        assignment.setDueAt(dueAt);
        assignment.setInstructions(instructions);
        assignments.save(assignment);
    }

    public boolean ownsSourcePdf(String storedPath, UserAccount teacher) {
        return practicals.findBySourcePdfPath(storedPath).map(p -> p.getCreatedBy() == null || p.getCreatedBy().getId().equals(teacher.getId())).orElse(false);
    }

    private Practical owned(Long id, UserAccount teacher) {
        Practical practical = practicals.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Practical not found."));
        if (teacher.getRole() == Role.ADMIN) return practical;
        if (practical.getCreatedBy() == null) {
            practical.setCreatedBy(teacher);
            return practicals.save(practical);
        }
        if (!practical.getCreatedBy().getId().equals(teacher.getId())) {
            if (teacher.getDepartment() == null || practical.getCreatedBy().getDepartment() == null || Objects.equals(teacher.getDepartment(), practical.getCreatedBy().getDepartment())) {
                return practical;
            }
            throw new ApiException(HttpStatus.FORBIDDEN, "You cannot manage another department's practical.");
        }
        return practical;
    }

    private String classSection(UserAccount student) {
        if (student.getCohort() != null && student.getDivision() != null) return student.getCohort() + "-" + student.getDivision();
        return null;
    }

    private String nvl(String value) {
        return value == null ? "" : value;
    }

    private String clip(String value,int max){String text=nvl(value);return text.length()>max?text.substring(0,max):text;}

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
