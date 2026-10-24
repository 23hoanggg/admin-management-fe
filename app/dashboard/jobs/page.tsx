"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createJob, listJobs } from "@/app/lib/api/jobs";

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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) return;

    createJobMutation.mutate({
      name: trimmedName,
      description: description.trim() || undefined,
    });
  }

  if (isPending) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading jobs...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-destructive/30 bg-destructive/5 p-5"
      >
        <h2 className="font-semibold text-destructive">Unable to load jobs</h2>
        <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Page header */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Jobs
          </h1>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {jobs.length} {jobs.length === 1 ? "job" : "jobs"} total
        </div>
      </header>

      {/* Create job form */}
      <div className="rounded-xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Create a new job</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="job-name" className="text-sm font-medium">
                Job name <span className="text-destructive">*</span>
              </label>

              <input
                id="job-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength={120}
                placeholder="job name"
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="job-description" className="text-sm font-medium">
                Description
              </label>

              <textarea
                id="job-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                maxLength={1000}
                rows={1}
                placeholder="description (optional)"
                className="min-h-11 w-full resize-y rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>
          </div>

          {createJobMutation.isError && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            >
              Create job failed: {createJobMutation.error.message}
            </p>
          )}

          {createJobMutation.isSuccess && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              Job created successfully.
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={createJobMutation.isPending || !name.trim()}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createJobMutation.isPending ? "Creating..." : "+ Create job"}
            </button>
          </div>
        </form>
      </div>

      {/* Job list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">All jobs</h2>
          <span className="text-sm text-muted-foreground">
            {jobs.length} results
          </span>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center">
            <h3 className="font-medium">No jobs yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first job using the form above.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <article
                key={job.id}
                className="flex flex-col rounded-xl border bg-card p-5 transition hover:border-primary/40 hover:shadow-sm"
              >
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="break-words font-semibold">{job.name}</h3>

                    <span className="shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium">
                      {job.status}
                    </span>
                  </div>

                  <p className="min-h-10 line-clamp-2 text-sm leading-5 text-muted-foreground">
                    {job.description || "No description provided."}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {job._count?.shelves ?? 0}
                    </span>
                    {job._count?.shelves === 1 ? "shelf" : "shelves"}
                  </div>
                </div>

                <div className="mt-5 border-t pt-4">
                  <Link
                    href={`/dashboard/jobs/${job.id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary transition hover:underline"
                  >
                    View details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
