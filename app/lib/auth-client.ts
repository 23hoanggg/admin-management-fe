import { createAuthClient } from "better-auth/react";
import { API_URL } from "./config";
import {
  anonymousClient,
  usernameClient,
  adminClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [anonymousClient(), usernameClient(), adminClient()],
});
