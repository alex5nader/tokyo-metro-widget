import * as path from "https://deno.land/std@0.183.0/path/mod.ts";
import { PROJECT_PATH } from "./mock/index.ts";
import { runScript } from "./mock/util.ts";

console.log(`PID: ${Deno.pid}`);

const mainRealPath = path.resolve(Deno.args[0]);
const mainModule = path.relative(PROJECT_PATH, mainRealPath);

const files = FileManager.local();
const mainDevicePath = files.joinPath(
  files.documentsDirectory(),
  path.basename(mainModule),
);

files.writeString(mainDevicePath, await Deno.readTextFile(mainRealPath));

await runScript(mainDevicePath);

console.log();
console.log(scriptOutput);

if (widget) {
  console.log("Widget:");
  console.log(widget);
}
