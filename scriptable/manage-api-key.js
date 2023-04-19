const { Message, TextInput, Wizard } = importModule("./wizard.js");

const KEYCHAIN_KEY = `tokyo-metro-widget/api-key`;

const view = () => {
  let message;
  try {
    message = Keychain.get(KEYCHAIN_KEY);
  } catch (_) {
    message = "No key saved.";
  }

  return new Message("API Key", message);
};

const update = async () => {
  const input = new TextInput("Enter API Key", undefined, "API Key");

  const key = await input.present();

  if (key) {
    Keychain.set(KEYCHAIN_KEY, key);
  }
};

const remove = () => {
  if (Keychain.contains(KEYCHAIN_KEY)) {
    Keychain.remove(KEYCHAIN_KEY);
    return new Message("API Key", "Successfully removed API key.");
  } else {
    return new Message("API Key", "API key has not been saved.");
  }
};

module.exports = new Wizard("API Key settings", {
  "View API Key": view,
  "Update API Key": update,
  "Remove API key": [remove, "destructive"],
});
