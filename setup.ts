const alert = new Alert();
alert.title = "Test alert";
alert.message = "Description";

alert.addAction("Ok");
alert.addDestructiveAction("Destroy the universe");
alert.addCancelAction("Cancel");

alert.addTextField("Sample input");

const result = await alert.present();

console.log(`You entered ${result} and ${alert.textFieldValue(0)}`);