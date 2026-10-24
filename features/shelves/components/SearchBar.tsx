interface SearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  isFiltering: boolean;
  resultCount: number;
  totalCount: number;
}

export default function SearchBar({
  query,
  onQueryChange,
  isFiltering,
  resultCount,
  totalCount,
}: SearchBarProps) {
  return (
    <div className="pb-2 mb-1 border-b border-border flex flex-col gap-2 sticky top-0 bg-card z-10">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by name or shelf number..."
          className="w-full px-3 py-1.5 pr-8 text-sm border border-input bg-input-background text-input-foreground placeholder:text-placeholder rounded-md outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-sm"
          >
            ✕
          </button>
        )}
      </div>
      <div className="text-xs text-muted-foreground font-medium">
        {isFiltering
          ? `${resultCount} / ${totalCount} shelves`
          : `Total: ${totalCount} products`}
      </div>
    </div>
  );
}
