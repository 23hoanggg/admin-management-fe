"use client";

import {
  banUser,
  impersonateUser,
  listUsers,
  removeUser,
  unbanUser,
  updateUser,
} from "@/app/lib/api/users";
import { authClient } from "@/app/lib/auth-client";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UpdateUserInput {
  name: string;
  username: string;
}

export default function UserSlot() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

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
    onError: (error) => {
      console.error("Impersonation failed:", error);
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

  const updateUserMutation = useMutation({
    mutationFn: ({
      userId,
      input,
    }: {
      userId: string;
      input: UpdateUserInput;
    }) => updateUser(userId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Update user failed:", error);
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
    return <p>đang đăng nhập</p>;
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
    <section>
      <h2 className="mb-4 text-lg font-bold">Users</h2>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b">
            <th className="px-2 py-2 text-left">Username</th>
            <th className="px-2 py-2 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="px-2 py-2">{user.username ?? user.name}</td>

              <td className="px-2 py-2">
                <button
                  type="button"
                  disabled={impersonateMutation.isPending}
                  className="mr-2 rounded border px-2 py-1 disabled:opacity-50"
                  onClick={() => impersonateMutation.mutate(user.id)}
                >
                  {impersonateMutation.isPending
                    ? "Đang đăng nhập..."
                    : "Login"}
                </button>

                <button
                  type="button"
                  className="mr-2 rounded border px-2 py-1"
                  onClick={() => removeUserMutation.mutate(user.id)}
                >
                  Delete
                </button>

                <button
                  type="button"
                  className="rounded border px-2 py-1"
                  onClick={() => banUserMutation.mutate(user.id)}
                >
                  Ban
                </button>

                <button
                  type="button"
                  className="mr-2 rounded border px-2 py-1"
                  onClick={() => unbanUserMutation.mutate(user.id)}
                >
                  Unban
                </button>

                <button
                  type="button"
                  className="mr-2 rounded border px-2 py-1"
                  onClick={() =>
                    updateUserMutation.mutate({
                      userId: user.id,
                      input,
                    })
                  }
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-3">
        <button
          disabled={currentPage === 1 || isPlaceholderData}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          pre
        </button>
        <span>
          {currentPage} of {totalPages || 1}
        </span>
        <button
          disabled={isPlaceholderData || currentPage >= totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          next
        </button>
      </div>
    </section>
  );
}
