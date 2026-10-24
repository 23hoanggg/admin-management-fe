"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ShelfEditor } from "@/features/shelves";
import { getJobEditor } from "@/app/lib/api/jobs";

export default function JobShelvesPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["jobs", id, "editor"],
    queryFn: () => getJobEditor(id),
    enabled: Boolean(id),
  });

  if (isPending) return <p className="p-6">Loading data...</p>;

  if (isError) {
    return (
      <div className="space-y-4 p-6">
        <p role="alert">Can not view detail: {error.message}</p>
        <Link href={`/dashboard/jobs/${id}`} className="underline">
          Back to Job
        </Link>
      </div>
    );
  }

  const image = {
    src: `/api/images/${data.image.storageKey}`,
    width: data.image.width,
    height: data.image.height,
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-2 flex items-center justify-between border-b border-border pb-2">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Shelf Management
        </h1>
        <Link href={`/dashboard/jobs/${id}`} className="text-sm underline">
          Back to Job
        </Link>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <ShelfEditor image={image} initialItems={data.items} jobId={id} />
      </div>
    </div>
  );
}
