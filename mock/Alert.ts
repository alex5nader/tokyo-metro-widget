type Action = {
  title: string;
  type: "normal" | "destructive" | "cancel";
};

type TextField = {
  placeholder: string;
  text: string;
  value: string | null;
};

const styles: Record<Action["type"], string> = {
  normal: "",
  destructive: "color: red",
  cancel: "font-weight: bold",
};

declare global {
  interface Alert {
    textFieldValue(index: number): string | null;
  }
}

// deno-lint-ignore no-explicit-any
(globalThis as any).Alert = class Alert {
  title = "";
  message = "";
  #actions: Action[] = [];
  #textFields: TextField[] = [];

  constructor() {}

  addAction(title: string) {
    this.#actions.push({
      title,
      type: "normal",
    });
  }

  addDestructiveAction(title: string) {
    this.#actions.push({
      title,
      type: "destructive",
    });
  }

  addCancelAction(title: string) {
    this.#actions.push({
      title,
      type: "cancel",
    });
  }

  addTextField(placeholder: string, text: string) {
    this.#textFields.push({
      placeholder,
      text,
      value: null,
    });
  }

  addSecureTextField(placeholder: string, text: string) {
    this.addTextField(placeholder, text);
  }

  textFieldValue(index: number): string | null {
    return this.#textFields[index].value;
  }

  present(): Promise<number> {
    const actions: Action[] = this.#actions.length > 0
      ? this.#actions
      : [{ title: "Cancel", type: "cancel" }];

    console.log(this.title);
    if (this.message) {
      console.log(this.message);
    }
    console.log();

    if (this.#textFields.length > 0) {
      for (let i = 0; i < this.#textFields.length; i++) {
        const textField = this.#textFields[i];
        textField.value = prompt(
          textField.text ? `(${textField.text})` : "",
          textField.placeholder,
        ) ?? "";
      }
      console.log();
    }

    for (let i = 0; i < actions.length; i++) {
      console.log(
        `[${i}] %c${actions[i].title}`,
        styles[actions[i].type],
      );
    }

    return new Promise((resolve) => {
      while (true) {
        const result = prompt(`Which action? [0-${actions.length - 1}]`);

        if (!result) {
          continue;
        }

        const index = Number(result);

        if (
          Number.isNaN(index) || index < 0 || index >= actions.length
        ) {
          continue;
        }

        if (actions[index].type === "cancel") {
          resolve(-1);
        } else {
          resolve(index);
        }

        break;
      }
    });
  }

  presentAlert() {
    return this.present();
  }

  presentSheet() {
    return this.present();
  }
};
