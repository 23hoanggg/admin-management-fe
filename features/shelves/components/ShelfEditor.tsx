"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ImageInfo, ShelfItem, Polygon } from "../types/shelf";
import { bboxToPolygon } from "../utils/geometry";
import { updateJobItem, UpdateItemInput } from "@/app/lib/api/jobs";
import ImageArea from "./ImageArea";
import InfoList from "./InfoList";
import ItemEditModal from "./EditItemModel";

interface PolygonDraft {
  itemId: string;
  points: Polygon;
}

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
  const [items, setItems] = useState<ShelfItem[]>(initialItems);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<PolygonDraft | null>(null);
  const [infoId, setInfoId] = useState<string | null>(null);

  const infoItem = items.find((i) => i.img_crop_id === infoId);

  const mutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateItemInput }) =>
      updateJobItem(jobId, id, input),
    onSuccess: (saved) => {
      // Thay item cũ bằng item BE vừa trả về
      setItems((prev) =>
        prev.map((item) =>
          item.img_crop_id === saved.img_crop_id ? saved : item,
        ),
      );
    },
  });

  const handleSelect = (id: string | null) => {
    if (id === null) {
      setSelectedId(null);
      setDraft(null);
      return;
    }

    const item = items.find((i) => i.img_crop_id === id);
    if (!item) return;

    const points: Polygon = item.polygon ?? bboxToPolygon(item.bboxes);
    setSelectedId(id);
    setDraft({ itemId: id, points });
  };

  // Lưu hình dạng polygon
  const handleSave = () => {
    if (!draft) return;
    mutation.mutate(
      { id: draft.itemId, input: { polygon: draft.points } },
      {
        onSuccess: () => {
          setDraft(null);
          setSelectedId(null);
        },
      },
    );
  };

  const handleCancel = () => {
    mutation.reset();
    setDraft(null);
    setSelectedId(null);
  };

  // Lưu thông tin (tên, số kệ) từ modal
  const handleSaveInfo = (changes: { name: string; shelf_digit: string }) => {
    if (!infoId) return;
    mutation.mutate(
      { id: infoId, input: changes },
      { onSuccess: () => setInfoId(null) },
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full p-2 md:p-4 gap-3 md:gap-4 overflow-y-auto md:overflow-hidden">
      {mutation.isError && (
        <div
          role="alert"
          className="fixed top-4 right-4 z-50 rounded-md bg-red-600 px-4 py-2 text-sm text-white shadow"
        >
          Lưu thất bại: {mutation.error.message}
        </div>
      )}

      <ImageArea
        items={items}
        hoveredId={hoveredId}
        selectedId={selectedId}
        draft={draft}
        image={image}
        onHover={setHoveredId}
        onSelect={handleSelect}
        onDraftChange={(points) => {
          setDraft((prev) => (prev ? { ...prev, points } : null));
        }}
      />

      <InfoList
        items={items}
        hoveredId={hoveredId}
        selectedId={selectedId}
        isSaving={mutation.isPending}
        onHover={setHoveredId}
        onSelect={handleSelect}
        onSave={handleSave}
        onCancel={handleCancel}
        onEditInfo={setInfoId}
      />

      {infoItem && (
        <ItemEditModal
          key={infoItem.img_crop_id}
          item={infoItem}
          onSave={handleSaveInfo}
          onClose={() => setInfoId(null)}
        />
      )}
    </div>
  );
}
