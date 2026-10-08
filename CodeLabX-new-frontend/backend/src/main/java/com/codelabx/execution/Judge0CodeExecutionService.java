package com.codelabx.execution;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;
import java.util.Map;

@Service
@ConditionalOnProperty(name = "codelabx.execution.provider", havingValue = "judge0")
public class Judge0CodeExecutionService implements CodeExecutionService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public Judge0CodeExecutionService(
            @Value("${codelabx.execution.judge0.url}") String url,
            @Value("${codelabx.execution.judge0.api-key:}") String apiKey,
            @Value("${codelabx.execution.judge0.api-host:}") String apiHost,
            @Value("${codelabx.execution.timeout-ms}") int timeoutMs,
            ObjectMapper objectMapper
    ) {
        this.objectMapper = objectMapper;
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(8));
        factory.setReadTimeout(Duration.ofMillis(timeoutMs + 5000));
        RestClient.Builder builder = RestClient.builder().baseUrl(url).requestFactory(factory);
        this.restClient = builder.build();
        this.apiKey = apiKey;
        this.apiHost = apiHost;
    }

    private final String apiKey;
    private final String apiHost;

    @Override
    public ExecutionResult execute(CodeLanguage language, String source, String stdin) {
        if (source == null || source.isBlank()) {
            return ExecutionResult.malformed("Source code is required.");
        }
        if (apiKey == null || apiKey.isBlank()) {
            return ExecutionResult.unavailable("Judge0 is not configured on the server.");
        }
        int languageId = language == CodeLanguage.JAVA ? 62 : 71;
        String encoded = Base64.getEncoder().encodeToString(source.getBytes(StandardCharsets.UTF_8));
        Map<String, Object> payload = Map.of(
                "language_id", languageId,
                "source_code", encoded,
                "stdin", Base64.getEncoder().encodeToString((stdin == null ? "" : stdin).getBytes(StandardCharsets.UTF_8)),
                "base64_encoded", true
        );
        long started = System.currentTimeMillis();
        try {
            String body = restClient.post()
                    .uri(uri -> uri.queryParam("base64_encoded", "true").queryParam("wait", "true").build())
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("X-RapidAPI-Key", apiKey)
                    .header("X-RapidAPI-Host", apiHost == null ? "" : apiHost)
                    .body(payload)
                    .retrieve()
                    .body(String.class);
            long elapsed = System.currentTimeMillis() - started;
            return mapJudge0(body, elapsed);
        } catch (RestClientException ex) {
            return ExecutionResult.unavailable("Code execution service unavailable. Please try again.");
        }
    }

    private ExecutionResult mapJudge0(String body, long elapsed) {
        try {
            JsonNode root = objectMapper.readTree(body);
            int statusId = root.path("status").path("id").asInt(0);
            String stdout = decode(root.path("stdout").asText(""));
            String stderr = decode(root.path("stderr").asText(""));
            String compile = decode(root.path("compile_output").asText(""));
            if (statusId == 6) {
                return new ExecutionResult("COMPILATION_ERROR", stdout, compile, compile, "", elapsed);
            }
            if (statusId == 5) {
                return new ExecutionResult("TIMEOUT", stdout, stderr, "", "Execution timed out.", elapsed);
            }
            if (statusId != 3) {
                return new ExecutionResult("RUNTIME_ERROR", stdout, stderr, "", stderr, elapsed);
            }
            return new ExecutionResult("SUCCESS", stdout, stderr, "", "", elapsed);
        } catch (Exception ex) {
            return ExecutionResult.apiFailure("Malformed response from execution service.");
        }
    }

    private String decode(String value) {
        if (value == null || value.isBlank()) {
            return "";
        }
        try {
            return new String(Base64.getDecoder().decode(value), StandardCharsets.UTF_8);
        } catch (IllegalArgumentException ex) {
            return value;
        }
    }
}
