// deno-lint-ignore-file no-explicit-any

export function getCaller(self: any) {
  const _prepareStackTrace = (Error as any).prepareStackTrace;
  (Error as any).prepareStackTrace = function (_: any, trace: any) {
    return trace.map((callSite: any) => ({
      fileName: callSite.getFileName(),
    }));
  };

  const obj: any = {};
  Error.captureStackTrace(obj, self);

  const stack = obj.stack;
  (Error as any).prepareStackTrace = _prepareStackTrace;

  return stack[0];
}
