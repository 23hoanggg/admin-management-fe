import { PdfBox } from "../types/pdf";
import { boxToStyle } from "../utils/geometry";

interface BoxOverlayProps {
  outputKey: string;
  box: PdfBox;
  isHovered: boolean;
  onHover: (key: string | null) => void;
}

// box polygon
export default function BoxOverlay({
  outputKey,
  box,
  isHovered,
  onHover,
}: BoxOverlayProps) {
  const colorClass = isHovered
    ? "border-green-500 bg-green-500/25"
    : "border-red-500";

  return (
    <div
      onMouseEnter={() => onHover(outputKey)}
      onMouseLeave={() => onHover(null)}
      className={`absolute border-2 ${colorClass}`}
      style={boxToStyle(box)}
    >
      {/* label box */}
      <span className="absolute bottom-full left-0 bg-black px-1 text-xs font-bold text-white">
        {outputKey}
      </span>
    </div>
  );
}
