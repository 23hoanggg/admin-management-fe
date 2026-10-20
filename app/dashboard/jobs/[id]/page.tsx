"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getJob } from "@/app/lib/api/jobs";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: job,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["jobs", id],
    queryFn: () => getJob(id),
    enabled: Boolean(id),
  });

  if (isPending) {
    return <p>Loading jobs information...</p>;
  }

  if (isError) {
    return (
      <main className="space-y-4 p-6">
        <p role="alert">can not load job: {error.message}</p>

        <Link href="/dashboard/jobs" className="underline">
          Back to list job
        </Link>
      </main>
    );
  }

  return (
    <main className="space-y-6 p-6">
      <Link href="/dashboard/jobs" className="text-sm underline">
        ← Back to list job
      </Link>

      <section className="rounded-lg border p-5">
        <h1 className="text-2xl font-bold">{job.name}</h1>

        <p className="mt-2 text-gray-500">
          {job.description || "Job chưa có mô tả"}
        </p>

        <div className="mt-4 space-y-2 text-sm">
          <p>
            <strong>ID:</strong> {job.id}
          </p>

          <p>
            <strong>Status:</strong> {job.status}
          </p>

          {/*<p>
            <strong>Số Shelf:</strong> {job._count?.shelves ?? 0}
          </p>*/}

          <p>
            <strong>Created at:</strong>{" "}
            {new Date(job.createdAt).toLocaleString("vi-VN")}
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Shelves</h2>

          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/jobs/${job.id}/shelves`}
              className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
            >
              View detail
            </Link>

            <button
              type="button"
              disabled
              className="rounded-md border px-3 py-2 text-sm opacity-50"
            >
              + Create shelf
            </button>
          </div>
        </div>

        {/*<div className="rounded-lg border border-dashed p-6 text-center">
          <p className="font-medium">Khu vực quản lý Shelf</p>
          <p className="mt-2 text-sm text-gray-500">
            Chúng ta sẽ kết nối API Shelves ở bước tiếp theo.
          </p>
        </div>*/}
      </section>
    </main>
  );
}
