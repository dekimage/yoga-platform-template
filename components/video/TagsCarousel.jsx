"use client";

import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const TagsCarousel = observer(({ title = "Popular Tags", className = "" }) => {
  const { videoStore } = useStore();
  const router = useRouter();

  // Get all unique tags from videos
  const allTags = videoStore.videos
    .reduce((tags, video) => {
      video.tags.forEach((tag) => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
      return tags;
    }, [])
    .sort();

  const handleTagClick = (tag) => {
    router.push(`/dashboard/videos/tag/${encodeURIComponent(tag)}`);
  };

  if (allTags.length === 0) return null;

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 pb-2">
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant="outline"
              size="sm"
              onClick={() => handleTagClick(tag)}
              className="flex-shrink-0 hover:bg-primary hover:text-primary-foreground"
            >
              #{tag}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
});

export default TagsCarousel;
