// output runpod
export interface PdfDetail {
  outputKey: string;
  overall: string;
  text: string[];
  boxes: PdfBox[];
}

export interface PdfBox {
  coord: BoxCoord;
  page_id: number;
}

export type BoxCoord = [number, number, number, number];

// selected box
export interface SelectedBox {
  outputKey: string;
  index: number;
}

export type ResizeCorner =
  "top-left" | "top-right" | "bottom-left" | "bottom-right";

export type DragMode = "move" | ResizeCorner;
