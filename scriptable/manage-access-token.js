const { Message, TextInput, Wizard } = importModule("./wizard.js");

const KEYCHAIN_KEY = `tokyo-metro-widget/api-key`;

module.exports.getAccessKey = () => {
  try {
    return Keychain.get(KEYCHAIN_KEY);
  } catch (_) {
    return null;
  }
};

module.exports.present = async () => {
  const view = async () => {
    await new Message(
      "Access Token",
      module.exports.getAccessKey() ?? "No access token saved.",
    ).present();
  };

  const update = async () => {
    const input = new TextInput(
      "Enter Access Token",
      undefined,
      "Access token",
    );

    const key = await input.present();

    if (key) {
      Keychain.set(KEYCHAIN_KEY, key);
    }
  };

  const remove = async () => {
    if (Keychain.contains(KEYCHAIN_KEY)) {
      Keychain.remove(KEYCHAIN_KEY);
      await new Message("Access Token", "Successfully removed access token.")
        .present();
    } else {
      await new Message("Access Token", "Access token has not been saved.")
        .present();
    }
  };

  const wizard = new Wizard("Access Token Settings", {
    "View Access Token": view,
    "Update Access Token": update,
    "Remove Access Token": [remove, "destructive"],
  });

  await wizard.present();
};
