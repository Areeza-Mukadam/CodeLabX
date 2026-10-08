package com.codelabx.viva;

import com.codelabx.user.Role;
import com.codelabx.user.UserAccount;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class VivaController {

    private final VivaQuestionRepository vivaQuestions;

    public VivaController(VivaQuestionRepository vivaQuestions) {
        this.vivaQuestions = vivaQuestions;
    }

    @GetMapping("/api/viva/{practicalId}")
    public List<VivaView> list(@PathVariable Long practicalId, @AuthenticationPrincipal UserAccount user) {
        if (user.getRole() != Role.TEACHER) {
            throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.FORBIDDEN, "Teacher role required.");
        }
        return vivaQuestions.findByPracticalIdOrderBySortOrderAsc(practicalId).stream()
                .map(q -> new VivaView(q.getId(), q.getPractical().getId(), q.getQuestion(), q.getMarks(), q.getSortOrder()))
                .toList();
    }

    public record VivaView(Long id, Long practicalId, String question, int marks, int order) {}
}
