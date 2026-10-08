package com.codelabx.progress.dto;

import com.codelabx.progress.PracticalStep;
import com.codelabx.progress.ProgressStatus;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public class ProgressDtos {
    public record ProgressView(
            Long practicalId,
            PracticalStep currentStep,
            List<PracticalStep> completedSteps,
            ProgressStatus status,
            int percent,
            Map<String, String> practiceAnswers,
            String conclusionText,
            String draftCode,
            String draftLanguage,
            Instant updatedAt
    ) {}

    public record CompleteStepRequest(
            PracticalStep step,
            Map<String, String> practiceAnswers,
            String conclusionText,
            String draftCode,
            String draftLanguage
    ) {}

    public record SaveDraftRequest(String draftCode, String draftLanguage, String conclusionText, Map<String, String> practiceAnswers) {}
}
