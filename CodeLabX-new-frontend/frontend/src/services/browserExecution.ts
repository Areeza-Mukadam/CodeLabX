import type { BrowserRunResult } from "./browserExecution.types";
import { BrowserRuntimeUnavailable, OUTPUT_LIMIT } from "./browserExecution.types";

const truncate = (value: string) => value.slice(0, OUTPUT_LIMIT);

function workerRun<T>(
  worker: Worker,
  data: unknown,
  timeoutMs: number,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      worker.terminate();
      reject(new BrowserRuntimeUnavailable("Browser runtime exceeded its time limit; using the server runner."));
    }, timeoutMs);
    worker.onmessage = (event: MessageEvent<T & { fallback?: boolean; message?: string }>) => {
      window.clearTimeout(timeout);
      if (event.data?.fallback) reject(new BrowserRuntimeUnavailable(event.data.message));
      else resolve(event.data);
    };
    worker.onerror = (event) => {
      window.clearTimeout(timeout);
      reject(new BrowserRuntimeUnavailable(event.message || "Browser runtime failed to initialize."));
    };
    worker.postMessage(data);
  });
}

export async function runBrowserCode(
  language: string,
  source: string,
  stdin: string,
): Promise<BrowserRunResult> {
  if (language === "ASSEMBLY") {
    const worker = new Worker(new URL("./assembly8086Execution.worker.ts", import.meta.url), { type: "module" });
    try {
      const result = await workerRun<BrowserRunResult>(worker, { source, stdin }, 15_000);
      return { ...result, stderr: truncate(result.stderr), stdout: truncate(result.stdout), compileError: truncate(result.compileError), runtimeError: truncate(result.runtimeError) };
    } finally {
      worker.terminate();
    }
  }

  if (language === "SQL") {
    const worker = new Worker(new URL("./sqlExecution.worker.ts", import.meta.url), { type: "module" });
    try {
      const result = await workerRun<BrowserRunResult>(worker, { source }, 30_000);
      return { ...result, stderr: truncate(result.stderr), stdout: truncate(result.stdout), compileError: truncate(result.compileError), runtimeError: truncate(result.runtimeError) };
    } finally {
      worker.terminate();
    }
  }

  if (!window.crossOriginIsolated) {
    throw new BrowserRuntimeUnavailable("Browser isolation is unavailable; using the server runner.");
  }

  if (language === "PYTHON") {
    const worker = new Worker(new URL("./pythonExecution.worker.ts", import.meta.url), { type: "module" });
    try {
      const result = await workerRun<BrowserRunResult>(worker, { source, stdin }, 45_000);
      return { ...result, stderr: truncate(result.stderr), stdout: truncate(result.stdout), compileError: "", runtimeError: result.status === "RUNTIME_ERROR" ? result.stderr : "" };
    } finally {
      worker.terminate();
    }
  }

  if (language === "C" || language === "CPP" || language === "C++") {
    const worker = new Worker(new URL("./cppExecution.worker.ts", import.meta.url), { type: "module" });
    try {
      const result = await workerRun<BrowserRunResult>(worker, { language: language === "C" ? "c" : "cpp", source, stdin }, 150_000);
      return { ...result, stderr: truncate(result.stderr), stdout: truncate(result.stdout), compileError: truncate(result.compileError), runtimeError: truncate(result.runtimeError) };
    } finally {
      worker.terminate();
    }
  }

  if (language !== "JAVA") {
    throw new BrowserRuntimeUnavailable("This language is not supported by a browser runtime; using the server runner.");
  }

  if (/\b(?:System\s*\.\s*in|new\s+Scanner\s*\()/.test(source)) {
    throw new BrowserRuntimeUnavailable("Java standard input is not supported by the browser runtime; using the server runner.");
  }

  const worker = new Worker(new URL("./javaExecution.worker.ts", import.meta.url), { type: "module" });
  try {
    const result = await workerRun<BrowserRunResult>(worker, { source }, 90_000);
    return { ...result, stderr: truncate(result.stderr), stdout: truncate(result.stdout), compileError: truncate(result.compileError), runtimeError: truncate(result.runtimeError) };
  } finally {
    worker.terminate();
  }
}
