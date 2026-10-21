import { ShelfItem } from "../types/shelf";
import EditToolbar from "./EditToolbar";
import ItemCard from "./ItemCard";
import SearchBar from "./SearchBar";

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
  query: string;
  onQueryChange: (value: string) => void;
  matchedIds: Set<string> | null;
}

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
  query,
  onQueryChange,
  matchedIds,
}: InfoListProps) {
  const displayItems = selectedId
    ? items.filter((item) => item.img_crop_id === selectedId)
    : matchedIds
      ? items.filter((item) => matchedIds.has(item.img_crop_id))
      : items;

  return (
    <div className="w-full md:w-80 lg:w-96 p-3 md:p-4 rounded-lg flex flex-col gap-2 overflow-y-auto h-full md:h-full max-h-[500px] md:max-h-none border border-gray-200 bg-white">
      {selectedId ? (
        <EditToolbar
          totalCount={items.length}
          isSaving={isSaving}
          onSave={onSave}
          onCancel={onCancel}
        />
      ) : (
        <SearchBar
          query={query}
          onQueryChange={onQueryChange}
          isFiltering={matchedIds !== null}
          resultCount={displayItems.length}
          totalCount={items.length}
        />
      )}

      <div className="space-y-2 overflow-y-auto">
        {!selectedId && displayItems.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-6">
            No product match &quot;{query}&quot;
          </p>
        )}

        {displayItems.map((item) => (
          <ItemCard
            key={item.img_crop_id}
            item={item}
            isSelected={selectedId === item.img_crop_id}
            isHovered={hoveredId === item.img_crop_id}
            onHover={onHover}
            onSelect={onSelect}
            onEditInfo={onEditInfo}
          />
        ))}
      </div>
    </div>
  );
}
