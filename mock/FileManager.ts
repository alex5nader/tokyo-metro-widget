import "./Data.ts";

import * as path from "https://deno.land/std@0.183.0/path/mod.ts";
import { existsSync } from "https://deno.land/std@0.182.0/fs/exists.ts";
import { unsupported } from "./util.ts";

// deno-lint-ignore no-explicit-any
(globalThis as any).FileManager = class FileManager {
  static local(): FileManager {
    return new FileManager();
  }
  static iCloud(): FileManager {
    return new FileManager();
  }

  #dir: string;

  #getPath(filePath: string): string {
    return path.join(this.#dir, filePath);
  }

  private constructor() {
    this.#dir = Deno.makeTempDirSync();
  }

  #read(filePath: string): Uint8Array {
    return Deno.readFileSync(this.#getPath(filePath));
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
    Deno.writeFileSync(this.#getPath(filePath), data);
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
    Deno.removeSync(this.#getPath(filePath));
  }

  move(sourceFilePath: string, destinationFilePath: string) {
    Deno.renameSync(
      this.#getPath(sourceFilePath),
      this.#getPath(destinationFilePath),
    );
  }

  copy(sourceFilePath: string, destinationFilePath: string) {
    Deno.copyFileSync(
      this.#getPath(sourceFilePath),
      this.#getPath(destinationFilePath),
    );
  }

  fileExists(filePath: string): boolean {
    return existsSync(this.#getPath(filePath));
  }

  isDirectory(filePath: string): boolean {
    try {
      const stat = Deno.statSync(this.#getPath(filePath));
      return stat.isDirectory;
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return false;
      } else {
        throw error;
      }
    }
  }
};
