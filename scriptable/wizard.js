module.exports.Wizard = class Wizard {
  constructor(title, pages) {
    this.alert = new Alert();
    this.alert.title = title;

    this.pages = [];
    for (const [label, page] of Object.entries(pages)) {
      this.alert.addAction(label);
      this.pages.push(page);
    }

    this.alert.addCancelAction("Cancel");
  }

  async present() {
    const choice = await this.alert.present();

    if (choice === -1) {
      return;
    }

    const page = this.pages[choice];
    if (typeof page === "function") {
      return (await page()).present();
    } else {
      return page.present();
    }
  }
};
