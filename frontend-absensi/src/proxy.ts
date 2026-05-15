import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "access_token";
const ROLE_COOKIE_NAME = "user_role";

const adminRoles = ["admin", "hr"];

function isAdminRole(role: string | undefined) {
  return adminRoles.includes(role ?? "");
}

function redirectTo(pathname: string, request: NextRequest) {
  return NextResponse.redirect(new URL(pathname, request.url));
}

function legacyRedirect(pathname: string, role: string | undefined) {
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return isAdminRole(role) ? "/admin/dashboard" : "/app/attendance";
  }
  if (pathname === "/attendance" || pathname.startsWith("/attendance/")) {
    return pathname.replace("/attendance", "/app/attendance");
  }
  if (pathname === "/employees" || pathname.startsWith("/employees/")) {
    return pathname.replace("/employees", "/admin/employees");
  }
  if (pathname === "/offices" || pathname.startsWith("/offices/")) {
    return pathname.replace("/offices", "/admin/offices");
  }
  if (pathname === "/shifts" || pathname.startsWith("/shifts/")) {
    return pathname.replace("/shifts", "/admin/shifts");
  }
  if (pathname === "/reports" || pathname.startsWith("/reports/")) {
    return pathname.replace("/reports", "/admin/reports");
  }
  if (pathname === "/profile" || pathname.startsWith("/profile/")) {
    return pathname.replace("/profile", "/app/profile");
  }
  if (pathname === "/settings" || pathname.startsWith("/settings/")) {
    return isAdminRole(role)
      ? pathname.replace("/settings", "/admin/settings")
      : pathname.replace("/settings", "/app/settings");
  }
  return null;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const role = request.cookies.get(ROLE_COOKIE_NAME)?.value;

  const isLogin = pathname === "/login";
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAppRoute = pathname === "/app" || pathname.startsWith("/app/");
  const legacy = legacyRedirect(pathname, role);

  if (legacy) {
    return redirectTo(legacy, request);
  }

  if (pathname === "/admin") {
    return redirectTo("/admin/dashboard", request);
  }

  if (pathname === "/app") {
    return redirectTo("/app/attendance", request);
  }

  if (isLogin && token) {
    return redirectTo(isAdminRole(role) ? "/admin/dashboard" : "/app/attendance", request);
  }

  if ((isAdminRoute || isAppRoute) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", isAdminRoute ? "/admin/dashboard" : "/app/attendance");
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && !isAdminRole(role)) {
    return redirectTo("/app/attendance", request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/admin/:path*",
    "/app/:path*",
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
