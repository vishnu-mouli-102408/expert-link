import env from "@/env";
import type { AppRouter } from "@/server";
import { createClient } from "jstack";

export const client = createClient<AppRouter>({
  baseUrl: `${getBaseUrl()}/api`,
});

// console.log("BASE URL", getBaseUrl());

function getBaseUrl() {
  // 👇 Use browser URL if client-side
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // 👇 Use Vercel URL in production
  if (env.VERCEL_URL) {
    return `https://${env.VERCEL_URL}`;
  }

  // 👇 Default to localhost
  return "http://localhost:3000";
}

// needed for cloudflare deployement
// function getBaseUrl() {
//   // 👇 In production, use the production worker
//   if (env.NODE_ENV === "production") {
//     return "https://expert-link.vishnumouli0.workers.dev";
//   }

//   // 👇 Locally, use wrangler backend
//   return "http://localhost:8080";
// }
