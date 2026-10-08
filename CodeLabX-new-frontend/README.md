# CodeLabX

CodeLabX is a college programming laboratory and practical assessment platform. It gives students a structured, step-by-step way to learn and submit programming practicals, while giving teachers tools to publish practicals and review student work.

## Phase 1 features

- Student, teacher, and administrator sign-in with role-based access.
- Assigned practicals with an enforced Aim → Theory → Algorithm → Practice → Code → Conclusion flow.
- Draft practical authoring, Java and Python starter code, practice questions, viva bank, student assignment, and publishing.
- Monaco coding environment with Java/Python selection, Run, submission, terminal output, and copy/cut/paste integrity event logging.
- Teacher submission review, manual code and viva marks, feedback, and integrity summaries.
- PostgreSQL-backed persistent storage for users, practicals, progress, submissions, and evaluations.

> Phase 1 uses an external sandboxed code-execution API. Docker-based self-hosted execution is intentionally reserved for a future scaling phase.

## Architecture

The React frontend calls the Spring Boot REST API. Spring Boot authenticates users, enforces roles and practical progression, persists data through Spring Data JPA, and routes code runs through the replaceable `CodeExecutionService` interface. `ExternalApiCodeExecutionService` is the default Piston adapter; `Judge0CodeExecutionService` is an optional adapter. No student program is executed on the application server. A future Docker runner can implement the same interface without changing the student UI.

```text
React + Vite → Spring Boot REST API → PostgreSQL
                            └──────→ external sandbox API (Java / Python)
```

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router, Zustand, Monaco Editor.
- Backend: Java 21, Spring Boot, Spring Web, Spring Security, Spring Data JPA, Bean Validation.
- Database: PostgreSQL for local development and deployment. H2 is only used by automated tests.

## Frontend file map

The React app is split by responsibility under `frontend/src/`:

- `App.tsx` — routes and page composition.
- `pages/` — login, dashboards, practical lab, practical builder, and submission screens.
- `components/` — shared app shell, branding, route guards, and loading/empty/error UI.
- `styles/pages/` — page-specific stylesheets for login, dashboards, lab, authoring, review, and app shell.
- `styles/components.css` — shared component styles; `styles/theme.css` — design tokens.
- `services/api.ts` — authenticated HTTP requests to Spring Boot.
- `state/authStore.ts` — shared Zustand authentication state.
- `hooks/useLoad.ts` — reusable API loading state.
- `types/` and `utils/` — shared API types and display formatting.
- `index.css` — global browser defaults and font loading.

Run `npm run format` from `frontend/` to format the page, component, style, service, hook, type, and utility modules.

## Run locally

Requirements: Java 21, Node.js 20.19+ or 22.12+, npm, and Docker Desktop (for the local PostgreSQL container).

1. Start PostgreSQL from the project root:

   ```powershell
   docker compose up -d postgres
   ```

   The database is stored in a named Docker volume and remains available after the container stops. For local development, the default database password is `codelabx-local`; change it through `POSTGRES_PASSWORD` before exposing the database beyond your machine.

2. Start the backend with the `postgres` profile (also the default):

   ```powershell
   cd backend
   $env:SPRING_PROFILES_ACTIVE = 'postgres'
   .\mvnw.cmd spring-boot:run
   ```

3. Start the frontend in a second terminal:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

4. Open the Vite URL (normally `http://localhost:5173`). The API defaults to `http://localhost:8080`; override it with `VITE_API_URL` in the frontend environment.

The initial database is populated with published practicals, a teacher, two students, and a separate administrator account. Demo password for all accounts is `CodeLabX123!`:

| Role | Email |
| --- | --- |
| Teacher | `teacher@tcetmumbai.in` |
| Student | `student@tcetmumbai.in` |
| Student | `student2@tcetmumbai.in` |
| Admin | `admin@tcetmumbai.in` |

Demo data is inserted into PostgreSQL on first startup. Student submissions are saved in PostgreSQL and appear on the teacher's **Submission review** page (`/teacher/submissions`), which reads from `GET /api/teacher/submissions`. Stopping or restarting the app does not delete the database volume. To intentionally erase local database data, run `docker compose down -v` from the project root.

Put Semester 3 Data Structures practical PDFs in [docs/seed-materials/semester-3/data-structures](docs/seed-materials/semester-3/data-structures); its README lists the recommended file naming pattern.

## Execution configuration

The frontend only calls `POST /api/execution/run`. The backend uses the local Piston sandbox defined in `compose.yaml` and supports Java and Python. Start it with `docker compose up -d piston`, then install the runtimes once:

```powershell
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:2000/api/v2/packages -ContentType 'application/json' -Body '{"language":"java","version":"17.x"}'
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:2000/api/v2/packages -ContentType 'application/json' -Body '{"language":"python","version":"3.x"}'
```

The backend defaults to `http://127.0.0.1:2000/api/v2/execute`. Set `CODE_EXECUTION_PROVIDER=piston`, `PISTON_API_URL`, optional `PISTON_AUTHORIZATION`, `PISTON_JAVA_VERSION`, `PISTON_PYTHON_VERSION`, and `CODE_EXECUTION_TIMEOUT_MS` to override it. The public Piston API now requires authorization, so the local sandbox is used by default. The editor includes a program-input box and sends it as standard input. API credentials stay in backend environment variables and are never sent to the browser. `mock` is available for UI development without a provider.

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

Student source code runs inside the isolated Piston service, not in the Spring Boot process. Keep the Piston port bound to localhost; do not expose it directly to the public internet.
