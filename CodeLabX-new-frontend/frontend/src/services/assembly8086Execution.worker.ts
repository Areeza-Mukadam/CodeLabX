import "../vendor/8086/assembler.js";
import "../vendor/8086/emulator.js";

type AssemblerApi = {
  assemble(source: string): { bytes: Uint8Array; origin: number; errors: Array<{ line: number; message: string }>; ok: boolean };
};
type EmulatorApi = {
  CPU8086: new () => { load(bytes: Uint8Array, origin: number): void; intHook: ((cpu: any, interrupt: number) => unknown) | null; step(): void; exited: boolean; halted: boolean; waiting: boolean; instrCount: number; exitCode: number };
  createDOS(output: (text: string) => void): { hook: (cpu: any, interrupt: number) => unknown; pushInput(value: string): void };
};

self.onmessage = (event: MessageEvent<{ source: string; stdin: string }>) => {
  const started = performance.now();
  const source = event.data.source;
  if (source.length > 128_000) {
    self.postMessage({ fallback: true, message: "Assembly source is too large for the browser runner; using the server runner." });
    return;
  }

  try {
    const assembler = (globalThis as typeof globalThis & { Assembler8086: AssemblerApi }).Assembler8086;
    const emulator = (globalThis as typeof globalThis & { Emu8086: EmulatorApi }).Emu8086;
    const assembled = assembler.assemble(source);
    if (!assembled.ok) {
      const compileError = assembled.errors.map((error) => `Line ${error.line}: ${error.message}`).join("\n");
      self.postMessage({ status: "COMPILE_ERROR", stdout: "", stderr: compileError, compileError, runtimeError: "", executionTime: Math.round(performance.now() - started) });
      return;
    }

    let stdout = "";
    const cpu = new emulator.CPU8086();
    const dos = emulator.createDOS((text) => {
      if (stdout.length < 32_000) stdout += text.slice(0, 32_000 - stdout.length);
    });
    cpu.load(assembled.bytes, assembled.origin);
    cpu.intHook = dos.hook;
    if (event.data.stdin) dos.pushInput(`${event.data.stdin}${/[\r\n]$/.test(event.data.stdin) ? "" : "\r"}`);

    const maxInstructions = 500_000;
    while (!cpu.exited && !cpu.halted && !cpu.waiting && cpu.instrCount < maxInstructions) cpu.step();
    const limited = cpu.instrCount >= maxInstructions && !cpu.exited && !cpu.halted && !cpu.waiting;
    const runtimeError = limited
      ? `Execution stopped after ${maxInstructions.toLocaleString()} instructions.`
      : cpu.waiting ? "Program is waiting for input. Enter a value in the input box and run it again." : "";
    self.postMessage({
      status: runtimeError ? "RUNTIME_ERROR" : "SUCCESS",
      stdout,
      stderr: runtimeError,
      compileError: "",
      runtimeError,
      executionTime: Math.round(performance.now() - started),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    self.postMessage({ status: "RUNTIME_ERROR", stdout: "", stderr: message, compileError: "", runtimeError: message, executionTime: Math.round(performance.now() - started) });
  }
};
