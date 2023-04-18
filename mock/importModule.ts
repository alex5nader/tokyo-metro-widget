import * as path from "https://deno.land/std@0.183.0/path/mod.ts";
import { getCaller } from "./getCaller.ts";
import { runScript } from "./util.ts";

// deno-lint-ignore no-explicit-any
(globalThis as any).importModule = function importModule(name: string) {
  const caller = getCaller(importModule);
  const file = path.fromFileUrl(caller.fileName);

  return runScript(path.resolve(path.dirname(file), name));
};
