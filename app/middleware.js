//
import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token");
  const { pathname } = request.nextUrl;

  // If user has token and tries to go to login, redirect them to dashboard
  if (token && pathname === "/login") {
    // You might want to default to employee, or check role from cookie if possible
    // For now, let's just let them stay or redirect to a safe default
    return NextResponse.redirect(new URL("/employee", request.url));
  }

  // Protect routes
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/employee/:path*",
    "/employer/:path*",
    "/dashboard/:path*",
    "/profile/:path*", 
  ],
};