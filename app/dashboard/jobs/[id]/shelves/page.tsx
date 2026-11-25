"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ShelfEditor } from "@/features/shelves";
import { getJobEditor } from "@/app/lib/api/jobs";
import { authClient } from "@/app/lib/auth-client";

export default function JobShelvesPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = authClient.useSession();
  const isAdmin = session?.user?.role === "admin"; // chỉ admin được sửa

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["jobs", id, "editor"],
    queryFn: () => getJobEditor(id),
  });

  if (isPending)
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (isError)
    return <p className="text-sm text-destructive">{error.message}</p>;

  const image = {
    src: `/api/images/${data.image.storageKey}`,
    width: data.image.width,
    height: data.image.height,
  };

  return (
    <div className="space-y-4">
      <div>
        <Link
          href={`/dashboard/jobs/${id}`}
          className="text-xs text-muted-foreground hover:underline"
        >
          ← Back to job
        </Link>
        <h1 className="text-lg font-semibold">Shelf editor</h1>
      </div>

      <div className="panel h-[calc(100dvh-8rem)] overflow-hidden">
        <ShelfEditor
          image={image}
          initialItems={data.items}
          jobId={id}
          canEdit={isAdmin}
        />
      </div>
    </div>
  );
}
