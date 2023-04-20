module.exports.main = async (installer) => {
  const makeWidget = () => {
    return importModule("./widget.js").makeTokyoMetroWidget(installer.files);
  };

  if (config.runsInWidget) {
    const w = makeWidget();

    Script.setWidget(w);
    Script.complete();
  } else {
    const { showMenu } = importModule("./alerts.js");
    const pages = {
      "Manage Access Token": () =>
        importModule("./manage-access-token.js").present(),
      "Choose Stations": () =>
        importModule("./choose-stations.js").present(installer.files),
      "Preview Widget": async () => {
        const w = makeWidget();

        await w.presentSmall();
      },
      "Update Code": async () => {
        const { update } = importModule("./update-code.js");

        await update(installer);
      },
    };

    await showMenu({
      title: "Tokyo Metro Widget",
      pages,
    });
  }
};
