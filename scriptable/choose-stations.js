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
  console.log(api);
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
  const lineActions = lines.map((line) => line.title);
  lineActions.push("Finish");
  lineActions.push({ type: "cancel" });

  const { choice: lineChoice } = await showAlert({
    title: "Choose a line",
    actions: lineActions,
    sheet: true,
  });

  if (lineChoice === -1) {
    return "cancel";
  } else if (lineChoice === lines.length) {
    return "finish";
  }

  return lines[lineChoice].idStr;
};

const chooseStation = async (stations) => {
  const stationActions = stations.map((station) => station.title);
  stationActions.push({ label: "Back", type: "cancel" });

  const { choice: stationChoice } = await showAlert({
    title: "Choose a station",
    actions: stationActions,
    sheet: true,
  });

  if (stationChoice === -1) {
    return "back";
  }

  return stations[stationChoice].idStr;
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

  const chosenStations = [];
  while (true) {
    const lineId = await chooseLine(lines);

    if (lineId === "cancel") {
      return null;
    } else if (lineId === "finish") {
      break;
    }

    const stations = await getStations(api, lineId);
    const stationId = await chooseStation(stations);

    if (stationId === "back") {
      continue;
    }

    chosenStations.push({ lineId, stationId });
  }

  console.log(chosenStations);

  return chosenStations;
};

module.exports.showStationMenu = async (files) => {
  const stations = await chooseStations();

  importModule("./saved-stations.js").saveStations(files, stations);
};
