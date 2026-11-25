"use client";

import { useRef, useState } from "react";

interface DeleteButtonProps {
  itemName: string;
  onConfirm: () => Promise<unknown>;
  disabled?: boolean;
}

export default function DeleteButton({
  itemName,
  onConfirm,
  disabled,
}: DeleteButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  function openDialog() {
    setError("");
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await onConfirm();
      closeDialog();
    } catch (err) {
      setError((err as Error).message);
    }
    setIsDeleting(false);
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-sm btn-danger"
        disabled={disabled}
        onClick={openDialog}
      >
        Delete
      </button>

      <dialog
        ref={dialogRef}
        className="panel m-auto w-full max-w-sm p-5 text-left backdrop:bg-black/40"
      >
        <h2 className="font-semibold">Delete &quot;{itemName}&quot;?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This action cannot be undone.
        </p>

        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            className="btn"
            onClick={closeDialog}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </dialog>
    </>
  );
}
