import { BoundingBox, Point, Polygon } from "../types/shelf";

export function bboxToPolygon(bbox: BoundingBox): Polygon {
  const [x, y, width, height] = bbox;

  return [
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height },
  ];
}

export function polygonToBBox(polygon: Polygon): BoundingBox {
  const xs = polygon.map((point) => point.x);
  const ys = polygon.map((point) => point.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return [minX, minY, maxX - minX, maxY - minY];
}

export function clampPoint(
  point: Point,
  imageWidth: number,
  imageHeight: number,
): Point {
  const x = point.x;
  const y = point.y;

  const clampedX = Math.max(0, Math.min(imageWidth, x));
  const clampedY = Math.max(0, Math.min(imageHeight, y));

  return {
    x: clampedX,
    y: clampedY,
  };
}

export function translatePolygonWithinBounds(
  polygon: Polygon,
  dx: number,
  dy: number,
  imageWidth: number,
  imageHeight: number,
): Polygon {
  const xs = polygon.map((point) => point.x);
  const ys = polygon.map((point) => point.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  // Calculate maximum allowed movement in X and Y
  const allowedDx = Math.max(-minX, Math.min(dx, imageWidth - maxX));
  const allowedDy = Math.max(-minY, Math.min(dy, imageHeight - maxY));

  return polygon.map((point) => ({
    x: point.x + allowedDx,
    y: point.y + allowedDy,
  })) as Polygon;
}
