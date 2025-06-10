import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      return NextResponse.json(
        { error: "Admin credentials not configured" },
        { status: 500 }
      );
    }

    if (username === adminUsername && password === adminPassword) {
      // Generate a simple admin token (you could use JWT here for more security)
      const adminToken = Buffer.from(`${username}:${Date.now()}`).toString(
        "base64"
      );

      return NextResponse.json({
        success: true,
        token: adminToken,
        message: "Admin authenticated successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Invalid admin credentials" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
