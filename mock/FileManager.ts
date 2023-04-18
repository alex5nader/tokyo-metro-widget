import "./Data.ts";

import * as path from "https://deno.land/std@0.183.0/path/mod.ts";
import { existsSync } from "https://deno.land/std@0.182.0/fs/exists.ts";
import { unsupported } from "./util.ts";

declare global {
  interface FileManager {
    getPath(filePath: string): string;
  }
}

// deno-lint-ignore no-explicit-any
(globalThis as any).FileManager = class FileManager {
  static #local = new FileManager("local");
  static #iCloud = new FileManager("iCloud");

  static local(): FileManager {
    return FileManager.#local;
  }
  static iCloud(): FileManager {
    return FileManager.#iCloud;
  }

  #dir: string;

  getPath(filePath: string): string {
    return path.join(this.#dir, filePath);
  }

  constructor(label: string) {
    this.#dir = Deno.makeTempDirSync();
    console.log(`Using ${this.#dir} for ${label}`);

    this.createDirectory(this.documentsDirectory(), false);
  }

  #read(filePath: string): Uint8Array {
    return Deno.readFileSync(filePath);
  }

  read(filePath: string): Data {
    return Data.fromBytes(this.#read(filePath));
  }

  readString(filePath: string): string {
    return new TextDecoder().decode(this.#read(filePath));
  }

  readImage(_filePath: string): Image {
    return unsupported();
  }

  #write(filePath: string, data: Uint8Array) {
    Deno.writeFileSync(filePath, data);
  }

  write(filePath: string, content: Data) {
    this.#write(filePath, content.bytes);
  }

  writeString(filePath: string, content: string) {
    this.#write(filePath, new TextEncoder().encode(content));
  }

  writeImage(_filePath: string, _image: Image) {
    unsupported();
  }

  remove(filePath: string) {
    Deno.removeSync(filePath);
  }

  move(sourceFilePath: string, destinationFilePath: string) {
    Deno.renameSync(sourceFilePath, destinationFilePath);
  }

  copy(sourceFilePath: string, destinationFilePath: string) {
    Deno.copyFileSync(sourceFilePath, destinationFilePath);
  }

  fileExists(filePath: string): boolean {
    return existsSync(filePath);
  }

  isDirectory(filePath: string): boolean {
    try {
      const stat = Deno.statSync(filePath);
      return stat.isDirectory;
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return false;
      } else {
        throw error;
      }
    }
  }

  createDirectory(path: string, intermediateDirectories: boolean) {
    Deno.mkdirSync(path, { recursive: intermediateDirectories });
  }

  documentsDirectory(): string {
    return this.getPath("Documents");
  }

  joinPath(lhsPath: string, rhsPath: string): string {
    return path.join(lhsPath, rhsPath);
  }

  downloadFileFromiCloud(_filePath: string): Promise<void> {
    // Mock icloud files are always on disk
    return Promise.resolve();
  }

  isFileStoredIniCloud(filePath: string): boolean {
    return FileManager.iCloud().fileExists(filePath);
  }
};

export const DEVICE_LOCAL_ROOT = FileManager.local().getPath(".");
export const ICLOUD_ROOT = FileManager.iCloud().getPath(".");
