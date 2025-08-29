// Lightweight global progress event hooks to avoid coupling core to the CLI

type Recorder = (filePath: string) => void;

let recorder: Recorder | null = null;

export function setProgressRecorder(fn: Recorder | null): void {
  recorder = fn;
}

export function emitProgress(filePath: string): void {
  try {
    recorder?.(filePath);
  } catch {
    // Do not let UI progress errors break core image writes
  }
}


