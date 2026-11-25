"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteShelf,
  listShelves,
  type Shelf,
  updateShelf,
} from "@/app/lib/api/jobs";
import DeleteButton from "@/app/components/DeleteButton";
import StatusBadge from "@/app/components/StatusBadge";

// Danh sách kệ của 1 job: ai cũng xem được, chỉ admin đổi tên / xoá
export default function ShelvesSection({
  jobId,
  isAdmin,
}: {
  jobId: string;
  isAdmin: boolean;
}) {
  const {
    data: shelves,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["jobs", jobId, "shelves"],
    queryFn: () => listShelves(jobId),
  });

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="text-sm font-semibold">Shelves</h2>
      </div>

      {isPending && (
        <p className="p-4 text-sm text-muted-foreground">Loading…</p>
      )}
      {isError && (
        <p className="p-4 text-sm text-destructive">{error.message}</p>
      )}

      {shelves && shelves.length === 0 && (
        <p className="p-4 text-sm text-muted-foreground">No shelves yet</p>
      )}

      {shelves && shelves.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Created</th>
              {isAdmin && <th />}
            </tr>
          </thead>
          <tbody>
            {shelves.map((shelf) => (
              <ShelfRow
                key={shelf.id}
                jobId={jobId}
                shelf={shelf}
                isAdmin={isAdmin}
              />
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

// 1 dòng kệ: bấm Rename để sửa tên ngay trong dòng
function ShelfRow({
  jobId,
  shelf,
  isAdmin,
}: {
  jobId: string;
  shelf: Shelf;
  isAdmin: boolean;
}) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(shelf.name);

  // Đổi tên / xoá xong thì tải lại dữ liệu của job (số kệ, danh sách kệ, editor)
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["jobs"] });

  const renameMutation = useMutation({
    mutationFn: () => updateShelf(jobId, shelf.id, name.trim()),
    onSuccess: () => {
      setIsEditing(false);
      refresh();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteShelf(jobId, shelf.id),
    onSuccess: refresh,
  });

  return (
    <tr>
      <td>
        {isEditing ? (
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        ) : (
          shelf.name
        )}
        {renameMutation.isError && (
          <p className="text-xs text-destructive">
            {renameMutation.error.message}
          </p>
        )}
      </td>
      <td>
        <StatusBadge status={shelf.status} />
      </td>
      <td className="text-muted-foreground">
        {new Date(shelf.createdAt).toLocaleString("en-GB")}
      </td>

      {isAdmin && (
        <td>
          <div className="flex justify-end gap-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  disabled={renameMutation.isPending || !name.trim()}
                  onClick={() => renameMutation.mutate()}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => {
                    setName(shelf.name);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setIsEditing(true)}
              >
                Rename
              </button>
            )}
            <DeleteButton
              itemName={shelf.name}
              onConfirm={() => deleteMutation.mutateAsync()}
            />
          </div>
        </td>
      )}
    </tr>
  );
}
