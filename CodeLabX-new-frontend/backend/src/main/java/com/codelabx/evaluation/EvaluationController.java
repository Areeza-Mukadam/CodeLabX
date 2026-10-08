package com.codelabx.evaluation;

import com.codelabx.user.UserAccount;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/evaluations")
public class EvaluationController {

    private final EvaluationService evaluationService;

    public EvaluationController(EvaluationService evaluationService) {
        this.evaluationService = evaluationService;
    }

    @PostMapping
    public EvaluationService.EvaluationView save(
            @RequestBody EvaluationService.EvaluationRequest request,
            @AuthenticationPrincipal UserAccount teacher
    ) {
        return evaluationService.saveEvaluation(teacher, request);
    }

    @PostMapping("/viva")
    public EvaluationService.EvaluationView viva(
            @RequestBody EvaluationService.VivaBatchRequest request,
            @AuthenticationPrincipal UserAccount teacher
    ) {
        return evaluationService.saveViva(teacher, request);
    }

    @GetMapping("/by-submission/{submissionId}")
    public EvaluationService.EvaluationView get(@PathVariable Long submissionId) {
        return evaluationService.getForSubmission(submissionId);
    }
}
