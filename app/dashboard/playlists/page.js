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
import { PlaylistCard } from "@/components/playlist/PlaylistCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, Grid, List } from "lucide-react";

const PlaylistsPage = observer(() => {
  const { playlistStore } = useStore();
  const searchParams = useSearchParams();
  const [tagFilter, setTagFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Get tag filter from URL params
  const urlTag = searchParams.get("tag");

  // Load playlists when component mounts
  useEffect(() => {
    const loadPlaylists = async () => {
      if (
        playlistStore.playlists.length === 0 &&
        !playlistStore.loading &&
        !playlistStore.isInitialized
      ) {
        console.log("🎵 Playlists not loaded, fetching from Contentful...");
        await playlistStore.fetchPlaylists();
      }
    };

    loadPlaylists();
  }, [playlistStore]);

  // Set tag filter from URL
  useEffect(() => {
    if (urlTag) {
      setTagFilter(urlTag);
    }
  }, [urlTag]);

  // Get unique tags for filter
  const allTags = playlistStore.playlists.reduce((tags, playlist) => {
    playlist.tags.forEach((tag) => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });
    return tags;
  }, []);

  // Filter and sort playlists
  const filteredPlaylists = playlistStore.playlists
    .filter((playlist) => {
      const matchesTag =
        tagFilter === "all" || playlist.tags.includes(tagFilter);
      return matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "mostVideos":
          return b.videoCount - a.videoCount;
        case "longest":
          return b.totalDuration - a.totalDuration;
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const clearFilters = () => {
    setTagFilter("all");
    setSortBy("newest");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Yoga Playlists</h1>
        <p className="text-muted-foreground">
          Discover curated collections of yoga practices
          {tagFilter !== "all" && ` filtered by "${tagFilter}"`}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-4">
          <Select value={tagFilter} onValueChange={setTagFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="mostVideos">Most Videos</SelectItem>
              <SelectItem value="longest">Longest Duration</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>

          {(tagFilter !== "all" || sortBy !== "newest") && (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          {filteredPlaylists.length} playlist
          {filteredPlaylists.length !== 1 ? "s" : ""} found
        </div>
      </div>

      {/* Active Filters */}
      {tagFilter !== "all" && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Active filters:</span>
          <Badge
            variant="secondary"
            className="cursor-pointer"
            onClick={() => setTagFilter("all")}
          >
            {tagFilter} ×
          </Badge>
        </div>
      )}

      {/* Results */}
      {playlistStore.loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredPlaylists.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto mb-4 h-12 w-12 text-muted-foreground">
            <List className="h-full w-full" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No playlists found</h3>
          <p className="text-muted-foreground mb-4">
            {playlistStore.playlists.length === 0 && !playlistStore.loading
              ? "Loading playlists..."
              : tagFilter !== "all"
              ? `No playlists found with the tag "${tagFilter}"`
              : "No playlists match your current filters"}
          </p>
          {tagFilter !== "all" && (
            <Button onClick={clearFilters}>Clear Filters</Button>
          )}
        </div>
      )}
    </div>
  );
});

export default PlaylistsPage;
