const downloadStationData = async () => {
  return false;
};

module.exports.present = async (files) => {
  const { showMessage } = importModule("./alerts.js");

  if (!await downloadStationData()) {
    await showMessage({
      title: "Choose Stations",
      message:
        "Failed to download station data.\nDid you provide an access token?",
    });
    return;
  }
};
