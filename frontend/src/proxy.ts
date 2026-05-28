export { auth as proxy } from "@/auth";

export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - images
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
