const outputLimit = 32_000;

self.onmessage = async (event: MessageEvent<{ source: string; stdin: string }>) => {
  const started = performance.now();
  try {
    const moduleUrl = `${self.location.origin}/pyodide/pyodide.mjs`;
    const { loadPyodide } = await import(/* @vite-ignore */ moduleUrl) as typeof import("pyodide");
    const pyodide = await loadPyodide({ indexURL: `${self.location.origin}/pyodide/` });
    pyodide.globals.set("__student_source", event.data.source);
    pyodide.globals.set("__student_stdin", event.data.stdin);
    const script = `import io, sys, traceback\nclass __LimitedOutput:\n def __init__(self): self.parts=[]; self.size=0\n def write(self, value):\n  piece=value[:max(0, ${outputLimit}-self.size)]; self.parts.append(piece); self.size+=len(piece); return len(value)\n def flush(self): pass\n def getvalue(self): return ''.join(self.parts)\n__out=__LimitedOutput(); __err=__LimitedOutput()\nsys.stdin=io.StringIO(__student_stdin)\nsys.stdout=__out; sys.stderr=__err\ntry:\n exec(compile(__student_source, '<student>', 'exec'), {'__name__':'__main__'})\n __status='SUCCESS'\nexcept SyntaxError:\n traceback.print_exc(file=__err); __status='COMPILE_ERROR'\nexcept BaseException:\n traceback.print_exc(file=__err); __status='RUNTIME_ERROR'\n(__status, __out.getvalue(), __err.getvalue())`;
    const [status, stdout, stderr] = pyodide.runPython(script).toJs();
    self.postMessage({ status, stdout, stderr, executionTime: Math.round(performance.now() - started) });
  } catch (error) {
    self.postMessage({ fallback: true, message: error instanceof Error ? error.message : String(error) });
  }
};
