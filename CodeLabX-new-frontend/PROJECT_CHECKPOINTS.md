# CodeLabX — Checkpoint Log

The repository initially had no commits, and the application work was already present as uncommitted files when implementation began. This log records the completed scope and verification available in the current workspace. No historical checkpoint commits are claimed.

Phase 1 uses an external sandboxed code-execution API. Docker-based self-hosted execution is intentionally reserved for a future scaling phase.

| ID | Title | Status | Commit |
| --- | --- | --- | --- |
| CP-01 | Establish CodeLabX foundation | Complete | — |
| CP-02 | Add authentication and role-based access | Complete | — |
| CP-03 | Implement structured student practical flow | Complete | — |
| CP-04 | Add teacher practical management | Complete | — |
| CP-05 | Add Monaco coding environment and integrity controls | Complete | — |
| CP-06 | Integrate external Java and Python execution | Complete; provider configured, live API not exercised | — |
| CP-07 | Add submission and manual evaluation | Complete | — |
| CP-08 | Add viva assessment workflow | Complete | — |
| CP-09 | Finalize CodeLabX Phase 1 | Complete | — |

## Verification

- Frontend production build: `npm run build` — passed.
- Backend compile: `mvnw.cmd compile` — passed.
- Backend Spring context test: `mvnw.cmd test` — 1 test passed, 0 failures/errors.
- Demo seed runs during application startup against an empty practical table.

The Spring Boot context test starts the H2 application context and exercises schema creation and initialization. A live Piston or Judge0 request requires network/provider availability and was not exercised here.
