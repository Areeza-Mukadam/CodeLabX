package com.codelabx.progress;

import com.codelabx.common.ApiException;
import com.codelabx.practical.PracticeQuestion;
import com.codelabx.practical.PracticeQuestionRepository;
import com.codelabx.practical.Practical;
import com.codelabx.practical.PracticalService;
import com.codelabx.progress.dto.ProgressDtos.CompleteStepRequest;
import com.codelabx.progress.dto.ProgressDtos.ProgressView;
import com.codelabx.progress.dto.ProgressDtos.SaveDraftRequest;
import com.codelabx.user.UserAccount;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProgressService {

    private final StudentProgressRepository repository;
    private final PracticalService practicalService;
    private final PracticeQuestionRepository practiceQuestions;
    private final ObjectMapper objectMapper;

    public ProgressService(
            StudentProgressRepository repository,
            PracticalService practicalService,
            PracticeQuestionRepository practiceQuestions,
            ObjectMapper objectMapper
    ) {
        this.repository = repository;
        this.practicalService = practicalService;
        this.practiceQuestions = practiceQuestions;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public ProgressView getOrCreate(Long practicalId, UserAccount student) {
        Practical practical = practicalService.requireAssignedPublished(practicalId, student);
        StudentProgress progress = repository.findByStudentIdAndPracticalId(student.getId(), practicalId)
                .orElseGet(() -> {
                    StudentProgress created = new StudentProgress();
                    created.setStudent(student);
                    created.setPractical(practical);
                    created.setDraftCode(practical.getJavaStarterCode());
                    created.setDraftLanguage("JAVA");
                    return repository.save(created);
                });
        return toView(progress);
    }

    @Transactional
    public ProgressView saveDraft(Long practicalId, UserAccount student, SaveDraftRequest request) {
        StudentProgress progress = load(practicalId, student);
        if (request.draftCode() != null) {
            progress.setDraftCode(request.draftCode());
        }
        if (request.draftLanguage() != null) {
            progress.setDraftLanguage(request.draftLanguage());
        }
        if (request.conclusionText() != null) {
            progress.setConclusionText(request.conclusionText());
        }
        if (request.practiceAnswers() != null) {
            progress.setPracticeAnswersJson(writeJson(request.practiceAnswers()));
        }
        if (request.observationEntries() != null) {
            progress.setObservationEntriesJson(writeJson(request.observationEntries()));
        }
        return toView(repository.save(progress));
    }

    @Transactional
    public ProgressView completeStep(Long practicalId, UserAccount student, CompleteStepRequest request) {
        StudentProgress progress = load(practicalId, student);
        if (progress.getStatus() == ProgressStatus.SUBMITTED || progress.getStatus() == ProgressStatus.EVALUATED) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "This practical is already submitted.");
        }
        PracticalStep step = request.step() != null ? request.step() : progress.getCurrentStep();

        if (step == PracticalStep.PRACTICE && request.practiceAnswers() != null) {
            progress.setPracticeAnswersJson(writeJson(request.practiceAnswers()));
        }
        if (request.observationEntries() != null) {
            progress.setObservationEntriesJson(writeJson(request.observationEntries()));
        }
        if (step == PracticalStep.CONCLUSION && request.conclusionText() != null && !request.conclusionText().isBlank()) {
            progress.setConclusionText(request.conclusionText().trim());
        }
        if (step == PracticalStep.CODE && request.draftCode() != null) {
            progress.setDraftCode(request.draftCode());
            if (request.draftLanguage() != null) {
                progress.setDraftLanguage(request.draftLanguage());
            }
        }

        Set<PracticalStep> completed = parseCompleted(progress.getCompletedSteps());
        completed.add(step);
        progress.setCompletedSteps(completed.stream().sorted(Comparator.comparingInt(PracticalStep::ordinal))
                .map(Enum::name).collect(Collectors.joining(",")));
        progress.setStatus(ProgressStatus.IN_PROGRESS);
        if (step != PracticalStep.CONCLUSION) {
            PracticalStep next = step.next();
            if (step == PracticalStep.PRACTICE && Boolean.FALSE.equals(progress.getPractical().getCodeRequired())) {
                next = PracticalStep.CONCLUSION;
            }
            progress.setCurrentStep(next);
        }
        return toView(repository.save(progress));
    }

    public void assertStepUnlocked(UserAccount student, Long practicalId, PracticalStep required) {
        practicalService.requireAssignedPublished(practicalId, student);
    }

    public StudentProgress load(Long practicalId, UserAccount student) {
        Practical practical = practicalService.requireAssignedPublished(practicalId, student);
        return repository.findByStudentIdAndPracticalId(student.getId(), practicalId)
                .orElseGet(() -> {
                    StudentProgress created = new StudentProgress();
                    created.setStudent(student);
                    created.setPractical(practical);
                    created.setDraftCode(practical.getJavaStarterCode());
                    created.setDraftLanguage("JAVA");
                    created.setCurrentStep(PracticalStep.AIM);
                    return repository.save(created);
                });
    }

    public ProgressView toView(StudentProgress progress) {
        List<PracticalStep> completed = new ArrayList<>(parseCompleted(progress.getCompletedSteps()));
        if (Boolean.FALSE.equals(progress.getPractical().getCodeRequired())) {
            completed.remove(PracticalStep.CODE);
        }
        completed.sort(Comparator.comparingInt(PracticalStep::ordinal));
        int totalSteps = Boolean.FALSE.equals(progress.getPractical().getCodeRequired()) ? 5 : PracticalStep.values().length;
        int percent = (int) Math.round(completed.size() * 100.0 / totalSteps);
        if (progress.getStatus() == ProgressStatus.SUBMITTED || progress.getStatus() == ProgressStatus.EVALUATED) {
            percent = 100;
        }
        return new ProgressView(
                progress.getPractical().getId(),
                progress.getCurrentStep(),
                completed,
                progress.getStatus(),
                percent,
                readJson(progress.getPracticeAnswersJson()),
                readJson(progress.getObservationEntriesJson()),
                readColumns(progress.getPractical().getObservationColumnsJson()),
                progress.getPractical().getObservationRowCount() == null ? 5 : progress.getPractical().getObservationRowCount(),
                progress.getConclusionText(),
                progress.getDraftCode(),
                progress.getDraftLanguage(),
                progress.getUpdatedAt()
        );
    }

    private void validatePractice(Long practicalId, Map<String, String> answers) {
        List<PracticeQuestion> questions = practiceQuestions.findByPracticalIdOrderBySortOrderAsc(practicalId);
        if (questions.isEmpty()) {
            return;
        }
        for (PracticeQuestion question : questions) {
            String answer = answers.get(String.valueOf(question.getId()));
            if (answer == null || answer.isBlank()) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Answer every practice question before continuing.");
            }
        }
    }

    private Set<PracticalStep> parseCompleted(String raw) {
        Set<PracticalStep> steps = new HashSet<>();
        if (raw == null || raw.isBlank()) {
            return steps;
        }
        for (String part : raw.split(",")) {
            if (!part.isBlank()) {
                steps.add(PracticalStep.valueOf(part.trim()));
            }
        }
        return steps;
    }

    private String writeJson(Map<String, String> map) {
        try {
            return objectMapper.writeValueAsString(map);
        } catch (Exception ex) {
            return "{}";
        }
    }

    private Map<String, String> readJson(String json) {
        try {
            if (json == null || json.isBlank()) {
                return Map.of();
            }
            return objectMapper.readValue(json, new TypeReference<>() {});
        } catch (Exception ex) {
            return Map.of();
        }
    }

    private List<String> readColumns(String json) {
        try {
            if (json == null || json.isBlank()) return List.of();
            return objectMapper.readValue(json, new TypeReference<>() {});
        } catch (Exception ex) {
            return List.of();
        }
    }
}
