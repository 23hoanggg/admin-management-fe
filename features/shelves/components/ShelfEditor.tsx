"use client";

import { ImageInfo, ShelfItem } from "../types/shelf";
import { useShelfEditor } from "../hooks/useShelfEditor";
import ImageArea from "./ImageArea";
import InfoList from "./InfoList";
import EditItemModal from "./EditItemModal";

export interface ShelfEditorProps {
  image: ImageInfo;
  initialItems: ShelfItem[];
  jobId: string;
}

export default function ShelfEditor({
  image,
  initialItems,
  jobId,
}: ShelfEditorProps) {
  const editor = useShelfEditor(jobId, initialItems);

  return (
    <div className="flex flex-col md:flex-row h-full w-full p-2 md:p-4 gap-3 md:gap-4 overflow-y-auto md:overflow-hidden">
      {editor.saveError && (
        <div
          role="alert"
          className="fixed top-4 right-4 z-50 rounded-md bg-red-600 px-4 py-2 text-sm text-white shadow"
        >
          Save error: {editor.saveError}
        </div>
      )}

      <ImageArea
        items={editor.items}
        hoveredId={editor.hoveredId}
        selectedId={editor.selectedId}
        draft={editor.draft}
        image={image}
        matchedIds={editor.matchedIds}
        onHover={editor.setHoveredId}
        onSelect={editor.handleSelect}
        onDraftChange={editor.handleDraftChange}
      />

      <InfoList
        items={editor.items}
        hoveredId={editor.hoveredId}
        selectedId={editor.selectedId}
        isSaving={editor.isSaving}
        query={editor.query}
        onQueryChange={editor.setQuery}
        matchedIds={editor.matchedIds}
        onHover={editor.setHoveredId}
        onSelect={editor.handleSelect}
        onSave={editor.handleSave}
        onCancel={editor.handleCancel}
        onEditInfo={editor.setInfoId}
      />

      {editor.infoItem && (
        <EditItemModal
          key={editor.infoItem.img_crop_id}
          item={editor.infoItem}
          onSave={editor.handleSaveInfo}
          onClose={editor.closeInfo}
        />
      )}
    </div>
  );
}
