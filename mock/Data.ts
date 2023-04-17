declare global {
  interface Data {
    readonly blob: Blob;

    constructor(blob: Blob): Data;
  }
}

// deno-lint-ignore no-explicit-any
(globalThis as any).Data = class Data {
  readonly blob: Blob;
  constructor(blob: Blob) {
    this.blob = blob;
  }
};
