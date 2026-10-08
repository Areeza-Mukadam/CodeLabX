package com.codelabx.practical.dto;

import com.codelabx.practical.Practical;
import com.codelabx.practical.PracticalStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import java.time.Instant;
import java.util.List;

public class PracticalDtos {

    public record PracticeQuestionInput(Long id, @NotBlank String question, String expectedAnswer, int order) {}

    public record VivaQuestionInput(Long id, @NotBlank String question, int marks, int order) {}

    public record PracticalUpsertRequest(
            @NotBlank String title,
            @NotBlank String subject,
            @Min(1) @Max(8) Integer semester,
            String description,
            String aim,
            String theory,
            String algorithm,
            String codeInstructions,
            String conclusion,
            String javaStarterCode,
            String pythonStarterCode,
            List<PracticeQuestionInput> practiceQuestions,
            List<VivaQuestionInput> vivaQuestions
    ) {}

    public record AssignRequest(List<Long> studentIds) {}

    public record PracticeQuestionView(Long id, String question, int order) {}

    public record PracticeQuestionTeacherView(Long id, String question, String expectedAnswer, int order) {}

    public record VivaQuestionView(Long id, String question, int marks, int order) {}

    public record PracticalSummary(
            Long id,
            String title,
            String subject,
            Integer semester,
            String description,
            String status,
            Instant updatedAt,
            int assignedCount,
            int completedCount,
            int progressPercent,
            String progressStatus
    ) {}

    public record PracticalDetail(
            Long id,
            String title,
            String subject,
            Integer semester,
            String description,
            String aim,
            String theory,
            String algorithm,
            String codeInstructions,
            String conclusion,
            String javaStarterCode,
            String pythonStarterCode,
            PracticalStatus status,
            Instant createdAt,
            Instant updatedAt,
            List<PracticeQuestionView> practiceQuestions,
            List<VivaQuestionView> vivaQuestions
    ) {}

    public record PracticalTeacherDetail(
            Long id,
            String title,
            String subject,
            Integer semester,
            String description,
            String aim,
            String theory,
            String algorithm,
            String codeInstructions,
            String conclusion,
            String javaStarterCode,
            String pythonStarterCode,
            PracticalStatus status,
            Instant createdAt,
            Instant updatedAt,
            List<PracticeQuestionTeacherView> practiceQuestions,
            List<VivaQuestionView> vivaQuestions,
            List<Long> assignedStudentIds
    ) {}

    public static PracticalSummary toSummary(Practical p, int assigned, int completed) {
        return new PracticalSummary(p.getId(), p.getTitle(), p.getSubject(), p.getSemester(), p.getDescription(), p.getStatus().name(), p.getUpdatedAt(), assigned, completed, 0, "");
    }
}
