import { NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { firestore } from "@/lib/firebase";

export async function POST(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decodedToken = await verifyToken(token);
    const { videoId } = await request.json();

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    // Get user document
    const userDoc = await firestore
      .collection("users")
      .doc(decodedToken.uid)
      .get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    const currentFavorites = userData.favoriteVideos || [];

    let updatedFavorites;
    let action;

    // Toggle favorite
    if (currentFavorites.includes(videoId)) {
      // Remove from favorites
      updatedFavorites = currentFavorites.filter((id) => id !== videoId);
      action = "removed";
    } else {
      // Add to favorites
      updatedFavorites = [...currentFavorites, videoId];
      action = "added";
    }

    // Update user document
    await userDoc.ref.update({
      favoriteVideos: updatedFavorites,
      updatedAt: new Date(),
    });

    console.log(
      `✅ ${action} video ${videoId} ${
        action === "added" ? "to" : "from"
      } favorites for user ${decodedToken.uid}`
    );

    return NextResponse.json({
      success: true,
      action,
      favoriteVideos: updatedFavorites,
      message: `Video ${action} ${
        action === "added" ? "to" : "from"
      } favorites`,
    });
  } catch (error) {
    console.error("❌ Error toggling favorite:", error);
    return NextResponse.json(
      { error: "Failed to toggle favorite" },
      { status: 500 }
    );
  }
}
