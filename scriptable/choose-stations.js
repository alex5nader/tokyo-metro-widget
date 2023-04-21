const { showAlert, showMessage } = importModule("./alerts.js");

const cache = (f, getCacheId) => {
  const cache = {};
  return async (...args) => {
    const cacheId = getCacheId(args);
    if (cacheId in cache) {
      return cache[cacheId];
    }

    const result = await f.apply(null, args);
    cache[cacheId] = result;
    return result;
  };
};

const getLines = cache(async (api) => {
  const data = await api.get(api.endpoints.lines, {
    "odpt:operator": "odpt.Operator:TokyoMetro",
  });

  return data.map((line) => ({
    idStr: line["owl:sameAs"],
    title: line["dc:title"],
  }));
}, () => null);

const getStations = cache(async (api, line) => {
  const data = await api.get(api.endpoints.stations, {
    "odpt:railway": line,
  });

  const result = data.map((station) => ({
    idStr: station["owl:sameAs"],
    title: station["dc:title"],
    code: station["odpt:stationCode"],
  }));

  result.sort((a, b) => a.code.localeCompare(b.code));
  return result;
}, ([_, line]) => line);

const getTimetables = cache(async (api, station) => {
  const data = await api.get(api.endpoints.stationTimetables, {
    "odpt:station": station,
  });

  return data.map((timetable) => ({
    idStr: timetable["owl:sameAs"],
    direction: timetable["odpt:railDirection"].split(":")[1],
    calendar: timetable["odpt:calendar"].split(":")[1],
  }));
}, ([_, station]) => station);

const setupApi = async (files) => {
  const accessToken = importModule("./manage-access-token.js").getAccessToken();
  if (!accessToken) {
    return null;
  }

  const { OdptApi } = importModule("./odpt.js");
  const api = new OdptApi(accessToken);

  return api;
};

const chooseLine = async (lines) => {
  const actions = lines.map((line) => line.title);
  actions.push("Finish");
  actions.push({ type: "cancel" });

  const { choice } = await showAlert({
    title: "Choose a line",
    actions,
    sheet: true,
  });

  if (choice === -1) {
    return "cancel";
  } else if (choice === lines.length) {
    return "finish";
  }

  return lines[choice].idStr;
};

const chooseStation = async (stations) => {
  const actions = stations.map((station) => station.title);
  actions.push({ label: "Back", type: "cancel" });

  const { choice } = await showAlert({
    title: "Choose a station",
    actions,
    sheet: true,
  });

  if (choice === -1) {
    return "back";
  }

  return stations[choice];
};

const chooseTimetable = async (timetables) => {
  const actions = timetables.map((timetable) =>
    `Bound for ${timetable.direction} (${timetable.calendar})`
  );
  actions.push({ label: "Back", type: "cancel" });

  const { choice } = await showAlert({
    title: "Choose a timetable",
    actions,
    sheet: true,
  });

  if (choice === -1) {
    return "back";
  }

  return timetables[choice].idStr;
};

const chooseStations = async () => {
  const api = await setupApi();
  if (!api) {
    await showMessage({
      title: "Choose Stations",
      message:
        "Failed to download station data.\nDid you provide an access token?",
    });
    return null;
  }

  const lines = await getLines(api);

  const chosenTimetables = [];
  while (true) {
    const lineId = await chooseLine(lines);

    if (lineId === "cancel") {
      return null;
    } else if (lineId === "finish") {
      break;
    }

    const stations = await getStations(api, lineId);
    const station = await chooseStation(stations);

    if (station === "back") {
      continue;
    }

    const timetables = await getTimetables(api, station.idStr);
    const timetableId = await chooseTimetable(timetables);

    if (timetableId === "back") {
      continue;
    }

    chosenTimetables.push({
      stationTitle: station.title,
      stationCode: station.code,
      timetableId,
    });
  }

  return chosenTimetables;
};

module.exports.showStationMenu = async (installer) => {
  const stations = await chooseStations();

  importModule("./saved-stations.js").saveStations(installer.files, stations);

  await importModule("./download-icons.js").downloadIcons(installer, stations);
};
