"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteJob, getJob } from "@/app/lib/api/jobs";
import { authClient } from "@/app/lib/auth-client";
import StatusBadge from "@/app/components/StatusBadge";
import DeleteButton from "@/app/components/DeleteButton";
import EditJobForm from "./EditJobForm";
import ShelvesSection from "./ShelvesSection";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const isAdmin = session?.user?.role === "admin"; // chỉ admin sửa / xoá
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: job,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["jobs", id],
    queryFn: () => getJob(id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      router.push("/dashboard/jobs");
    },
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
        <div className="flex gap-2">
          {isAdmin && (
            <>
              <button
                type="button"
                className="btn"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <DeleteButton
                itemName={job.name}
                onConfirm={() => deleteMutation.mutateAsync()}
              />
            </>
          )}
          <Link
            href={`/dashboard/jobs/${job.id}/shelves`}
            className="btn btn-primary"
          >
            Open shelf editor
          </Link>
        </div>
      </div>

      {isAdmin && isEditing && (
        <EditJobForm job={job} onDone={() => setIsEditing(false)} />
      )}

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

      <ShelvesSection jobId={job.id} isAdmin={isAdmin} />
    </div>
  );
}
