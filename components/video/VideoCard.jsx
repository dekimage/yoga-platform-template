"use client";

import { useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";

export const VideoCard = observer(({ video }) => {
  const router = useRouter();
  const { authStore } = useStore();

  const handleTagClick = (e, tag) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/dashboard/videos/tag/${encodeURIComponent(tag)}`);
  };

  const handleCardClick = () => {
    router.push(`/dashboard/video/${video.slug}`);
  };

  // FIXED: Handle missing isPublic field - default to false (private) for security
  const isPublic = video.isPublic === true;
  const hasAccess = isPublic || authStore.user?.activeMember;
  const showLockIcon = !isPublic && !authStore.user?.activeMember;

  console.log(
    `🔍 Video: ${video.title}, isPublic: ${video.isPublic}, hasAccess: ${hasAccess}`
  );

  return (
    <div
      className="group cursor-pointer bg-card rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-200"
      onClick={handleCardClick}
    >
      <div className="relative aspect-video">
        <img
          src={`https:${video.thumbnail}`}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />

        {/* FREE Badge for public videos */}
        {isPublic && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-green-500 hover:bg-green-600 text-white font-semibold">
              FREE
            </Badge>
          </div>
        )}

        {/* Lock overlay for private videos when user doesn't have access */}
        {!hasAccess && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <Lock className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Premium Content</p>
            </div>
          </div>
        )}

        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {video.duration}min
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            {/* Lock icon next to title for private videos */}
            {showLockIcon && (
              <Lock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            )}
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {video.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {video.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {video.level}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {video.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={(e) => handleTagClick(e, tag)}
              >
                #{tag}
              </Badge>
            ))}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {video.description}
          </p>
        </div>
      </div>
    </div>
  );
});
