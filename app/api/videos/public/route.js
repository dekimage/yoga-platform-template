import { NextResponse } from "next/server";
import { generateSignedUrl } from "@/lib/bunny";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");

    console.log("🎥 Public video request for videoId:", videoId);

    if (!videoId) {
      return NextResponse.json({ error: "Video ID required" }, { status: 400 });
    }

    // Generate signed URL for public video (no authentication required)
    try {
      const signedUrl = generateSignedUrl(videoId);
      console.log("✅ Generated signed URL for public video:", videoId);

      return NextResponse.json({ signedUrl });
    } catch (error) {
      console.error("❌ Error generating signed URL:", error);
      return NextResponse.json(
        {
          error: "Failed to generate video URL",
          details: error.message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Unexpected error in public video API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
