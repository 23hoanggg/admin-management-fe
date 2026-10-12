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
    <section className="space-y-6">
      <div>
        {isPending && <p className="text-sm">Checking session...</p>}

        {error && <p className="text-sm">Session error: {error.message}</p>}

        {!isPending && !error && !session && (
          <div className="space-y-2">
            <p className="text-sm">No user is currently logged in.</p>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="rounded border px-3 py-1 text-sm"
            >
              Login
            </button>
          </div>
        )}

        {!isPending && !error && session && (
          <div className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between pb-1">
                <span>Name</span>
                <span>{session.user.name}</span>
              </div>

              <div className="flex justify-between pb-1">
                <span>Username</span>
                <span>{session.user.username ?? "N/A"}</span>
              </div>

              <div className="flex justify-between pb-1">
                <span>Role</span>
                <span>{session.user.role ?? "user"}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded border px-3 py-1 text-sm"
            >
              Logout
            </button>

            <button
              type="button"
              onClick={() => {
                stopImpersonateMutation.mutate();
              }}
              className="rounded border px-3 py-1 text-sm"
            >
              Stop Impersonate User
            </button>
          </div>
        )}
      </div>

      {/* Activity */}
      <div>
        <h2 className="mb-4 text-lg font-bold">Activity</h2>

        <div className="space-y-3"></div>
      </div>
    </section>
  );
}
