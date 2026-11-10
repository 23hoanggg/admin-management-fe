"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getJob } from "@/app/lib/api/jobs";
import StatusBadge from "@/app/components/StatusBadge";

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
  });

  if (isPending)
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (isError)
    return <p className="text-sm text-destructive">{error.message}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <Link
            href="/dashboard/jobs"
            className="text-xs text-muted-foreground hover:underline"
          >
            ← Jobs
          </Link>
          <h1 className="text-lg font-semibold">{job.name}</h1>
          <p className="text-sm text-muted-foreground">
            {job.description || "No description"}
          </p>
        </div>
        <Link
          href={`/dashboard/jobs/${job.id}/shelves`}
          className="btn btn-primary"
        >
          Open shelf editor
        </Link>
      </div>

      <section className="panel">
        <table className="table">
          <tbody>
            <tr>
              <td className="w-40 text-muted-foreground">Status</td>
              <td>
                <StatusBadge status={job.status} />
              </td>
            </tr>
            <tr>
              <td className="text-muted-foreground">Shelves</td>
              <td>{job.shelfCount}</td>
            </tr>
            <tr>
              <td className="text-muted-foreground">Created</td>
              <td>{new Date(job.createdAt).toLocaleString("en-GB")}</td>
            </tr>
            <tr>
              <td className="text-muted-foreground">Updated</td>
              <td>{new Date(job.updatedAt).toLocaleString("en-GB")}</td>
            </tr>
            <tr>
              <td className="text-muted-foreground">ID</td>
              <td className="font-mono text-xs">{job.id}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
