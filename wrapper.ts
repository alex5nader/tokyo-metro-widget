import * as path from "https://deno.land/std@0.183.0/path/mod.ts";
import { PROJECT_PATH } from "./mock/index.ts";

console.log(`PID: ${Deno.pid}`);

const mainRealPath = path.resolve(Deno.args[0]);
const mainModule = path.relative(PROJECT_PATH, mainRealPath);

const files = FileManager.local();
files.writeString(mainModule, await Deno.readTextFile(mainRealPath));

await importModule(mainModule);

console.log();
console.log(scriptOutput);

if (widget) {
  console.log("Widget:");
  console.log(widget);
}
