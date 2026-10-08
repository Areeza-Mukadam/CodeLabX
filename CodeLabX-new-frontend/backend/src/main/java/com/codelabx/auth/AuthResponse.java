package com.codelabx.auth;

import com.codelabx.user.UserDto;

public record AuthResponse(String token, UserDto user) {
}
