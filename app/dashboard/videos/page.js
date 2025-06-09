"use client"

import { useState } from "react"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/StoreProvider"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VideoCard } from "@/components/video/VideoCard"

const VideosPage = observer(() => {
  const { videoStore } = useStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [levelFilter, setLevelFilter] = useState("")

  // Get unique categories and levels for filters
  const categories = [...new Set(videoStore.videos.map((video) => video.category))]
  const levels = [...new Set(videoStore.videos.map((video) => video.level))]

  // Filter videos based on search query and filters
  const filteredVideos = videoStore.videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !categoryFilter || video.category === categoryFilter
    const matchesLevel = !levelFilter || video.level === levelFilter

    return matchesSearch && matchesCategory && matchesLevel
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Yoga Videos</h1>
        <p className="text-muted-foreground">Browse our collection of premium yoga videos</p>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_200px_200px]">
        <Input placeholder="Search videos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

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
          <p className="text-muted-foreground">No videos found matching your criteria</p>
        </div>
      )}
    </div>
  )
})

export default VideosPage
