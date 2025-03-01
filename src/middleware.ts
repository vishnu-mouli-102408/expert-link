import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoutes = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

const isUserRoutes = createRouteMatcher(["/user(.*)"]);
const isExpertRoutes = createRouteMatcher(["/expert(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoutes(req)) await auth.protect();
  if (
    isUserRoutes(req) &&
    (await auth()).sessionClaims?.metadata?.role !== "user"
  ) {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }
  if (
    isExpertRoutes(req) &&
    (await auth()).sessionClaims?.metadata?.role !== "expert"
  ) {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
