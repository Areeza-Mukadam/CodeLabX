package com.codelabx.auth;

import com.codelabx.common.ApiException;
import com.codelabx.user.Role;
import com.codelabx.user.UserAccount;
import com.codelabx.user.UserDto;
import com.codelabx.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository users, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse login(LoginRequest request) {
        String reqEmail = request.email() != null ? request.email().trim().toLowerCase() : "";
        if (!reqEmail.endsWith("@tcetmumbai.in")) {
            throw new BadCredentialsException("Only @tcetmumbai.in college email addresses are permitted.");
        }
        UserAccount user = users.findByEmailIgnoreCase(reqEmail)
                .or(() -> {
                    if ("inzamam@tcetmumbai.in".equalsIgnoreCase(reqEmail)) {
                        return users.findByEmailIgnoreCase("inzamam.khan.te.b@tcetmumbai.in");
                    } else if ("inzamam.khan.te.b@tcetmumbai.in".equalsIgnoreCase(reqEmail)) {
                        return users.findByEmailIgnoreCase("inzamam@tcetmumbai.in");
                    }
                    return java.util.Optional.empty();
                })
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }
        return new AuthResponse(jwtService.issueToken(user), UserDto.from(user));
    }

    public AuthResponse register(RegisterRequest request) {
        String email = request.email() != null ? request.email().trim().toLowerCase() : "";
        if (!email.endsWith("@tcetmumbai.in")) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Only @tcetmumbai.in college email addresses are permitted.");
        }
        if (users.findByEmailIgnoreCase(email).isPresent()) {
            throw new ApiException(HttpStatus.CONFLICT, "An account with this college email already exists.");
        }
        if (request.password() == null || request.password().trim().length() < 6) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Password must be at least 6 characters long.");
        }

        UserAccount user = new UserAccount();
        user.setName(request.name() != null && !request.name().isBlank() ? request.name().trim() : "Student");
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));
        Role role = "TEACHER".equalsIgnoreCase(request.role()) || "FACULTY".equalsIgnoreCase(request.role())
                ? Role.TEACHER
                : Role.STUDENT;
        user.setRole(role);
        user.setDepartment(request.department() != null && !request.department().isBlank()
                ? request.department().trim()
                : "Computer Engineering");

        String classSec = request.classSection() != null && !request.classSection().isBlank()
                ? request.classSection().trim()
                : "SE-B";
        user.setCohort(classSec.contains("-") ? classSec.split("-")[0] : "SE");
        user.setDivision(request.division() != null && !request.division().isBlank()
                ? request.division().trim()
                : (classSec.contains("-") ? classSec.split("-")[1] : "B"));
        user.setRollNo(request.rollNo() != null ? request.rollNo().trim() : "");

        user = users.save(user);
        return new AuthResponse(jwtService.issueToken(user), UserDto.from(user));
    }

    public record RegisterRequest(
            String name,
            String email,
            String password,
            String role,
            String department,
            String classSection,
            String division,
            String rollNo
    ) {}
}
