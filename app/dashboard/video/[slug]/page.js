"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoCard } from "@/components/video/VideoCard";
import FavoriteButton from "@/components/video/FavoriteButton";

const VideoPage = observer(() => {
  const params = useParams();
  const router = useRouter();
  const { videoStore, analyticsStore } = useStore();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signedUrl, setSignedUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVideo = async () => {
      try {
        // Ensure videos are loaded first
        await videoStore.ensureVideosLoaded();

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
        setVideo(foundVideo);

        // Get signed URL for the video
        console.log(
          "🎬 Getting signed URL for bunnyVideoId:",
          foundVideo.bunnyVideoId
        );
        const url = await videoStore.getSignedVideoUrl(foundVideo.bunnyVideoId);
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
  }, [params.slug, videoStore, analyticsStore]);

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
        <h1 className="text-2xl font-bold">{video.title}</h1>
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

      {/* Related Videos Section - SMART: Using MobX lookup */}
      {relatedVideos.length > 0 && (
        <div className="pt-6 border-t">
          <h3 className="text-xl font-semibold mb-4">Related Videos</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {relatedVideos.map((relatedVideo) => (
              <VideoCard key={relatedVideo.id} video={relatedVideo} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default VideoPage;
