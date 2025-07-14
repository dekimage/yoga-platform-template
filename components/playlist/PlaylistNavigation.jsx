"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

export function PlaylistNavigation({ navigation, playlistId, playlistTitle }) {
  const router = useRouter();

  const handlePreviousVideo = () => {
    if (navigation.previous) {
      router.push(
        `/dashboard/video/${navigation.previous.slug}?playlist=${playlistId}`
      );
    }
  };

  const handleNextVideo = () => {
    if (navigation.next) {
      router.push(
        `/dashboard/video/${navigation.next.slug}?playlist=${playlistId}`
      );
    }
  };

  const handleBackToPlaylist = () => {
    router.push(`/dashboard/playlist/${playlistId}`);
  };

  return (
    <div className="space-y-4">
      {/* Back to Playlist Button */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleBackToPlaylist}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {playlistTitle || "Playlist"}
        </Button>
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Previous Video */}
        <Card
          className={`cursor-pointer transition-all ${
            navigation.previous
              ? "hover:shadow-md"
              : "opacity-50 cursor-not-allowed"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <ChevronLeft className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Previous
                </p>
                {navigation.previous ? (
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={handlePreviousVideo}
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={`https:${navigation.previous.thumbnail}`}
                        alt={navigation.previous.title}
                        className="w-16 h-10 object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {navigation.previous.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {navigation.previous.duration}min
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No previous video
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Video */}
        <Card
          className={`cursor-pointer transition-all ${
            navigation.next
              ? "hover:shadow-md"
              : "opacity-50 cursor-not-allowed"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1 text-right">
                  Next
                </p>
                {navigation.next ? (
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={handleNextVideo}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate text-right">
                        {navigation.next.title}
                      </p>
                      <p className="text-xs text-muted-foreground text-right">
                        {navigation.next.duration}min
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <img
                        src={`https:${navigation.next.thumbnail}`}
                        alt={navigation.next.title}
                        className="w-16 h-10 object-cover rounded"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-right">
                    No next video
                  </p>
                )}
              </div>
              <div className="flex-shrink-0">
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Auto-play Next Button */}
      {navigation.next && (
        <div className="flex justify-center">
          <Button onClick={handleNextVideo} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            Play Next: {navigation.next.title}
          </Button>
        </div>
      )}
    </div>
  );
}
