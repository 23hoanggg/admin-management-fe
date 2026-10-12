import { createAuthClient } from "better-auth/react";
import {
  anonymousClient,
  usernameClient,
  adminClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:6868",
  plugins: [anonymousClient(), usernameClient(), adminClient()],
});
