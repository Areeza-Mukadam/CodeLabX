package com.codelabx.user;

import java.time.Instant;

public record UserDto(Long id, String name, String email, Role role, Instant createdAt) {
    public static UserDto from(UserAccount user) {
        return new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getCreatedAt());
    }
}
