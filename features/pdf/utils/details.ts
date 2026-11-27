import { PdfDetail } from "../types/pdf";

// item NG
export function getNgDetails(detailsJson?: string): PdfDetail[] {
  if (!detailsJson) return [];

  const details: PdfDetail[] = JSON.parse(detailsJson);
  return details.filter((detail) => detail.overall !== "OK");
}
