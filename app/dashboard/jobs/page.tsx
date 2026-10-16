"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createJob, listJobs } from "@/app/lib/api/jobs";
import { useState } from "react";

export default function JobsPage() {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createJobMutation = useMutation({
    mutationFn: createJob,
    onSuccess: async () => {
      setName("");
      setDescription("");
      await queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });
    },
  });

  const {
    data: jobs,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: listJobs,
  });

  if (isPending) {
    return <p>Đang tải danh sách Jobs...</p>;
  }

  if (isError) {
    return <p>Lỗi khi tải Jobs: {error.message}</p>;
  }

  return (
    <section>
      <h1 className="text-2xl font-bold">Jobs</h1>

      <form
        onSubmit={(event) => {
          event.preventDefault();

          const trimmedName = name.trim();

          if (!trimmedName) return;

          createJobMutation.mutate({
            name: trimmedName,
            description: description.trim() || undefined,
          });
        }}
        className="mb-6 max-w-lg space-y-3"
      >
        <div>
          <label htmlFor="job-name" className="mb-1 block">
            Tên Job
          </label>

          <input
            id="job-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            maxLength={120}
            placeholder="Ví dụ: Kiểm kê siêu thị A"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="job-description" className="mb-1 block">
            Mô tả
          </label>

          <textarea
            id="job-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={1000}
            placeholder="Mô tả công việc (không bắt buộc)"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={createJobMutation.isPending || !name.trim()}
          className="rounded-md border px-4 py-2 disabled:opacity-50"
        >
          {createJobMutation.isPending ? "Đang tạo..." : "Tạo Job"}
        </button>

        {createJobMutation.isError && (
          <p role="alert" className="text-sm text-red-600">
            Tạo Job thất bại: {createJobMutation.error.message}
          </p>
        )}
      </form>

      {jobs.map((job) => (
        <div key={job.id} className="my-3 rounded-lg border p-4">
          <h2 className="font-semibold">{job.name}</h2>
          <p>{job.description || "Không có mô tả"}</p>
          <p>Trạng thái: {job.status}</p>
          <p>Số Shelf: {job._count?.shelves ?? 0}</p>

          <Link href={`/dashboard/jobs/${job.id}`}>Xem chi tiết</Link>
        </div>
      ))}
    </section>
  );
}
