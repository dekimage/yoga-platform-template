import { NextResponse } from "next/server";
import { getPlaylists } from "@/lib/contentful";

export async function GET() {
  try {
    const playlists = await getPlaylists();
    return NextResponse.json(playlists);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return NextResponse.json(
      { error: "Failed to fetch playlists" },
      { status: 500 }
    );
  }
}
