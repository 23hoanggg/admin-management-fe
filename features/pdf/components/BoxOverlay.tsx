import { PdfBox } from "../types/pdf";
import { boxToStyle } from "../utils/geometry";

interface BoxOverlayProps {
  outputKey: string;
  box: PdfBox;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (key: string | null) => void;
  onClick: () => void;
}

// box polygon
export default function BoxOverlay({
  outputKey,
  box,
  isHovered,
  isSelected,
  onHover,
  onClick,
}: BoxOverlayProps) {
  let colorClass = "border-red-500";
  if (isHovered) colorClass = "border-green-500 bg-green-500/25";
  if (isSelected) colorClass = "border-blue-500 bg-blue-500/25";

  return (
    <div
      onMouseEnter={() => onHover(outputKey)}
      onMouseLeave={() => onHover(null)}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={`absolute cursor-pointer border-2 ${colorClass}`}
      style={boxToStyle(box)}
    >
      {/* label box */}
      <span className="absolute bottom-full left-0 bg-black px-1 text-xs font-bold text-white">
        {outputKey}
      </span>
    </div>
  );
}
