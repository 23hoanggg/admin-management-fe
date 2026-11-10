import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShelfItem, Polygon, PolygonDraft } from "../types/shelf";
import { bboxToPolygon } from "../utils/geometry";
import { getMatchedIds } from "../utils/search";
import { updateJobItem, UpdateItemInput } from "@/app/lib/api/jobs";

export function useShelfEditor(jobId: string, initialItems: ShelfItem[]) {
  const queryClient = useQueryClient();
  const [items, setItems] = useState<ShelfItem[]>(initialItems);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<PolygonDraft | null>(null);
  const [infoId, setInfoId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const matchedIds = useMemo(() => getMatchedIds(items, query), [items, query]);
  const infoItem = items.find((i) => i.id === infoId);

  const mutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateItemInput }) =>
      updateJobItem(jobId, id, input),
    onSuccess: (saved) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === saved.id ? saved : item,
        ),
      );
      queryClient.invalidateQueries({ queryKey: ["jobs", jobId, "editor"] });
    },
  });

  const handleSelect = (id: string | null) => {
    if (id === null) {
      setSelectedId(null);
      setDraft(null);
      return;
    }
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const points: Polygon = item.polygon.length === 4 ? item.polygon : bboxToPolygon(item.bbox);
    setSelectedId(id);
    setDraft({ itemId: id, points });
  };

  const handleDraftChange = (points: Polygon) => {
    setDraft((prev) => (prev ? { ...prev, points } : null));
  };

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

  const handleSaveInfo = (changes: { name: string; shelfDigit: string }) => {
    if (!infoId) return;
    mutation.mutate(
      { id: infoId, input: changes },
      { onSuccess: () => setInfoId(null) },
    );
  };

  const closeInfo = () => setInfoId(null);

  return {
    items,
    hoveredId,
    selectedId,
    draft,
    query,
    matchedIds,
    infoItem,
    isSaving: mutation.isPending,
    saveError: mutation.isError ? mutation.error.message : null,
    setHoveredId,
    setQuery,
    setInfoId,
    handleSelect,
    handleDraftChange,
    handleSave,
    handleCancel,
    handleSaveInfo,
    closeInfo,
  };
}
