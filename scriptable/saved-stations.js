const STATIONS_FILE = "stations.json";

module.exports.loadStations = (files) => {
  const path = files.toAbsolute(STATIONS_FILE);
  const content = files.readString(path);

  return JSON.parse(content);
};

module.exports.saveStations = (files, stations) => {
  const content = JSON.stringify(stations);
  const path = files.toAbsolute(STATIONS_FILE);

  files.writeString(path, content);
};
