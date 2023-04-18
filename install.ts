await main();

async function main() {
  const targetFile = "setup.ts";
  const folder = "tokyo-metro-widget";

  const files = getFiles();
  const scriptPath = `${folder}/${targetFile}`;

  if (!files.isDirectory(folder)) {
    files.createDirectory(folder);
  }
  if (!files.fileExists(scriptPath)) {
    // const req = new Request(
    //   `https://raw.githubusercontent.com/alex5nader/tokyo-metro-widget/main/${targetFile}`,
    // );
    //
    // const code = await req.loadString();
    const code = Deno.readTextFileSync(`./${targetFile}`);
    files.writeString(scriptPath, code);
  }

  await files.downloadFileFromiCloud(scriptPath);

  const script = await importModule(scriptPath);

  await script.setup();
}

function getFiles() {
  const local = FileManager.local();

  if (local.isFileStoredIniCloud(module.filename)) {
    return FileManager.iCloud();
  } else {
    return local;
  }
}
