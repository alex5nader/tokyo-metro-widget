import * as path from "https://deno.land/std@0.183.0/path/mod.ts";
import { getCaller } from "./getCaller.ts";

// deno-lint-ignore no-explicit-any
const exports: Record<string, any> = {};
const module = {};

Object.defineProperty(module, "filename", {
  get: function getter() {
    const caller = getCaller(getter);
    const file = path.fromFileUrl(caller.fileName);

    return file;
  },
});

Object.defineProperty(module, "exports", {
  get: function getter() {
    const caller = getCaller(getter);
    const file = path.fromFileUrl(caller.fileName);

    if (!(file in exports)) {
      exports[file] = {};
    }
    return exports[file];
  },
  // deno-lint-ignore no-explicit-any
  set: function setter(value: any) {
    const caller = getCaller(setter);
    const file = path.fromFileUrl(caller.fileName);

    exports[file] = value;
  },
});

// deno-lint-ignore no-explicit-any
export function getScriptExportsFor(realPath: string): any {
  return exports[realPath];
}

// deno-lint-ignore no-explicit-any
(globalThis as any).module = module;
