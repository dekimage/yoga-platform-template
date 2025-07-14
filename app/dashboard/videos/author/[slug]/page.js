"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { VideoCard } from "@/components/video/VideoCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe, Mail } from "lucide-react";
import Link from "next/link";

const AuthorPage = observer(() => {
  const params = useParams();
  const router = useRouter();
  const { videoStore, authorStore } = useStore();
  const [author, setAuthor] = useState(null);
  const [authorVideos, setAuthorVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const authorSlug = decodeURIComponent(params.slug);

  useEffect(() => {
    const loadAuthorAndVideos = async () => {
      try {
        // Ensure both authors and videos are loaded
        await Promise.all([
          authorStore.ensureAuthorsLoaded(),
          videoStore.ensureVideosLoaded(),
        ]);

        // Find author by slug
        const foundAuthor = authorStore.getAuthorBySlug(authorSlug);
        if (foundAuthor) {
          setAuthor(foundAuthor);

          // Get videos by this author
          const videos = authorStore.getAuthorVideos(
            foundAuthor.id,
            videoStore
          );
          setAuthorVideos(videos);
        }
      } catch (error) {
        console.error("Error loading author data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAuthorAndVideos();
  }, [authorSlug, authorStore, videoStore]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-24 bg-muted rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-8 w-1/2 bg-muted rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-video w-full bg-muted rounded-lg animate-pulse" />
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">Author not found</h2>
        <Button asChild>
          <Link href="/dashboard/videos">Browse All Videos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/videos">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Videos
          </Link>
        </Button>
      </div>

      {/* Author Header */}
      <div className="bg-card rounded-lg p-6 border">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Author Avatar */}
          <div className="flex-shrink-0">
            <div className="relative w-32 h-32 rounded-full overflow-hidden">
              <img
                src={
                  author.avatar?.startsWith("/")
                    ? author.avatar
                    : `https:${author.avatar}`
                }
                alt={author.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Author Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{author.name}</h1>

            {author.bio && (
              <p className="text-muted-foreground mb-4">{author.bio}</p>
            )}

            {/* Specialties */}
            {author.specialties && author.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-sm font-medium">Specialties:</span>
                {author.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            )}

            {/* Contact Info */}
            <div className="flex flex-wrap gap-4 text-sm">
              {author.website && (
                <a
                  href={author.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <Globe className="h-4 w-4" />
                  Website
                </a>
              )}
              {author.email && (
                <a
                  href={`mailto:${author.email}`}
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  Contact
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Videos by Author */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Videos by {author.name} ({authorVideos.length})
        </h2>

        {authorVideos.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {authorVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No videos found by this author yet.
            </p>
            <Button asChild>
              <Link href="/dashboard/videos">Browse All Videos</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
});

export default AuthorPage;
