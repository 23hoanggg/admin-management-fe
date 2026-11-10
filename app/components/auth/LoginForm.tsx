"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { loginSchema } from "@/app/lib/schemas/auth.schema";

export default function LoginForm({ isModal = false }: { isModal?: boolean }) {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Đăng nhập xong: đang ở popup thì đóng popup, không thì về dashboard
  function goNext() {
    if (isModal) router.back();
    else router.push("/dashboard");
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const result = loginSchema.safeParse({ username, password });
    if (!result.success) {
      setErrorMessage(result.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    const { error } = await authClient.signIn.username(result.data);
    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message ?? "Sign in failed.");
      return;
    }
    goNext();
  }

  async function handleGuestLogin() {
    setIsLoading(true);
    const { error } = await authClient.signIn.anonymous();
    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message ?? "Sign in failed.");
      return;
    }
    goNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">Sign in</h2>

      <div>
        <label htmlFor="login-username" className="label">
          Username
        </label>
        <input
          id="login-username"
          className="input"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="login-password" className="label">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          className="input"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isLoading}
        />
      </div>

      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary w-full"
      >
        {isLoading ? "Signing in…" : "Sign in"}
      </button>
      <button
        type="button"
        disabled={isLoading}
        onClick={handleGuestLogin}
        className="btn w-full"
      >
        Continue as guest
      </button>

      <p className="text-center text-xs text-muted-foreground">
        No account?{" "}
        <Link href="/register" replace className="text-foreground underline">
          Register
        </Link>
      </p>
    </form>
  );
}
