import { Point } from "../types/shelf";

interface StaticPolygonProps {
  points: Point[];
  shelfDigit: string;
  itemId: string;
  isHovered: boolean;
  isMatched?: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string | null) => void;
}

export default function StaticPolygon({
  points,
  shelfDigit,
  itemId,
  isHovered,
  isMatched = false,
  onHover,
  onSelect,
}: StaticPolygonProps) {
  const pointsString = points.map((p) => `${p.x},${p.y}`).join(" ");

  const strokeColor = isHovered ? "#00FF7F" : isMatched ? "#2C2CFF" : "#ef4444";
  const fillColor = isHovered
    ? "rgba(34, 197, 94, 0.25)"
    : isMatched
      ? "rgba(59, 130, 246, 0.25)"
      : "transparent";

  return (
    <g
      onMouseEnter={() => onHover(itemId)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(itemId)}
      className="cursor-pointer"
    >
      <polygon
        points={pointsString}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="16"
      />

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
    </g>
  );
}
