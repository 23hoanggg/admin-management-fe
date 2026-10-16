"use client";

import { useMemo, useState } from "react";
import { ShelfItem } from "../types/shelf";

interface InfoListProps {
  items: ShelfItem[];
  hoveredId: string | null;
  selectedId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string | null) => void;
  onSave: () => void;
  onCancel: () => void;
  onEditInfo: (id: string) => void;
  isSaving?: boolean;
}

const normalize = (value: unknown) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();

export default function InfoList({
  items,
  hoveredId,
  selectedId,
  onHover,
  onSelect,
  onSave,
  onCancel,
  onEditInfo,
  isSaving = false,
}: InfoListProps) {
  const [query, setQuery] = useState("");

  const displayItems = useMemo(() => {
    if (selectedId) {
      return items.filter((item) => item.img_crop_id === selectedId);
    }
    const q = normalize(query);
    if (!q) return items;

    return items.filter(
      (item) =>
        normalize(item.name).includes(q) ||
        normalize(item.shelf_digit).includes(q),
    );
  }, [items, selectedId, query]);

  return (
    <div className="w-full md:w-80 lg:w-96 p-3 md:p-4 rounded-lg flex flex-col gap-2 overflow-y-auto h-full md:h-full max-h-[500px] md:max-h-none border border-gray-200 bg-white">
      {selectedId ? (
        <div className="flex items-center justify-between gap-2 pb-2 mb-1 border-b border-gray-200 sticky top-0 bg-white z-10">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition"
          >
            Cancel ({items.length})
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="px-4 py-1.5 text-xs sm:text-sm bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      ) : (
        <div className="pb-2 mb-1 border-b border-gray-100 flex flex-col gap-2 sticky top-0 bg-white z-10">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or shelf number..."
              className="w-full px-3 py-1.5 pr-8 text-sm border border-gray-300 rounded-md outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
            )}
          </div>
          <div className="text-xs text-gray-500 font-medium">
            {query
              ? `${displayItems.length} / ${items.length} shelves`
              : `Total: ${items.length} products`}
          </div>
        </div>
      )}

      {/* Item cards */}
      <div className="space-y-2 overflow-y-auto">
        {!selectedId && displayItems.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-6">
            No shelves match &quot;{query}&quot;
          </p>
        )}

        {displayItems.map((item) => {
          const id = item.img_crop_id;
          if (!id) return null;

          const isSelected = selectedId === id;
          const isHovered = hoveredId === id;

          return (
            <div
              key={id}
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
                      e.stopPropagation(); // không kích hoạt onSelect của card
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
        })}
      </div>
    </div>
  );
}
