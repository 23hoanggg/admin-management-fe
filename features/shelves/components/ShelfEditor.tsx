"use client";

import React, { useEffect, useState } from "react";
import { ImageInfo, MockData, ShelfItem, Polygon } from "../types/shelf";
import rawData from "../data/mock.json";
import { bboxToPolygon, polygonToBBox } from "../utils/geometry";
import ImageArea from "./ImageArea";
import InfoList from "./InfoList";

const mockData = rawData as unknown as MockData;

interface PolygonDraft {
  itemId: string;
  points: Polygon;
}

export interface ShelfEditorProps {
  image: ImageInfo;
}

export default function ShelfEditor({ image }: ShelfEditorProps) {
  const [items, setItems] = useState<ShelfItem[]>(mockData.results);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<PolygonDraft | null>(null);

  useEffect(() => {
    try {
      const savedItems = localStorage.getItem("shelf-items");
      if (savedItems) {
        const parsedItems: ShelfItem[] = JSON.parse(savedItems);
        queueMicrotask(() => {
          setItems(parsedItems);
        });
      }
    } catch (error) {
      console.error("Failed to load shelf items:", error);
    }
  }, []);

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

  const handleSave = () => {
    if (!draft) return;

    const updatedBbox = polygonToBBox(draft.points);

    const updatedItems = items.map((item) => {
      if (item.img_crop_id !== draft.itemId) return item;
      return {
        ...item,
        polygon: draft.points,
        updated_bboxes: updatedBbox,
      };
    });

    setItems(updatedItems);
    localStorage.setItem("shelf-items", JSON.stringify(updatedItems));
    setDraft(null);
    setSelectedId(null);
  };

  const handleCancel = () => {
    setDraft(null);
    setSelectedId(null);
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full p-2 md:p-4 gap-3 md:gap-4 overflow-y-auto md:overflow-hidden">
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
        onHover={setHoveredId}
        onSelect={handleSelect}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
