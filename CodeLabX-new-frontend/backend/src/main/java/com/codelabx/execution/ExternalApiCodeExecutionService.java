package com.codelabx.execution;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@ConditionalOnProperty(name = "codelabx.execution.provider", havingValue = "piston", matchIfMissing = true)
public class ExternalApiCodeExecutionService implements CodeExecutionService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String javaVersion;
    private final String pythonVersion;
    private final String sqlVersion;
    private final String assemblyVersion;
    private final int timeoutMs;
    private final String authorization;
    private final ProgrammingLanguageRepository languages;
    private final MockCodeExecutionService fallbackService;

    @Autowired
    public ExternalApiCodeExecutionService(
            @Value("${codelabx.execution.piston.url}") String pistonUrl,
            @Value("${codelabx.execution.piston.java-version}") String javaVersion,
            @Value("${codelabx.execution.piston.python-version}") String pythonVersion,
            @Value("${codelabx.execution.piston.sql-version}") String sqlVersion,
            @Value("${codelabx.execution.piston.assembly-version}") String assemblyVersion,
            @Value("${codelabx.execution.timeout-ms}") int timeoutMs,
            @Value("${codelabx.execution.piston.authorization:}") String authorization,
            ObjectMapper objectMapper,
            ProgrammingLanguageRepository languages,
            MockCodeExecutionService fallbackService
    ) {
        this(pistonUrl, javaVersion, pythonVersion, sqlVersion, assemblyVersion, timeoutMs, authorization, objectMapper, languages,
                fallbackService, createRestClient(pistonUrl, timeoutMs));
    }

    ExternalApiCodeExecutionService(
            String pistonUrl,
            String javaVersion,
            String pythonVersion,
            String sqlVersion,
            String assemblyVersion,
            int timeoutMs,
            String authorization,
            ObjectMapper objectMapper,
            ProgrammingLanguageRepository languages,
            RestClient restClient
    ) {
        this(pistonUrl, javaVersion, pythonVersion, sqlVersion, assemblyVersion, timeoutMs, authorization, objectMapper, languages,
                new MockCodeExecutionService(), restClient);
    }

    ExternalApiCodeExecutionService(
            String pistonUrl,
            String javaVersion,
            String pythonVersion,
            String sqlVersion,
            String assemblyVersion,
            int timeoutMs,
            String authorization,
            ObjectMapper objectMapper,
            ProgrammingLanguageRepository languages,
            MockCodeExecutionService fallbackService,
            RestClient restClient
    ) {
        this.javaVersion = javaVersion;
        this.pythonVersion = pythonVersion;
        this.sqlVersion = sqlVersion;
        this.assemblyVersion = assemblyVersion;
        this.timeoutMs = timeoutMs;
        this.authorization = authorization;
        this.languages = languages;
        this.objectMapper = objectMapper;
        this.fallbackService = fallbackService;
        this.restClient = restClient;
    }

    private static RestClient createRestClient(String pistonUrl, int timeoutMs) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(2));
        factory.setReadTimeout(Duration.ofMillis(Math.min(timeoutMs, 6000)));
        return RestClient.builder()
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
        String code = language.name();
        String configuredVersion = switch (language) {
            case JAVA -> javaVersion;
            case PYTHON -> pythonVersion;
            case SQL -> sqlVersion;
            case ASSEMBLY -> assemblyVersion;
        };
        lang = switch (language) {
            case JAVA -> "java";
            case PYTHON -> "python";
            case SQL -> "sqlite3";
            case ASSEMBLY -> "nasm64";
        };
        version = languages.findByCodeIgnoreCase(code).filter(ProgrammingLanguage::isEnabled)
                .map(ProgrammingLanguage::getRuntimeVersion).orElse(configuredVersion);
        fileName = switch (language) {
            case JAVA -> javaSourceFile(source);
            case PYTHON -> "main.py";
            case SQL -> "main.sql";
            case ASSEMBLY -> "main.asm";
        };

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
            return mapPiston(body, elapsed, language);
        } catch (RestClientResponseException ex) {
            return fallbackService.execute(language, source, stdin);
        } catch (RestClientException ex) {
            return fallbackService.execute(language, source, stdin);
        } catch (Exception ex) {
            return fallbackService.execute(language, source, stdin);
        }
    }

    private ExecutionResult mapPiston(String body, long elapsed, CodeLanguage language) {
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
            String status = run.path("status").asText("");

            String javaCompilerOutput = stderr == null || stderr.isBlank() ? text(run, "output") : stderr;
            if (language == CodeLanguage.JAVA && code != 0
                    && javaCompilerOutput.contains("compilation failed")
                    && javaCompilerOutput.matches("(?s).*\\b\\d+: error:.*")) {
                return new ExecutionResult("COMPILATION_ERROR", stdout, javaCompilerOutput,
                        javaCompilerOutput, "", elapsed);
            }

            if ("SIGKILL".equals(signal) || "timeout".equalsIgnoreCase(signal) || "TO".equals(status)) {
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

    private String javaSourceFile(String source) {
        Matcher matcher = Pattern.compile("\\bpublic\\s+(?:final\\s+)?class\\s+([A-Za-z_$][\\w$]*)")
                .matcher(source);
        return matcher.find() ? matcher.group(1) + ".java" : "Main.java";
    }

    private String text(JsonNode node, String field) {
        if (node == null || node.isMissingNode()) {
            return "";
        }
        JsonNode value = node.path(field);
        return value.isMissingNode() || value.isNull() ? "" : value.asText("");
    }
}
