const { showMenu, showMessage, showTextInput } = importModule("./alerts.js");

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
    await showMessage({
      title: "Access Token",
      message: module.exports.getAccessKey() ?? "No access token saved.",
    });
  };

  const update = async () => {
    const key = await showTextInput({
      title: "Enter Access Token",
      placeholder: "Access Token",
    });

    if (key) {
      Keychain.set(KEYCHAIN_KEY, key);
    }
  };

  const remove = async () => {
    if (Keychain.contains(KEYCHAIN_KEY)) {
      Keychain.remove(KEYCHAIN_KEY);
      await showMessage({
        title: "Access Token",
        message: "Successfully removed access token.",
      });
    } else {
      await showMessage({
        title: "Access Token",
        message: "Access token has not been saved.",
      });
    }
  };

  await showMenu({
    title: "Access Token Settings",
    pages: {
      "View Access Token": view,
      "Update Access Token": update,
      "Remove Access Token": [remove, "destructive"],
    },
  });
};
