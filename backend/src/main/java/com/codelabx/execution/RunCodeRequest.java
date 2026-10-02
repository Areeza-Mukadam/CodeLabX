package com.codelabx.execution;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RunCodeRequest(
        Long practicalId,
        @NotNull CodeLanguage language,
        @NotBlank String source
) {
}
