package com.codelabx.evaluation;

import com.codelabx.integrity.IntegrityService;
import com.codelabx.progress.ProgressService;
import com.codelabx.progress.StudentProgress;
import com.codelabx.progress.StudentProgressRepository;
import com.codelabx.progress.dto.ProgressDtos.ProgressView;
import com.codelabx.submission.Submission;
import com.codelabx.submission.SubmissionService;
import com.codelabx.viva.VivaController.VivaView;
import com.codelabx.viva.VivaQuestionRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import com.codelabx.user.UserAccount;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;

@RestController
public class TeacherReviewController {

    private final SubmissionService submissionService;
    private final StudentProgressRepository progressRepository;
    private final ProgressService progressService;
    private final IntegrityService integrityService;
    private final VivaQuestionRepository vivaQuestions;
    private final EvaluationRepository evaluations;
    private final VivaMarkRepository vivaMarks;

    public TeacherReviewController(
            SubmissionService submissionService,
            StudentProgressRepository progressRepository,
            ProgressService progressService,
            IntegrityService integrityService,
            VivaQuestionRepository vivaQuestions,
            EvaluationRepository evaluations,
            VivaMarkRepository vivaMarks
    ) {
        this.submissionService = submissionService;
        this.progressRepository = progressRepository;
        this.progressService = progressService;
        this.integrityService = integrityService;
        this.vivaQuestions = vivaQuestions;
        this.evaluations = evaluations;
        this.vivaMarks = vivaMarks;
    }

    @GetMapping({"/api/teacher/review/{submissionId:[0-9]+}", "/teacher/review/{submissionId:[0-9]+}"})
    @Transactional(readOnly = true)
    public ReviewBundle review(@PathVariable Long submissionId, @AuthenticationPrincipal UserAccount teacher) {
        submissionService.assertFacultyOwns(submissionId, teacher);
        var detail = submissionService.detail(submissionId);
        Submission submission = submissionService.require(submissionId);
        StudentProgress progress = progressRepository
                .findByStudentIdAndPracticalId(submission.getStudent().getId(), submission.getPractical().getId())
                .orElse(null);
        ProgressView progressView = progress == null ? null : progressService.toView(progress);
        Map<String, Long> integrity = integrityService.summary(submission.getStudent().getId(), submission.getPractical().getId());
        List<VivaView> viva = vivaQuestions.findByPracticalIdOrderBySortOrderAsc(submission.getPractical().getId())
                .stream()
                .map(q -> new VivaView(q.getId(), q.getPractical().getId(), q.getQuestion(), q.getMarks(), q.getSortOrder()))
                .toList();
        EvaluationService.EvaluationView evaluation = evaluations.findBySubmissionId(submissionId)
                .map(ev -> new EvaluationService.EvaluationView(
                        ev.getId(),
                        submissionId,
                        ev.getCodeMarks(),
                        ev.getVivaMarks(),
                        ev.getTotalMarks(),
                        ev.getFeedback(),
                        ev.getEvaluatedAt(),
                        vivaMarks.findByEvaluationId(ev.getId()).stream()
                                .map(m -> new EvaluationService.VivaMarkView(
                                        m.getVivaQuestion().getId(),
                                        m.getVivaQuestion().getQuestion(),
                                        m.getVivaQuestion().getMarks(),
                                        m.getAwardedMarks(),
                                        m.getStudentAnswerNotes()
                                )).toList()
                ))
                .orElse(null);
        return new ReviewBundle(detail, progressView, integrity, viva, evaluation);
    }

    public record ReviewBundle(
            SubmissionService.SubmissionDetail submission,
            ProgressView progress,
            Map<String, Long> integrity,
            List<VivaView> vivaQuestions,
            EvaluationService.EvaluationView evaluation
    ) {}
}
