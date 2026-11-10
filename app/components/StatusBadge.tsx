const tone: Record<string, string> = {
  PENDING: "text-muted-foreground",
  PROCESSING: "text-warning",
  COMPLETED: "text-success",
  FAILED: "text-destructive",
  ACTIVE: "text-success",
  BANNED: "text-destructive",
};

const label: Record<string, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  FAILED: "Failed",
  ACTIVE: "Active",
  BANNED: "Banned",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`whitespace-nowrap text-xs font-medium ${tone[status] ?? "text-muted-foreground"}`}
    >
      {label[status] ?? status}
    </span>
  );
}
