"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoCard } from "@/components/video/VideoCard";
import { ArrowLeft, PlayCircle, Clock, List } from "lucide-react";

const PlaylistDetailPage = observer(() => {
  const params = useParams();
  const router = useRouter();
  const { playlistStore, videoStore } = useStore();
  const [playlist, setPlaylist] = useState(null);
  const [playlistVideos, setPlaylistVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPlaylistAndVideos = async () => {
      try {
        // Ensure both playlists and videos are loaded
        await Promise.all([
          playlistStore.ensurePlaylistsLoaded(),
          videoStore.ensureVideosLoaded(),
        ]);

        // Find playlist by ID
        const foundPlaylist = playlistStore.getPlaylistById(params.id);

        if (!foundPlaylist) {
          setError("Playlist not found");
          return;
        }

        console.log("🎵 Found playlist:", foundPlaylist);
        setPlaylist(foundPlaylist);

        // Get videos for this playlist
        const videos = playlistStore.getPlaylistVideos(params.id, videoStore);
        console.log("🎵 Playlist videos:", videos);
        setPlaylistVideos(videos);
      } catch (err) {
        console.error("Error loading playlist:", err);
        setError(`Failed to load playlist: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadPlaylistAndVideos();
  }, [params.id, playlistStore, videoStore]);

  const handlePlayAll = () => {
    if (playlistVideos.length > 0) {
      // Navigate to first video with playlist context
      router.push(
        `/dashboard/video/${playlistVideos[0].slug}?playlist=${params.id}`
      );
    }
  };

  const handleTagClick = (tag) => {
    router.push(`/dashboard/playlists?tag=${encodeURIComponent(tag)}`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-video w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">{error}</h2>
        <Button onClick={() => router.push("/dashboard/playlists")}>
          Back to Playlists
        </Button>
      </div>
    );
  }

  if (!playlist) return null;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard/playlists")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Playlists
        </Button>
      </div>

      {/* Playlist Header */}
      <div className="bg-card rounded-lg p-6 border">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Playlist Thumbnail */}
          <div className="flex-shrink-0">
            <div className="relative w-full md:w-48 aspect-video rounded-lg overflow-hidden">
              <img
                src={
                  playlist.thumbnail?.startsWith("/")
                    ? playlist.thumbnail
                    : `https:${playlist.thumbnail}`
                }
                alt={playlist.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <List className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          {/* Playlist Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{playlist.title}</h1>
            <p className="text-muted-foreground mb-4">{playlist.description}</p>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <PlayCircle className="h-4 w-4" />
                {playlist.videoCount} video
                {playlist.videoCount !== 1 ? "s" : ""}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {playlist.totalDuration}min total
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {playlist.tags.map((tag) => (
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

            {/* Play All Button */}
            <Button
              onClick={handlePlayAll}
              disabled={playlistVideos.length === 0}
              className="flex items-center gap-2"
            >
              <PlayCircle className="h-4 w-4" />
              Play All
            </Button>
          </div>
        </div>
      </div>

      {/* Videos in Playlist */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Videos in this playlist</h2>

        {playlistVideos.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {playlistVideos.map((video, index) => (
              <div key={video.id} className="relative">
                {/* Video Number Badge */}
                <div className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                  {index + 1}
                </div>
                <VideoCard video={video} playlistId={params.id} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto mb-4 h-12 w-12 text-muted-foreground">
              <PlayCircle className="h-full w-full" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              No videos in this playlist
            </h3>
            <p className="text-muted-foreground">
              This playlist doesn't contain any videos yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export default PlaylistDetailPage;
