package com.codelabx.submission;

import com.codelabx.user.Role;
import com.codelabx.user.UserAccount;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SubmissionController {

    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @PostMapping("/submissions")
    public SubmissionService.SubmissionView submit(
            @RequestBody SubmissionService.SubmitRequest request,
            @AuthenticationPrincipal UserAccount user
    ) {
        return submissionService.submit(user, request);
    }

    @GetMapping("/submissions")
    public List<SubmissionService.SubmissionView> mine(@AuthenticationPrincipal UserAccount user) {
        return submissionService.forStudent(user);
    }

    @GetMapping("/submissions/{id}")
    public SubmissionService.SubmissionDetail get(@PathVariable Long id, @AuthenticationPrincipal UserAccount user) {
        var detail = submissionService.detail(id);
        if (user.getRole() == Role.STUDENT && !detail.submission().studentId().equals(user.getId())) {
            throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.FORBIDDEN, "You cannot view this submission.");
        }
        return detail;
    }

    @GetMapping("/teacher/submissions")
    public List<SubmissionService.SubmissionListItem> teacherList(@AuthenticationPrincipal UserAccount user) {
        if (user.getRole() != Role.TEACHER) {
            throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.FORBIDDEN, "Teacher role required.");
        }
        return submissionService.forTeacher();
    }
}
