module.exports.main = async (installer) => {
  if (config.runsInWidget) {
    const { makeTokyoMetroWidget } = importModule("./widget.js");

    const w = makeTokyoMetroWidget(files);

    Script.setWidget(w);
    Script.complete();
  } else {
    const { Wizard } = importModule("./wizard.js");

    const mainMenu = new Wizard("Tokyo Metro Widget", {
      ["Manage API Key"]: () => importModule("./manage-api-key.js"),
      ["Preview Widget"]: async () => {
        const { makeTokyoMetroWidget } = importModule("./widget.js");

        const w = makeTokyoMetroWidget(files);

        await w.presentSmall();
      },
      ["Update Code"]: async () => {
        const { update } = importModule("./update-code.js");

        await update(installer);
      },
    });

    await mainMenu.present();
  }
};
