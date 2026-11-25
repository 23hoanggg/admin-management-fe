import { PdfDetail } from "../types/pdf";

interface DetailCardProps {
  detail: PdfDetail;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (key: string | null) => void;
  onSelect: (key: string) => void;
}

export default function DetailCard({
  detail,
  isHovered,
  isSelected,
  onHover,
  onSelect,
}: DetailCardProps) {
  let colorClass = "border-border";
  if (isHovered)
    colorClass = "border-green-400 bg-green-50 dark:bg-green-500/10";
  if (isSelected) colorClass = "border-blue-500 bg-blue-50 dark:bg-blue-500/10";

  return (
    <div
      onMouseEnter={() => onHover(detail.outputKey)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(detail.outputKey)}
      className={`cursor-pointer rounded-md border p-3 transition-colors ${colorClass}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-bold">{detail.outputKey}</span>
        <span className="text-xs font-medium text-destructive">
          {detail.overall}
        </span>
      </div>

      {detail.text.map((line, index) => (
        <p key={index} className="mt-1 text-sm">
          {line}
        </p>
      ))}
    </div>
  );
}
