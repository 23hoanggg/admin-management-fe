/* eslint-disable @next/next/no-img-element */
import { PdfBox, PdfDetail, SelectedBox } from "../types/pdf";
import BoxOverlay from "./BoxOverlay";

interface PageImageProps {
  imageUrl: string;
  page: number;
  details: PdfDetail[];
  hoveredKey: string | null;
  selected: SelectedBox | null;
  onHover: (key: string | null) => void;
  onSelect: (selected: SelectedBox | null) => void;
}

export default function PageImage({
  imageUrl,
  page,
  details,
  hoveredKey,
  selected,
  onHover,
  onSelect,
}: PageImageProps) {
  const isOnThisPage = (box: PdfBox) => box.page_id === page - 1;

  return (
    <div
      onClick={() => onSelect(null)}
      className="flex flex-1 items-center justify-center overflow-auto bg-muted p-4"
    >
      <div className="relative h-full">
        <img
          src={imageUrl}
          alt={`Page ${page}`}
          className="block h-full w-auto border bg-white"
        />

        {details.map((detail) =>
          detail.boxes.map((box, index) => {
            if (!isOnThisPage(box)) return null;

            const isSelected =
              selected?.outputKey === detail.outputKey &&
              selected.index === index;

            return (
              <BoxOverlay
                key={`${detail.outputKey}-${index}`}
                outputKey={detail.outputKey}
                box={box}
                isHovered={hoveredKey === detail.outputKey}
                isSelected={isSelected}
                onHover={onHover}
                onClick={() =>
                  onSelect(
                    isSelected ? null : { outputKey: detail.outputKey, index },
                  )
                }
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
