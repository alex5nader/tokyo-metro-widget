const { Wizard } = await importModule("./wizard.js");

const one = new Wizard("One", {});
const two = new Wizard("Two", { one });

module.exports = new Wizard("Three", { one, two });
