const STATIONS_FILE = "stations.json";

module.exports.loadStations = (files) => {
  const path = files.toAbsolute(STATIONS_FILE);
  if (!files.fileExists(path)) {
    return null;
  }

  return JSON.parse(files.readString(path));
};

module.exports.saveStations = (files, stations) => {
  const path = files.toAbsolute(STATIONS_FILE);

  files.writeString(path, JSON.stringify(stations));
};
