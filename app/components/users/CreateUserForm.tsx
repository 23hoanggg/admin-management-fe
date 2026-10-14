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
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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
      <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-lg">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Create User</h2>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {errorMessage && (
          <p role="alert" className="mb-4 text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="create-name"
              className="mb-1 block text-sm font-medium"
            >
              Name
            </label>
            <input
              id="create-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black"
            />
          </div>

          <div>
            <label
              htmlFor="create-username"
              className="mb-1 block text-sm font-medium"
            >
              Username
            </label>
            <input
              id="create-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black"
            />
          </div>

          <div>
            <label
              htmlFor="create-email"
              className="mb-1 block text-sm font-medium"
            >
              Email
            </label>
            <input
              id="create-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black"
            />
          </div>

          <div>
            <label
              htmlFor="create-password"
              className="mb-1 block text-sm font-medium"
            >
              Password
            </label>
            <input
              id="create-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black"
            />
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createMutation.isPending ? "Creating..." : "Create user"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
