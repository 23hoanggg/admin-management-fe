"use client";

import { useState } from "react";
import { BoxCoord, PdfDetail, SelectedBox } from "../types/pdf";
import PageImage from "./PageImage";
import DetailList from "./DetailList";

interface PdfViewerProps {
  imageUrl: string;
  page: number;
  details: PdfDetail[];
}

export default function PdfViewer({ imageUrl, page, details }: PdfViewerProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [selected, setSelected] = useState<SelectedBox | null>(null);
  const [draft, setDraft] = useState<PdfDetail[] | null>(null);

  let shownDetails = details;
  if (draft) shownDetails = draft;

  const hasChanges = draft !== null;

  let selectedKey: string | null = null;
  if (selected) selectedKey = selected.outputKey;

  function updateBoxCoord(outputKey: string, index: number, coord: BoxCoord) {
    const newDetails = shownDetails.map((detail) => {
      if (detail.outputKey !== outputKey) return detail;

      const boxes = [...detail.boxes];
      boxes[index] = { ...boxes[index], coord };
      return { ...detail, boxes };
    });

    setDraft(newDetails);
  }

  function selectDetail(outputKey: string) {
    if (selected && selected.outputKey === outputKey) {
      setSelected(null);
      return;
    }
    setSelected({ outputKey, index: 0 });
  }

  return (
    <div className="flex min-w-0 flex-1">
      <PageImage
        imageUrl={imageUrl}
        page={page}
        details={shownDetails}
        hoveredKey={hoveredKey}
        selected={selected}
        onHover={setHoveredKey}
        onSelect={setSelected}
        onChangeBox={updateBoxCoord}
      />

      <DetailList
        details={shownDetails}
        hoveredKey={hoveredKey}
        selectedKey={selectedKey}
        onHover={setHoveredKey}
        onSelect={selectDetail}
        hasChanges={hasChanges}
        onCancel={() => setDraft(null)}
      />
    </div>
  );
}
