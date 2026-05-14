import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "access_token";

const protectedRoutes = [
  "/dashboard",
  "/attendance",
  "/employees",
  "/offices",
  "/shifts",
  "/reports",
  "/profile",
  "/settings",
];

const guestRoutes = ["/login"];

const adminHrRoutes = [
  "/employees",
  "/offices",
  "/shifts",
  "/reports",
];

function matchesRoute(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const role = request.cookies.get("user_role")?.value;

  const isProtectedRoute = matchesRoute(pathname, protectedRoutes);
  const isGuestRoute = matchesRoute(pathname, guestRoutes);
  const isAdminHrRoute = matchesRoute(pathname, adminHrRoutes);

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isGuestRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAdminHrRoute && token && role && !["admin", "hr"].includes(role)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/attendance/:path*",
    "/employees/:path*",
    "/offices/:path*",
    "/shifts/:path*",
    "/reports/:path*",
    "/profile/:path*",
    "/settings/:path*",
  ],
};
