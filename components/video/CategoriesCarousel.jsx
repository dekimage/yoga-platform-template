"use client";

import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const CategoriesCarousel = observer(
  ({ title = "Categories", className = "" }) => {
    const { videoStore } = useStore();
    const router = useRouter();

    // Get all unique categories from videos
    const categories = [
      ...new Set(videoStore.videos.map((video) => video.category)),
    ].sort();

    const handleCategoryClick = (category) => {
      router.push(`/dashboard/videos/category/${encodeURIComponent(category)}`);
    };

    if (categories.length === 0) return null;

    return (
      <div className={className}>
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-2 pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant="default"
                size="sm"
                onClick={() => handleCategoryClick(category)}
                className="flex-shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    );
  }
);

export default CategoriesCarousel;
