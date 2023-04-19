module.exports.main = async (files) => {
  if (config.runsInWidget) {
    const { makeTokyoMetroWidget } = importModule("./widget.js");

    const w = makeTokyoMetroWidget(files);

    Script.setWidget(w);
    Script.complete();
  } else {
    const { Wizard } = importModule("./wizard.js");

    // TODO: option to redownload installer too so changes will sync
    const mainMenu = new Wizard("Tokyo Metro Widget", {
      ["Manage API Key"]: () => importModule("./manage-api-key.js"),
      ["Preview Widget"]: async () => {
        const { makeTokyoMetroWidget } = importModule("./widget.js");

        const w = makeTokyoMetroWidget(files);

        await w.presentSmall();
      },
    });

    await mainMenu.present();
  }
};
