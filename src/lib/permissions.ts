import { type Role } from "@prisma/client";

/**
 * Define which roles can access which route groups
 */
export const ROUTE_ROLE_MAP: Record<string, Role[]> = {
  "(student)": ["STUDENT", "SUPER_ADMIN"],
  "(instructor)": ["INSTRUCTOR", "SUPER_ADMIN"],
  "(admin)": ["SUPER_ADMIN"],
};

/**
 * Public routes that don't require authentication
 */
export const PUBLIC_ROUTES = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/verify-email",
  "/auth/forgot-password",
  "/api/webhooks",
];

/**
 * Auth routes - redirect to dashboard if already logged in
 */
export const AUTH_ROUTES = [
  "/auth/login",
  "/auth/register",
];

/**
 * Check if a user with the given role can access the specified route group
 */
export function canAccessRouteGroup(role: Role, routeGroup: string): boolean {
  const allowedRoles = ROUTE_ROLE_MAP[routeGroup];
  if (!allowedRoles) return true; // no restriction
  return allowedRoles.includes(role);
}

/**
 * Get the default dashboard path for a given role
 */
export function getDashboardPath(role: Role): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "/admin/dashboard";
    case "INSTRUCTOR":
      return "/instructor/courses";
    case "STUDENT":
      return "/student/dashboard";
    default:
      return "/";
  }
}
