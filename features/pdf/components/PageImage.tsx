/* eslint-disable @next/next/no-img-element */
import { PointerEvent, useRef, useState } from "react";
import {
  BoxCoord,
  DragMode,
  PdfBox,
  PdfDetail,
  SelectedBox,
} from "../types/pdf";
import { mouseToRatio, moveBox, resizeBox } from "../utils/geometry";
import BoxOverlay from "./BoxOverlay";

interface PageImageProps {
  imageUrl: string;
  page: number;
  details: PdfDetail[];
  hoveredKey: string | null;
  selected: SelectedBox | null;
  onHover: (key: string | null) => void;
  onSelect: (selected: SelectedBox | null) => void;
  onChangeBox: (outputKey: string, index: number, coord: BoxCoord) => void;
}

interface Drag {
  outputKey: string;
  index: number;
  mode: DragMode;
  startMouse: { x: number; y: number };
  startCoord: BoxCoord;
}

export default function PageImage({
  imageUrl,
  page,
  details,
  hoveredKey,
  selected,
  onHover,
  onSelect,
  onChangeBox,
}: PageImageProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<Drag | null>(null);

  // page_id
  function isOnThisPage(box: PdfBox) {
    return box.page_id === page - 1;
  }

  function isBoxSelected(outputKey: string, index: number) {
    if (!selected) return false;
    return selected.outputKey === outputKey && selected.index === index;
  }

  function startDrag(
    outputKey: string,
    index: number,
    box: PdfBox,
    mode: DragMode,
    event: PointerEvent,
  ) {
    const image = imageRef.current;
    if (!image) return;

    onSelect({ outputKey, index });
    image.setPointerCapture(event.pointerId);

    setDrag({
      outputKey,
      index,
      mode,
      startMouse: mouseToRatio(event, image),
      startCoord: box.coord,
    });
  }

  function handlePointerMove(event: PointerEvent) {
    const image = imageRef.current;
    if (!drag || !image) return;

    const mouse = mouseToRatio(event, image);
    const dx = mouse.x - drag.startMouse.x;
    const dy = mouse.y - drag.startMouse.y;

    let coord: BoxCoord;
    if (drag.mode === "move") {
      coord = moveBox(drag.startCoord, dx, dy);
    } else {
      coord = resizeBox(drag.startCoord, drag.mode, dx, dy);
    }

    onChangeBox(drag.outputKey, drag.index, coord);
  }

  function handlePointerUp() {
    setDrag(null);
  }

  return (
    <div
      onPointerDown={() => onSelect(null)}
      className="flex flex-1 items-center justify-center overflow-auto bg-muted p-4"
    >
      <div
        ref={imageRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative h-full touch-none select-none"
      >
        <img
          src={imageUrl}
          alt={`Page ${page}`}
          draggable={false}
          className="block h-full w-auto border bg-white"
        />

        {details.map((detail) =>
          detail.boxes.map((box, index) => {
            if (!isOnThisPage(box)) return null;

            return (
              <BoxOverlay
                key={`${detail.outputKey}-${index}`}
                outputKey={detail.outputKey}
                box={box}
                isHovered={hoveredKey === detail.outputKey}
                isSelected={isBoxSelected(detail.outputKey, index)}
                onHover={onHover}
                onDragStart={(mode, event) =>
                  startDrag(detail.outputKey, index, box, mode, event)
                }
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
