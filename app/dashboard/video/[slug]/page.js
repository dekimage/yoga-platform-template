"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoCard } from "@/components/video/VideoCard";
import FavoriteButton from "@/components/video/FavoriteButton";
import { PlaylistNavigation } from "@/components/playlist/PlaylistNavigation";

const VideoPage = observer(() => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { videoStore, playlistStore, analyticsStore, authStore } = useStore();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signedUrl, setSignedUrl] = useState("");
  const [error, setError] = useState("");
  const [playlistNavigation, setPlaylistNavigation] = useState(null);

  // Get playlist ID from URL params
  const playlistId = searchParams.get("playlist");

  useEffect(() => {
    const loadVideo = async () => {
      try {
        // Ensure videos are loaded first
        await videoStore.ensureVideosLoaded();

        // If we have a playlist ID, ensure playlists are loaded too
        if (playlistId) {
          await playlistStore.ensurePlaylistsLoaded();
        }

        // Find video by slug
        const foundVideo = videoStore.videos.find(
          (v) => v.slug === params.slug
        );

        if (!foundVideo) {
          setError("Video not found");
          return;
        }

        console.log("🎬 Found video:", foundVideo);
        console.log("🎬 Video bunnyVideoId:", foundVideo.bunnyVideoId);

        // Check if user has access to this video
        const isPublic = foundVideo.isPublic === true;
        const hasAccess = isPublic || authStore.user?.activeMember;

        if (!hasAccess) {
          router.push("/dashboard/premium");
          return;
        }

        setVideo(foundVideo);

        // If we came from a playlist, get navigation info
        if (playlistId) {
          const navigation = playlistStore.getPlaylistNavigation(
            playlistId,
            foundVideo.id,
            videoStore
          );
          console.log("🎵 Playlist navigation:", navigation);
          setPlaylistNavigation(navigation);
        }

        // Get signed URL for the video
        console.log(
          "🎬 Getting signed URL for bunnyVideoId:",
          foundVideo.bunnyVideoId
        );
        const url = await videoStore.getSignedVideoUrl(
          foundVideo.bunnyVideoId,
          foundVideo.isPublic
        );
        console.log("🎬 Received signed URL:", url);
        setSignedUrl(url);

        // Track video view
        analyticsStore.trackVideoView(foundVideo.id);
      } catch (err) {
        console.error("Error loading video:", err);
        setError(`Failed to load video: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [
    params.slug,
    playlistId,
    videoStore,
    playlistStore,
    analyticsStore,
    authStore,
  ]);

  const handleVideoComplete = () => {
    if (video) {
      analyticsStore.trackVideoComplete(video.id);
    }
  };

  const handleTagClick = (tag) => {
    router.push(`/dashboard/videos/tag/${encodeURIComponent(tag)}`);
  };

  // SMART: Get related videos from MobX using IDs
  const getRelatedVideos = () => {
    if (!video?.relatedVideoIds || video.relatedVideoIds.length === 0) {
      return [];
    }

    return video.relatedVideoIds
      .map((id) => videoStore.videos.find((v) => v.id === id))
      .filter(Boolean) // Remove any undefined videos
      .slice(0, 3); // Limit to 3 videos
  };

  const relatedVideos = getRelatedVideos();

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[50vh] w-full rounded-lg" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">{error}</h2>
        <Button onClick={() => router.push("/dashboard/videos")}>
          Back to Videos
        </Button>
      </div>
    );
  }

  if (!video) return null;

  return (
    <div className="space-y-6">
      <VideoPlayer
        url={signedUrl}
        title={video.title}
        onComplete={handleVideoComplete}
      />

      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{video.title}</h1>

          {/* Author Info */}
          {video.author && (
            <div
              className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors"
              onClick={() =>
                router.push(
                  `/dashboard/videos/author/${encodeURIComponent(
                    video.author.slug
                  )}`
                )
              }
            >
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={
                    video.author.avatar?.startsWith("/")
                      ? video.author.avatar
                      : `https:${video.author.avatar}`
                  }
                  alt={video.author.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium hover:text-primary transition-colors">
                  {video.author.name}
                </p>
                {video.author.bio && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {video.author.bio}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <FavoriteButton videoId={video.id} className="h-10 w-10" />
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        <Badge>{video.category}</Badge>
        <Badge variant="outline">{video.level}</Badge>
        <span className="text-sm text-muted-foreground">
          {video.duration} minutes
        </span>
      </div>

      <div className="prose max-w-none">
        <p>{video.description}</p>
      </div>

      <div className="pt-4 border-t">
        <h3 className="font-medium mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {video.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80 transition-colors"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Playlist Navigation or Related Videos */}
      {playlistNavigation ? (
        <div className="pt-6 border-t">
          <h3 className="text-xl font-semibold mb-4">Playlist Navigation</h3>
          <PlaylistNavigation
            navigation={playlistNavigation}
            playlistId={playlistId}
            playlistTitle={playlistStore.getPlaylistById(playlistId)?.title}
          />
        </div>
      ) : (
        relatedVideos.length > 0 && (
          <div className="pt-6 border-t">
            <h3 className="text-xl font-semibold mb-4">Related Videos</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {relatedVideos.map((relatedVideo) => (
                <VideoCard key={relatedVideo.id} video={relatedVideo} />
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
});

export default VideoPage;
