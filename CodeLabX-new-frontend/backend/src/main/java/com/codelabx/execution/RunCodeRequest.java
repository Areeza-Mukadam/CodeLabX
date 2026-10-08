package com.codelabx.execution;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RunCodeRequest(
        Long practicalId,
        @NotNull CodeLanguage language,
        @NotBlank String source,
        @Size(max = 10000) String stdin
) {
}
