const url: URL = new URL("../.keychain.json", import.meta.url);
const store: Record<string, string> = await initStore();

globalThis.addEventListener("unload", () => saveStore());

// deno-lint-ignore no-explicit-any
(globalThis as any).Keychain = class Keychain {
  static contains(key: string): boolean {
    return key in store;
  }

  static set(key: string, value: string) {
    store[key] = value;
  }

  static get(key: string): string {
    if (!Keychain.contains(key)) {
      throw new Error(`Key ${key} does not exist in keychain.`);
    }
    return store[key];
  }

  static remove(key: string) {
    delete store[key];
  }
};

async function initStore() {
  try {
    return JSON.parse(await Deno.readTextFile(url));
  } catch {
    return {};
  }
}

function saveStore() {
  Deno.writeTextFileSync(url, JSON.stringify(store));
}
