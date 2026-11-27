import { BoxCoord, PdfBox, ResizeCorner } from "../types/pdf";

const MIN_SIZE = 0.01;

// ratio box
export function boxToStyle(box: PdfBox) {
  const [x, y, width, height] = box.coord;

  return {
    left: `${x * 100}%`,
    top: `${y * 100}%`,
    width: `${width * 100}%`,
    height: `${height * 100}%`,
  };
}

// mouse position
export function mouseToRatio(
  event: { clientX: number; clientY: number },
  image: HTMLElement,
) {
  const rect = image.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) / rect.width,
    y: (event.clientY - rect.top) / rect.height,
  };
}

function clamp(value: number, min: number, max: number) {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}

// move box
export function moveBox(start: BoxCoord, dx: number, dy: number): BoxCoord {
  const [x, y, width, height] = start;

  const newX = clamp(x + dx, 0, 1 - width);
  const newY = clamp(y + dy, 0, 1 - height);

  return [newX, newY, width, height];
}

// resize box
export function resizeBox(
  start: BoxCoord,
  corner: ResizeCorner,
  dx: number,
  dy: number,
): BoxCoord {
  const [x, y, width, height] = start;
  let left = x;
  let top = y;
  let right = x + width;
  let bottom = y + height;

  // left + right
  if (corner === "top-left" || corner === "bottom-left") {
    left = clamp(left + dx, 0, right - MIN_SIZE);
  } else {
    right = clamp(right + dx, left + MIN_SIZE, 1);
  }

  // top + bottom
  if (corner === "top-left" || corner === "top-right") {
    top = clamp(top + dy, 0, bottom - MIN_SIZE);
  } else {
    bottom = clamp(bottom + dy, top + MIN_SIZE, 1);
  }

  return [left, top, right - left, bottom - top];
}
