"use client";

import { useRef, useEffect } from "react";

export function VideoPlayer({ url, title, onComplete }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    // For iframe-based players, we can use Bunny.net's Player.js library
    // for advanced event handling if needed
    if (onComplete) {
      // This is a placeholder for video completion tracking
      // You can implement this using Bunny.net's Player.js library
    }
  }, [onComplete]);

  if (!url) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading video...</p>
        </div>
      </div>
    );
  }

  // Check if URL is an iframe embed URL (Bunny.net format)
  const isIframeUrl = url.includes("iframe.mediadelivery.net");

  if (isIframeUrl) {
    return (
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <iframe
          ref={iframeRef}
          src={url}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={title || "Video Player"}
        />
      </div>
    );
  }

  // Fallback to HTML5 video for other URLs
  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <video
        className="w-full h-full"
        controls
        preload="metadata"
        poster="/placeholder.svg?height=400&width=600"
        onEnded={onComplete}
      >
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
