import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const role = req.auth?.user?.role;
  const { pathname } = req.nextUrl;

  // chưa login → chặn luôn (tuỳ bạn)
  if (!req.auth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ===== ADMIN AREA =====
  if (pathname.startsWith("/admin")) {
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // ===== USER AREA =====
  if (pathname.startsWith("/users")) {
    if (role !== "USER") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/users/:path*"],
};
