import { PointerEvent } from "react";
import { DragMode, PdfBox, ResizeCorner } from "../types/pdf";
import { boxToStyle } from "../utils/geometry";
import ResizeHandle from "./ResizeHandle";

const CORNERS: ResizeCorner[] = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];

interface BoxOverlayProps {
  outputKey: string;
  box: PdfBox;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (key: string | null) => void;
  onDragStart: (mode: DragMode, event: PointerEvent) => void;
}

// Bounding box
export default function BoxOverlay({
  outputKey,
  box,
  isHovered,
  isSelected,
  onHover,
  onDragStart,
}: BoxOverlayProps) {
  let colorClass = "border-red-500";
  if (isHovered) colorClass = "border-green-500 bg-green-500/25";
  if (isSelected) colorClass = "border-blue-500 bg-blue-500/25";

  return (
    <div
      onMouseEnter={() => onHover(outputKey)}
      onMouseLeave={() => onHover(null)}
      onPointerDown={(event) => {
        event.stopPropagation();
        onDragStart("move", event);
      }}
      className={`absolute cursor-move border-2 ${colorClass}`}
      style={boxToStyle(box)}
    >
      {/* label box */}
      <span className="absolute bottom-full left-0 bg-black px-1 text-xs font-bold text-white">
        {outputKey}
      </span>

      {isSelected &&
        CORNERS.map((corner) => (
          <ResizeHandle
            key={corner}
            corner={corner}
            onDragStart={(event) => onDragStart(corner, event)}
          />
        ))}
    </div>
  );
}
