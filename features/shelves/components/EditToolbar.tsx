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
    <div className="flex items-center justify-between gap-2 pb-2 mb-1 border-b border-gray-200 sticky top-0 bg-white z-10">
      <button
        type="button"
        onClick={onCancel}
        className="px-3 py-1.5 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition"
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
