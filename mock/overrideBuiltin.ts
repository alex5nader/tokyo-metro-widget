// deno-lint-ignore-file no-explicit-any

// This workaround is necessary because Scriptable defines its API
// in the global scope, and has conflicts with built-in names.
//
// In order to mock the API for local testing, these globals must
// be available to script code. However, this breaks all library
// code that uses any conflicted APIs.
//
// Because local testing will run under Deno, V8's stack trace API
// along with an accessor property can be used to determine where
// global values are accessed, and whether to provide the Scriptable
// mock or the regular implementation.

import * as path from "https://deno.land/std@0.183.0/path/mod.ts";
import { getCaller } from "./getCaller.ts";
import { DEVICE_LOCAL_ROOT, ICLOUD_ROOT } from "./FileManager.ts";

const shouldOverride = (callerFile: string) => {
  try {
    const callerPath = path.fromFileUrl(callerFile);
    if (
      callerPath.startsWith(DEVICE_LOCAL_ROOT) ||
      callerPath.startsWith(ICLOUD_ROOT)
    ) {
      return true;
    }
  } catch {
    // not a file URL means non-local code, use non-overridden value
  }
  return false;
};

/**
 * Replace a value on globalThis, but only for callers within the project.
 */
export function overrideBuiltin(name: string, replacement: any) {
  if (!(name in globalThis)) {
    throw new Error(
      `Tried to override builtin ${name}, but it does not already exist.`,
    );
  }
  const original = (globalThis as any)[name];

  Object.defineProperty(globalThis, name, {
    get: function getter() {
      const caller = getCaller(getter);

      if (shouldOverride(caller.fileName)) {
        return replacement;
      } else {
        return original;
      }
    },
  });
}
