export type BrowserRunResult = {
  status: string;
  stdout: string;
  stderr: string;
  compileError: string;
  runtimeError: string;
  executionTime: number;
};

export class BrowserRuntimeUnavailable extends Error {}

export const OUTPUT_LIMIT = 32_000;
