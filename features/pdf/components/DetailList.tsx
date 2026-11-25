import { PdfDetail } from "../types/pdf";
import DetailCard from "./DetailCard";

interface DetailListProps {
  details: PdfDetail[];
  hoveredKey: string | null;
  onHover: (key: string | null) => void;
}

export default function DetailList({
  details,
  hoveredKey,
  onHover,
}: DetailListProps) {
  return (
    <div className="w-80 shrink-0 space-y-2 overflow-y-auto border-l bg-card p-3 lg:w-96">
      {details.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No NG items
        </p>
      )}

      {details.map((detail) => (
        <DetailCard
          key={detail.outputKey}
          detail={detail}
          isHovered={hoveredKey === detail.outputKey}
          onHover={onHover}
        />
      ))}
    </div>
  );
}
