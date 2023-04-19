const { Alert, TextInput, Wizard } = await importModule("./wizard.js");

const KEYCHAIN_KEY = `tokyo-metro-widget/api-key`;

const view = () => {
  let message;
  try {
    message = Keychain.get(KEYCHAIN_KEY);
  } catch (_) {
    message = "No key saved.";
  }

  return new Alert("API Key", message, ["Ok"]);
};

const update = async () => {
  const input = new TextInput("Enter API Key", undefined, "API Key");

  const key = await input.present();

  if (key) {
    Keychain.set(KEYCHAIN_KEY, key);
  }
};

const remove = () => {
  Keychain.remove(KEYCHAIN_KEY);

  return new Alert("API Key", "Successfully removed API key.", ["Ok"]);
};

module.exports = new Wizard("API Key settings", {
  "View API Key": view,
  "Update API Key": update,
  "Remove API key": remove,
});
