const setupApi = async (files) => {
  const accessToken = importModule("./manage-access-token.js").getAccessToken();
  if (!accessToken) {
    return null;
  }

  const { OdptApi } = importModule("./odpt.js");
  const api = new OdptApi(accessToken);

  return api;
};

const nextDeparture = async (api, station) => {
  const data = (await api.get(api.endpoints.stationTimetables, {
    "owl:sameAs": station.timetableId,
  }))[0];

  const now = new Date().getTime();

  const timetable = data["odpt:stationTimetableObject"];

  timetable.sort((a, b) =>
    a["odpt:departureTime"].localeCompare(b["odpt:departureTime"])
  );

  const idx = timetable.findIndex((obj) => {
    const [hour, minute] = obj["odpt:departureTime"].split(":");
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);

    return date.getTime() > now;
  });

  return [timetable[idx], timetable[(idx + 1) % timetable.length]];
};

module.exports.getSavedStationStatus = async (files) => {
  const savedStations = importModule("./saved-stations.js").loadStations(files);

  if (!savedStations) {
    return null;
  }

  const api = await setupApi();
  if (!api) {
    await showMessage({
      title: "Station Status",
      message:
        "Failed to get station status.\nDid you provide an access token?",
    });
    return null;
  }

  return Promise.all(
    savedStations.map(async (station) => {
      const departures = await nextDeparture(api, station);

      return {
        departureTimes: departures.map((departure) =>
          departure["odpt:departureTime"]
        ),
        stationCode: station.stationCode,
      };
    }),
  );
};
