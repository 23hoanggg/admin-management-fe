"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { stopImpersonateUser } from "@/app/lib/api/users";

export default function ActivitySlot() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: session, isPending, error } = authClient.useSession();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      queryClient.removeQueries({ queryKey: ["users"] });
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const stopImpersonateMutation = useMutation({
    mutationFn: stopImpersonateUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      router.refresh();
    },
    onError: (error) => {
      console.error("Stop impersonation failed:", error);
    },
  });

  return (
    <section className="space-y-8">
      <div className="flex min-h-16 items-center justify-end gap-3 border-b border-border pb-4">
        {isPending && (
          <p className="text-sm text-muted-foreground">Checking session...</p>
        )}

        {error && (
          <p className="text-sm text-destructive">Session error: {error.message}</p>
        )}

        {!isPending && !error && !session && (
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            Login
          </button>
        )}

        {!isPending && !error && session && (
          <>
            <div className="flex items-center gap-3 border-r border-border pr-4">
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-foreground">
                  {session.user.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  @{session.user.username ?? "N/A"}
                </p>
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  session.user.role === "admin"
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {session.user.role ?? "user"}
              </span>
            </div>

            {/* Các nút thao tác */}
            <div className="flex items-center gap-2">
              {session.user.role !== "admin" && (
                <button
                  type="button"
                  onClick={() => stopImpersonateMutation.mutate()}
                  disabled={stopImpersonateMutation.isPending}
                  className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20 disabled:opacity-50"
                >
                  {stopImpersonateMutation.isPending
                    ? "Stopping..."
                    : "Stop impersonation"}
                </button>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>

      {/* Activity */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-foreground">Activity</h2>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">No recent activity.</p>
        </div>
      </div>
    </section>
  );
}
