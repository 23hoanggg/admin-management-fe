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

  if (isPending) return <p className="p-6">Đang tải dữ liệu...</p>;

  if (isError) {
    return (
      <div className="space-y-4 p-6">
        <p role="alert">Không thể tải editor: {error.message}</p>
        <Link href={`/dashboard/jobs/${id}`} className="underline">
          Quay lại Job
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
      <div className="mb-2 flex items-center justify-between border-b border-gray-200 pb-2">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">
          Shelf Management
        </h1>
        <Link href={`/dashboard/jobs/${id}`} className="text-sm underline">
          Quay lại Job
        </Link>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <ShelfEditor image={image} initialItems={data.items} jobId={id} />
      </div>
    </div>
  );
}
