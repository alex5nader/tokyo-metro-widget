const RawAlert = globalThis.Alert;

module.exports.Alert = class Alert {
  constructor(title, message, actions) {
    if (Array.isArray(message) && actions === undefined) {
      actions = message;
      message = undefined;
    }

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

      return raw;
    };
  }

  async present() {
    const raw = this.makeRaw();

    return await raw.present();
  }
};

module.exports.Wizard = class Wizard extends module.exports.Alert {
  constructor(title, message, pages) {
    if (typeof message === "object" && pages === undefined) {
      pages = message;
      message = undefined;
    }

    super(title, message, [...Object.keys(pages), { type: "cancel" }]);

    this.pages = Object.values(pages);
  }

  async present() {
    while (true) {
      const choice = await super.present();

      if (choice === -1) {
        return;
      }

      let page = this.pages[choice];
      if (typeof page === "function") {
        page = await page();
      }

      if (typeof page === "object" && "present" in page) {
        await page.present();
      }
    }
  }
};

module.exports.TextInput = class TextInput extends module.exports.Alert {
  constructor(title, message, placeholder, text) {
    super(title, message, ["Ok", { type: "cancel" }]);

    this.raw.addTextField(placeholder, text);
  }

  async present() {
    const choice = await super.present();

    if (choice === -1) {
      return null;
    }

    return this.raw.textFieldValue(0);
  }
};
