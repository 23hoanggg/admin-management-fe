"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/app/lib/api/users";
import { createUserSchema } from "@/app/lib/schemas/user.schema";

interface CreateUserFormProps {
  onClose: () => void;
}

export default function CreateUserForm({ onClose }: CreateUserFormProps) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onClose();
    },
    onError: (error: Error) => {
      setErrorMessage(error.message);
    },
  });
  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const result = createUserSchema.safeParse({
      name,
      username,
      email,
      password,
    });

    if (!result.success) {
      setErrorMessage(result.error.issues[0].message);
      return;
    }

    createMutation.mutate({
      ...result.data,
      role: "user",
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="panel w-full max-w-sm space-y-4 p-5"
      >
        <h2 className="text-lg font-semibold">New user</h2>

        <div>
          <label htmlFor="create-name" className="label">
            Full name
          </label>
          <input
            id="create-name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="create-username" className="label">
            Username
          </label>
          <input
            id="create-username"
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="create-email" className="label">
            Email
          </label>
          <input
            id="create-email"
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="create-password" className="label">
            Password (min 8 characters)
          </label>
          <input
            id="create-password"
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
            disabled={createMutation.isPending}
            className="btn btn-primary"
          >
            {createMutation.isPending ? "Creating…" : "Create user"}
          </button>
        </div>
      </form>
    </div>
  );
}
