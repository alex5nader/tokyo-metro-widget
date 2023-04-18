import { runScript } from "./util.ts";

// deno-lint-ignore no-explicit-any
(globalThis as any).importModule = function importModule(name: string) {
  return runScript(FileManager.local().getPath(name));
};
