package com.codelabx.evaluation;

import com.codelabx.user.UserAccount;
import com.codelabx.user.Role;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/evaluations", "/evaluations"})
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
        if (request == null || request.submissionId() == null) {
            throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.BAD_REQUEST, "submissionId is required.");
        }
        return evaluationService.saveEvaluation(teacher, request);
    }

    @PostMapping("/viva")
    public EvaluationService.EvaluationView viva(
            @RequestBody EvaluationService.VivaBatchRequest request,
            @AuthenticationPrincipal UserAccount teacher
    ) {
        if (request == null || request.submissionId() == null) {
            throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.BAD_REQUEST, "submissionId is required.");
        }
        return evaluationService.saveViva(teacher, request);
    }

    @GetMapping("/by-submission/{submissionId}")
    public EvaluationService.EvaluationView get(@PathVariable Long submissionId, @AuthenticationPrincipal UserAccount user) {
        if (user.getRole() != Role.TEACHER) throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.FORBIDDEN, "Faculty access required.");
        submissionServiceAccess(submissionId,user);
        return evaluationService.getForSubmission(submissionId);
    }

    private void submissionServiceAccess(Long submissionId,UserAccount teacher){
        // The service performs this ownership check before exposing marks or feedback.
        evaluationService.assertFacultyOwns(submissionId,teacher);
    }
}
