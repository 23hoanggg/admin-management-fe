"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  banUser,
  impersonateUser,
  listUsers,
  removeUser,
  unbanUser,
} from "@/app/lib/api/users";
import { authClient } from "@/app/lib/auth-client";
import CreateUserForm from "@/app/components/users/CreateUserForm";
import UpdateUserForm from "@/app/components/users/UpdateUserForm";
import Pagination from "@/app/components/Pagination";
import StatusBadge from "@/app/components/StatusBadge";
import DeleteButton from "@/app/components/DeleteButton";

interface User {
  id: string;
  name: string;
  email: string;
  username?: string | null;
  banned?: boolean | null;
}

const PAGE_SIZE = 8;

export default function UserSlot() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { data: session, refetch: refetchSession } = authClient.useSession();
  const isAdmin = session?.user?.role === "admin";

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["users", page],
    queryFn: () => listUsers({ currentPage: page, pageSize: PAGE_SIZE }),
    enabled: isAdmin,
  });

  function reloadUsers() {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  }

  const impersonateMutation = useMutation({
    mutationFn: impersonateUser,
    onSuccess: async () => {
      await refetchSession();
      queryClient.invalidateQueries();
    },
  });

  const banMutation = useMutation({
    mutationFn: banUser,
    onSuccess: reloadUsers,
  });

  const unbanMutation = useMutation({
    mutationFn: unbanUser,
    onSuccess: reloadUsers,
  });

  const removeMutation = useMutation({
    mutationFn: removeUser,
    onSuccess: reloadUsers,
  });

  const actionError =
    impersonateMutation.error ?? banMutation.error ?? unbanMutation.error;

  if (!isAdmin) {
    return (
      <div>
        <div className="panel-header">
          <h2 className="panel-title">Users</h2>
        </div>
        <p className="p-4 text-sm text-muted-foreground">
          Only admins can manage users.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="panel-header">
        <h2 className="panel-title">Users</h2>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsCreating(true)}
        >
          New user
        </button>
      </div>

      {actionError && (
        <p className="border-b px-4 py-2 text-sm text-destructive">
          {actionError.message}
        </p>
      )}

      <div className="flex-1">
        {isPending && (
          <p className="p-4 text-sm text-muted-foreground">Loading…</p>
        )}
        {isError && (
          <p className="p-4 text-sm text-destructive">{error.message}</p>
        )}
        {data?.users.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground">No users found.</p>
        )}

        <ul className="divide-y">
          {data?.users.map((user: User) => (
            <li key={user.id} className="space-y-2 px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    @{user.username} · {user.email}
                  </p>
                </div>
                <StatusBadge status={user.banned ? "BANNED" : "ACTIVE"} />
              </div>

              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  className="btn btn-sm"
                  disabled={!!user.banned || impersonateMutation.isPending}
                  onClick={() => impersonateMutation.mutate(user.id)}
                >
                  Impersonate
                </button>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => setEditingUser(user)}
                >
                  Edit
                </button>
                {user.banned ? (
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => unbanMutation.mutate(user.id)}
                  >
                    Unban
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => banMutation.mutate(user.id)}
                  >
                    Ban
                  </button>
                )}
                <DeleteButton
                  itemName={user.name}
                  onConfirm={() => removeMutation.mutateAsync(user.id)}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {data && (
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={data.total}
          onPageChange={setPage}
        />
      )}

      {isCreating && <CreateUserForm onClose={() => setIsCreating(false)} />}
      {editingUser && (
        <UpdateUserForm
          user={editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
}
