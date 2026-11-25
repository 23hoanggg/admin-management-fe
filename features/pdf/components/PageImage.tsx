/* eslint-disable @next/next/no-img-element */
import { PdfBox, PdfDetail } from "../types/pdf";
import BoxOverlay from "./BoxOverlay";

interface PageImageProps {
  imageUrl: string;
  page: number;
  details: PdfDetail[];
  hoveredKey: string | null;
  onHover: (key: string | null) => void;
}

export default function PageImage({
  imageUrl,
  page,
  details,
  hoveredKey,
  onHover,
}: PageImageProps) {
  const isOnThisPage = (box: PdfBox) => box.page_id === page - 1;

  return (
    <div className="flex flex-1 items-center justify-center overflow-auto bg-muted p-4">
      <div className="relative h-full">
        <img
          src={imageUrl}
          alt={`Page ${page}`}
          className="block h-full w-auto border bg-white"
        />

        {details.map((detail) =>
          detail.boxes
            .filter(isOnThisPage)
            .map((box, index) => (
              <BoxOverlay
                key={`${detail.outputKey}-${index}`}
                outputKey={detail.outputKey}
                box={box}
                isHovered={hoveredKey === detail.outputKey}
                onHover={onHover}
              />
            )),
        )}
      </div>
    </div>
  );
}
