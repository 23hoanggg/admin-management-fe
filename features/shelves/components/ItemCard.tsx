import { ShelfItem } from "../types/shelf";

interface ItemCardProps {
  item: ShelfItem;
  isSelected: boolean;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string | null) => void;
  onEditInfo: (id: string) => void;
}

export default function ItemCard({
  item,
  isSelected,
  isHovered,
  onHover,
  onSelect,
  onEditInfo,
}: ItemCardProps) {
  const id = item.img_crop_id;

  return (
    <div
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(isSelected ? null : id)}
      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
        isSelected
          ? "bg-green-100 border-green-500"
          : isHovered
            ? "bg-green-50 border-green-400"
            : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold text-sm text-gray-900">
          Shelf: {item.shelf_digit}
        </span>
        <div className="flex items-center gap-2">
          {isSelected && (
            <span className="text-xs text-green-700 font-semibold bg-green-200 px-2 py-0.5 rounded">
              Editing
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEditInfo(id);
            }}
            className="text-xs text-blue-600 hover:underline"
          >
            Edit info
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-800 mt-1 font-medium">
        Name: {item.name || "Unknown Item"}
      </div>
    </div>
  );
}
