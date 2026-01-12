import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Check if Clerk is configured
const isClerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.CLERK_SECRET_KEY
);

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/servers(.*)",
  "/mods(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

// Middleware that handles both Clerk and non-Clerk scenarios
export default function middleware(request: NextRequest) {
  // If Clerk is not configured, allow all requests
  if (!isClerkConfigured) {
    return NextResponse.next();
  }

  // Use Clerk middleware when configured
  return clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
  })(request, {} as never);
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
