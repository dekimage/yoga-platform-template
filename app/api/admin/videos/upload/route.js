import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const videoId = formData.get("videoId");

    if (!file || !videoId) {
      return NextResponse.json(
        { error: "File and video ID are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.BUNNY_API_KEY;
    const libraryId = process.env.BUNNY_LIBRARY_ID;

    if (!apiKey || !libraryId) {
      return NextResponse.json(
        { error: "Bunny.net configuration missing" },
        { status: 500 }
      );
    }

    console.log("🐰 Uploading video file for ID:", videoId);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Bunny.net
    const uploadResponse = await fetch(
      `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`,
      {
        method: "PUT",
        headers: {
          AccessKey: apiKey,
          "Content-Type": "application/octet-stream",
        },
        body: buffer,
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("Bunny.net upload error:", errorText);
      throw new Error(`Upload failed: ${uploadResponse.status}`);
    }

    console.log("✅ Video uploaded successfully");

    return NextResponse.json({
      success: true,
      message: "Video uploaded successfully",
      videoId: videoId,
    });
  } catch (error) {
    console.error("❌ Error uploading video:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
