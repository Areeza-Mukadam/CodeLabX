package com.codelabx.submission;

import com.codelabx.common.ApiException;
import com.codelabx.evaluation.Evaluation;
import com.codelabx.evaluation.EvaluationRepository;
import com.codelabx.execution.CodeLanguage;
import com.codelabx.progress.PracticalStep;
import com.codelabx.progress.ProgressService;
import com.codelabx.progress.ProgressStatus;
import com.codelabx.progress.StudentProgress;
import com.codelabx.user.UserAccount;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class SubmissionService {

    private final SubmissionRepository submissions;
    private final ProgressService progressService;
    private final EvaluationRepository evaluations;

    public SubmissionService(SubmissionRepository submissions, ProgressService progressService, EvaluationRepository evaluations) {
        this.submissions = submissions;
        this.progressService = progressService;
        this.evaluations = evaluations;
    }

    @Transactional
    public SubmissionView submit(UserAccount student, SubmitRequest request) {
        StudentProgress progress = progressService.load(request.practicalId(), student);
        progressService.assertStepUnlocked(student, request.practicalId(), PracticalStep.CONCLUSION);
        if (request.code() == null || request.code().isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Code is required to submit.");
        }
        if (progress.getStatus() == ProgressStatus.SUBMITTED || progress.getStatus() == ProgressStatus.EVALUATED) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "This practical is already submitted.");
        }

        progress.setDraftCode(request.code());
        progress.setDraftLanguage(request.language().name());
        if (request.conclusionText() != null) {
            progress.setConclusionText(request.conclusionText());
        }
        if (progress.getConclusionText() == null || progress.getConclusionText().isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Complete the conclusion before submitting.");
        }

        Submission submission = new Submission();
        submission.setStudent(student);
        submission.setPractical(progress.getPractical());
        submission.setLanguage(request.language());
        submission.setCode(request.code());
        submission.setOutput(request.output() == null ? "" : request.output());
        submission.setExecutionStatus(request.executionStatus() == null ? "UNKNOWN" : request.executionStatus());
        submission.setConclusionText(progress.getConclusionText());
        submission.setSubmittedAt(Instant.now());
        submissions.save(submission);

        progress.setStatus(ProgressStatus.SUBMITTED);
        progress.setCurrentStep(PracticalStep.CONCLUSION);
        return toView(submission);
    }

    @Transactional(readOnly = true)
    public List<SubmissionView> forStudent(UserAccount student) {
        return submissions.findByStudentIdOrderBySubmittedAtDesc(student.getId()).stream().map(this::toView).toList();
    }

    @Transactional(readOnly = true)
    public List<SubmissionListItem> forTeacher(UserAccount teacher) {
        return submissions.findAllByOrderBySubmittedAtDesc().stream().filter(s -> {
            if (teacher.getRole() == com.codelabx.user.Role.ADMIN) return true;
            if (s.getPractical() == null || s.getPractical().getCreatedBy() == null) return true;
            if (s.getPractical().getCreatedBy().getId().equals(teacher.getId())) return true;
            return teacher.getDepartment() == null || s.getPractical().getCreatedBy().getDepartment() == null || java.util.Objects.equals(teacher.getDepartment(), s.getPractical().getCreatedBy().getDepartment());
        }).map(s -> {
            var evaluation = evaluations.findBySubmissionId(s.getId()).orElse(null);
            return new SubmissionListItem(
                    s.getId(),
                    s.getStudent().getId(),
                    s.getStudent().getName(),
                    s.getStudent().getEmail(),
                    s.getStudent().getRollNo(),
                    classSection(s.getStudent()),
                    s.getPractical().getId(),
                    s.getPractical().getTitle(),
                    s.getLanguage(),
                    s.getExecutionStatus(),
                    s.getSubmittedAt(),
                    evaluation != null,
                    evaluation != null ? evaluation.getTotalMarks() : null
            );
        }).toList();
    }

    @Transactional(readOnly = true)
    public List<StudentResult> resultsForStudent(UserAccount student) {
        return submissions.findByStudentIdOrderBySubmittedAtDesc(student.getId()).stream()
                .map(s -> evaluations.findBySubmissionId(s.getId()).filter(e -> e.getEvaluatedAt() != null)
                        .map(e -> new StudentResult(s.getId(), s.getPractical().getTitle(), e.getTotalMarks(), e.getFeedback(), e.getEvaluatedAt(), e.getTeacher().getName(), s.getSubmittedAt()))
                        .orElse(null)).filter(java.util.Objects::nonNull).toList();
    }

    @Transactional(readOnly = true)
    public SubmissionDetail detail(Long id) {
        Submission s = submissions.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Submission not found."));
        Evaluation evaluation = evaluations.findBySubmissionId(id).orElse(null);
        return new SubmissionDetail(
                toView(s),
                s.getStudent().getName(),
                s.getStudent().getEmail(),
                s.getStudent().getRollNo(),
                classSection(s.getStudent()),
                s.getPractical().getTitle(),
                s.getConclusionText(),
                evaluation == null ? null : evaluation.getId(),
                evaluation == null ? null : evaluation.getCodeMarks(),
                evaluation == null ? null : evaluation.getVivaMarks(),
                evaluation == null ? null : evaluation.getTotalMarks(),
                evaluation == null ? null : evaluation.getFeedback()
        );
    }

    public void assertFacultyOwns(Long id, UserAccount teacher) {
        Submission s = require(id);
        if (teacher.getRole() == com.codelabx.user.Role.ADMIN) return;
        if (s.getPractical() == null || s.getPractical().getCreatedBy() == null) return;
        if (s.getPractical().getCreatedBy().getId().equals(teacher.getId())) return;
        if (teacher.getDepartment() == null || s.getPractical().getCreatedBy().getDepartment() == null || java.util.Objects.equals(teacher.getDepartment(), s.getPractical().getCreatedBy().getDepartment())) return;
        throw new ApiException(HttpStatus.FORBIDDEN, "You cannot access a submission for another department's practical.");
    }

    public Submission require(Long id) {
        return submissions.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Submission not found."));
    }

    private SubmissionView toView(Submission s) {
        return new SubmissionView(s.getId(), s.getStudent().getId(), s.getPractical().getId(), s.getLanguage(),
                s.getCode(), s.getOutput(), s.getExecutionStatus(), s.getSubmittedAt());
    }

    private String classSection(UserAccount student){return student.getCohort()==null||student.getDivision()==null?null:student.getCohort()+"-"+student.getDivision();}

    public record SubmitRequest(Long practicalId, CodeLanguage language, String code, String output, String executionStatus, String conclusionText) {}
    public record SubmissionView(Long id, Long studentId, Long practicalId, CodeLanguage language, String code, String output, String executionStatus, Instant submittedAt) {}
    public record SubmissionListItem(Long id, Long studentId, String studentName, String studentEmail, String rollNo, String classSection, Long practicalId, String practicalTitle, CodeLanguage language, String executionStatus, Instant submittedAt, boolean evaluated, Integer totalMarks) {}
    public record SubmissionDetail(SubmissionView submission, String studentName, String studentEmail, String rollNo, String classSection, String practicalTitle, String conclusionText, Long evaluationId, Integer codeMarks, Integer vivaMarks, Integer totalMarks, String feedback) {}
    public record StudentResult(Long submissionId, String practicalTitle, Integer marks, String feedback, Instant reviewedAt, String facultyName, Instant submittedAt) {}
}
