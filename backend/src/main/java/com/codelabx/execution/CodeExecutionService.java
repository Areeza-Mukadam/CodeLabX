package com.codelabx.execution;

/**
 * Replaceable code-execution contract.
 * Phase 1 uses an external sandboxed API. A Docker implementation may be added later
 * without changing POST /api/execution/run or the student editor.
 */
public interface CodeExecutionService {
    ExecutionResult execute(CodeLanguage language, String source);
}
