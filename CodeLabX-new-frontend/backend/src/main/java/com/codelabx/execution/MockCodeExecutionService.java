package com.codelabx.execution;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "codelabx.execution.provider", havingValue = "mock")
public class MockCodeExecutionService implements CodeExecutionService {
    @Override
    public ExecutionResult execute(CodeLanguage language, String source, String stdin) {
        if (source == null || source.isBlank()) {
            return ExecutionResult.malformed("Source code is required.");
        }
        if (source.contains("COMPILE_FAIL")) {
            return new ExecutionResult("COMPILATION_ERROR", "", "error: ';' expected", "Main.java:1: error: ';' expected", "", 12L);
        }
        if (source.contains("RUNTIME_FAIL")) {
            return new ExecutionResult("RUNTIME_ERROR", "", "Exception in thread \"main\" java.lang.RuntimeException", "", "Exception in thread \"main\" java.lang.RuntimeException", 18L);
        }
        String stdout = language == CodeLanguage.PYTHON ? "Mock Python execution complete.\n" : "Mock Java execution complete.\n";
        return new ExecutionResult("SUCCESS", stdout, "", "", "", 24L);
    }
}
