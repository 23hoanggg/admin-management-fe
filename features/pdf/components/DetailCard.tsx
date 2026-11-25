import { PdfDetail } from "../types/pdf";

interface DetailCardProps {
  detail: PdfDetail;
  isHovered: boolean;
  onHover: (key: string | null) => void;
}

export default function DetailCard({
  detail,
  isHovered,
  onHover,
}: DetailCardProps) {
  const colorClass = isHovered
    ? "border-green-400 bg-green-50 dark:bg-green-500/10"
    : "border-border";

  return (
    <div
      onMouseEnter={() => onHover(detail.outputKey)}
      onMouseLeave={() => onHover(null)}
      className={`rounded-md border p-3 transition-colors ${colorClass}`}
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
