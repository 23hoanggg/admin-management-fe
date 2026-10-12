"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";

interface LoginFormProps {
  isModal?: boolean;
}

export default function LoginForm({ isModal = false }: LoginFormProps) {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    const { data, error } = await authClient.signIn.username({
      username,
      password,
    });

    if (error) {
      setIsLoading(false);
      return;
    }

    if (data) {
      if (isModal) {
        router.back();
      } else {
        router.push("/dashboard");
      }
    }

    setIsLoading(false);
  };

  const handleAnonymousLogin = async () => {
    setIsLoading(true);

    const { data, error } = await authClient.signIn.anonymous();

    console.log(data);
    console.log(error);

    if (error) {
      console.log(error);
    }

    if (data) {
      if (isModal) {
        router.back();
      } else {
        router.push("/dashboard");
      }
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <h2 className="text-lg font-bold">Sign In</h2>
      </div>

      <div>
        <label htmlFor="username" className="block text-xs font-medium">
          Username
        </label>

        <input
          id="username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          disabled={isLoading}
          className="mt-1 w-full rounded border p-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-xs font-medium">
          Password
        </label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          disabled={isLoading}
          className="mt-1 w-full rounded border p-2 text-sm"
        />
      </div>

      <div className="space-y-2 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded border py-2 text-sm"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>

        <button
          type="button"
          onClick={handleAnonymousLogin}
          disabled={isLoading}
          className="w-full rounded border py-2 text-xs"
        >
          Sign In Anonymously
        </button>
      </div>
    </form>
  );
}
