import { PdfBox } from "../types/pdf";

export function boxToStyle(box: PdfBox) {
  const [x, y, width, height] = box.coord;

  return {
    left: `${x * 100}%`,
    top: `${y * 100}%`,
    width: `${width * 100}%`,
    height: `${height * 100}%`,
  };
}
