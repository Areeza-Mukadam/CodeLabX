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

    public List<SubmissionView> forStudent(UserAccount student) {
        return submissions.findByStudentIdOrderBySubmittedAtDesc(student.getId()).stream().map(this::toView).toList();
    }

    public List<SubmissionListItem> forTeacher() {
        return submissions.findAllByOrderBySubmittedAtDesc().stream().map(s -> {
            var evaluation = evaluations.findBySubmissionId(s.getId()).orElse(null);
            return new SubmissionListItem(
                    s.getId(),
                    s.getStudent().getId(),
                    s.getStudent().getName(),
                    s.getStudent().getEmail(),
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

    public SubmissionDetail detail(Long id) {
        Submission s = submissions.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Submission not found."));
        Evaluation evaluation = evaluations.findBySubmissionId(id).orElse(null);
        return new SubmissionDetail(
                toView(s),
                s.getStudent().getName(),
                s.getStudent().getEmail(),
                s.getPractical().getTitle(),
                s.getConclusionText(),
                evaluation == null ? null : evaluation.getId(),
                evaluation == null ? null : evaluation.getCodeMarks(),
                evaluation == null ? null : evaluation.getVivaMarks(),
                evaluation == null ? null : evaluation.getTotalMarks(),
                evaluation == null ? null : evaluation.getFeedback()
        );
    }

    public Submission require(Long id) {
        return submissions.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Submission not found."));
    }

    private SubmissionView toView(Submission s) {
        return new SubmissionView(s.getId(), s.getStudent().getId(), s.getPractical().getId(), s.getLanguage(),
                s.getCode(), s.getOutput(), s.getExecutionStatus(), s.getSubmittedAt());
    }

    public record SubmitRequest(Long practicalId, CodeLanguage language, String code, String output, String executionStatus, String conclusionText) {}
    public record SubmissionView(Long id, Long studentId, Long practicalId, CodeLanguage language, String code, String output, String executionStatus, Instant submittedAt) {}
    public record SubmissionListItem(Long id, Long studentId, String studentName, String studentEmail, Long practicalId, String practicalTitle, CodeLanguage language, String executionStatus, Instant submittedAt, boolean evaluated, Integer totalMarks) {}
    public record SubmissionDetail(SubmissionView submission, String studentName, String studentEmail, String practicalTitle, String conclusionText, Long evaluationId, Integer codeMarks, Integer vivaMarks, Integer totalMarks, String feedback) {}
}
