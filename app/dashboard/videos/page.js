"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
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
  const { videoStore, authorStore } = useStore();
  const searchParams = useSearchParams();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");

  // Get search query from URL params (from global search)
  const searchQuery = searchParams.get("search") || "";
  const authorParam = searchParams.get("author") || "";

  // Add useEffect to ensure videos and authors are loaded when navigating to this page
  useEffect(() => {
    const loadData = async () => {
      const promises = [];

      if (
        videoStore.videos.length === 0 &&
        !videoStore.loading &&
        !videoStore.isInitialized
      ) {
        console.log("🎬 Videos not loaded, fetching from Contentful...");
        promises.push(videoStore.fetchVideos());
      } else if (
        videoStore.videos.length === 0 &&
        videoStore.isInitialized &&
        !videoStore.loading
      ) {
        console.log("🎬 Videos initialized but empty, refetching...");
        promises.push(videoStore.fetchVideos());
      }

      // Load authors
      if (
        authorStore.authors.length === 0 &&
        !authorStore.loading &&
        !authorStore.isInitialized
      ) {
        console.log("👤 Authors not loaded, fetching from Contentful...");
        promises.push(authorStore.fetchAuthors());
      }

      await Promise.all(promises);
    };

    loadData();
  }, []);

  // Set author filter from URL params
  useEffect(() => {
    if (authorParam) {
      setAuthorFilter(authorParam);
    }
  }, [authorParam]);

  // Get unique categories and levels for filters
  const categories = [
    ...new Set(videoStore.videos.map((video) => video.category)),
  ].filter(Boolean); // Remove any undefined/null values

  const levels = [
    ...new Set(videoStore.videos.map((video) => video.level)),
  ].filter(Boolean); // Remove any undefined/null values

  // Filter videos based on search query and filters
  const filteredVideos = videoStore.videos.filter((video) => {
    const matchesSearch =
      !searchQuery ||
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      video.author?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || video.category === categoryFilter;

    const matchesLevel = levelFilter === "all" || video.level === levelFilter;

    const matchesAuthor =
      authorFilter === "all" || video.author?.slug === authorFilter;

    return matchesSearch && matchesCategory && matchesLevel && matchesAuthor;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Yoga Videos</h1>
        <p className="text-muted-foreground">
          Browse our collection of premium yoga videos
          {searchQuery && ` - searching for "${searchQuery}"`}
          {authorFilter !== "all" &&
            ` - by ${
              authorStore.getAuthorBySlug(authorFilter)?.name || authorFilter
            }`}
        </p>
      </div>

      {/* Categories Carousel */}
      <CategoriesCarousel />

      {/* Tags Carousel */}
      <TagsCarousel />

      {/* Filters Only (Search moved to header) */}
      <div className="flex gap-4">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Categories" />
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
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Levels" />
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

        <Select value={authorFilter} onValueChange={setAuthorFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Authors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Authors</SelectItem>
            {authorStore.authors.map((author) => (
              <SelectItem key={author.id} value={author.slug}>
                {author.name}
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
