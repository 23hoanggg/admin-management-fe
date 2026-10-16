"use client";

import { useEffect, useRef, useState } from "react";
import { ShelfItem } from "../types/shelf";

interface ItemEditModalProps {
  item: ShelfItem;
  onSave: (changes: { name: string; shelf_digit: string }) => void;
  onClose: () => void;
}

export default function ItemEditModal({
  item,
  onSave,
  onClose,
}: ItemEditModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [name, setName] = useState(item.name ?? "");
  const [shelfDigit, setShelfDigit] = useState(String(item.shelf_digit ?? ""));

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose} // chạy khi nhấn Esc hoặc dialog.close()
      onClick={(e) => {
        // bấm ra vùng nền tối -> đóng
        if (e.target === dialogRef.current) dialogRef.current?.close();
      }}
      className="m-auto w-full max-w-md rounded-lg p-0 shadow-xl backdrop:bg-black/50"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave({ name: name.trim(), shelf_digit: shelfDigit.trim() });
        }}
        className="flex flex-col gap-4 p-5"
      >
        <h2 className="text-lg font-bold text-gray-900">Edit shelf info</h2>

        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
          Shelf number
          <input
            value={shelfDigit}
            onChange={(e) => setShelfDigit(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="rounded-md bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </form>
    </dialog>
  );
}
