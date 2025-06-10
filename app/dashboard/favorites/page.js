"use client";

import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { VideoCard } from "@/components/video/VideoCard";
import { Heart } from "lucide-react";

const FavoritesPage = observer(() => {
  const { authStore, videoStore } = useStore();
  const { user } = authStore;
  const { videos } = videoStore;

  // 🔍 DEBUG: Let's see what we have
  console.log("🔍 DEBUG user object:", user);
  console.log("🔍 DEBUG user.favoriteVideos:", user?.favoriteVideos);
  console.log("🔍 DEBUG videos array length:", videos.length);
  console.log("🔍 DEBUG first video ID:", videos[0]?.id);

  // Get user's favorite video IDs
  const favoriteIds = user?.favoriteVideos || [];
  console.log("🔍 DEBUG favoriteIds:", favoriteIds);

  // Filter videos to show only favorites
  const favoriteVideos = videos.filter((video) => {
    const isMatch = favoriteIds.includes(video.id);
    console.log(
      `🔍 DEBUG video ${video.id} (${video.title}) - is favorite: ${isMatch}`
    );
    return isMatch;
  });

  console.log("🔍 DEBUG favoriteVideos:", favoriteVideos);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Heart className="h-6 w-6 text-red-500" />
          <h1 className="text-3xl font-bold">My Favorites</h1>
        </div>
        <p className="text-muted-foreground">
          Your favorite yoga videos - {favoriteVideos.length} video
          {favoriteVideos.length !== 1 ? "s" : ""}
        </p>
      </div>

      {favoriteVideos.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
          <p className="text-muted-foreground mb-4">
            Start adding videos to your favorites by clicking the heart icon on
            any video
          </p>
          <a href="/dashboard/videos" className="text-primary hover:underline">
            Browse Videos →
          </a>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favoriteVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
});

export default FavoritesPage;
