import { ShelfItem } from "../types/shelf";

export const normalize = (value: unknown) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();

export function getMatchedIds(
  items: ShelfItem[],
  query: string,
): Set<string> | null {
  const q = normalize(query);
  if (!q) return null;

  const ids = new Set<string>();
  for (const item of items) {
    if (
      normalize(item.name).includes(q) ||
      normalize(item.shelf_digit).includes(q)
    ) {
      ids.add(item.img_crop_id);
    }
  }
  return ids;
}
