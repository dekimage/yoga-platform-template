"use client";

import { useParams } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { VideoCard } from "@/components/video/VideoCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const CategoryPage = observer(() => {
  const params = useParams();
  const { videoStore } = useStore();
  const category = decodeURIComponent(params.category);

  // Filter videos by category
  const categoryVideos = videoStore.videos.filter(
    (video) => video.category.toLowerCase() === category.toLowerCase()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/videos">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Videos
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Badge>{category}</Badge> Videos
        </h1>
        <p className="text-muted-foreground">
          Found {categoryVideos.length} video
          {categoryVideos.length !== 1 ? "s" : ""} in this category
        </p>
      </div>

      {categoryVideos.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categoryVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No videos found in the "{category}" category
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/videos">Browse All Videos</Link>
          </Button>
        </div>
      )}
    </div>
  );
});

export default CategoryPage;
