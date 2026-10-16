import { ShelfItem } from "../types/shelf";

interface InfoListProps {
  items: ShelfItem[];
  hoveredId: string | null;
  selectedId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string | null) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function InfoList({
  items,
  hoveredId,
  selectedId,
  onHover,
  onSelect,
  onSave,
  onCancel,
}: InfoListProps) {
  const displayItems = selectedId
    ? items.filter((item) => item.img_crop_id === selectedId)
    : items;

  return (
    <div className="w-full md:w-80 lg:w-96 p-3 md:p-4 rounded-lg flex flex-col gap-2 overflow-y-auto h-full md:h-full max-h-[500px] md:max-h-none border border-gray-200 bg-white">
      {selectedId ? (
        <div className="flex items-center justify-between gap-2 pb-2 mb-1 border-b border-gray-200 sticky top-0 bg-white z-10">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition"
          >
            Back ({items.length})
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-4 py-1.5 text-xs sm:text-sm bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="pb-2 mb-1 border-b border-gray-100 text-xs text-gray-500 font-medium">
          Total: {items.length} shelves
        </div>
      )}

      {/* Item cards */}
      <div className="space-y-2 overflow-y-auto">
        {displayItems.map((item) => {
          if (!item.img_crop_id) return null;

          const isSelected = selectedId === item.img_crop_id;
          const isHovered = hoveredId === item.img_crop_id;

          return (
            <div
              key={item.img_crop_id}
              onMouseEnter={() => onHover(item.img_crop_id)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onSelect(isSelected ? null : item.img_crop_id)}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                isSelected
                  ? "bg-green-100 border-green-500"
                  : isHovered
                    ? "bg-green-50 border-green-400"
                    : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-gray-900">
                  Shelf: {item.shelf_digit}
                </span>
                {isSelected && (
                  <span className="text-xs text-green-700 font-semibold bg-green-200 px-2 py-0.5 rounded">
                    Editing
                  </span>
                )}
              </div>

              <div className="text-sm text-gray-800 mt-1 font-medium">
                Name: {item.name || "Unknown Item"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
