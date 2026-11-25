const colors: Record<string, string> = {
  PROCESSING: "text-warning",
  COMPLETED: "text-success",
  FAILED: "text-destructive",
  ACTIVE: "text-success",
  BANNED: "text-destructive",
};

export default function StatusBadge({ status }: { status: string }) {
  const color = colors[status] ?? "text-muted-foreground";

  return (
    <span className={`text-xs font-medium capitalize ${color}`}>
      {status.toLowerCase()}
    </span>
  );
}
