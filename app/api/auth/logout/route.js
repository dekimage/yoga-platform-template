import { NextResponse } from "next/server";

export async function POST(request) {
  const response = NextResponse.json({ success: true });

  // Clear auth cookie
  response.cookies.set("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
