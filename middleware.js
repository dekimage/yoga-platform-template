import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Remove the membership check for video routes - let the video detail page handle access control
    // This allows public videos to be accessed by non-premium users
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
