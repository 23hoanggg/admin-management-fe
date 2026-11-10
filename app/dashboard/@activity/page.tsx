"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/app/lib/auth-client";
import { stopImpersonateUser } from "@/app/lib/api/users";
import { listPdfConversions } from "@/app/lib/api/pdf";
import StatusBadge from "@/app/components/StatusBadge";

export default function ActivitySlot() {
  const queryClient = useQueryClient();
  const {
    data: session,
    isPending,
    refetch: refetchSession,
  } = authClient.useSession();

  const recentPdfs = useQuery({
    queryKey: ["pdf", "recent"],
    queryFn: () => listPdfConversions(1, 5),
    enabled: !!session,
  });

  async function handleLogout() {
    await authClient.signOut();
    queryClient.clear();
  }

  const stopImpersonateMutation = useMutation({
    mutationFn: stopImpersonateUser,
    onSuccess: async () => {
      await refetchSession();
      queryClient.invalidateQueries();
    },
  });

  const isImpersonating = !!session?.session.impersonatedBy;

  return (
    <div>
      <div className="panel-header">
        <h2 className="panel-title">Activity</h2>

        {isPending && (
          <span className="text-xs text-muted-foreground">Loading…</span>
        )}

        {!isPending && !session && (
          <Link href="/login" className="btn btn-primary">
            Sign in
          </Link>
        )}

        {session && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{session.user.name}</p>
              <p className="text-xs text-muted-foreground">
                @{session.user.username ?? "guest"} ·{" "}
                {session.user.role ?? "user"}
              </p>
            </div>

            {isImpersonating && (
              <button
                type="button"
                className="btn text-warning"
                disabled={stopImpersonateMutation.isPending}
                onClick={() => stopImpersonateMutation.mutate()}
              >
                Stop impersonating
              </button>
            )}

            <button type="button" className="btn" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium">Recent PDF files</h3>
          <Link
            href="/dashboard/pdf"
            className="text-xs text-muted-foreground hover:underline"
          >
            View all
          </Link>
        </div>

        {!session && (
          <p className="text-sm text-muted-foreground">
            Sign in to see activity.
          </p>
        )}

        {recentPdfs.isError && (
          <p className="text-sm text-destructive">{recentPdfs.error.message}</p>
        )}

        {recentPdfs.data && (
          <table className="table rounded-md border">
            <thead>
              <tr>
                <th>File</th>
                <th>Status</th>
                <th>Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {recentPdfs.data.conversions.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-muted-foreground">
                    No files yet.
                  </td>
                </tr>
              )}
              {recentPdfs.data.conversions.map((pdf) => (
                <tr key={pdf.id}>
                  <td>
                    <Link
                      href={`/dashboard/pdf/${pdf.id}`}
                      className="hover:underline"
                    >
                      {pdf.originalName}
                    </Link>
                  </td>
                  <td>
                    <StatusBadge status={pdf.status} />
                  </td>
                  <td className="text-muted-foreground">
                    {new Date(pdf.createdAt).toLocaleString("en-GB")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
