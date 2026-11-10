"use client";

import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/app/lib/auth-client";
import { listJobs } from "@/app/lib/api/jobs";
import { listPdfConversions } from "@/app/lib/api/pdf";

export default function AdminSlot() {
  const { data: session } = authClient.useSession();

  const jobs = useQuery({
    queryKey: ["jobs"],
    queryFn: listJobs,
    enabled: !!session,
  });

  const allPdfs = useQuery({
    queryKey: ["pdf", "count", "all"],
    queryFn: () => listPdfConversions(1, 1),
    enabled: !!session,
  });

  const failedPdfs = useQuery({
    queryKey: ["pdf", "count", "failed"],
    queryFn: () => listPdfConversions(1, 1, "FAILED"),
    enabled: !!session,
  });

  return (
    <div className="grid grid-cols-3 divide-x">
      <div className="px-4 py-3">
        <p className="text-xs text-muted-foreground">Jobs</p>
        <p className="text-2xl font-semibold">{jobs.data?.length ?? "–"}</p>
      </div>
      <div className="px-4 py-3">
        <p className="text-xs text-muted-foreground">PDF files</p>
        <p className="text-2xl font-semibold">{allPdfs.data?.total ?? "–"}</p>
      </div>
      <div className="px-4 py-3">
        <p className="text-xs text-muted-foreground">Failed PDFs</p>
        <p className="text-2xl font-semibold">
          {failedPdfs.data?.total ?? "–"}
        </p>
      </div>
    </div>
  );
}
