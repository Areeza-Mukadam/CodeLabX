import { createBrowserEngine } from "@wasm-oj/browser";
import { browserSource as clangSource } from "@wasm-oj/toolchain-clang";

const OUTPUT_LIMIT = 32_000;
const SOURCE_LIMIT = 128_000;

self.onmessage = async (event: MessageEvent<{ language: "c" | "cpp"; source: string; stdin: string }>) => {
  const started = performance.now();
  let engine: Awaited<ReturnType<typeof createBrowserEngine>> | undefined;
  try {
    if (event.data.source.length > SOURCE_LIMIT || event.data.stdin.length > SOURCE_LIMIT) {
      self.postMessage({ fallback: true, message: "Source or input is too large for the browser runner; using the server runner." });
      return;
    }
    engine = await createBrowserEngine({
      toolchains: [clangSource("/toolchains/")],
      artifactCache: true,
    });
    const entry = event.data.language === "c" ? "main.c" : "main.cpp";
    const result = await engine.execute(
      {
        language: event.data.language,
        target: "wasip1",
        optimization: "debug",
        entry,
        files: { [entry]: event.data.source },
      },
      {
        stdin: event.data.stdin,
        resources: {
          instructionBudget: 100_000_000,
          logicalTimeLimitMs: 10_000,
          memoryLimitBytes: 64 * 1024 * 1024,
          outputLimitBytes: OUTPUT_LIMIT,
          filesystemWriteLimitBytes: 1024 * 1024,
          filesystemEntryLimit: 64,
          wallTimeLimitMs: 10_000,
        },
      },
    );
    const build = result.build;
    if (!build.success || !result.run) {
      const message = [build.stderr, ...build.diagnostics.map((diagnostic) => diagnostic.message)].filter(Boolean).join("\n");
      self.postMessage({ status: "COMPILE_ERROR", stdout: build.stdout, stderr: build.stderr, compileError: message, runtimeError: "", executionTime: Math.round(performance.now() - started) });
      return;
    }
    const run = result.run;
    self.postMessage({
      status: run.termination === "exited" && run.code === 0 ? "SUCCESS" : "RUNTIME_ERROR",
      stdout: run.stdout.slice(0, OUTPUT_LIMIT),
      stderr: run.stderr.slice(0, OUTPUT_LIMIT),
      compileError: "",
      runtimeError: run.termination === "exited" ? "" : `${run.termination}${run.trapMessage ? `: ${run.trapMessage}` : ""}`,
      executionTime: Math.round(run.executionDurationMs ?? performance.now() - started),
    });
  } catch (error) {
    self.postMessage({ fallback: true, message: error instanceof Error ? error.message : String(error) });
  } finally {
    engine?.dispose();
  }
};
