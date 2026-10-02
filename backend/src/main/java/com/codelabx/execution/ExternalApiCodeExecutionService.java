package com.codelabx.execution;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
@ConditionalOnProperty(name = "codelabx.execution.provider", havingValue = "piston", matchIfMissing = true)
public class ExternalApiCodeExecutionService implements CodeExecutionService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String javaVersion;
    private final String pythonVersion;
    private final int timeoutMs;
    private final String authorization;

    public ExternalApiCodeExecutionService(
            @Value("${codelabx.execution.piston.url}") String pistonUrl,
            @Value("${codelabx.execution.piston.java-version}") String javaVersion,
            @Value("${codelabx.execution.piston.python-version}") String pythonVersion,
            @Value("${codelabx.execution.timeout-ms}") int timeoutMs,
            @Value("${codelabx.execution.piston.authorization:}") String authorization,
            ObjectMapper objectMapper
    ) {
        this.javaVersion = javaVersion;
        this.pythonVersion = pythonVersion;
        this.timeoutMs = timeoutMs;
        this.authorization = authorization;
        this.objectMapper = objectMapper;
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(8));
        factory.setReadTimeout(Duration.ofMillis(Math.max(timeoutMs, 1000) + 3000));
        this.restClient = RestClient.builder()
                .baseUrl(pistonUrl)
                .requestFactory(factory)
                .build();
    }

    @Override
    public ExecutionResult execute(CodeLanguage language, String source, String stdin) {
        if (source == null || source.isBlank()) {
            return ExecutionResult.malformed("Source code is required.");
        }
        String lang;
        String version;
        String fileName;
        if (language == CodeLanguage.JAVA) {
            lang = "java";
            version = javaVersion;
            fileName = "Main.java";
        } else if (language == CodeLanguage.PYTHON) {
            lang = "python";
            version = pythonVersion;
            fileName = "main.py";
        } else {
            return ExecutionResult.malformed("Unsupported language.");
        }

        Map<String, Object> payload = Map.of(
                "language", lang,
                "version", version,
                "files", List.of(Map.of("name", fileName, "content", source)),
                "stdin", stdin == null ? "" : stdin,
                "run_timeout", timeoutMs
        );

        long started = System.currentTimeMillis();
        try {
            String body = restClient.post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .headers(headers -> {
                        if (authorization != null && !authorization.isBlank()) {
                            headers.set(HttpHeaders.AUTHORIZATION, authorization);
                        }
                    })
                    .body(payload)
                    .retrieve()
                    .body(String.class);
            long elapsed = System.currentTimeMillis() - started;
            return mapPiston(body, elapsed);
        } catch (RestClientResponseException ex) {
            int status = ex.getStatusCode().value();
            if (status == 401 || status == 403) {
                return ExecutionResult.unavailable("The Piston execution provider requires authorization. Configure a Piston token or a local Piston service.");
            }
            return ExecutionResult.unavailable("The Piston execution provider returned HTTP " + status + ". Please check its configuration.");
        } catch (RestClientException ex) {
            return ExecutionResult.unavailable("Cannot reach the configured code execution provider. Check that it is running and try again.");
        } catch (Exception ex) {
            return ExecutionResult.apiFailure("Code execution service unavailable. Please try again.");
        }
    }

    private ExecutionResult mapPiston(String body, long elapsed) {
        try {
            JsonNode root = objectMapper.readTree(body);
            JsonNode compile = root.path("compile");
            JsonNode run = root.path("run");

            if (!compile.isMissingNode() && !compile.isNull()) {
                int compileCode = compile.path("code").asInt(0);
                String compileErr = text(compile, "stderr");
                if (compileCode != 0 && compileErr != null && !compileErr.isBlank()) {
                    return new ExecutionResult("COMPILATION_ERROR", text(run, "stdout"), compileErr, compileErr, "", elapsed);
                }
            }

            String stdout = text(run, "stdout");
            String stderr = text(run, "stderr");
            String signal = run.path("signal").asText("");
            int code = run.path("code").asInt(0);

            if ("SIGKILL".equals(signal) || "timeout".equalsIgnoreCase(signal)) {
                return new ExecutionResult("TIMEOUT", stdout, stderr, "", "Execution timed out.", elapsed);
            }
            if (code != 0) {
                String runtime = stderr == null || stderr.isBlank() ? text(run, "output") : stderr;
                return new ExecutionResult("RUNTIME_ERROR", stdout, stderr, "", runtime, elapsed);
            }
            return new ExecutionResult("SUCCESS", stdout, stderr, "", "", elapsed);
        } catch (Exception ex) {
            return ExecutionResult.apiFailure("Malformed response from execution service.");
        }
    }

    private String text(JsonNode node, String field) {
        if (node == null || node.isMissingNode()) {
            return "";
        }
        JsonNode value = node.path(field);
        return value.isMissingNode() || value.isNull() ? "" : value.asText("");
    }
}
