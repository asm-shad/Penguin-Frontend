import jwt, { JwtPayload } from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  UserRole,
  isValidRedirectForRole,
} from "./lib/auth-utils";
import { getUserInfo } from "./services/auth/getUserInfo";
import { deleteCookie, getCookie } from "./services/auth/tokenHandlers";
import { getNewAccessToken } from "./services/auth/auth.service";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasTokenRefreshedParam =
    request.nextUrl.searchParams.has("tokenRefreshed");

  // If coming back after token refresh, remove the param and continue
  if (hasTokenRefreshedParam) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("tokenRefreshed");
    return NextResponse.redirect(url);
  }

  const tokenRefreshResult = await getNewAccessToken();

  // If token was refreshed, redirect to same page to fetch with new token
  if (tokenRefreshResult?.tokenRefreshed) {
    const url = request.nextUrl.clone();
    url.searchParams.set("tokenRefreshed", "true");
    return NextResponse.redirect(url);
  }

  const accessToken = (await getCookie("accessToken")) || null;

  let userRole: UserRole | null = null;
  if (accessToken) {
    try {
      const verifiedToken: JwtPayload | string = jwt.verify(
        accessToken,
        process.env.JWT_SECRET as string
      );

      if (typeof verifiedToken === "string") {
        await deleteCookie("accessToken");
        await deleteCookie("refreshToken");
        return NextResponse.redirect(new URL("/login", request.url));
      }

      userRole = verifiedToken.role as UserRole;
    } catch (error) {
      console.log(error);
      // Token verification failed
      await deleteCookie("accessToken");
      await deleteCookie("refreshToken");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  const routeOwner = getRouteOwner(pathname);
  const isAuth = isAuthRoute(pathname);

  // Rule 1: User is logged in and trying to access auth route.
  if (accessToken && isAuth) {
    // USER role goes to home page, others go to their dashboard
    let redirectUrl: string;
    if (userRole === "USER") {
      redirectUrl = "/"; // Home page for regular users
    } else {
      redirectUrl = getDefaultDashboardRoute(userRole as UserRole); // Dashboard for staff
    }
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Rule 2: User is trying to access open public route
  if (routeOwner === null) {
    return NextResponse.next();
  }

  // User needs to be authenticated for protected routes
  if (!accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rule 3: User needs password change
  if (accessToken) {
    const userInfo = await getUserInfo();

    // User needs to reset password
    if (userInfo.needPasswordReset) {
      if (pathname !== "/reset-password") {
        const resetPasswordUrl = new URL("/reset-password", request.url);
        resetPasswordUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(resetPasswordUrl);
      }
      return NextResponse.next();
    }

    // User doesn't need password reset but is on reset-password page
    if (
      userInfo &&
      !userInfo.needPasswordReset &&
      pathname === "/reset-password"
    ) {
      // USER role goes to home page, others go to their dashboard
      let redirectUrl: string;
      if (userRole === "USER") {
        redirectUrl = "/"; // Home page for regular users
      } else {
        redirectUrl = getDefaultDashboardRoute(userRole as UserRole); // Dashboard for staff
      }
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // Rule 4: User is trying to access common protected route
  if (routeOwner === "COMMON") {
    return NextResponse.next();
  }

  // Rule 5: User is trying to access role-based protected route
  // TypeScript now knows routeOwner is not "COMMON" and not null (from previous checks)
  const roleBasedRouteOwner = routeOwner as Exclude<
    typeof routeOwner,
    "COMMON" | null
  >;

  if (roleBasedRouteOwner) {
    // Check if user's role matches the route owner
    if (!isValidRedirectForRole(pathname, userRole as UserRole)) {
      // USER role goes to home page, others go to their dashboard
      let redirectUrl: string;
      if (userRole === "USER") {
        redirectUrl = "/"; // Home page for regular users
      } else {
        redirectUrl = getDefaultDashboardRoute(userRole as UserRole); // Dashboard for staff
      }
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
