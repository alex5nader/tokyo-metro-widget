module.exports.update = async (installer) => {
  await Promise.all([
    installer.downloadTargets({ force: true }),
    installer.redownloadInstaller(),
  ]);

  const { Message } = importModule("./wizard.js");

  await new Message("Update Code", "Successfully updated.").present();
};
