export type BoundingBox = [x: number, y: number, width: number, height: number];

export type Point = {
  x: number;
  y: number;
};

export type Polygon = [Point, Point, Point, Point];

// Giống message EditorItem trong proto/image.proto
export interface ShelfItem {
  id: string;
  name: string;
  shelfDigit: string;
  bbox: BoundingBox;
  polygon: Polygon | []; // [] = chưa vẽ polygon
}

export interface ImageInfo {
  src: string;
  width: number;
  height: number;
}

export interface PolygonDraft {
  itemId: string;
  points: Polygon;
}
