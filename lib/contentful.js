import { createClient } from "contentful";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function getVideos() {
  try {
    const entries = await client.getEntries({
      content_type: "video",
      order: "-sys.createdAt",
      include: 1, // Reduced include level since we only need IDs
    });

    return entries.items.map((item) => ({
      id: item.sys.id,
      title: item.fields.title,
      slug: item.fields.slug,
      description: item.fields.description,
      bunnyVideoId: item.fields.bunnyVideoId,
      thumbnail: item.fields.thumbnail?.fields?.file?.url,
      category: item.fields.category?.fields?.label || item.fields.category,
      tags: item.fields.tags?.map((tag) => tag.fields?.label || tag) || [],
      level: item.fields.level?.fields?.label || item.fields.level,
      duration: item.fields.duration,
      // SIMPLIFIED: Just send the IDs, let MobX handle the rest
      relatedVideoIds:
        item.fields.relatedVideos?.map((relatedVideo) => relatedVideo.sys.id) ||
        [],
    }));
  } catch (error) {
    console.error("Error fetching videos from Contentful:", error);
    // Return dummy data if Contentful fails
    return [
      {
        id: "1",
        title: "Morning Flow for Beginners",
        slug: "morning-flow-beginners",
        description:
          "A gentle 20-minute flow to start your day with energy and mindfulness.",
        bunnyVideoId: "video1",
        thumbnail: "/placeholder.svg?height=200&width=300",
        category: "Vinyasa",
        tags: ["morning", "beginner", "flow"],
        level: "beginner",
        duration: 20,
        relatedVideoIds: [],
      },
      {
        id: "2",
        title: "Power Yoga for Strength",
        slug: "power-yoga-strength",
        description:
          "Build strength and endurance with this challenging 45-minute power yoga session.",
        bunnyVideoId: "video2",
        thumbnail: "/placeholder.svg?height=200&width=300",
        category: "Power",
        tags: ["strength", "advanced", "power"],
        level: "advanced",
        duration: 45,
        relatedVideoIds: [],
      },
      {
        id: "3",
        title: "Restorative Evening Practice",
        slug: "restorative-evening-practice",
        description:
          "Wind down with this peaceful 30-minute restorative practice perfect for bedtime.",
        bunnyVideoId: "video3",
        thumbnail: "/placeholder.svg?height=200&width=300",
        category: "Restorative",
        tags: ["evening", "relaxation", "restorative"],
        level: "beginner",
        duration: 30,
        relatedVideoIds: [],
      },
    ];
  }
}
