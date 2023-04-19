const tryDevServer = "";

async function main() {
  const targets = ["main.js", "manage-api-key.js", "wizard.js"];
  const folder = "tokyo-metro-widget";

  const installer = new Installer(folder, targets);

  installer.createTargetDir();
  await installer.downloadTargets();

  const mainWizard = await importModule("./tokyo-metro-widget/main.js");
  await mainWizard.present();
}

class Installer {
  constructor(folderName, targets) {
    const localFiles = FileManager.local();

    if (localFiles.isFileStoredIniCloud(module.filename)) {
      this.files = FileManager.iCloud();
    } else {
      this.files = localFiles;
    }

    this.folder = this.files.joinPath(
      this.files.documentsDirectory(),
      folderName,
    );
    this.targets = targets;
  }

  #targetPath(target) {
    return this.files.joinPath(this.folder, target);
  }

  createTargetDir() {
    if (!this.files.isDirectory(this.folder)) {
      this.files.createDirectory(this.folder);
    }
  }

  async downloadTarget(target) {
    const scriptPath = this.#targetPath(target);
    if (!this.files.fileExists(scriptPath) || tryDevServer) {
      const url = tryDevServer
        ? `${tryDevServer}/${target}`
        : `https://raw.githubusercontent.com/alex5nader/tokyo-metro-widget/main/scriptable/${target}`;
      const req = new Request(url);

      const code = await req.loadString();
      this.files.writeString(scriptPath, code);
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
