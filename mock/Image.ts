import { unsupported } from "./util.ts";

declare global {
  class Image {}
}

globalThis.Image = class Image {
  constructor() {
    unsupported();
  }
};
