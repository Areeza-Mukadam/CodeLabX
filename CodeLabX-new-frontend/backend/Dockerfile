# ==============================================================================
# CodeLabX Backend - Multi-Stage Dockerfile (Spring Boot 4 / Java 21)
# ==============================================================================

# --- Stage 1: Build JAR ---
FROM maven:3.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Cache dependencies layer
COPY pom.xml ./
RUN mvn dependency:go-offline -B || true

# Copy source code and resources
COPY src ./src

# Build production JAR (skip tests during container build for speed)
RUN mvn clean package -DskipTests -B

# --- Stage 2: Minimal Runtime Environment ---
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Add a dedicated non-root application user
RUN addgroup -S codelabx && adduser -S codelabx -G codelabx

# Install wget for Docker health check
RUN apk add --no-cache wget

# Copy the built artifact from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Ensure proper file permissions
RUN chown -R codelabx:codelabx /app

USER codelabx

EXPOSE 8080

# Health check against Spring Boot health endpoint
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=5 \
  CMD wget --spider -q http://localhost:8080/api/health || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
