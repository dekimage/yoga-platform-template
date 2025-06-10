import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { title } = await request.json();

    const apiKey = process.env.BUNNY_API_KEY;
    const libraryId = process.env.BUNNY_LIBRARY_ID;

    if (!apiKey || !libraryId) {
      return NextResponse.json(
        { error: "Bunny.net configuration missing" },
        { status: 500 }
      );
    }

    console.log("🐰 Creating video in Bunny.net:", title);

    const response = await fetch(
      `https://video.bunnycdn.com/library/${libraryId}/videos`,
      {
        method: "POST",
        headers: {
          AccessKey: apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Bunny.net API error:", errorText);
      throw new Error(`Bunny.net API error: ${response.status}`);
    }

    const videoData = await response.json();
    console.log("✅ Video created successfully:", videoData);

    return NextResponse.json(videoData);
  } catch (error) {
    console.error("❌ Error creating video:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
