const RawAlert = globalThis.Alert;

module.exports.Alert = class Alert {
  constructor(title, message, inputs) {
    if (typeof message === "object" && inputs === undefined) {
      inputs = message;
      message = undefined;
    }
    const { actions, textFields } = inputs;

    this.title = title;

    // Scriptable Alerts cannot be reused so every present must create a new one
    this.makeRaw = () => {
      const raw = new RawAlert();
      raw.title = title;
      raw.message = message;

      if (actions) {
        for (const action of actions) {
          if (typeof action === "string") {
            raw.addAction(action);
          } else if (action.type === "destructive") {
            raw.addDestructiveAction(action.label);
          } else if (action.type === "cancel") {
            raw.addCancelAction(action.label ?? "Cancel");
          } else {
            throw new Error(`Invalid action: ${JSON.stringify(action)}`);
          }
        }
      }

      if (textFields) {
        for (const { placeholder, text } of textFields) {
          raw.addTextField(placeholder, text);
        }
      }

      return raw;
    };
  }

  async _present(present) {
    const raw = this.makeRaw();

    return {
      choice: await present(raw),
      textFieldValue: (index) => raw.textFieldValue(index),
    };
  }

  present() {
    return this._present((raw) => raw.present());
  }

  presentSheet() {
    return this._present((raw) => raw.presentSheet());
  }
};

module.exports.Message = class Message extends module.exports.Alert {
  constructor(title, message, action) {
    super(title, message, { actions: [action ?? "Ok"] });
  }
};

module.exports.Wizard = class Wizard extends module.exports.Alert {
  static actions(pages) {
    const actions = [];

    for (const [label, page] of Object.entries(pages)) {
      actions.push(Array.isArray(page) ? { label, type: page[1] } : label);
    }

    actions.push({ type: "cancel" });

    return actions;
  }

  constructor(title, message, pages) {
    if (typeof message === "object" && pages === undefined) {
      pages = message;
      message = undefined;
    }

    super(title, message, { actions: Wizard.actions(pages) });

    this.pages = Object.values(pages);
  }

  async present() {
    const { choice } = await super.presentSheet();

    if (choice === -1) {
      return;
    }

    const page = this.pages[choice];
    if (typeof page === "function") {
      await page();
    } else {
      throw new Error(`Page ${choice} of wizard ${this.title} is invalid`);
    }
  }
};

module.exports.TextInput = class TextInput extends module.exports.Alert {
  constructor(title, message, placeholder, text) {
    super(title, message, {
      actions: ["Ok", { type: "cancel" }],
      textFields: [{ placeholder, text }],
    });
  }

  async present() {
    const { choice, textFieldValue } = await super.presentSheet();

    if (choice === -1) {
      return null;
    }

    return textFieldValue(0);
  }
};
