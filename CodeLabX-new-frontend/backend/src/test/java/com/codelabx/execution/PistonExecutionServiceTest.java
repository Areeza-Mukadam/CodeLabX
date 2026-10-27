package com.codelabx.execution;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.ObjectMapper;

import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.lang.reflect.Proxy;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Timeout;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.jsonPath;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class PistonExecutionServiceTest {
    private static final String EXECUTE_URL = "https://piston.example/api/v2/execute";
    private static final String SUCCESS_RESPONSE = "{\"run\":{\"stdout\":\"ok\\n\",\"stderr\":\"\",\"code\":0}}";

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    void forwardsJavaAndPythonRequestsToConfiguredUrlWithBackendAuthorization() {
        RestClient.Builder builder = RestClient.builder().baseUrl(EXECUTE_URL);
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        var service = service(builder.build(), "Bearer test-secret");

        server.expect(requestTo(EXECUTE_URL))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header(HttpHeaders.AUTHORIZATION, "Bearer test-secret"))
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.language").value("java"))
                .andExpect(jsonPath("$.version").value("15.0.2"))
                .andExpect(jsonPath("$.files[0].name").value("Main.java"))
                .andExpect(jsonPath("$.files[0].content").value("class Main {}"))
                .andExpect(jsonPath("$.stdin").value("java input"))
                .andExpect(jsonPath("$.run_timeout").value(12000))
                .andRespond(withSuccess(SUCCESS_RESPONSE, MediaType.APPLICATION_JSON));
        server.expect(requestTo(EXECUTE_URL))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header(HttpHeaders.AUTHORIZATION, "Bearer test-secret"))
                .andExpect(jsonPath("$.language").value("python"))
                .andExpect(jsonPath("$.version").value("3.12.0"))
                .andExpect(jsonPath("$.files[0].name").value("main.py"))
                .andExpect(jsonPath("$.stdin").value("python input"))
                .andRespond(withSuccess(SUCCESS_RESPONSE, MediaType.APPLICATION_JSON));

        assertEquals("SUCCESS", service.execute(CodeLanguage.JAVA, "class Main {}", "java input").status());
        assertEquals("SUCCESS", service.execute(CodeLanguage.PYTHON, "print(input())", "python input").status());
        server.verify();
    }

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    void forwardsSqliteAndNasm64RequestsToConfiguredRuntimes() {
        RestClient.Builder builder = RestClient.builder().baseUrl(EXECUTE_URL);
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        var service = service(builder.build(), "");

        server.expect(requestTo(EXECUTE_URL))
                .andExpect(jsonPath("$.language").value("sqlite3"))
                .andExpect(jsonPath("$.version").value("3.36.0"))
                .andExpect(jsonPath("$.files[0].name").value("main.sql"))
                .andExpect(jsonPath("$.files[0].content").value("SELECT 1;"))
                .andRespond(withSuccess(SUCCESS_RESPONSE, MediaType.APPLICATION_JSON));
        server.expect(requestTo(EXECUTE_URL))
                .andExpect(jsonPath("$.language").value("nasm64"))
                .andExpect(jsonPath("$.version").value("2.15.5"))
                .andExpect(jsonPath("$.files[0].name").value("main.asm"))
                .andExpect(jsonPath("$.files[0].content").value("section .text"))
                .andRespond(withSuccess(SUCCESS_RESPONSE, MediaType.APPLICATION_JSON));

        assertEquals("SUCCESS", service.execute(CodeLanguage.SQL, "SELECT 1;", "").status());
        assertEquals("SUCCESS", service.execute(CodeLanguage.ASSEMBLY, "section .text", "").status());
        server.verify();
    }

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    void usesThePublicJavaClassNameAsTheSourceFilename() {
        RestClient.Builder builder = RestClient.builder().baseUrl(EXECUTE_URL);
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        server.expect(requestTo(EXECUTE_URL))
                .andExpect(jsonPath("$.files[0].name").value("Solution.java"))
                .andRespond(withSuccess(SUCCESS_RESPONSE, MediaType.APPLICATION_JSON));

        assertEquals("SUCCESS", service(builder.build(), "").execute(
                CodeLanguage.JAVA, "public class Solution { public static void main(String[] args) {} }", "").status());
        server.verify();
    }

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    void mapsPistonsJavaCompilerErrorReturnedInRunStage() {
        RestClient.Builder builder = RestClient.builder().baseUrl(EXECUTE_URL);
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        String pistonResponse = """
                {"language":"java","version":"15.0.2","run":{"stdout":"","stderr":"Main.java:1: error: ';' expected\\nerror: compilation failed\\n","output":"Main.java:1: error: ';' expected\\nerror: compilation failed\\n","code":1,"signal":null,"status":"RE"}}
                """;
        server.expect(requestTo(EXECUTE_URL))
                .andRespond(withSuccess(pistonResponse, MediaType.APPLICATION_JSON));

        ExecutionResult result = service(builder.build(), "")
                .execute(CodeLanguage.JAVA, "public class Main {", "");

        assertEquals("COMPILATION_ERROR", result.status());
        assertTrue(result.compileError().contains("compilation failed"));
        server.verify();
    }

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    void authorizationFailureIsSanitizedAndDoesNotLeakResponseOrSecret() {
        RestClient.Builder builder = RestClient.builder().baseUrl(EXECUTE_URL);
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        server.expect(requestTo(EXECUTE_URL)).andRespond(withStatus(HttpStatus.FORBIDDEN)
                .body("private upstream body with secret-value"));

        ExecutionResult result = service(builder.build(), "Bearer secret-value")
                .execute(CodeLanguage.PYTHON, "print('x')", "");

        assertEquals("UNAVAILABLE", result.status());
        assertFalse(result.runtimeError().contains("secret-value"));
        assertFalse(result.runtimeError().contains("private upstream body"));
        server.verify();
    }

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    void connectionFailureReturnsGenericUnavailableResult() {
        RestClient.Builder builder = RestClient.builder().baseUrl(EXECUTE_URL);
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        server.expect(requestTo(EXECUTE_URL)).andRespond(request -> {
            throw new ResourceAccessException("connection failed for secret endpoint");
        });

        ExecutionResult result = service(builder.build(), "")
                .execute(CodeLanguage.JAVA, "class Main {}", "");

        assertEquals("UNAVAILABLE", result.status());
        assertTrue(result.runtimeError().contains("Cannot reach the configured code execution provider"));
        assertFalse(result.runtimeError().contains("secret endpoint"));
        server.verify();
    }

    private ExternalApiCodeExecutionService service(RestClient restClient, String authorization) {
        return new ExternalApiCodeExecutionService(
                EXECUTE_URL, "15.0.2", "3.12.0", "3.36.0", "2.15.5", 12000, authorization,
                new ObjectMapper(), languageRepository(), restClient);
    }

    private ProgrammingLanguageRepository languageRepository() {
        return (ProgrammingLanguageRepository) Proxy.newProxyInstance(
                ProgrammingLanguageRepository.class.getClassLoader(),
                new Class<?>[]{ProgrammingLanguageRepository.class},
                (proxy, method, args) -> method.getName().equals("findByCodeIgnoreCase")
                        ? Optional.empty() : null);
    }
}
