const downloadStationData = async () => {
  return false;
};

module.exports.present = async (files) => {
  const { Message } = importModule("./wizard.js");

  if (!await downloadStationData()) {
    await new Message(
      "Choose Stations",
      "Failed to download station data.\nDid you provide an access token?",
    ).present();
    return;
  }
};
