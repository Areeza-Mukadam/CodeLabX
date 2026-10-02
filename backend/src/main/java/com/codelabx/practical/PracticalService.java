package com.codelabx.practical;

import com.codelabx.common.ApiException;
import com.codelabx.practical.dto.PracticalDtos;
import com.codelabx.practical.dto.PracticalDtos.*;
import com.codelabx.progress.ProgressStatus;
import com.codelabx.progress.StudentProgressRepository;
import com.codelabx.user.Role;
import com.codelabx.user.UserAccount;
import com.codelabx.user.UserRepository;
import com.codelabx.viva.VivaQuestion;
import com.codelabx.viva.VivaQuestionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class PracticalService {

    private final PracticalRepository practicals;
    private final PracticeQuestionRepository practiceQuestions;
    private final VivaQuestionRepository vivaQuestions;
    private final PracticalAssignmentRepository assignments;
    private final StudentProgressRepository progress;
    private final UserRepository users;

    public PracticalService(
            PracticalRepository practicals,
            PracticeQuestionRepository practiceQuestions,
            VivaQuestionRepository vivaQuestions,
            PracticalAssignmentRepository assignments,
            StudentProgressRepository progress,
            UserRepository users
    ) {
        this.practicals = practicals;
        this.practiceQuestions = practiceQuestions;
        this.vivaQuestions = vivaQuestions;
        this.assignments = assignments;
        this.progress = progress;
        this.users = users;
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
    public List<PracticalSummary> listAssignedToStudent(UserAccount student) {
        return assignments.findByStudentId(student.getId()).stream()
                .map(PracticalAssignment::getPractical)
                .filter(p -> p.getStatus() == PracticalStatus.PUBLISHED)
                .map(p -> {
                    var prog = progress.findByStudentIdAndPracticalId(student.getId(), p.getId()).orElse(null);
                    int completed = prog == null || prog.getCompletedSteps().isBlank()
                            ? 0
                            : prog.getCompletedSteps().split(",").length;
                    int percent = (int) Math.round(completed * 100.0 / 6.0);
                    String progressStatus = prog == null ? "NOT_STARTED" : prog.getStatus().name();
                    return new PracticalSummary(p.getId(), p.getTitle(), p.getDescription(), progressStatus, p.getUpdatedAt(), 0, completed, percent, progressStatus);
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public PracticalDetail studentDetail(Long id, UserAccount student) {
        Practical practical = requireAssignedPublished(id, student);
        return toStudentDetail(practical);
    }

    @Transactional(readOnly = true)
    public PracticalTeacherDetail teacherDetail(Long id) {
        Practical practical = practicals.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Practical not found."));
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
    public PracticalTeacherDetail update(Long id, PracticalUpsertRequest request) {
        Practical practical = practicals.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Practical not found."));
        apply(practical, request);
        replaceQuestions(practical, request);
        return toTeacherDetail(practical);
    }

    @Transactional
    public PracticalTeacherDetail publish(Long id) {
        Practical practical = practicals.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Practical not found."));
        if (isBlank(practical.getTitle()) || isBlank(practical.getAim()) || isBlank(practical.getTheory())
                || isBlank(practical.getAlgorithm()) || isBlank(practical.getCodeInstructions())
                || isBlank(practical.getConclusion())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Fill aim, theory, algorithm, code instructions and conclusion before publishing.");
        }
        practical.setStatus(PracticalStatus.PUBLISHED);
        return toTeacherDetail(practical);
    }

    @Transactional
    public void assign(Long practicalId, List<Long> studentIds) {
        Practical practical = practicals.findById(practicalId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Practical not found."));
        if (studentIds == null) {
            return;
        }
        for (Long studentId : studentIds) {
            UserAccount student = users.findById(studentId)
                    .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Unknown student: " + studentId));
            if (student.getRole() != Role.STUDENT) {
                throw new ApiException(HttpStatus.BAD_REQUEST, student.getEmail() + " is not a student.");
            }
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
        if (!assignments.existsByPracticalIdAndStudentId(id, student.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "This practical is not assigned to you.");
        }
        return practical;
    }

    public List<UserAccount> students() {
        return users.findByRole(Role.STUDENT);
    }

    private void apply(Practical practical, PracticalUpsertRequest request) {
        practical.setTitle(request.title());
        practical.setDescription(nvl(request.description()));
        practical.setAim(nvl(request.aim()));
        practical.setTheory(nvl(request.theory()));
        practical.setAlgorithm(nvl(request.algorithm()));
        practical.setCodeInstructions(nvl(request.codeInstructions()));
        practical.setConclusion(nvl(request.conclusion()));
        practical.setJavaStarterCode(nvl(request.javaStarterCode()));
        practical.setPythonStarterCode(nvl(request.pythonStarterCode()));
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
        List<VivaQuestionView> viva = List.of();
        return new PracticalDetail(
                practical.getId(), practical.getTitle(), practical.getDescription(), practical.getAim(),
                practical.getTheory(), practical.getAlgorithm(), practical.getCodeInstructions(),
                practical.getConclusion(), practical.getJavaStarterCode(), practical.getPythonStarterCode(),
                practical.getStatus(), practical.getCreatedAt(), practical.getUpdatedAt(), questions, viva
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
                .map(a -> a.getStudent().getId())
                .toList();
        return new PracticalTeacherDetail(
                practical.getId(), practical.getTitle(), practical.getDescription(), practical.getAim(),
                practical.getTheory(), practical.getAlgorithm(), practical.getCodeInstructions(),
                practical.getConclusion(), practical.getJavaStarterCode(), practical.getPythonStarterCode(),
                practical.getStatus(), practical.getCreatedAt(), practical.getUpdatedAt(), questions, viva, assigned
        );
    }

    private String nvl(String value) {
        return value == null ? "" : value;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
