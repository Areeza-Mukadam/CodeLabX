# CodeLabX architecture (Phase 1)

```text
React (Vite)  →  Spring Boot  →  External sandboxed execution API
                                     ├── Java
                                     └── Python
```

Students never call the execution vendor from the browser. The only run endpoint is:

```text
POST /api/execution/run
```

`CodeExecutionService` is the replaceable backend contract:

```text
CodeExecutionService
        │
        ├── ExternalApiCodeExecutionService   (Phase 1)
        └── DockerCodeExecutionService        (future — not implemented)
```

## Persistence

JPA entities map to PostgreSQL, the default runtime database. Local development uses the PostgreSQL container in `compose.yaml` with a named data volume. H2 is limited to automated tests. Submitted code, output, student/practical links, timestamps, progress, and evaluations are stored in PostgreSQL; teachers retrieve submissions from `GET /api/teacher/submissions` and review them in the teacher dashboard.

## Auth

JWT bearer tokens after `POST /api/auth/login`. Roles: `STUDENT`, `TEACHER`. Progression and teacher APIs are enforced on the server, not only in React routes.
