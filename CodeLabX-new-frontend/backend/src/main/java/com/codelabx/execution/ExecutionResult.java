package com.codelabx.execution;

public record ExecutionResult(
        String status,
        String stdout,
        String stderr,
        String compileError,
        String runtimeError,
        Long executionTime
) {
    public static ExecutionResult malformed(String message) {
        return new ExecutionResult("MALFORMED_REQUEST", "", "", message, "", null);
    }

    public static ExecutionResult unavailable(String message) {
        return new ExecutionResult("UNAVAILABLE", "", "", "", message, null);
    }

    public static ExecutionResult apiFailure(String message) {
        return new ExecutionResult("API_FAILURE", "", "", "", message, null);
    }
}
