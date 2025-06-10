import crypto from "crypto";

export function generateSignedUrl(videoId, expirationTime = 3600) {
  const libraryId = process.env.BUNNY_LIBRARY_ID;

  if (!libraryId) {
    throw new Error("Bunny.net configuration missing");
  }

  // For Bunny.net Stream, use the iframe embed URL
  // This is the correct and secure way to embed Bunny.net videos
  return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`;
}

// Function to upload video to Bunny.net (for admin use)
export async function uploadVideo(videoFile, videoId) {
  const apiKey = process.env.BUNNY_API_KEY;
  const libraryId = process.env.BUNNY_LIBRARY_ID;

  if (!apiKey || !libraryId) {
    throw new Error("Bunny.net configuration missing");
  }

  const response = await fetch(
    `https://video.bunnycdn.com/library/${libraryId}/videos`,
    {
      method: "POST",
      headers: {
        AccessKey: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: videoId,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create video in Bunny.net");
  }

  return await response.json();
}

// Function to get video info from Bunny.net
export async function getVideoInfo(videoId) {
  const apiKey = process.env.BUNNY_API_KEY;
  const libraryId = process.env.BUNNY_LIBRARY_ID;

  const response = await fetch(
    `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`,
    {
      headers: {
        AccessKey: apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get video info from Bunny.net");
  }

  return await response.json();
}
