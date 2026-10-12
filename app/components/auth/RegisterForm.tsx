"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    const { data, error } = await authClient.signUp.email({
      name,
      email,
      username,
      password,
    });

    console.log("data:", data);
    console.log("error:", error);

    if (data) {
      router.back();
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h2 className="text-lg font-bold">Register</h2>

      <div>
        <label htmlFor="name" className="block text-xs font-medium">
          Name
        </label>

        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          disabled={isLoading}
          className="mt-1 w-full rounded border p-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-xs font-medium">
          Email
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={isLoading}
          className="mt-1 w-full rounded border p-2 text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="register-username"
          className="block text-xs font-medium"
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
          className="mt-1 w-full rounded border p-2 text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="register-password"
          className="block text-xs font-medium"
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
          className="mt-1 w-full rounded border p-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded border py-2 text-sm"
      >
        {isLoading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
