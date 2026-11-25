"use client";

import { useState } from "react";
import { PdfDetail } from "../types/pdf";
import PageImage from "./PageImage";
import DetailList from "./DetailList";

interface PdfViewerProps {
  imageUrl: string;
  page: number;
  details: PdfDetail[];
}

export default function PdfViewer({ imageUrl, page, details }: PdfViewerProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  return (
    <div className="flex min-w-0 flex-1">
      <PageImage
        imageUrl={imageUrl}
        page={page}
        details={details}
        hoveredKey={hoveredKey}
        onHover={setHoveredKey}
      />

      <DetailList
        details={details}
        hoveredKey={hoveredKey}
        onHover={setHoveredKey}
      />
    </div>
  );
}
