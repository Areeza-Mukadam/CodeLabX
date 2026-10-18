# CodeLabX

CodeLabX is a college programming laboratory and practical assessment platform. It gives students a structured, step-by-step way to learn and submit programming practicals, while giving teachers tools to publish practicals and review student work.

## Phase 1 features

- Student, teacher, and administrator sign-in with role-based access.
- Assigned practicals with an enforced Aim → Theory → Algorithm → Practice → Code → Conclusion flow.
- Draft practical authoring, Java and Python starter code, practice questions, viva bank, student assignment, and publishing.
- Monaco coding environment with Java/Python selection, Run, submission, terminal output, and copy/cut/paste integrity event logging.
- Teacher submission review, manual code and viva marks, feedback, and integrity summaries.
- PostgreSQL-backed persistent storage for users, practicals, progress, submissions, and evaluations.

> Code execution is sent by the Spring Boot backend to the sandboxed Piston service. Docker Compose includes a local Piston instance for development; production can use another protected Piston endpoint through backend environment configuration.

## Architecture

The React frontend calls the Spring Boot REST API. Spring Boot authenticates users, enforces roles and practical progression, persists data through Spring Data JPA, and routes code runs through the replaceable `CodeExecutionService` interface. `ExternalApiCodeExecutionService` is the default Piston adapter; `Judge0CodeExecutionService` is an optional adapter. No student program is executed on the application server. A future Docker runner can implement the same interface without changing the student UI.

```text
React + Vite → Spring Boot REST API → PostgreSQL
                            └──────→ Piston sandbox (Java / Python)
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

The frontend only calls `POST /api/execution/run`; it never receives the Piston URL or credentials. The backend forwards Java and Python requests to the endpoint in `PISTON_API_URL`. `PISTON_AUTHORIZATION` is an optional complete HTTP `Authorization` header value for a protected proxy or Piston endpoint (for example, `Bearer …` or `Basic …`). Keep it only in the backend environment or an ignored local `.env` file. Do not put credentials in frontend variables, source files, logs, or responses.

### Start and verify local Piston

Prerequisites: Docker Desktop's Linux engine must be running, Node.js must be installed, and `cloudflared` must be available (on this laptop it is at `C:\Program Files (x86)\cloudflared\cloudflared.exe`). If `docker info` shows client details followed by a Server connection error, start Docker Desktop and retry. Docker Compose binds Piston's host port to `127.0.0.1` only. The internal container port, Piston image, persistent package volume, temporary execution storage, and runtime initialization service are retained. From the project root:

```powershell
docker compose up -d piston piston-init
docker compose logs piston-init
$runtimes = Invoke-RestMethod -Uri http://127.0.0.1:2000/api/v2/runtimes
$runtimes | Where-Object { $_.language -in @("java", "python") } | Format-Table language, version
```

Verify each runtime with a direct Piston request:

```powershell
$java = @'
{"language":"java","version":"15.0.2","files":[{"name":"Main.java","content":"public class Main { public static void main(String[] args) { System.out.println(\"java-ok\"); } }"}],"stdin":"","run_timeout":12000}
'@
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:2000/api/v2/execute -ContentType 'application/json' -Body $java

$python = @'
{"language":"python","version":"3.12.0","files":[{"name":"main.py","content":"print('python-ok')"}],"stdin":"","run_timeout":12000}
'@
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:2000/api/v2/execute -ContentType 'application/json' -Body $python
```

Compose defaults `PISTON_API_URL` to `http://piston:2000/api/v2/execute` for backend-to-Piston traffic inside its private Docker network. Compose accepts an override from the project `.env`; the Spring configuration also reads this environment variable directly. Changing it does not require frontend changes or a backend image rebuild. The local defaults `PISTON_JAVA_VERSION=15.0.2` and `PISTON_PYTHON_VERSION=3.12.0` match the installed Piston packages; change them only to versions present in `/api/v2/runtimes`. `PISTON_RUN_TIMEOUT=12000` configures Piston's maximum run timeout to match the backend's existing `CODE_EXECUTION_TIMEOUT_MS=12000`. `CODE_EXECUTION_PROVIDER=piston` selects this adapter; `mock` remains available for UI development.

### Securely tunnel laptop Piston to the hosted backend

Never tunnel Piston itself: its package installation and administrative endpoints must stay private. `scripts/piston-gateway.mjs` is a local-only gateway that listens on `127.0.0.1:2100`, accepts only authenticated `POST /api/v2/execute` requests for Java or Python, limits request/response bodies to 2 MiB, does not log request data, and forwards to `127.0.0.1:2000/api/v2/execute`. It rejects other paths/methods and does not forward the bearer credential to Piston. Cloudflare Quick Tunnel provides temporary HTTPS transport to this gateway; its random URL is not treated as authentication. Quick Tunnels are account-free but intended for development and their URL changes when restarted ([Cloudflare Quick Tunnel docs](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/)).

1. Create a high-entropy gateway token once. This writes it only to the ignored local file `.piston-gateway-secret` and prints nothing:

   ```powershell
   node -e "require('node:fs').writeFileSync('.piston-gateway-secret',require('node:crypto').randomBytes(32).toString('base64url')+'\n',{flag:'wx',mode:0o600})"
   ```

   Keep this file private and out of Git, logs, Vercel, and chat. Do not run the generation command again unless rotating the token.

