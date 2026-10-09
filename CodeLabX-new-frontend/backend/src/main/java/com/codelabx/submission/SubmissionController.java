package com.codelabx.submission;

import com.codelabx.user.Role;
import com.codelabx.user.UserAccount;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.codelabx.execution.ProgrammingLanguageRepository;
import com.codelabx.execution.ProgrammingLanguage;

@RestController
@RequestMapping("/api")
public class SubmissionController {

    private final SubmissionService submissionService;
    private final ProgrammingLanguageRepository languages;

    public SubmissionController(SubmissionService submissionService, ProgrammingLanguageRepository languages) {
        this.submissionService = submissionService;
        this.languages=languages;
    }

    @PostMapping("/submissions")
    public SubmissionService.SubmissionView submit(
            @RequestBody SubmissionService.SubmitRequest request,
            @AuthenticationPrincipal UserAccount user
    ) {
        if (user.getRole() != Role.STUDENT) throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.FORBIDDEN, "Student role required.");
        if (request.language() == null) throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.BAD_REQUEST, "Language is required.");
        boolean isEnabled = languages.findByCodeIgnoreCase(request.language().name())
                .map(ProgrammingLanguage::isEnabled)
                .orElse(true);
        if (!isEnabled) throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.BAD_REQUEST, "This programming language is disabled by the administrator.");
        return submissionService.submit(user, request);
    }

    @GetMapping("/submissions")
    public List<SubmissionService.SubmissionView> mine(@AuthenticationPrincipal UserAccount user) {
        if (user.getRole() != Role.STUDENT) throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.FORBIDDEN, "Student role required.");
        return submissionService.forStudent(user);
    }

    @GetMapping({"/results", "/submissions/results"})
    public List<SubmissionService.StudentResult> results(@AuthenticationPrincipal UserAccount user) {
        if (user.getRole() != Role.STUDENT) throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.FORBIDDEN, "Student role required.");
        return submissionService.resultsForStudent(user);
    }

    @GetMapping("/submissions/{id:[0-9]+}")
    public SubmissionService.SubmissionDetail get(@PathVariable Long id, @AuthenticationPrincipal UserAccount user) {
        var detail = submissionService.detail(id);
        if (user.getRole() == Role.STUDENT && !detail.submission().studentId().equals(user.getId())) {
            throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.FORBIDDEN, "You cannot view this submission.");
        }
        if (user.getRole() == Role.TEACHER) submissionService.assertFacultyOwns(id, user);
        if (user.getRole() == Role.ADMIN) throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.FORBIDDEN, "Administrator cannot access individual student submissions through this endpoint.");
        return detail;
    }

    @GetMapping("/teacher/submissions")
    public List<SubmissionService.SubmissionListItem> teacherList(@AuthenticationPrincipal UserAccount user) {
        if (user.getRole() != Role.TEACHER) {
            throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.FORBIDDEN, "Teacher role required.");
        }
        return submissionService.forTeacher(user);
    }
}
