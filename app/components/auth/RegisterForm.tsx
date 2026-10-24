"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { createUserSchema } from "@/app/lib/schemas/user.schema";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const result = createUserSchema.safeParse({
      name,
      email,
      username,
      password,
    });

    if (!result.success) {
      setErrorMessage(result.error.issues[0].message);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        name: result.data.name,
        email: result.data.email,
        username: result.data.username,
        password: result.data.password,
      });

      if (error) {
        setErrorMessage(error.message ?? "Đã xảy ra lỗi. Vui lòng thử lại.");
        return;
      }

      if (data) {
        router.back();
      }
    } catch {
      setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 text-card-foreground shadow-lg">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Register</h2>

          <button
            type="button"
            onClick={() => router.back()}
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
              htmlFor="register-name"
              className="mb-1 block text-sm font-medium"
            >
              Name
            </label>
            <input
              id="register-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              disabled={isLoading}
              className="w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm text-input-foreground outline-none placeholder:text-placeholder focus:border-ring"
            />
          </div>

          <div>
            <label
              htmlFor="register-email"
              className="mb-1 block text-sm font-medium"
            >
              Email
            </label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={isLoading}
              className="w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm text-input-foreground outline-none placeholder:text-placeholder focus:border-ring"
            />
          </div>

          <div>
            <label
              htmlFor="register-username"
              className="mb-1 block text-sm font-medium"
            >
              Username
            </label>
            <input
              id="register-username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              disabled={isLoading}
              className="w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm text-input-foreground outline-none placeholder:text-placeholder focus:border-ring"
            />
          </div>

          <div>
            <label
              htmlFor="register-password"
              className="mb-1 block text-sm font-medium"
            >
              Password
            </label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={isLoading}
              className="w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm text-input-foreground outline-none placeholder:text-placeholder focus:border-ring"
            />
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-md border px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
