import { NextResponse } from "next/server"

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // In a real app, you would verify the token here
    // For now, we'll assume it's valid if it exists
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
