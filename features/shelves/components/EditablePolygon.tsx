import React, { useState } from "react";
import { clampPoint, translatePolygonWithinBounds } from "../utils/geometry";
import { Point, Polygon } from "../types/shelf";

interface EditablePolygonProps {
  points: Polygon;
  shelfDigit: string;
  imageWidth: number;
  imageHeight: number;
  getSvgPoint: (clientX: number, clientY: number) => Point;
  onChange: (points: Polygon) => void;
}

export default function EditablePolygon({
  points,
  shelfDigit,
  imageWidth,
  imageHeight,
  getSvgPoint,
  onChange,
}: EditablePolygonProps) {
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [isDraggingPolygon, setIsDraggingPolygon] = useState(false);
  const [lastPointer, setLastPointer] = useState<Point | null>(null);

  // 4 corners
  const handleCornerPointerDown = (
    index: number,
    e: React.PointerEvent<SVGCircleElement>,
  ) => {
    e.stopPropagation();
    setDraggingIdx(index);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleCornerPointerMove = (e: React.PointerEvent<SVGCircleElement>) => {
    if (draggingIdx === null) return;

    const svgCoords = getSvgPoint(e.clientX, e.clientY);
    const clamped = clampPoint(svgCoords, imageWidth, imageHeight);

    const newPoints = [...points] as Polygon;
    newPoints[draggingIdx] = clamped;
    onChange(newPoints);
  };

  const handleCornerPointerUp = (e: React.PointerEvent<SVGCircleElement>) => {
    if (draggingIdx === null) return;
    setDraggingIdx(null);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  // Drag polygon
  const handlePolygonPointerDown = (
    e: React.PointerEvent<SVGPolygonElement>,
  ) => {
    e.stopPropagation();
    setIsDraggingPolygon(true);
    const startPoint = getSvgPoint(e.clientX, e.clientY);
    setLastPointer(startPoint);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePolygonPointerMove = (
    e: React.PointerEvent<SVGPolygonElement>,
  ) => {
    if (!isDraggingPolygon || !lastPointer) return;

    const currentPoint = getSvgPoint(e.clientX, e.clientY);
    const dx = currentPoint.x - lastPointer.x;
    const dy = currentPoint.y - lastPointer.y;

    const newPoints = translatePolygonWithinBounds(
      points,
      dx,
      dy,
      imageWidth,
      imageHeight,
    );

    onChange(newPoints);
    setLastPointer(currentPoint);
  };

  const handlePolygonPointerUp = (e: React.PointerEvent<SVGPolygonElement>) => {
    if (!isDraggingPolygon) return;
    setIsDraggingPolygon(false);
    setLastPointer(null);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const pointsString = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <g>
      {/* Polygon */}
      <polygon
        points={pointsString}
        fill="rgba(34, 197, 94, 0.4)"
        stroke="#16a34a"
        strokeWidth="16"
        className="cursor-move"
        onPointerDown={handlePolygonPointerDown}
        onPointerMove={handlePolygonPointerMove}
        onPointerUp={handlePolygonPointerUp}
      />

      {/* Label */}
      <text
        x={points[0].x}
        y={Math.max(75, points[0].y - 20)}
        fill="white"
        stroke="black"
        strokeWidth="8"
        paintOrder="stroke fill"
        fontSize="85"
        fontWeight="bold"
        className="pointer-events-none select-none"
      >
        {shelfDigit}
      </text>

      {/* 4 Corners */}
      {points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="30"
          fill="white"
          stroke="purple"
          strokeWidth="10"
          className="cursor-move"
          onPointerDown={(e) => handleCornerPointerDown(index, e)}
          onPointerMove={handleCornerPointerMove}
          onPointerUp={handleCornerPointerUp}
        />
      ))}
    </g>
  );
}
