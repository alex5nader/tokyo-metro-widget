module.exports.update = async (installer) => {
  await Promise.all([
    installer.downloadTargets({ force: true }),
    installer.redownloadInstaller(),
  ]);

  const { showMessage } = importModule("./alerts.js");

  await showMessage({
    title: "Update Code",
    message: "Successfully updated.",
  });
};
