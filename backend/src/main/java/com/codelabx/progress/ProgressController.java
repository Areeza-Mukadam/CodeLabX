package com.codelabx.progress;

import com.codelabx.progress.dto.ProgressDtos.CompleteStepRequest;
import com.codelabx.progress.dto.ProgressDtos.ProgressView;
import com.codelabx.progress.dto.ProgressDtos.SaveDraftRequest;
import com.codelabx.user.UserAccount;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/practicals/{practicalId}/progress")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping
    public ProgressView get(@PathVariable Long practicalId, @AuthenticationPrincipal UserAccount user) {
        return progressService.getOrCreate(practicalId, user);
    }

    @PostMapping
    public ProgressView complete(@PathVariable Long practicalId, @Valid @RequestBody CompleteStepRequest request, @AuthenticationPrincipal UserAccount user) {
        return progressService.completeStep(practicalId, user, request);
    }

    @PutMapping
    public ProgressView draft(@PathVariable Long practicalId, @RequestBody SaveDraftRequest request, @AuthenticationPrincipal UserAccount user) {
        return progressService.saveDraft(practicalId, user, request);
    }
}
