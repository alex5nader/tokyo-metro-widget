const calculateDimensions = (count) => {
  let width;
  for (width = Math.ceil(Math.sqrt(count)); width > 1; width--) {
    if (count % width === 0) break;
  }
  return [width, count / width];
};

module.exports.makeTokyoMetroWidget = (files, stations) => {
  const { getIcon } = importModule("./download-icons.js");

  const [width, height] = calculateDimensions(stations.length);
  console.log(`${width} x ${height}`);

  const widget = new ListWidget();
  const wrapper = widget.addStack();
  wrapper.layoutVertically();

  wrapper.addText("Tokyo Metro departures");
  wrapper.addSpacer(10);

  for (let y = 0; y < height; y++) {
    const row = wrapper.addStack();
    row.spacing = 5;
    row.centerAlignContent();

    for (let x = 0; x < width; x++) {
      const { departureTimes, stationCode } = stations[y * width + x];
      console.log(stationCode);

      const stationInfo = row.addStack();
      stationInfo.spacing = 5;
      stationInfo.layoutVertically();

      const imageWrapper = stationInfo.addStack();
      imageWrapper.addSpacer();
      const image = getIcon(files, stationCode);
      imageWrapper.addImage(image);
      imageWrapper.addSpacer();

      const time = stationInfo.addStack();
      time.addSpacer();
      time.addText(`${departureTimes[0]}    ${departureTimes[1]}`);
      time.addSpacer();
    }
  }

  return widget;
};
