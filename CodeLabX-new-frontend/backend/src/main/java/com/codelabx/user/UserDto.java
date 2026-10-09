package com.codelabx.user;

import java.time.Instant;

public record UserDto(Long id, String name, String email, Role role, Instant createdAt, String classSection, String division, String cohort, String department, String rollNo) {
    public static UserDto from(UserAccount user) {
        String section = user.getCohort() == null || user.getDivision() == null ? null : user.getCohort() + "-" + user.getDivision();
        return new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getCreatedAt(), section, user.getDivision(), user.getCohort(), user.getDepartment(), user.getRollNo());
    }
}
