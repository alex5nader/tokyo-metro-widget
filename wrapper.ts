import { CompletionError } from "./mock/index.ts";

const runScript = async (path: string) => {
  try {
    await import(path);
  } catch (error) {
    if (!(error instanceof CompletionError)) {
      throw error;
    }
  }
};

await runScript(Deno.args[0]);

console.log();
console.log(scriptOutput);

if (widget) {
  console.log("Widget:");
  console.log(widget);
}
