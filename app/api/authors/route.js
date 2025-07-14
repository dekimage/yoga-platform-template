import { NextResponse } from "next/server";
import { getAuthors } from "@/lib/contentful";

export async function GET() {
  try {
    const authors = await getAuthors();
    return NextResponse.json(authors);
  } catch (error) {
    console.error("Error fetching authors:", error);
    return NextResponse.json(
      { error: "Failed to fetch authors" },
      { status: 500 }
    );
  }
}
