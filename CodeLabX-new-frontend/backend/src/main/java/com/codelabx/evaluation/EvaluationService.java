package com.codelabx.evaluation;

import com.codelabx.common.ApiException;
import com.codelabx.progress.ProgressStatus;
import com.codelabx.progress.StudentProgressRepository;
import com.codelabx.submission.Submission;
import com.codelabx.submission.SubmissionService;
import com.codelabx.user.UserAccount;
import com.codelabx.viva.VivaQuestion;
import com.codelabx.viva.VivaQuestionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class EvaluationService {

    private final EvaluationRepository evaluations;
    private final VivaMarkRepository vivaMarks;
    private final VivaQuestionRepository vivaQuestions;
    private final SubmissionService submissionService;
    private final StudentProgressRepository progress;

    public EvaluationService(
            EvaluationRepository evaluations,
            VivaMarkRepository vivaMarks,
            VivaQuestionRepository vivaQuestions,
            SubmissionService submissionService,
            StudentProgressRepository progress
    ) {
        this.evaluations = evaluations;
        this.vivaMarks = vivaMarks;
        this.vivaQuestions = vivaQuestions;
        this.submissionService = submissionService;
        this.progress = progress;
    }

    @Transactional
    public EvaluationView saveEvaluation(UserAccount teacher, EvaluationRequest request) {
        Submission submission = submissionService.require(request.submissionId());
        submissionService.assertFacultyOwns(submission.getId(), teacher);
        Evaluation evaluation = evaluations.findBySubmissionId(submission.getId()).orElseGet(() -> {
            Evaluation created = new Evaluation();
            created.setSubmission(submission);
            created.setTeacher(teacher);
            return created;
        });
        evaluation.setTeacher(teacher);
        evaluation.setCodeMarks(clamp(request.codeMarks(), 0, 10));
        if (request.feedback() != null) {
            evaluation.setFeedback(request.feedback());
        }
        recalc(evaluation);
        evaluations.save(evaluation);
        markProgress(submission);
        return toView(evaluation);
    }

    @Transactional
    public EvaluationView saveViva(UserAccount teacher, VivaBatchRequest request) {
        Submission submission = submissionService.require(request.submissionId());
        submissionService.assertFacultyOwns(submission.getId(), teacher);
        Evaluation evaluation = evaluations.findBySubmissionId(submission.getId()).orElseGet(() -> {
            Evaluation created = new Evaluation();
            created.setSubmission(submission);
            created.setTeacher(teacher);
            created.setCodeMarks(0);
            return created;
        });
        evaluation.setTeacher(teacher);
        evaluations.save(evaluation);
        if (request.entries() != null) {
            for (VivaEntry entry : request.entries()) {
                VivaQuestion question = vivaQuestions.findById(entry.vivaQuestionId())
                        .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Unknown viva question."));
                VivaMark mark = vivaMarks.findByEvaluationIdAndVivaQuestionId(evaluation.getId(), question.getId())
                        .orElseGet(VivaMark::new);
                mark.setEvaluation(evaluation);
                mark.setVivaQuestion(question);
                mark.setStudentAnswerNotes(entry.notes());
                int max = question.getMarks();
                mark.setAwardedMarks(clamp(entry.awardedMarks(), 0, max));
                vivaMarks.save(mark);
            }
        }
        int vivaTotal = vivaMarks.findByEvaluationId(evaluation.getId()).stream()
                .map(VivaMark::getAwardedMarks)
                .filter(v -> v != null)
                .mapToInt(Integer::intValue)
                .sum();
        evaluation.setVivaMarks(vivaTotal);
        recalc(evaluation);
        evaluations.save(evaluation);
        markProgress(submission);
        return toView(evaluation);
    }

    public EvaluationView getForSubmission(Long submissionId) {
        Evaluation evaluation = evaluations.findBySubmissionId(submissionId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Evaluation not started yet."));
        return toView(evaluation);
    }

    public void assertFacultyOwns(Long submissionId,UserAccount teacher){submissionService.assertFacultyOwns(submissionId,teacher);}

    private void recalc(Evaluation evaluation) {
        int code = evaluation.getCodeMarks() == null ? 0 : evaluation.getCodeMarks();
        int viva = evaluation.getVivaMarks() == null ? 0 : evaluation.getVivaMarks();
        evaluation.setTotalMarks(code + viva);
        evaluation.setEvaluatedAt(Instant.now());
    }

    private void markProgress(Submission submission) {
        progress.findByStudentIdAndPracticalId(submission.getStudent().getId(), submission.getPractical().getId())
                .ifPresent(p -> {
                    p.setStatus(ProgressStatus.EVALUATED);
                    progress.save(p);
                });
    }

    private EvaluationView toView(Evaluation evaluation) {
        List<VivaMarkView> marks = evaluation.getId() == null
                ? List.of()
                : vivaMarks.findByEvaluationId(evaluation.getId()).stream()
                .map(m -> new VivaMarkView(
                        m.getVivaQuestion().getId(),
                        m.getVivaQuestion().getQuestion(),
                        m.getVivaQuestion().getMarks(),
                        m.getAwardedMarks(),
                        m.getStudentAnswerNotes()
                )).toList();
        return new EvaluationView(
                evaluation.getId(),
                evaluation.getSubmission().getId(),
                evaluation.getCodeMarks(),
                evaluation.getVivaMarks(),
                evaluation.getTotalMarks(),
                evaluation.getFeedback(),
                evaluation.getEvaluatedAt(),
                marks
        );
    }

    private int clamp(Integer value, int min, int max) {
        if (value == null) {
            return min;
        }
        return Math.max(min, Math.min(max, value));
    }

    public record EvaluationRequest(Long submissionId, Integer codeMarks, String feedback) {}
    public record VivaEntry(Long vivaQuestionId, Integer awardedMarks, String notes) {}
    public record VivaBatchRequest(Long submissionId, List<VivaEntry> entries) {}
    public record VivaMarkView(Long vivaQuestionId, String question, int maxMarks, Integer awardedMarks, String notes) {}
    public record EvaluationView(Long id, Long submissionId, Integer codeMarks, Integer vivaMarks, Integer totalMarks, String feedback, Instant evaluatedAt, List<VivaMarkView> viva) {}
}
