"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createJob, listJobs } from "@/app/lib/api/jobs";
import Pagination from "@/app/components/Pagination";
import StatusBadge from "@/app/components/StatusBadge";

const PAGE_SIZE = 10;

export default function JobsPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [page, setPage] = useState(1);

  const {
    data: jobs,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: listJobs,
  });

  const createJobMutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      setName("");
      setDescription("");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    createJobMutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
    });
  }

  // Cắt danh sách theo trang (API trả về tất cả jobs)
  const jobsOnPage =
    jobs?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">Jobs</h1>

      {/* Tạo job mới */}
      <form onSubmit={handleSubmit} className="panel flex items-end gap-3 p-4">
        <div className="flex-1">
          <label htmlFor="job-name" className="label">
            Name
          </label>
          <input
            id="job-name"
            className="input"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="flex-[2]">
          <label htmlFor="job-description" className="label">
            Description (optional)
          </label>
          <input
            id="job-description"
            className="input"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!name.trim() || createJobMutation.isPending}
        >
          {createJobMutation.isPending ? "Creating…" : "Create job"}
        </button>
      </form>

      {createJobMutation.isError && (
        <p className="text-sm text-destructive">
          {createJobMutation.error.message}
        </p>
      )}

      {/* Danh sách job */}
      <section className="panel">
        {isPending && (
          <p className="p-4 text-sm text-muted-foreground">Loading…</p>
        )}
        {isError && (
          <p className="p-4 text-sm text-destructive">{error.message}</p>
        )}

        {jobs && (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th className="text-right">Shelves</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No jobs yet.
                  </td>
                </tr>
              )}
              {jobsOnPage.map((job) => (
                <tr key={job.id}>
                  <td>
                    <Link
                      href={`/dashboard/jobs/${job.id}`}
                      className="font-medium hover:underline"
                    >
                      {job.name}
                    </Link>
                  </td>
                  <td className="text-muted-foreground">
                    {job.description || "–"}
                  </td>
                  <td>
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="text-right">{job.shelfCount}</td>
                  <td className="text-muted-foreground">
                    {new Date(job.createdAt).toLocaleString("en-GB")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {jobs && (
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={jobs.length}
            onPageChange={setPage}
          />
        )}
      </section>
    </div>
  );
}
