package com.codelabx.execution;

import org.junit.jupiter.api.Test;
import org.springframework.boot.env.YamlPropertySourceLoader;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.StandardEnvironment;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PistonUrlConfigurationTest {
    private static final String TEST_PISTON_URL = "https://piston-config.example/api/v2/execute";

    @Test
    void pistonEndpointComesFromPistonApiUrlEnvironmentProperty() throws IOException {
        var applicationProperties = new YamlPropertySourceLoader()
                .load("application", new ClassPathResource("application.yml")).get(0);
        var environment = new StandardEnvironment();
        environment.getPropertySources().addFirst(new MapPropertySource(
                "test-environment", Map.of("PISTON_API_URL", TEST_PISTON_URL)));

        String configuredValue = (String) applicationProperties
                .getProperty("codelabx.execution.piston.url");

        assertEquals(TEST_PISTON_URL, environment.resolveRequiredPlaceholders(configuredValue));
    }
}
