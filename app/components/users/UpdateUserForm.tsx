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

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
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
      <form
        onSubmit={handleSubmit}
        className="panel w-full max-w-sm space-y-4 p-5"
      >
        <h2 className="text-lg font-semibold">Edit user</h2>

        <div>
          <label htmlFor="update-name" className="label">
            Full name
          </label>
          <input
            id="update-name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="update-username" className="label">
            Username
          </label>
          <input
            id="update-username"
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="update-email" className="label">
            Email
          </label>
          <input
            id="update-email"
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="update-password" className="label">
            New password (leave blank to keep)
          </label>
          <input
            id="update-password"
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {errorMessage && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn">
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="btn btn-primary"
          >
            {updateMutation.isPending ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
