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

JPA entities map to PostgreSQL. A local `h2` profile uses file-backed H2 in PostgreSQL mode for machines without a database server.

## Auth

JWT bearer tokens after `POST /api/auth/login`. Roles: `STUDENT`, `TEACHER`. Progression and teacher APIs are enforced on the server, not only in React routes.
