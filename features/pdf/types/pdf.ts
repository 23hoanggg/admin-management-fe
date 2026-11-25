export interface PdfDetail {
  outputKey: string;
  overall: string; // OK / NG
  text: string[];
  boxes: PdfBox[];
}

export interface PdfBox {
  coord: [number, number, number, number];
  page_id: number;
}
