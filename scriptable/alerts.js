module.exports.showAlert = async ({
  title,
  message,
  actions,
  textFields,
  sheet,
}) => {
  const raw = new Alert();
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

  return {
    choice: sheet ? await raw.presentSheet() : await raw.presentAlert(),
    textFieldValue: (index) => raw.textFieldValue(index),
  };
};

module.exports.showMessage = ({ title, message, action }) => {
  return module.exports.showAlert({
    title,
    message,
    actions: [action ?? "Ok"],
  });
};

module.exports.showMenu = async ({
  title,
  message,
  pages: pageDefinitions,
}) => {
  if (!pageDefinitions) {
    throw new Error(`Menu ${title} has no pages.`);
  }

  const actions = [];
  const pages = [];

  for (const [label, page] of Object.entries(pageDefinitions)) {
    if (Array.isArray(page)) {
      actions.push({ label, type: page[1] });
      pages.push(page[0]);
    } else {
      actions.push(label);
      pages.push(page);
    }
  }

  actions.push({ type: "cancel" });

  const { choice } = await module.exports.showAlert({
    title,
    message,
    actions,
    sheet: true,
  });

  if (choice === -1) {
    return;
  }

  const page = pages[choice];
  if (typeof page === "function") {
    await page();
  } else {
    throw new Error(`Page ${choice} of menu ${title} is invalid`);
  }
};

module.exports.showTextInput = async ({
  title,
  message,
  placeholder,
  text,
}) => {
  const { choice, textFieldValue } = await module.exports.showAlert({
    title,
    message,
    actions: ["Ok", { type: "cancel" }],
    textFields: [{ placeholder, text }],
  });

  if (choice === -1) {
    return null;
  }

  return textFieldValue(0);
};
