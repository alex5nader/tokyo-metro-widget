module.exports.OdptApi = class OdptApi {
  endpoints = {
    lines: "odpt:Railway",
    stations: "odpt:Station",
    stationTimetables: "odpt:StationTimetable",
  };

  constructor(accessToken) {
    this.token = accessToken;
  }

  apiUrl(endpoint) {
    return `https://api.odpt.org/api/v4/${endpoint}?acl:consumerKey=${this.token}`;
  }

  static encodeParams(params) {
    return Object.entries(params).map(([key, value]) =>
      `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    ).join("");
  }

  async get(endpoint, params) {
    if (!endpoint) throw new Error(`Invalid endpoint ${endpoint}`);

    const fullUrl = this.apiUrl(endpoint) + OdptApi.encodeParams(params);

    try {
      return JSON.parse(await new Request(fullUrl).loadString());
    } catch (_) {
      return null;
    }
  }
};
