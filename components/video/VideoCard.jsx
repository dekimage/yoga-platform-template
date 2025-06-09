import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export function VideoCard({ video }) {
  return (
    <Link href={`/dashboard/video/${video.slug}`}>
      <div className="group cursor-pointer">
        <div className="relative overflow-hidden rounded-lg mb-3">
          <img
            src={video.thumbnail || "/placeholder.svg?height=200&width=300"}
            alt={video.title}
            className="w-full h-48 object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-12 w-12 text-white"
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="text-xs">
              {video.duration}min
            </Badge>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">{video.title}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {video.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {video.level}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
        </div>
      </div>
    </Link>
  )
}
