const { Wizard } = await importModule("./wizard.js");

module.exports = new Wizard("Tokyo Metro Widget", {
  ["Manage API Key"]: () => importModule("./manage-api-key.js"),
});

