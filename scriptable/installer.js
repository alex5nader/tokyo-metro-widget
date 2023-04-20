// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: subway;
const tryDevServer = importModule("./Tokyo Metro Widget Dev Server.js");

async function main() {
  const targets = [
    "alerts.js",
    "choose-stations.js",
    "download-icons.js",
    "get-station-status.js",
    "main.js",
    "manage-access-token.js",
    "odpt.js",
    "saved-stations.js",
    "update-code.js",
    "widget.js",
  ];
  const folder = "tokyo-metro-widget";

  const installer = new Installer(folder, targets);

  installer.files.createScriptDir();
  await installer.downloadTargets({ force: tryDevServer !== "" });

  await importModule("./tokyo-metro-widget/main.js").main(installer);
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

  getTargetUrl(target) {
    return tryDevServer
      ? `${tryDevServer}/${target}`
      : `https://raw.githubusercontent.com/alex5nader/tokyo-metro-widget/main/scriptable/${target}`;
  }

  async downloadTarget(target, force) {
    const scriptPath = this.files.toAbsolute(target);

    if (force || !this.files.fileExists(scriptPath)) {
      const req = new Request(this.getTargetUrl(target));
      this.files.write(scriptPath, await req.load());
    }

    await this.files.downloadFileFromiCloud(scriptPath);
  }

  async downloadTargets({ force }) {
    const promises = [];
    for (const target of this.targets) {
      promises.push(this.downloadTarget(target, force));
    }

    await Promise.all(promises);
  }

  async redownloadInstaller() {
    const req = new Request(this.getTargetUrl("installer.js"));

    this.files.write(module.filename, await req.load());
    await this.files.downloadFileFromiCloud(module.filename);
  }
}

await main();
