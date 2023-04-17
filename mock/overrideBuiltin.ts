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

function getStackTrace(caller: any) {
  const _prepareStackTrace = (Error as any).prepareStackTrace;
  (Error as any).prepareStackTrace = function (_: any, trace: any) {
    return trace.map((callSite: any) => ({
      fileName: callSite.getFileName(),
    }));
  };

  const obj: any = {};
  Error.captureStackTrace(obj, caller);

  const stack = obj.stack;
  (Error as any).prepareStackTrace = _prepareStackTrace;

  return stack;
}

const PROJECT_PATH = path.join(
  path.dirname(path.fromFileUrl(import.meta.url)),
  "..",
);

const shouldOverride = (callerFile: string) => {
  try {
    const callerPath = path.fromFileUrl(callerFile);
    if (callerPath.startsWith(PROJECT_PATH)) {
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
      const trace = getStackTrace(getter);

      if (shouldOverride(trace[0].fileName)) {
        return replacement;
      } else {
        return original;
      }
    },
  });
}
