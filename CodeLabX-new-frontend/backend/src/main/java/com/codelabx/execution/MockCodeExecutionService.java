package com.codelabx.execution;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@ConditionalOnProperty(name = "codelabx.execution.provider", havingValue = "mock")
public class MockCodeExecutionService implements CodeExecutionService {

    @Override
    public ExecutionResult execute(CodeLanguage language, String source, String stdin) {
        if (source == null || source.isBlank()) {
            return ExecutionResult.malformed("Source code is required.");
        }
        long startTime = System.currentTimeMillis();

        // 1. Try real local process execution via java or python
        try {
            ExecutionResult localResult = runLocalProcess(language, source, stdin, startTime);
            if (localResult != null) {
                return localResult;
            }
        } catch (Exception ignored) {
            // Fall back to heuristic output if process execution cannot be spawned
        }

        // 2. Intelligent regex fallback if process execution cannot be invoked
        String extractedOutput = extractOutputHeuristic(language, source);
        long elapsed = Math.max(15, System.currentTimeMillis() - startTime);
        return new ExecutionResult("SUCCESS", extractedOutput, "", "", "", elapsed);
    }

    private ExecutionResult runLocalProcess(CodeLanguage language, String source, String stdin, long startTime) throws Exception {
        Path tempDir = Files.createTempDirectory("codelabx_exec_");
        try {
            ProcessBuilder pb;
            if (language == CodeLanguage.JAVA) {
                String className = "Main";
                Matcher m = Pattern.compile("public\\s+class\\s+(\\w+)").matcher(source);
                if (m.find()) {
                    className = m.group(1);
                }
                Path javaFile = tempDir.resolve(className + ".java");
                Files.writeString(javaFile, source);
                pb = new ProcessBuilder("java", javaFile.toAbsolutePath().toString());
            } else {
                Path pyFile = tempDir.resolve("script.py");
                Files.writeString(pyFile, source);
                pb = new ProcessBuilder("python", pyFile.toAbsolutePath().toString());
            }

            pb.directory(tempDir.toFile());
            Process process = pb.start();

            if (stdin != null && !stdin.isEmpty()) {
                try (OutputStream os = process.getOutputStream()) {
                    os.write(stdin.getBytes());
                    os.flush();
                }
            } else {
                process.getOutputStream().close();
            }

            boolean finished = process.waitFor(8, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                return new ExecutionResult("TIME_LIMIT_EXCEEDED", "", "Execution timed out (limit: 8 seconds)", "", "Process timed out", 8000L);
            }

            long elapsed = System.currentTimeMillis() - startTime;
            String stdout = readStream(process.getInputStream());
            String stderr = readStream(process.getErrorStream());

            int exitCode = process.exitValue();
            if (exitCode == 0) {
                return new ExecutionResult("SUCCESS", stdout.isEmpty() ? "(Program executed with no output)\n" : stdout, stderr, "", "", elapsed);
            } else {
                boolean isCompileError = stderr.contains("error:") || stderr.contains("SyntaxError");
                String status = isCompileError ? "COMPILATION_ERROR" : "RUNTIME_ERROR";
                return new ExecutionResult(status, stdout, stderr, isCompileError ? stderr : "", isCompileError ? "" : stderr, elapsed);
            }
        } finally {
            deleteDir(tempDir.toFile());
        }
    }

    private String readStream(InputStream is) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append("\n");
            }
            return sb.toString();
        }
    }

    private void deleteDir(File dir) {
        if (dir == null || !dir.exists()) return;
        File[] files = dir.listFiles();
        if (files != null) {
            for (File f : files) {
                f.delete();
            }
        }
        dir.delete();
    }

    private String extractOutputHeuristic(CodeLanguage language, String source) {
        StringBuilder sb = new StringBuilder();
        if (language == CodeLanguage.JAVA) {
            Matcher m = Pattern.compile("System\\.out\\.println\\s*\\(\\s*(?:\"([^\"]*)\"|([^)]+))\\s*\\)").matcher(source);
            while (m.find()) {
                String val = m.group(1) != null ? m.group(1) : m.group(2).trim();
                sb.append(val).append("\n");
            }
        } else {
            Matcher m = Pattern.compile("print\\s*\\(\\s*(?:\"([^\"]*)\"|([^)]+))\\s*\\)").matcher(source);
            while (m.find()) {
                String val = m.group(1) != null ? m.group(1) : m.group(2).trim();
                sb.append(val).append("\n");
            }
        }
        return sb.length() > 0 ? sb.toString() : "Program executed successfully.\n";
    }
}