2. Start local Piston and its runtime initialization, then run the gateway in a second PowerShell window:

   ```powershell
   docker compose up -d piston piston-init
   docker compose logs piston-init
   node scripts/piston-gateway.mjs
   ```

   If Compose reports an existing container-name conflict, inspect the container's Compose project and package-volume mount first. Do not remove containers or volumes to clear a conflict. The existing Piston host binding must show `127.0.0.1:2000`; never tunnel port 2000.

3. In a third PowerShell window, start the free Quick Tunnel to the gateway (not Piston):

   ```powershell
   & 'C:\Program Files (x86)\cloudflared\cloudflared.exe' tunnel --url http://127.0.0.1:2100 --no-autoupdate
   ```

   If `cloudflared` is not on `PATH`, this machine has it at `C:\Program Files (x86)\cloudflared\cloudflared.exe`. Copy the printed `https://….trycloudflare.com` URL privately. Keep all three services running and the laptop awake/online. The tunnel URL is temporary and changes after restart.

4. Verify the gateway locally before configuring Render. An authorized request succeeds; missing authorization must return HTTP 401 and `/api/v2/packages` must return 404:

   ```powershell
   $token = (Get-Content .piston-gateway-secret -Raw).Trim()
   $headers = @{ Authorization = "Bearer $token" }
   $body = '{"language":"python","version":"3.12.0","files":[{"name":"main.py","content":"print(\u0027gateway-ok\u0027)"}],"stdin":"","run_timeout":12000}'
   Invoke-RestMethod -Method Post -Uri http://127.0.0.1:2100/api/v2/execute -Headers $headers -ContentType 'application/json' -Body $body
   Invoke-WebRequest -Uri http://127.0.0.1:2100/api/v2/packages -SkipHttpErrorCheck | Select-Object StatusCode
   Remove-Variable token, headers, body
   ```

5. In the Render backend's environment settings, set `CODE_EXECUTION_PROVIDER=piston`, `PISTON_API_URL` to the actual tunnel URL plus `/api/v2/execute`, `PISTON_AUTHORIZATION` to `Bearer ` plus the contents of the local ignored secret file, `PISTON_JAVA_VERSION=15.0.2`, `PISTON_PYTHON_VERSION=3.12.0`, and `CODE_EXECUTION_TIMEOUT_MS=12000`. Enter the secret directly in Render's backend-only environment settings; never put it in Vercel or the repository. Changing Render environment settings restarts the backend; no frontend change or backend rebuild is required. Verify a Java and Python run through the live application.

On this laptop, a bounded test through the HTTPS tunnel ran tiny Python jobs at concurrency 1, 5, 10, 20, and 30. All 66 requests succeeded (100%); at concurrency 30, p50 was 493 ms, p95 619 ms, and max 626 ms. This measures a small Python program through the tunnel directly to Piston; it does not include Render or Java compilation and is not a guarantee for a class session. Keep execution output small and monitor the laptop during a real demonstration.

To stop safely, press `Ctrl+C` in the Cloudflare window and then the gateway window, and run `docker compose stop piston` from the project root. This stops the service without deleting containers or package volumes. `docker compose start piston` restarts the current Compose container; rerun `docker compose up -d piston piston-init` if its configuration changes.

To rotate the gateway token, stop the gateway and tunnel, overwrite `.piston-gateway-secret` with a new 32-byte random value using the command below, update Render's `PISTON_AUTHORIZATION` to `Bearer ` plus the new file contents, then restart the gateway and tunnel. The URL will also change when Quick Tunnel restarts.

```powershell
node -e "require('node:fs').writeFileSync('.piston-gateway-secret',require('node:crypto').randomBytes(32).toString('base64url')+'\n',{mode:0o600})"
```

If the tunnel restarts, update Render's `PISTON_API_URL` to the new HTTPS URL. If the secret may have leaked, stop the gateway and tunnel, replace the local secret, update Render's `PISTON_AUTHORIZATION`, then restart both local processes. This laptop-based setup is temporary, depends on power/network, and has not been established as reliable for 30 simultaneous students.

### Migrate to a college Piston server

When the college server is ready, configure the backend's `PISTON_API_URL` to its reachable HTTPS execution endpoint, normally ending in `/api/v2/execute`. If the college endpoint requires an `Authorization` header, configure its complete value in `PISTON_AUTHORIZATION` using Render's secret environment settings. If it has no endpoint-specific authorization, leave `PISTON_AUTHORIZATION` empty. Ensure the Render backend has a network route to that endpoint and that its TLS certificate is trusted. Update `PISTON_JAVA_VERSION` and `PISTON_PYTHON_VERSION` to versions installed on that server if they differ. Restart the Render service after changing environment settings. The request shape, Piston provider, Java/Python support, timeouts, and frontend remain unchanged.

### Execution environment variables

| Variable | Purpose |
| --- | --- |
| `CODE_EXECUTION_PROVIDER` | Selects `piston` (default) or the existing optional provider. |
| `PISTON_API_URL` | Full Piston execute endpoint URL; Compose defaults to its private `piston` service address. |
| `PISTON_AUTHORIZATION` | Optional complete backend-only `Authorization` header value for the protected endpoint. |
| `PISTON_JAVA_VERSION` | Java runtime version sent to Piston (default `15.0.2` in this checkout's local Compose setup). |
| `PISTON_PYTHON_VERSION` | Python runtime version sent to Piston (default `3.12.0` in this checkout's local Compose setup). |
| `PISTON_RUN_TIMEOUT` | Local Piston maximum allowed run time; set to `12000` to match the existing backend run timeout. |
| `CODE_EXECUTION_TIMEOUT_MS` | Existing per-run timeout passed to Piston (default `12000`). |

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
