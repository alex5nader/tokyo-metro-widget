module.exports.main = async (installer) => {
  const makeWidget = () => {
    return importModule("./widget.js").makeTokyoMetroWidget(installer.files);
  };

  if (config.runsInWidget) {
    const w = makeWidget();

    Script.setWidget(w);
    Script.complete();
  } else {
    const { Wizard } = importModule("./wizard.js");

    const mainMenu = new Wizard("Tokyo Metro Widget", {
      ["Manage Access Token"]: () => importModule("./manage-access-token.js"),
      ["Preview Widget"]: async () => {
        const w = makeWidget();

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
