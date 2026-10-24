"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser, type UpdateUserInput } from "@/app/lib/api/users";
import { updateUserSchema } from "@/app/lib/schemas/user.schema";

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
    mutationFn: async (data: UpdateUserInput) => {
      const payload: UpdateUserInput = {};

      if (data.name !== (user.name ?? "").trim()) {
        payload.name = data.name;
      }

      if (data.username !== (user.username ?? "").trim()) {
        payload.username = data.username;
      }

      if (data.email !== (user.email ?? "").trim()) {
        payload.email = data.email;
      }

      if (data.password !== "") {
        payload.password = data.password;
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const result = updateUserSchema.safeParse({
      name,
      username,
      email,
      password,
    });

    if (!result.success) {
      setErrorMessage(result.error.issues[0].message);
      return;
    }

    updateMutation.mutate(result.data);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 text-card-foreground shadow-lg">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Update User</h2>

          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {errorMessage && (
          <p role="alert" className="mb-4 text-sm text-destructive">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="update-name"
              className="mb-1 block text-sm font-medium"
            >
              Name
            </label>
            <input
              id="update-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm text-input-foreground outline-none placeholder:text-placeholder focus:border-ring"
            />
          </div>

          <div>
            <label
              htmlFor="update-username"
              className="mb-1 block text-sm font-medium"
            >
              Username
            </label>
            <input
              id="update-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm text-input-foreground outline-none placeholder:text-placeholder focus:border-ring"
            />
          </div>

          <div>
            <label
              htmlFor="update-email"
              className="mb-1 block text-sm font-medium"
            >
              Email
            </label>
            <input
              id="update-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm text-input-foreground outline-none placeholder:text-placeholder focus:border-ring"
            />
          </div>

          <div>
            <label
              htmlFor="update-password"
              className="mb-1 block text-sm font-medium"
            >
              Password
            </label>
            <input
              id="update-password"
              type="password"
              placeholder="Để trống nếu không đổi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm text-input-foreground outline-none placeholder:text-placeholder focus:border-ring"
            />
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateMutation.isPending ? "Updating..." : "Update user"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
