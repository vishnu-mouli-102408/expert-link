import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoutes = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api(.*)",
]);

const isUserRoutes = createRouteMatcher(["/user(.*)"]);
const isExpertRoutes = createRouteMatcher(["/expert(.*)"]);
const isOnboardingRoute = createRouteMatcher(["/onboarding"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();
  //   if (!isPublicRoutes(req)) await auth.protect();
  if (!userId && !isPublicRoutes(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

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

  if (userId && isOnboardingRoute(req)) {
    return NextResponse.next();
  }

  console.info("REQ", req.url);

  if (
    userId &&
    !sessionClaims?.metadata?.onboardingComplete &&
    req.nextUrl.pathname !== "/onboarding"
  ) {
    const onboardingUrl = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboardingUrl);
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
