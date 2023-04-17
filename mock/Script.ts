// deno-lint-ignore-file no-explicit-any
declare global {
  // deno-lint-ignore no-var
  var scriptOutput: any;
  // deno-lint-ignore no-var
  var widget: any;
}

(globalThis as any).scriptOutput = undefined;
(globalThis as any).widget = undefined;

export class CompletionError extends Error {}

(globalThis as any).Script = {
  name(): string {
    return "Mock script";
  },

  complete(): never {
    throw new CompletionError();
  },

  setShortcutOutput(value: any) {
    scriptOutput = value;
  },

  setWidget(widget: any) {
    (globalThis as any).widget = widget;
  },
};
