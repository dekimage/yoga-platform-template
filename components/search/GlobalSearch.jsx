"use client";

import { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import Link from "next/link";

const GlobalSearch = observer(({ isMobile = false }) => {
  const { videoStore } = useStore();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const searchRef = useRef(null);

  // Search videos in real-time
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const filtered = videoStore.videos
      .filter(
        (video) =>
          video.title.toLowerCase().includes(query.toLowerCase()) ||
          video.description.toLowerCase().includes(query.toLowerCase()) ||
          video.tags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
          ) ||
          video.category.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5); // Limit to 5 results

    setResults(filtered);
  }, [query, videoStore.videos]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/dashboard/videos?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className={`relative ${isMobile ? "w-full" : "w-80"}`}>
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search videos, tags, categories..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (query.length >= 2 || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-2">
              <div className="text-xs text-muted-foreground mb-2 px-2">
                Found {results.length} video{results.length !== 1 ? "s" : ""}
              </div>
              {results.map((video) => (
                <Link
                  key={video.id}
                  href={`/dashboard/video/${video.slug}`}
                  onClick={() => {
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className="block p-2 hover:bg-muted rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={`https:${video.thumbnail}`}
                      alt={video.title}
                      className="w-12 h-8 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {video.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {video.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {video.duration}min
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {query.trim() && (
                <div className="border-t mt-2 pt-2">
                  <Link
                    href={`/dashboard/videos?search=${encodeURIComponent(
                      query
                    )}`}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery("");
                    }}
                    className="block p-2 text-sm text-primary hover:bg-muted rounded-md text-center"
                  >
                    View all results for "{query}"
                  </Link>
                </div>
              )}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No videos found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
});

export default GlobalSearch;
