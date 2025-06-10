"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import FavoriteButton from "./FavoriteButton";

export function VideoCard({ video }) {
  const router = useRouter();

  const handleTagClick = (e, tag) => {
    e.preventDefault(); // Prevent the parent link from triggering
    e.stopPropagation();
    router.push(`/dashboard/videos/tag/${encodeURIComponent(tag)}`);
  };

  const handleCardClick = () => {
    router.push(`/dashboard/video/${video.slug}`);
  };

  return (
    <div
      className="group cursor-pointer border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden rounded-lg mb-3">
        <img
          src={video.thumbnail || "/placeholder.svg?height=200&width=300"}
          alt={video.title}
          className="w-full h-48 object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-12 w-12 text-white"
          >
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="text-xs">
            {video.duration}min
          </Badge>
        </div>
        <div className="absolute top-2 left-2">
          <FavoriteButton
            videoId={video.id}
            className="bg-background/80 backdrop-blur-sm"
          />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {video.title}
        </h3>
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
  );
}
