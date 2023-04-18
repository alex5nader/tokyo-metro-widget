const tryLocalServer = "";

// deno-lint-ignore no-explicit-any
const mocksEnabled = (globalThis as any).mocksEnabled;

async function main() {
  const targetFile = "setup.ts";
  const folder = "tokyo-metro-widget";

  const installer = new Installer(
    folder,
    targetFile,
  );

  await installer.install();
}

class Installer {
  readonly #files: FileManager;
  readonly #folder: string;
  readonly #targetFile: string;

  constructor(folderName: string, targetFile: string) {
    const localFiles = FileManager.local();

    if (localFiles.isFileStoredIniCloud(module.filename)) {
      this.#files = FileManager.iCloud();
    } else {
      this.#files = localFiles;
    }

    this.#folder = this.#files.joinPath(
      this.#files.documentsDirectory(),
      folderName,
    );
    this.#targetFile = targetFile;
  }

  #scriptPath(): string {
    return this.#files.joinPath(this.#folder, this.#targetFile);
  }

  createScriptDir() {
    if (!this.#files.isDirectory(this.#folder)) {
      this.#files.createDirectory(this.#folder);
    }
  }

  // deno-lint-ignore no-explicit-any
  async downloadScript(): Promise<any> {
    const scriptPath = this.#scriptPath();
    if (
      !this.#files.fileExists(scriptPath) || mocksEnabled || tryLocalServer
    ) {
      let code;
      if (mocksEnabled) {
        code = Deno.readTextFileSync("./setup.ts");
      } else if (tryLocalServer) {
        const req = new Request(`https://${tryLocalServer}`);
        code = await req.loadString();
      } else {
        const req = new Request(
          `https://raw.githubusercontent.com/alex5nader/tokyo-metro-widget/main/${this.#targetFile}`,
        );
        code = await req.loadString();
      }
      this.#files.writeString(scriptPath, code);
    }

    await this.#files.downloadFileFromiCloud(scriptPath);

    return importModule(scriptPath);
  }

  // deno-lint-ignore no-explicit-any
  async install(): Promise<any> {
    this.createScriptDir();
    const script = await this.downloadScript();

    return script.setup();
  }
}

await main();
