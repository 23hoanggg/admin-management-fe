"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { createUserSchema } from "@/app/lib/schemas/user.schema";

export default function RegisterForm({
  isModal = false,
}: {
  isModal?: boolean;
}) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

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
    const { error } = await authClient.signUp.email(result.data);
    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message ?? "Registration failed.");
      return;
    }

    if (isModal) router.back();
    else router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">Create account</h2>

      <div>
        <label htmlFor="register-name" className="label">
          Full name
        </label>
        <input
          id="register-name"
          className="input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="register-email" className="label">
          Email
        </label>
        <input
          id="register-email"
          type="email"
          className="input"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="register-username" className="label">
          Username
        </label>
        <input
          id="register-username"
          className="input"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="register-password" className="label">
          Password (min 8 characters)
        </label>
        <input
          id="register-password"
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
        {isLoading ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" replace className="text-foreground underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
