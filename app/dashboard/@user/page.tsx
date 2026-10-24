"use client";

import {
  banUser,
  impersonateUser,
  listUsers,
  removeUser,
  unbanUser,
} from "@/app/lib/api/users";
import CreateUserForm from "@/app/components/users/CreateUserForm";
import UpdateUserForm from "@/app/components/users/UpdateUserForm";
import { authClient } from "@/app/lib/auth-client";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  username?: string | null;
  banned?: boolean | null;
}

export default function UserSlot() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [isCreateForm, setIsCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: session,
    isPending: authPending,
    error: authError,
  } = authClient.useSession();

  const impersonateMutation = useMutation({
    mutationFn: impersonateUser,

    onSuccess: async () => {
      await queryClient.cancelQueries();
      queryClient.clear();
      router.refresh();
    },

    onError: (error: Error) => {
      console.error(error);
      window.alert("User got banned, can not sign in");
    },
  });

  const banUserMutation = useMutation({
    mutationFn: banUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Ban user failed:", error);
    },
  });

  const unbanUserMutation = useMutation({
    mutationFn: unbanUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Unban user failed:", error);
    },
  });

  const removeUserMutation = useMutation({
    mutationFn: removeUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Remove user failed:", error);
    },
  });

  const {
    data,
    isPending: usersPending,
    isError: usersIsError,
    error: usersError,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["users", { currentPage, pageSize }],
    queryFn: () => listUsers({ currentPage, pageSize }),
    placeholderData: keepPreviousData,
    enabled: !authPending && session?.user?.role === "admin",
  });

  const totalPages = Math.ceil((data?.total ?? 0) / pageSize);

  if (authPending) {
    return <p>Đang kiểm tra đăng nhập...</p>;
  }

  if (authError) {
    return <p>Lỗi xác thực. Vui lòng thử lại.</p>;
  }

  if (!session?.user) {
    return <p>Chưa đăng nhập.</p>;
  }

  if (session.user.role !== "admin") {
    return <p>User kh xem duoc.</p>;
  }

  if (usersPending) {
    return <p>Loading users...</p>;
  }

  if (usersIsError) {
    return <p>{usersError.message}</p>;
  }

  if (!data) {
    return <p>Không có dữ liệu users.</p>;
  }

  return (
    <section className="min-w-0 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Users
        </h2>

        <button
          type="button"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
          onClick={() => setIsCreateForm(true)}
        >
          + Create User
        </button>
      </div>

      {/* Users list + Pagination */}
      <div className="flex flex-col">
        <div className="min-h-[360px] space-y-3">
          {data.users.map((user: User) => (
            <div
              key={user.id}
              className="flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-input sm:flex-row sm:items-center sm:justify-between"
            >
              {/* Username + Status */}
              <div className="flex min-w-0 flex-col items-start gap-2">
                <span className="max-w-full font-medium text-foreground">
                  {user.username ?? user.name}
                </span>

                {user.banned === true ? (
                  <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/30">
                    Banned
                  </span>
                ) : user.banned === false ? (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30">
                    Active
                  </span>
                ) : (
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                    Unknown
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={impersonateMutation.isPending}
                  className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => impersonateMutation.mutate(user.id)}
                >
                  {impersonateMutation.isPending ? "Loading..." : "Login"}
                </button>

                <button
                  type="button"
                  disabled={removeUserMutation.isPending}
                  className="rounded-md border border-red-200 bg-card px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10 disabled:opacity-50"
                  onClick={() => removeUserMutation.mutate(user.id)}
                >
                  Delete
                </button>

                {user.banned === true ? (
                  <button
                    type="button"
                    disabled={unbanUserMutation.isPending}
                    className="rounded-md border border-emerald-200 bg-card px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-500/30 dark:text-emerald-400 dark:hover:bg-emerald-500/10 disabled:opacity-50"
                    onClick={() => unbanUserMutation.mutate(user.id)}
                  >
                    Unban
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={banUserMutation.isPending}
                    className="rounded-md border border-amber-200 bg-card px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-50 dark:border-amber-500/30 dark:text-amber-400 dark:hover:bg-amber-500/10 disabled:opacity-50"
                    onClick={() => banUserMutation.mutate(user.id)}
                  >
                    Ban
                  </button>
                )}

                <button
                  type="button"
                  className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-secondary-foreground transition hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setEditingUser(user)}
                >
                  Update
                </button>
              </div>
            </div>
          ))}

          {data.users.length === 0 && (
            <div className="rounded-xl border border-border bg-card px-4 py-12 text-center text-sm text-muted-foreground">
              No users found.
            </div>
          )}
        </div>

        <div className="mt-auto flex min-h-[56px] flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">
            Page{" "}
            <span className="font-medium text-foreground">{currentPage}</span> of{" "}
            <span className="font-medium text-foreground">{totalPages || 1}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1 || isPlaceholderData}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-secondary-foreground transition hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={
                isPlaceholderData ||
                totalPages === 0 ||
                currentPage >= totalPages
              }
              onClick={() => setCurrentPage((p) => p + 1)}
              className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-secondary-foreground transition hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Forms */}
      {isCreateForm && (
        <CreateUserForm onClose={() => setIsCreateForm(false)} />
      )}

      {editingUser && (
        <UpdateUserForm
          user={editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
    </section>
  );
}
