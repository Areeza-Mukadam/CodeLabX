package com.codelabx.execution;

import com.codelabx.progress.PracticalStep;
import com.codelabx.progress.ProgressService;
import com.codelabx.user.Role;
import com.codelabx.user.UserAccount;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/execution")
public class ExecutionController {

    private final CodeExecutionService codeExecutionService;
    private final ProgressService progressService;
    private final ProgrammingLanguageRepository languages;

    public ExecutionController(CodeExecutionService codeExecutionService, ProgressService progressService, ProgrammingLanguageRepository languages) {
        this.codeExecutionService = codeExecutionService;
        this.progressService = progressService;
        this.languages = languages;
    }

    @PostMapping("/run")
    public ExecutionResult run(@Valid @RequestBody RunCodeRequest request, @AuthenticationPrincipal UserAccount user) {
        if (user.getRole() != Role.STUDENT) {
            throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.FORBIDDEN, "Student role required.");
        }
        if (languages.findByCodeIgnoreCase(request.language().name()).filter(ProgrammingLanguage::isEnabled).isEmpty()) throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.BAD_REQUEST,"This programming language is disabled by the administrator.");
        if (request.practicalId() == null) return ExecutionResult.malformed("practicalId is required.");
        progressService.assertStepUnlocked(user, request.practicalId(), PracticalStep.CODE);
        return codeExecutionService.execute(request.language(), request.source(), request.stdin());
    }
}
