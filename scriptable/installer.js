const tryDevServer = "";

async function main() {
  const targets = [
    "main.js",
    "manage-api-key.js",
    "odpt.js",
    "widget.js",
    "wizard.js",
    "station_icon_n-14.png",
  ];
  const folder = "tokyo-metro-widget";

  const installer = new Installer(folder, targets);

  installer.files.createScriptDir();
  await installer.downloadTargets();

  await importModule("./tokyo-metro-widget/main.js").main(installer.files);
}

const makeFilesExt = (folderName) => {
  const localFiles = FileManager.local();

  let files;
  if (localFiles.isFileStoredIniCloud(module.filename)) {
    files = FileManager.iCloud();
  } else {
    files = localFiles;
  }

  const folder = files.joinPath(
    files.documentsDirectory(),
    folderName,
  );

  files.toAbsolute = function (relative) {
    return this.joinPath(folder, relative);
  };

  files.createScriptDir = function () {
    if (!this.isDirectory(folder)) {
      this.createDirectory(folder);
    }
  };

  return files;
};

class Installer {
  constructor(folderName, targets) {
    this.files = makeFilesExt(folderName);
    this.targets = targets;
  }

  async downloadTarget(target) {
    const scriptPath = this.files.toAbsolute(target);
    if (!this.files.fileExists(scriptPath) || tryDevServer) {
      const url = tryDevServer
        ? `${tryDevServer}/${target}`
        : `https://raw.githubusercontent.com/alex5nader/tokyo-metro-widget/main/scriptable/${target}`;
      const req = new Request(url);

      this.files.write(scriptPath, await req.load());
    }

    await this.files.downloadFileFromiCloud(scriptPath);
  }

  async downloadTargets() {
    const promises = [];
    for (const target of this.targets) {
      promises.push(this.downloadTarget(target));
    }

    await Promise.all(promises);
  }
}

await main();
