export type BoundingBox = [x: number, y: number, width: number, height: number];

export type Point = {
  x: number;
  y: number;
};

export type Polygon = [Point, Point, Point, Point];

export interface ShelfItem {
  bboxes: BoundingBox;
  shelf_digit: string;
  id: string | null;
  name: string;
  img_crop_id: string;
  polygon?: Polygon;
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
