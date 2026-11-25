"use client";

import { useState } from "react";
import { PdfDetail, SelectedBox } from "../types/pdf";
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

  function selectDetail(outputKey: string) {
    if (selected?.outputKey === outputKey) {
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
        details={details}
        hoveredKey={hoveredKey}
        selected={selected}
        onHover={setHoveredKey}
        onSelect={setSelected}
      />

      <DetailList
        details={details}
        hoveredKey={hoveredKey}
        selectedKey={selected?.outputKey ?? null}
        onHover={setHoveredKey}
        onSelect={selectDetail}
      />
    </div>
  );
}
