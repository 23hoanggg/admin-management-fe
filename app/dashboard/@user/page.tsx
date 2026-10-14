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
  const [pageSize, setPageSize] = useState(3);

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
      console.log(error);
      window.alert("user got banned");
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
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
    return <p>đang đăng nhập...</p>;
  }

  if (authError) {
    return <p>lỗi đăng nhập</p>;
  }

  if (!session?.user) {
    return <p>chưa đăng nhập</p>;
  }

  if (session.user.role !== "admin") {
    return <p>user kh xem được</p>;
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
        <h2 className="text-xl font-bold tracking-tight text-gray-900">
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

      {/* Users list */}
      <div className="space-y-3">
        {(data.users as User[]).map((user) => (
          <div
            key={user.id}
            className="flex min-w-0 flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-gray-300 sm:flex-row sm:items-center sm:justify-between"
          >
            {/* Username + Status */}
            <div className="flex min-w-0 flex-col items-start gap-2">
              <span className="max-w-full font-medium text-gray-900">
                {user.username ?? user.name}
              </span>

              {user.banned === true ? (
                <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-200">
                  Banned
                </span>
              ) : user.banned === false ? (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                  Active
                </span>
              ) : (
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500">
                  Unknown
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={impersonateMutation.isPending}
                className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => impersonateMutation.mutate(user.id)}
              >
                {impersonateMutation.isPending ? "Loading..." : "Login"}
              </button>

              <button
                type="button"
                disabled={removeUserMutation.isPending}
                className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                onClick={() => removeUserMutation.mutate(user.id)}
              >
                Delete
              </button>

              {user.banned === true ? (
                <button
                  type="button"
                  disabled={unbanUserMutation.isPending}
                  className="rounded-md border border-emerald-200 bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
                  onClick={() => unbanUserMutation.mutate(user.id)}
                >
                  Unban
                </button>
              ) : (
                <button
                  type="button"
                  disabled={banUserMutation.isPending}
                  className="rounded-md border border-amber-200 bg-white px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-50 disabled:opacity-50"
                  onClick={() => banUserMutation.mutate(user.id)}
                >
                  Ban
                </button>
              )}

              <button
                type="button"
                className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                onClick={() => setEditingUser(user)}
              >
                Update
              </button>
            </div>
          </div>
        ))}

        {data.users.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500">
            No users found.
          </div>
        )}
      </div>

      <div> {}</div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          Page <span className="font-medium text-gray-900">{currentPage}</span>{" "}
          of{" "}
          <span className="font-medium text-gray-900">{totalPages || 1}</span>
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1 || isPlaceholderData}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <button
            type="button"
            disabled={isPlaceholderData || currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
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
