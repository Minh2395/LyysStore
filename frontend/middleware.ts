import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const role = req.auth?.user?.role;
  const { pathname } = req.nextUrl;

  // ===== ADMIN AREA =====
  if (pathname.startsWith("/admin")) {
    if (!req.auth || role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  // ===== USER PROTECTED AREA =====
  const protectedRoutes = ["/dashboard", "/checkout", "/profile", "/orders"];

  const isProtected = protectedRoutes.some((path) => pathname.startsWith(path));

  if (isProtected && !req.auth) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
});
