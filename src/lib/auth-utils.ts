export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "PRODUCT_MANAGER"
  | "CUSTOMER_SUPPORT"
  | "USER";

export type RouteConfig = {
  exact: string[];
  patterns: RegExp[];
};

// Public routes that don't require authentication
export const authRoutes = ["/login", "/register", "/forgot-password"];

// Common routes accessible to all authenticated users
export const commonProtectedRoutes: RouteConfig = {
  exact: ["/my-profile", "/settings", "/change-password", "/reset-password"],
  patterns: [],
};

// SUPER_ADMIN specific routes
export const superAdminProtectedRoutes: RouteConfig = {
  exact: ["/super-admin"],
  patterns: [/^\/super-admin\//],
};

// ADMIN routes (accessible by both SUPER_ADMIN and ADMIN)
export const adminProtectedRoutes: RouteConfig = {
  exact: ["/admin"],
  patterns: [/^\/admin\//],
};

// PRODUCT_MANAGER specific routes
export const managerProtectedRoutes: RouteConfig = {
  exact: ["/product-manager"],
  patterns: [/^\/product-manager\//],
};

// CUSTOMER_SUPPORT specific routes
export const supportProtectedRoutes: RouteConfig = {
  exact: ["/customer-support"],
  patterns: [/^\/customer-support\//],
};

// USER (customer) routes
export const userProtectedRoutes: RouteConfig = {
  exact: ["/dashboard"],
  patterns: [/^\/dashboard\//],
};

// Helper: Check if route is authentication route
export const isAuthRoute = (pathname: string): boolean => {
  return authRoutes.some((route: string) => route === pathname);
};

// Helper: Check if route matches a route configuration
export const isRouteMatches = (
  pathname: string,
  routes: RouteConfig
): boolean => {
  // Check exact matches first for performance
  if (routes.exact.includes(pathname)) {
    return true;
  }
  // Then check patterns
  return routes.patterns.some((pattern: RegExp) => pattern.test(pathname));
};

// Helper: Determine who owns/controls a route
export const getRouteOwner = (
  pathname: string
):
  | "SUPER_ADMIN"
  | "ADMIN"
  | "PRODUCT_MANAGER"
  | "CUSTOMER_SUPPORT"
  | "USER"
  | "COMMON"
  | null => {
  // Order matters! Check most specific first

  // SUPER_ADMIN routes (specific routes only for SUPER_ADMIN)
  if (isRouteMatches(pathname, superAdminProtectedRoutes)) {
    // But make sure it's not a route that ADMIN should also access
    if (pathname === "/super-admin/create-admin") {
      return "SUPER_ADMIN"; // Only SUPER_ADMIN can create admins
    }
  }

  // ADMIN routes (accessible by both SUPER_ADMIN and ADMIN)
  if (isRouteMatches(pathname, adminProtectedRoutes)) {
    return "ADMIN";
  }

  // Role-specific routes
  if (isRouteMatches(pathname, managerProtectedRoutes)) {
    return "PRODUCT_MANAGER";
  }

  if (isRouteMatches(pathname, supportProtectedRoutes)) {
    return "CUSTOMER_SUPPORT";
  }

  if (isRouteMatches(pathname, userProtectedRoutes)) {
    return "USER";
  }

  // Common routes for all authenticated users
  if (isRouteMatches(pathname, commonProtectedRoutes)) {
    return "COMMON";
  }

  // Public route or not found
  return null;
};

// Helper: Get default dashboard route based on role
export const getDefaultDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case "SUPER_ADMIN":
      return "/super-admin/dashboard";
    case "ADMIN":
      return "/admin/dashboard/product-management";
    case "PRODUCT_MANAGER":
      return "/product-manager/dashboard";
    case "CUSTOMER_SUPPORT":
      return "/customer-support/dashboard";
    case "USER":
      return "/";
    default:
      return "/";
  }
};

// Helper: Check if a user role can access a specific route
export const isValidRedirectForRole = (
  redirectPath: string,
  role: UserRole
): boolean => {
  const routeOwner = getRouteOwner(redirectPath);

  // Public routes and common routes are accessible to all
  if (routeOwner === null || routeOwner === "COMMON") {
    return true;
  }

  switch (role) {
    case "SUPER_ADMIN":
      // SUPER_ADMIN can access everything except other role-specific routes
      return (
        routeOwner === "SUPER_ADMIN" ||
        routeOwner === "ADMIN" ||
        routeOwner === "PRODUCT_MANAGER" ||
        routeOwner === "CUSTOMER_SUPPORT" ||
        routeOwner === "USER"
      );

    case "ADMIN":
      // ADMIN can access ADMIN routes only
      return routeOwner === "ADMIN";

    case "PRODUCT_MANAGER":
      return routeOwner === "PRODUCT_MANAGER";

    case "CUSTOMER_SUPPORT":
      return routeOwner === "CUSTOMER_SUPPORT";

    case "USER":
      return routeOwner === "USER";

    default:
      // TypeScript exhaustive check
      const _exhaustiveCheck: never = role;
      return _exhaustiveCheck;
  }
};

// Optional: Helper to check if user can access a route
export const canUserAccessRoute = (
  pathname: string,
  role: UserRole
): boolean => {
  const routeOwner = getRouteOwner(pathname);

  if (routeOwner === null || routeOwner === "COMMON") {
    return true;
  }

  return isValidRedirectForRole(pathname, role);
};
