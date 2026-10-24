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
      <button
        type="button"
        onClick={onCancel}
        className="px-3 py-1.5 text-xs sm:text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium rounded-md transition"
      >
        Cancel ({totalCount})
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="px-4 py-1.5 text-xs sm:text-sm bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
