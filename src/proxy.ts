import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all paths except API routes, static files, and Next.js internals
  matcher: [
    "/",
    "/(ar|en)/:path*",
    // Skip: api, _next, static files, favicon
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
