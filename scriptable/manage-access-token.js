const { Message, TextInput, Wizard } = importModule("./wizard.js");

const KEYCHAIN_KEY = `tokyo-metro-widget/api-key`;

const view = () => {
  let message;
  try {
    message = Keychain.get(KEYCHAIN_KEY);
  } catch (_) {
    message = "No access token saved.";
  }

  return new Message("Access Token", message);
};

const update = async () => {
  const input = new TextInput("Enter Access Token", undefined, "Access token");

  const key = await input.present();

  if (key) {
    Keychain.set(KEYCHAIN_KEY, key);
  }
};

const remove = () => {
  if (Keychain.contains(KEYCHAIN_KEY)) {
    Keychain.remove(KEYCHAIN_KEY);
    return new Message("Access Token", "Successfully removed access token.");
  } else {
    return new Message("Access Token", "Access token has not been saved.");
  }
};

module.exports = new Wizard("Access Token Settings", {
  "View Access Token": view,
  "Update Access Token": update,
  "Remove Access Token": [remove, "destructive"],
});
