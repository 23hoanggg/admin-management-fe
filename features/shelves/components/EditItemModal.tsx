"use client";

import { useEffect, useRef, useState } from "react";
import { ShelfItem } from "../types/shelf";

interface ItemEditModalProps {
  item: ShelfItem;
  onSave: (changes: { name: string; shelfDigit: string }) => void;
  onClose: () => void;
}

export default function ItemEditModal({
  item,
  onSave,
  onClose,
}: ItemEditModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [name, setName] = useState(item.name ?? "");
  const [shelfDigit, setShelfDigit] = useState(String(item.shelfDigit ?? ""));

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) dialogRef.current?.close();
      }}
      className="m-auto w-full max-w-md rounded-lg bg-card p-0 text-card-foreground shadow-xl backdrop:bg-black/50"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave({ name: name.trim(), shelfDigit: shelfDigit.trim() });
        }}
        className="flex flex-col gap-4 p-5"
      >
        <h2 className="text-lg font-bold text-foreground">Edit shelf info</h2>

        <label className="flex flex-col gap-1 text-sm font-medium text-secondary-foreground">
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="input"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-secondary-foreground">
          Shelf number
          <input
            value={shelfDigit}
            onChange={(e) => setShelfDigit(e.target.value)}
            className="input"
          />
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="rounded-md bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </div>
      </form>
    </dialog>
  );
}
