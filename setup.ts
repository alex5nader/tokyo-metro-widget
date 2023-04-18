module.exports.setup = async function () {
  const alert = new Alert();
  alert.title = "Test alert";
  alert.message = "Description";

  alert.addAction("Ok");
  alert.addDestructiveAction("Destroy the universe");
  alert.addCancelAction("Cancel");

  alert.addTextField("Sample input");

  const result = await alert.present();

  console.log(`You entered ${result} and ${alert.textFieldValue(0)}`);

  Script.setShortcutOutput("the output");
  Script.complete();
};

module.exports.createWidget = async function () {
  // const widget = new ListWidget
};
