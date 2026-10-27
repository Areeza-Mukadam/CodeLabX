import { TraceJVMCompiler, TraceJVMEngine } from "@tracecode/tracejvm";

self.onmessage = async (event: MessageEvent<{ source: string }>) => {
  const base = `${self.location.origin}/tracejvm/`;
  const compiler = new TraceJVMCompiler({
    assets: { baseUrl: `${base}compiler/` },
    platformArchiveUrl: `${base}profiles/core/jdk23.jar`,
    platformClasspath: [{ path: "tracekernel-api.jar", url: `${base}profiles/core/tracekernel-api.jar` }],
  });
  try {
    await compiler.initialize();
    const source = event.data.source;
    const className = source.match(/\bpublic\s+(?:(?:final|abstract)\s+)?class\s+([A-Za-z_$][\w$]*)/)?.[1]
      ?? source.match(/\bclass\s+([A-Za-z_$][\w$]*)/)?.[1]
      ?? "Solution";
    const packageName = source.match(/^\s*package\s+([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*;/m)?.[1];
    const compiled = await compiler.compile({ sources: [{ path: `${packageName ? `${packageName.replaceAll('.', '/')}/` : ''}${className}.java`, content: source }] });
    if (compiled.status === "compile-error" || !compiled.program) {
      self.postMessage({ status: "COMPILE_ERROR", stdout: compiled.stdout, stderr: compiled.stderr, compileError: compiled.stderr || compiled.diagnostics.map((item) => item.message).join("\n"), runtimeError: "", executionTime: compiled.timings.totalMs });
      return;
    }
    const engine = new TraceJVMEngine({ assets: { runtimeProfileBaseUrls: { core: `${base}profiles/core` }, wasmUrl: `${base}bjvm_main.wasm` }, heapBytes: 64 * 1024 * 1024 });
    try {
      await engine.initialize();
      const result = await engine.run({ program: compiled.program, mainClass: packageName ? `${packageName}.${className}` : className });
      self.postMessage({ status: result.status === "completed" && result.exitCode === 0 ? "SUCCESS" : "RUNTIME_ERROR", stdout: result.stdout, stderr: result.stderr, compileError: "", runtimeError: result.status === "runtime-error" ? result.stderr : "", executionTime: Math.round(result.timings.totalMs) });
    } finally { engine.dispose(); }
  } catch (error) {
    self.postMessage({ fallback: true, message: error instanceof Error ? error.message : String(error) });
  } finally { compiler.dispose(); }
};
