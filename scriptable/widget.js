const { getIcon } = importModule("./download-icons.js");

ListWidget.prototype.addStackWith =
  WidgetStack.prototype.addStackWith =
    function addStackWith(f) {
      const stack = this.addStack();
      f(stack);
      return stack;
    };

ListWidget.prototype.addRow =
  WidgetStack.prototype.addRow =
    function addRow(f) {
      return this.addStackWith((stack) => {
        stack.layoutHorizontally();
        f(stack);
      });
    };

ListWidget.prototype.addColumn =
  WidgetStack.prototype.addColumn =
    function addColumn(f) {
      return this.addStackWith((stack) => {
        stack.layoutVertically();
        f(stack);
      });
    };

ListWidget.prototype.center =
  WidgetStack.prototype.center =
    function center(f) {
      this.addSpacer();
      f(this);
      this.addSpacer();
    };

ListWidget.prototype.addCenteredRow =
  WidgetStack.prototype.addCenteredRow =
    function addCenteredRow(f) {
      return this.addColumn((wrapper) => {
        wrapper.center(() => wrapper.addRow(f));
      });
    };

ListWidget.prototype.addCenteredColumn =
  WidgetStack.prototype.addCenteredColumn =
    function addCenteredColumn(f) {
      return this.addRow((wrapper) => {
        wrapper.center(() => wrapper.addColumn(f));
      });
    };

ListWidget.prototype.addTextWith =
  WidgetStack.prototype.addTextWith =
    function addTextWith(text, f) {
      const el = this.addText(text);
      f(el);
      return el;
    };

const addStationTitle = (parent, title) => {
  if (title.length === 5) {
    // 5 chars make a width of 92
    parent.addRow((row) => {
      const space = (parent.size.width - 92) / 2 - 1;
      row.addSpacer(space);
      row.addTextWith(title, (text) => {
        text.font = Font.title3();
      });
      row.addSpacer(space);
    });
  } else {
    parent.addRow((row) => {
      row.addSpacer();
      row.addTextWith(title, (text) => {
        text.font = Font.title3();
      });
      row.addSpacer();
    });
  }
};

const addStation = (parent, station, files, options) => {
  const stationSize = new Size(104, 87);

  const { departureTimes, stationCode, stationTitle } = station;

  parent.addColumn((wrapper) => {
    wrapper.size = stationSize;

    addStationTitle(wrapper, stationTitle);

    wrapper.addSpacer(3);

    wrapper.addRow((bottomRow) => {
      bottomRow.centerAlignContent();

      if (options?.loose) {
        bottomRow.spacing = 10;
      } else {
        bottomRow.spacing = 3;
      }

      bottomRow.size = new Size(stationSize.width, 60);

      const image = getIcon(files, stationCode);
      bottomRow.addImage(image).imageSize = new Size(50, 50);

      bottomRow.addColumn((rightColumn) => {
        rightColumn.size = new Size(45, 60);

        for (const time of departureTimes) {
          rightColumn.addText(time);
        }
      });
    });
  });
};

module.exports.makeTokyoMetroWidget = (files, stations) => {
  const widget = new ListWidget();

  widget.addColumn((wrapper) => {
    wrapper.addTextWith("東京メトロ今後出発予定", (title) => {
      title.font = Font.title2();
    });

    wrapper.addSpacer(10);

    wrapper.addRow((row) => {
      row.centerAlignContent();
      row.spacing = 5;

      if (stations.length === 3) {
        for (const station of stations) {
          addStation(row, station, files);
        }
      } else {
        row.addSpacer();
        for (const station of stations) {
          addStation(row, station, files, { loose: true });
          row.addSpacer();
        }
      }
    });
  });

  return widget;
};
