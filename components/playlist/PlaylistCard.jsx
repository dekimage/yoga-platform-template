"use client";

import { useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Clock, Lock } from "lucide-react";

export const PlaylistCard = observer(({ playlist }) => {
  const router = useRouter();
  const { authStore } = useStore();

  const handleCardClick = () => {
    router.push(`/dashboard/playlist/${playlist.id}`);
  };

  const handleTagClick = (e, tag) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/dashboard/playlists?tag=${encodeURIComponent(tag)}`);
  };

  // Check if user has access to this playlist
  const isPublic = playlist.isPublic === true;
  const hasAccess = isPublic || authStore.user?.activeMember;
  const showLockIcon = !isPublic && !authStore.user?.activeMember;

  return (
    <div className="group cursor-pointer relative" onClick={handleCardClick}>
      {/* Stacked Card Effect */}
      <div className="relative">
        {/* Bottom card (most visible shadow) */}
        <div className="absolute top-2 left-2 w-full h-full bg-card border rounded-lg shadow-sm opacity-60 transform rotate-1"></div>

        {/* Middle card */}
        <div className="absolute top-1 left-1 w-full h-full bg-card border rounded-lg shadow-md opacity-80 transform -rotate-0.5"></div>

        {/* Top card (main content) */}
        <div className="relative bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:transform group-hover:scale-105">
          {/* Thumbnail */}
          <div className="relative aspect-video">
            <img
              src={
                playlist.thumbnail?.startsWith("/")
                  ? playlist.thumbnail
                  : `https:${playlist.thumbnail}`
              }
              alt={playlist.title}
              className="w-full h-full object-cover"
            />

            {/* FREE Badge for public playlists */}
            {isPublic && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-green-500 hover:bg-green-600 text-white font-semibold">
                  FREE
                </Badge>
              </div>
            )}

            {/* Lock overlay for private playlists when user doesn't have access */}
            {!hasAccess && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <Lock className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Premium Content</p>
                </div>
              </div>
            )}

            {/* Play button overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <PlayCircle className="h-12 w-12 text-white" />
            </div>

            {/* Video count */}
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <PlayCircle className="h-3 w-3" />
              {playlist.videoCount}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {playlist.title}
            </h3>

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {playlist.description}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
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
            <div className="flex flex-wrap gap-1">
              {playlist.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-secondary/80 transition-colors"
                  onClick={(e) => handleTagClick(e, tag)}
                >
                  {tag}
                </Badge>
              ))}
              {playlist.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{playlist.tags.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
