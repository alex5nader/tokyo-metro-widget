import {
  decode,
  encode,
} from "https://deno.land/std@0.182.0/encoding/base64.ts";
import { unsupported } from "./util.ts";

declare global {
  namespace Data {
    function fromBytes(bytes: Uint8Array): Data;
  }
  interface Data {
    readonly bytes: Uint8Array;
  }
}

// deno-lint-ignore no-explicit-any
(globalThis as any).Data = class Data {
  readonly bytes: Uint8Array;

  private constructor(data: Uint8Array) {
    this.bytes = data;
  }

  static fromString(string: string): Data {
    return new Data(new TextEncoder().encode(string));
  }

  static fromFile(_filePath: string): Data {
    return unsupported();
  }

  static fromBase64String(base64String: string): Data {
    return new Data(decode(base64String));
  }

  static fromJPEG(_image: Image): Data {
    return unsupported();
  }

  static fromPNG(_image: Image): Data {
    return unsupported();
  }

  toRawString(): string {
    return new TextDecoder().decode(this.bytes);
  }

  toBase64String(): string {
    return encode(this.bytes);
  }

  getBytes(): number[] {
    return Array.from(this.bytes);
  }
};
