import { NextResponse } from "next/server"
import { getVideos } from "@/lib/contentful"

export async function GET() {
  try {
    const videos = await getVideos()
    return NextResponse.json(videos)
  } catch (error) {
    console.error("Error fetching videos:", error)
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
  }
}
