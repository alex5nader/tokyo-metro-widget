const calculateDimensions = (count) => {
  let width;
  for (width = Math.ceil(Math.sqrt(count)); width > 1; width--) {
    if (count % width === 0) break;
  }
  return [width, count / width];
};

module.exports.makeTokyoMetroWidget = (files) => {
  const widget = new ListWidget();

  const image = files.readImage(files.toAbsolute("station_icon_n-14.png"));
  widget.addImage(image);
  widget.addImage(image);
  widget.addImage(image);
  widget.addImage(image);

  return widget;
};
