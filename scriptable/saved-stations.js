const STATIONS_FILE = "stations.json";

module.exports.chooseStationPreset = async (files) => {
  const { showAlert, showMessage } = importModule("./alerts.js");

  const path = files.toAbsolute(STATIONS_FILE);
  if (!files.fileExists(path)) {
    return showMessage({
      title: "Error",
      message: "You have no saved stations.",
    });
  }

  const data = JSON.parse(files.readString(path));
  const actions = Object.keys(data);

  const { choice } = await showAlert({
    title: "Choose stations",
    actions,
  });

  if (choice === -1) {
    return null;
  }

  return data[actions[choice]];
};

module.exports.loadStations = (files, presetName) => {
  const path = files.toAbsolute(STATIONS_FILE);
  if (!files.fileExists(path)) {
    return null;
  }

  const data = JSON.parse(files.readString(path));

  return data[presetName];
};

module.exports.saveStations = (files, stations, presetName) => {
  const path = files.toAbsolute(STATIONS_FILE);

  if (files.fileExists(path)) {
    const data = JSON.parse(files.readString(path));

    data[presetName] = stations;

    files.writeString(path, JSON.stringify(data));
  } else {
    const data = {
      [presetName]: stations,
    };

    files.writeString(path, JSON.stringify(data));
  }
};
