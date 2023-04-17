import { unsupported } from "./util.ts";

// deno-lint-ignore no-explicit-any
(globalThis as any).Image = class Image {
  constructor() {
    unsupported();
  }
};
