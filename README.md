# CodeLabX

CodeLabX is a college programming laboratory and practical assessment platform. It gives students a structured, step-by-step way to learn and submit programming practicals, while giving teachers tools to publish practicals and review student work.

## Phase 1 features

- Student and teacher sign-in with role-based access.
- Assigned practicals with an enforced Aim → Theory → Algorithm → Practice → Code → Conclusion flow.
- Draft practical authoring, Java and Python starter code, practice questions, viva bank, student assignment, and publishing.
- Monaco coding environment with Java/Python selection, Run, submission, terminal output, and copy/cut/paste integrity event logging.
- Teacher submission review, manual code and viva marks, feedback, and integrity summaries.
- PostgreSQL support and a local H2 profile for a quick demo.

> Phase 1 uses an external sandboxed code-execution API. Docker-based self-hosted execution is intentionally reserved for a future scaling phase.

## Architecture

The React frontend calls the Spring Boot REST API. Spring Boot authenticates users, enforces roles and practical progression, persists data through Spring Data JPA, and routes code runs through the replaceable `CodeExecutionService` interface. `ExternalApiCodeExecutionService` is the default Piston adapter; `Judge0CodeExecutionService` is an optional adapter. No student program is executed on the application server. A future Docker runner can implement the same interface without changing the student UI.

```text
React + Vite → Spring Boot REST API → PostgreSQL/H2
                            └──────→ external sandbox API (Java / Python)
```

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router, Zustand, Monaco Editor.
- Backend: Java 21, Spring Boot, Spring Web, Spring Security, Spring Data JPA, Bean Validation.
- Database: PostgreSQL for deployment; H2 PostgreSQL compatibility mode for local demo.

## Run locally

Requirements: Java 21, Node.js 20.19+ or 22.12+, npm, and (optionally) PostgreSQL.

1. Set the environment variables listed in `.env.example` (copy `VITE_API_URL` to `frontend/.env.local`) and set a unique `JWT_SECRET` (at least 32 characters).
2. Start the backend:

   ```powershell
   cd backend
   $env:MAVEN_USER_HOME = Join-Path $env:TEMP 'codelabx-m2'
   .\mvnw.cmd spring-boot:run
   ```

   The default `h2` profile creates a local database under `backend/data`. To use PostgreSQL, create the database and set `SPRING_PROFILES_ACTIVE=postgres`, `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_DB`, `POSTGRES_USER`, and `POSTGRES_PASSWORD`.

3. Start the frontend in a second terminal:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

4. Open the Vite URL (normally `http://localhost:5173`). The API defaults to `http://localhost:8080`; override it with `VITE_API_URL` in the frontend environment.

The initial database is populated with three published practicals, a teacher, and two students. Demo password for all accounts is `CodeLabX123!`:

| Role | Email |
| --- | --- |
| Teacher | `teacher@codelabx.dev` |
| Student | `student@codelabx.dev` |
| Student | `student2@codelabx.dev` |

Demo data is created only when there are no practical records. To reset the default H2 demo, stop the backend and remove `backend/data`.

## Execution configuration

The frontend only calls `POST /api/execution/run`. The backend defaults to Piston and supports Java and Python. Configure `CODE_EXECUTION_PROVIDER=piston` and optional `PISTON_API_URL`, `PISTON_JAVA_VERSION`, `PISTON_PYTHON_VERSION`, and `CODE_EXECUTION_TIMEOUT_MS`. To use the Judge0 adapter, set `CODE_EXECUTION_PROVIDER=judge0`, `JUDGE0_API_URL`, and the provider credentials if required. API keys stay in backend environment variables and are never sent to the browser. `mock` is available for UI development without a provider.

## API overview

- `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `GET/POST /api/practicals`, `GET/PUT /api/practicals/{id}`, publish and assign actions under `/api/practicals/{id}`
- `GET/POST/PUT /api/practicals/{id}/progress`
- `POST /api/execution/run`
- `POST /api/submissions`, `GET /api/submissions`, teacher list and review under `/api/teacher/**`
- `POST /api/evaluations`, `POST /api/evaluations/viva`
- `GET /api/viva/{practicalId}` and `POST /api/integrity/events`

## Checkpoints

The required checkpoint plan and current implementation notes live in [PROJECT_CHECKPOINTS.md](PROJECT_CHECKPOINTS.md). Each checkpoint is intended to be reviewed and committed as a stable state.

## Future Docker migration

Docker execution is out of Phase 1. When self-hosting is justified, implement `DockerCodeExecutionService` behind `CodeExecutionService`, define strict resource and network limits, and choose it through backend configuration. The REST contract and React editor remain unchanged. Student code must never be run through `ProcessBuilder` or `Runtime.exec` in the Spring Boot process.
