"use client";

import { useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const FavoriteButton = observer(({ videoId, className = "" }) => {
  const { authStore } = useStore();
  const [loading, setLoading] = useState(false);

  const isFavorited =
    authStore.user?.favoriteVideos?.includes(videoId) || false;

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!authStore.isAuthenticated) {
      alert("Please log in to favorite videos");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/user/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ videoId }),
      });

      if (response.ok) {
        const data = await response.json();

        // Update the user's favorites in the store
        if (authStore.user) {
          authStore.user.favoriteVideos = data.favoriteVideos;
        }

        console.log(`✅ ${data.message}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to toggle favorite");
      }
    } catch (error) {
      console.error("❌ Error toggling favorite:", error);
      alert("Failed to update favorites. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleFavorite}
      disabled={loading}
      className={cn(
        "p-2 h-8 w-8 rounded-full hover:bg-background/80 transition-colors",
        className
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-colors",
          isFavorited
            ? "fill-red-500 text-red-500"
            : "text-muted-foreground hover:text-red-500"
        )}
      />
    </Button>
  );
});

export default FavoriteButton;
