interface EditToolbarProps {
  totalCount: number;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export default function EditToolbar({
  totalCount,
  isSaving,
  onSave,
  onCancel,
}: EditToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-2 pb-2 mb-1 border-b border-border sticky top-0 bg-card z-10">
      <button type="button" onClick={onCancel} className="btn btn-sm">
        Cancel ({totalCount})
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="btn btn-primary btn-sm"
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
