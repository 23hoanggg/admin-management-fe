import { PointerEvent } from "react";
import { ResizeCorner } from "../types/pdf";

interface ResizeHandleProps {
  corner: ResizeCorner;
  onDragStart: (event: PointerEvent) => void;
}

// 4 conners resize
export default function ResizeHandle({
  corner,
  onDragStart,
}: ResizeHandleProps) {
  const isLeft = corner === "top-left" || corner === "bottom-left";
  const isTop = corner === "top-left" || corner === "top-right";

  let left = "100%";
  if (isLeft) left = "0%";

  let top = "100%";
  if (isTop) top = "0%";

  return (
    <div
      onPointerDown={(event) => {
        event.stopPropagation();
        onDragStart(event);
      }}
      className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blue-500 bg-white"
      style={{ left, top }}
    />
  );
}
