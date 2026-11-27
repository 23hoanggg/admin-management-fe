import { PdfDetail } from "../types/pdf";
import DetailCard from "./DetailCard";

interface DetailListProps {
  details: PdfDetail[];
  hoveredKey: string | null;
  selectedKey: string | null;
  onHover: (key: string | null) => void;
  onSelect: (key: string) => void;
  hasChanges: boolean;
  onCancel: () => void;
}

export default function DetailList({
  details,
  hoveredKey,
  selectedKey,
  onHover,
  onSelect,
  hasChanges,
  onCancel,
}: DetailListProps) {
  return (
    <div className="w-80 shrink-0 space-y-2 overflow-y-auto border-l bg-card p-3 lg:w-96">
      {/* unsaved changes */}
      {hasChanges && (
        <div className="flex items-center justify-between rounded-md border border-dashed p-2">
          <span className="text-sm text-muted-foreground">Unsaved changes</span>
          <button type="button" className="btn btn-sm" onClick={onCancel}>
            Cancel
          </button>
        </div>
      )}

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
          isSelected={selectedKey === detail.outputKey}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
