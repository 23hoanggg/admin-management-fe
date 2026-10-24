"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { loginSchema } from "@/app/lib/schemas/auth.schema";

interface LoginFormProps {
  isModal?: boolean;
}

export default function LoginForm({ isModal = false }: LoginFormProps) {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const result = loginSchema.safeParse({
      username,
      password,
    });

    if (!result.success) {
      setErrorMessage(result.error.issues[0].message);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.username({
        username: result.data.username,
        password: result.data.password,
      });

      if (error) {
        setErrorMessage(error.message ?? "Đã xảy ra lỗi. Vui lòng thử lại.");
        return;
      }

      if (data) {
        if (isModal) {
          router.back();
        } else {
          router.push("/dashboard");
        }
      }
    } catch {
      setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.anonymous();

      if (error) {
        setErrorMessage(error.message ?? "Đã xảy ra lỗi. Vui lòng thử lại.");
        return;
      }

      if (data) {
        if (isModal) {
          router.back();
        } else {
          router.push("/dashboard");
        }
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
          <h2 className="text-lg font-semibold">Sign In</h2>

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
              htmlFor="login-username"
              className="mb-1 block text-sm font-medium"
            >
              Username
            </label>
            <input
              id="login-username"
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
              htmlFor="login-password"
              className="mb-1 block text-sm font-medium"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={isLoading}
              className="w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm text-input-foreground outline-none placeholder:text-placeholder focus:border-ring"
            />
          </div>

          <div className="mt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            <button
              type="button"
              onClick={handleAnonymousLogin}
              disabled={isLoading}
              className="w-full rounded-md border px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
            >
              Sign In Anonymously
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
