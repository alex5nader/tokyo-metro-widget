const ICONS_DIR = "station-icons";

module.exports.downloadIcons = (installer, stations) => {
  const iconsPath = installer.files.toAbsolute(ICONS_DIR);
  if (!installer.files.isDirectory(iconsPath)) {
    installer.files.createDirectory(iconsPath);
  }

  return Promise.all(stations.map((station) => {
    return installer.downloadTarget(`${ICONS_DIR}/${station.stationCode}.png`);
  }));
};

module.exports.getIcon = (files, stationCode) => {
  return files.readImage(
    files.toAbsolute(`${ICONS_DIR}/${stationCode}.png`),
  );
};
