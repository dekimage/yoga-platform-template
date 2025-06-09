import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // For video routes, check if user has active membership
    if (pathname.startsWith("/dashboard/video/")) {
      try {
        // Make an API call to verify the user instead of importing Firebase directly
        const response = await fetch(new URL("/api/auth/verify", request.url), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          return NextResponse.redirect(new URL("/login", request.url));
        }

        const userData = await response.json();

        // If user is not an active member, redirect to premium page
        if (!userData.activeMember) {
          return NextResponse.redirect(
            new URL("/dashboard/premium", request.url)
          );
        }
      } catch (error) {
        console.error("Middleware auth error:", error);
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
