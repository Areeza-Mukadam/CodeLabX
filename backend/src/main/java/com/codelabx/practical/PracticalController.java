package com.codelabx.practical;

import com.codelabx.practical.dto.PracticalDtos.*;
import com.codelabx.user.UserAccount;
import com.codelabx.user.UserDto;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/practicals")
public class PracticalController {

    private final PracticalService practicalService;

    public PracticalController(PracticalService practicalService) {
        this.practicalService = practicalService;
    }

    @GetMapping
    public List<PracticalSummary> mine(@AuthenticationPrincipal UserAccount user) {
        if (user.getRole().name().equals("TEACHER")) {
            return practicalService.listForTeacher();
        }
        return practicalService.listAssignedToStudent(user);
    }

    @GetMapping("/{id}")
    public Object get(@PathVariable Long id, @AuthenticationPrincipal UserAccount user) {
        if (user.getRole().name().equals("TEACHER")) {
            return practicalService.teacherDetail(id);
        }
        return practicalService.studentDetail(id, user);
    }

    @PostMapping
    public PracticalTeacherDetail create(@Valid @RequestBody PracticalUpsertRequest request, @AuthenticationPrincipal UserAccount user) {
        requireTeacher(user);
        return practicalService.create(request, user);
    }

    @PutMapping("/{id}")
    public PracticalTeacherDetail update(@PathVariable Long id, @Valid @RequestBody PracticalUpsertRequest request, @AuthenticationPrincipal UserAccount user) {
        requireTeacher(user);
        return practicalService.update(id, request);
    }

    @PostMapping("/{id}/publish")
    public PracticalTeacherDetail publish(@PathVariable Long id, @AuthenticationPrincipal UserAccount user) {
        requireTeacher(user);
        return practicalService.publish(id);
    }

    @PostMapping("/{id}/assign")
    public void assign(@PathVariable Long id, @RequestBody AssignRequest request, @AuthenticationPrincipal UserAccount user) {
        requireTeacher(user);
        practicalService.assign(id, request.studentIds());
    }

    @GetMapping("/students")
    public List<UserDto> students(@AuthenticationPrincipal UserAccount user) {
        requireTeacher(user);
        return practicalService.students().stream().map(UserDto::from).toList();
    }

    private void requireTeacher(UserAccount user) {
        if (!"TEACHER".equals(user.getRole().name())) {
            throw new com.codelabx.common.ApiException(org.springframework.http.HttpStatus.FORBIDDEN, "Teacher role required.");
        }
    }
}
