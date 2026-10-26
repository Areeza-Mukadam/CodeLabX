import sqlite3InitModule from "@sqlite.org/sqlite-wasm";

const OUTPUT_LIMIT = 32_000;
const MAX_ROWS = 500;

self.onmessage = async (event: MessageEvent<{ source: string }>) => {
  const started = performance.now();
  let db: {
    exec: (options: { sql: string; rowMode: "array"; columnNames: string[]; callback: (row: unknown) => false | void }) => unknown;
    close: () => void;
  } | undefined;
  try {
    if (event.data.source.length > 128_000) {
      self.postMessage({ fallback: true, message: "SQL source is too large for the browser runner; using the server runner." });
      return;
    }
    const sqlite3 = await sqlite3InitModule({ locateFile: () => `${self.location.origin}/sqlite3.wasm` });
    db = new sqlite3.oo1.DB(":memory:");
    const rows: unknown[][] = [];
    const columnNames: string[] = [];
    let truncated = false;
    db.exec({
      sql: event.data.source,
      rowMode: "array",
      columnNames,
      callback: (row: unknown) => {
        if (rows.length >= MAX_ROWS) {
          truncated = true;
          return false;
        }
        rows.push(Array.isArray(row) ? row : [row]);
        const textSize = rows.reduce((size, current) => size + current.join("\t").length, 0);
        if (textSize >= OUTPUT_LIMIT) {
          truncated = true;
          return false;
        }
      },
    });
    const lines = [
      ...(columnNames.length ? [columnNames.join("\t")] : []),
      ...rows.map((row) => row.map((value) => value == null ? "NULL" : String(value)).join("\t")),
    ];
    const stdout = lines.join("\n").slice(0, OUTPUT_LIMIT) || "Query executed successfully (no result rows).";
    self.postMessage({
      status: "SUCCESS",
      stdout: truncated ? `${stdout}\n… output limited` : stdout,
      stderr: "",
      compileError: "",
      runtimeError: "",
      executionTime: Math.round(performance.now() - started),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    self.postMessage({ status: "RUNTIME_ERROR", stdout: "", stderr: message, compileError: "", runtimeError: message, executionTime: Math.round(performance.now() - started) });
  } finally {
    db?.close();
  }
};
