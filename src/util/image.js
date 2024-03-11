export function sizeImageWidth(widthInput, heightInput) {
  const standardHeight = 1080;

  // 498 x 375
  // 1434 x 1080

  // standardWidth
  return widthInput / (heightInput / standardHeight);
}
