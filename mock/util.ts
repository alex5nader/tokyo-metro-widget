import * as path from "https://deno.land/std@0.183.0/path/mod.ts";
import { CompletionError } from "./Script.ts";
import { getScriptExportsFor } from "./module.ts";

export const unsupported = () => {
  throw new Error("Unsupported");
};

export const PROJECT_PATH = path.join(
  path.dirname(path.fromFileUrl(import.meta.url)),
  "..",
);

export const runScript = async (realPath: string) => {
  try {
    await import(realPath);
    const result = getScriptExportsFor(realPath);
    return result ?? module.exports;
  } catch (error) {
    if (error instanceof CompletionError) {
      return module.exports;
    }
    throw error;
  }
};
