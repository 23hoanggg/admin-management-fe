"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser, type UpdateUserInput } from "@/app/lib/api/users";

interface UpdateUserFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    username?: string | null;
  };
  onClose: () => void;
}

export default function UpdateUserForm({ user, onClose }: UpdateUserFormProps) {
  const [name, setName] = useState(user.name ?? "");
  const [username, setUsername] = useState(user.username ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async () => {
      const payload: UpdateUserInput = {};

      if (name.trim() !== (user.name ?? "").trim()) {
        payload.name = name.trim();
      }

      if (username.trim() !== (user.username ?? "").trim()) {
        payload.username = username.trim();
      }

      if (email.trim() !== (user.email ?? "").trim()) {
        payload.email = email.trim();
      }

      if (password.trim() !== "") {
        payload.password = password;
      }

      if (Object.keys(payload).length === 0) {
        return false;
      }

      await updateUser(user.id, payload);
      return true;
    },

    onSuccess: (updated) => {
      if (updated) {
        queryClient.invalidateQueries({
          queryKey: ["users"],
        });
      }

      onClose();
    },

    onError: (error: Error) => {
      setErrorMessage(error.message);
    },
  });

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    updateMutation.mutate();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded border bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">Update User</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {errorMessage && (
          <p className="mb-3 text-sm text-red-600">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label htmlFor="update-name" className="block text-sm font-medium">
              Name
            </label>
            <input
              id="update-name"
              className="mt-1 w-full rounded border px-2 py-1 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="update-username"
              className="block text-sm font-medium"
            >
              Username
            </label>
            <input
              id="update-username"
              className="mt-1 w-full rounded border px-2 py-1 text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="update-email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="update-email"
              type="email"
              className="mt-1 w-full rounded border px-2 py-1 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="update-password"
              className="block text-sm font-medium"
            >
              Password
            </label>
            <input
              id="update-password"
              type="password"
              placeholder="password"
              className="mt-1 w-full rounded border px-2 py-1 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-3 py-1 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="rounded border bg-black px-3 py-1 text-sm text-white disabled:opacity-50"
            >
              {updateMutation.isPending ? "Updating..." : "Update user"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
