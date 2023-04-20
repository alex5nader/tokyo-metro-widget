module.exports.main = async (installer) => {
  const makeWidget = async () => {
    const status = await importModule("./get-station-status.js")
      .getSavedStationStatus(installer.files);

    return importModule("./widget.js").makeTokyoMetroWidget(
      installer.files,
      status,
    );
  };

  if (config.runsInWidget) {
    const w = await makeWidget();

    Script.setWidget(w);
    Script.complete();
  } else {
    const { showMenu } = importModule("./alerts.js");
    const pages = {
      "Manage Access Token": () =>
        importModule("./manage-access-token.js").present(),
      "Choose Stations": () =>
        importModule("./choose-stations.js").showStationMenu(installer),
      "Get Station Status": async () => {
        const status = await importModule("./get-station-status.js")
          .getSavedStationStatus(installer.files);

        console.log(status);
      },
      "Preview Widget": async () => {
        const w = await makeWidget();

        await w.presentMedium();
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
