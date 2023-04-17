import "./Data.ts";
import { overrideBuiltin } from "./overrideBuiltin.ts";
import { unsupported } from "./util.ts";

type ScriptableResponse = {
  url: string;
  statusCode: number;
  mimeType: string | null;
  textEncodingName: string | null;
  headers: Record<string, string>;
  cookies: never;
};

const decodeContentType = (contentType: string | undefined) => {
  if (contentType) {
    const [mimeType, rest] = contentType.split(";");
    const encoding = rest.split("=")[1];

    return [mimeType, encoding];
  } else {
    return [null, null];
  }
};

class ScriptableRequest {
  url: string;
  method = "GET";
  headers: Record<string, string> = {};
  body: string | Data = "";
  timeoutInterval = 60;
  #response: ScriptableResponse | undefined;

  set onRedirect(_: never) {
    unsupported();
  }
  set allowInsecureRequest(_: never) {
    unsupported();
  }

  get response() {
    return this.#response;
  }

  constructor(url: string) {
    this.url = url;
  }

  async #load(): Promise<Response> {
    let body;
    if (this.body === "") {
      body = undefined;
    } else if (typeof this.body === "string") {
      body = this.body;
    } else {
      body = this.body.blob;
    }
    const result = await fetch(new URL(this.url), {
      method: this.method,
      headers: new Headers(this.headers),
      body,
    });

    const headers: Record<string, string> = {};
    for (const [name, value] of result.headers.entries()) {
      headers[name] = value;
    }
    const [mimeType, textEncodingName] = decodeContentType(
      headers["Content-Type"],
    );

    this.#response = {
      url: result.url,
      statusCode: result.status,
      mimeType,
      headers,
      textEncodingName,
      get cookies(): never {
        return unsupported();
      },
    };

    return result;
  }

  async load(): Promise<Data> {
    const result = await this.#load();
    return new Data(await result.blob());
  }

  async loadString(): Promise<string> {
    const result = await this.#load();
    return result.text();
  }

  // deno-lint-ignore no-explicit-any
  async loadJSON(): Promise<any> {
    const result = await this.#load();
    return result.json();
  }

  loadImage(): Promise<Image> {
    return unsupported();
  }

  addParameterToMultipart(_name: string, _value: string) {
    unsupported();
  }

  addFileDataToMultipart(
    _data: Data,
    _mimeType: string,
    _name: string,
    _filename: string,
  ) {
    unsupported();
  }

  addFileToMultipart(
    _filePath: string,
    _name: string,
    _filename: string,
  ) {
    unsupported();
  }

  addImageToMultipart(
    _image: Image,
    _name: string,
    _filename: string,
  ) {
    unsupported();
  }
}

overrideBuiltin("Request", ScriptableRequest);
