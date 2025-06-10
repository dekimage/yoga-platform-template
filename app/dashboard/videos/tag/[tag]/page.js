"use client";

import { useParams } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { VideoCard } from "@/components/video/VideoCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const TagPage = observer(() => {
  const params = useParams();
  const { videoStore } = useStore();
  const tag = decodeURIComponent(params.tag);

  // Filter videos by tag
  const taggedVideos = videoStore.videos.filter((video) =>
    video.tags.some((videoTag) => videoTag.toLowerCase() === tag.toLowerCase())
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
          Videos tagged with <Badge variant="outline">#{tag}</Badge>
        </h1>
        <p className="text-muted-foreground">
          Found {taggedVideos.length} video
          {taggedVideos.length !== 1 ? "s" : ""} with this tag
        </p>
      </div>

      {taggedVideos.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {taggedVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No videos found with the tag "#{tag}"
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/videos">Browse All Videos</Link>
          </Button>
        </div>
      )}
    </div>
  );
});

export default TagPage;
