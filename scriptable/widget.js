module.exports.makeTokyoMetroWidget = (files) => {
  const widget = new ListWidget();

  const image = files.readImage(files.toAbsolute("station_icon_n-14.png"));
  widget.addImage(image);
  widget.addImage(image);
  widget.addImage(image);
  widget.addImage(image);

  return widget;
};

