package com.codelabx.integrity;

import com.codelabx.user.Role;
import com.codelabx.user.UserAccount;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/integrity")
public class IntegrityController {

    private final IntegrityService integrityService;

    public IntegrityController(IntegrityService integrityService) {
        this.integrityService = integrityService;
    }

    @PostMapping("/events")
    public IntegrityService.IntegrityEventDto log(
            @RequestBody IntegrityService.LogRequest request,
            @AuthenticationPrincipal UserAccount user
    ) {
        return integrityService.log(user, request.practicalId(), request.eventType(), request.metadata());
    }

    @GetMapping("/events")
    public List<IntegrityService.IntegrityEventDto> list(
            @RequestParam Long studentId,
            @RequestParam Long practicalId,
            @AuthenticationPrincipal UserAccount user
    ) {
        if (user.getRole() == Role.STUDENT && !user.getId().equals(studentId)) {
            throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.FORBIDDEN, "Cannot view other students' integrity events.");
        }
        return integrityService.forStudentPractical(studentId, practicalId);
    }

    @GetMapping("/summary")
    public Map<String, Long> summary(@RequestParam Long studentId, @RequestParam Long practicalId, @AuthenticationPrincipal UserAccount user) {
        if (user.getRole() == Role.STUDENT && !user.getId().equals(studentId)) {
            throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.FORBIDDEN, "Cannot view other students' integrity events.");
        }
        return integrityService.summary(studentId, practicalId);
    }
}
