"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VideoCard } from "@/components/video/VideoCard";
import TagsCarousel from "@/components/video/TagsCarousel";
import CategoriesCarousel from "@/components/video/CategoriesCarousel";

const VideosPage = observer(() => {
  const { videoStore } = useStore();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  // Get search query from URL params
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  // Add useEffect to ensure videos are loaded when navigating to this page
  useEffect(() => {
    const loadVideos = async () => {
      if (
        videoStore.videos.length === 0 &&
        !videoStore.loading &&
        !videoStore.isInitialized
      ) {
        console.log("🎬 Videos not loaded, fetching from Contentful...");
        await videoStore.fetchVideos();
      } else if (
        videoStore.videos.length === 0 &&
        videoStore.isInitialized &&
        !videoStore.loading
      ) {
        console.log("🎬 Videos initialized but empty, refetching...");
        await videoStore.fetchVideos();
      }
    };

    loadVideos();
  }, []);

  // Get unique categories and levels for filters
  const categories = [
    ...new Set(videoStore.videos.map((video) => video.category)),
  ];
  const levels = [...new Set(videoStore.videos.map((video) => video.level))];

  // Filter videos based on search query and filters
  const filteredVideos = videoStore.videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory =
      !categoryFilter ||
      categoryFilter === "all" ||
      video.category === categoryFilter;
    const matchesLevel =
      !levelFilter || levelFilter === "all" || video.level === levelFilter;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Yoga Videos</h1>
        <p className="text-muted-foreground">
          Browse our collection of premium yoga videos
        </p>
      </div>

      {/* Categories Carousel */}
      <CategoriesCarousel />

      {/* Tags Carousel */}
      <TagsCarousel />

      {/* Search and Filters */}
      <div className="grid gap-4 md:grid-cols-[1fr_200px_200px]">
        <Input
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {levels.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      {videoStore.loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredVideos.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {videoStore.videos.length === 0 && !videoStore.loading
              ? "Loading videos..."
              : "No videos found matching your criteria"}
          </p>
        </div>
      )}
    </div>
  );
});

export default VideosPage;
