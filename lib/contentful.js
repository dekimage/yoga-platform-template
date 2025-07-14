import { createClient } from "contentful";

// Utility function to convert rich text to plain text
function richTextToPlainText(richText) {
  if (!richText || typeof richText === "string") {
    return richText || "";
  }

  if (richText.nodeType === "document" && richText.content) {
    return richText.content
      .map((node) => {
        if (node.nodeType === "paragraph" && node.content) {
          return node.content
            .map((textNode) =>
              textNode.nodeType === "text" ? textNode.value : ""
            )
            .join("");
        }
        return "";
      })
      .join(" ");
  }

  return "";
}

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

    return entries.items.map((item) => {
      console.log(`🔍 Processing video: ${item.fields.title}`);
      console.log(`🔍 Raw isPublic value:`, item.fields.isPublic);

      return {
        id: item.sys.id,
        title: item.fields.title,
        slug: item.fields.slug,
        description: richTextToPlainText(item.fields.description),
        bunnyVideoId: item.fields.bunnyVideoId,
        thumbnail: item.fields.thumbnail?.fields?.file?.url,
        category: item.fields.category?.fields?.label || item.fields.category,
        tags: item.fields.tags?.map((tag) => tag.fields?.label || tag) || [],
        level: item.fields.level?.fields?.label || item.fields.level,
        duration: item.fields.duration,
        // FIXED: Handle isPublic field properly with explicit default
        isPublic: item.fields.isPublic === true, // Only true if explicitly set to true
        // Author information
        authorId: item.fields.author?.sys?.id,
        author: item.fields.author
          ? {
              id: item.fields.author.sys.id,
              name: item.fields.author.fields?.name || "Unknown Author",
              slug: item.fields.author.fields?.slug || "unknown",
              avatar:
                item.fields.author.fields?.avatar?.fields?.file?.url ||
                "/placeholder-user.jpg",
              bio: richTextToPlainText(item.fields.author.fields?.bio),
            }
          : null,
        // SIMPLIFIED: Just send the IDs, let MobX handle the rest
        relatedVideoIds:
          item.fields.relatedVideos?.map(
            (relatedVideo) => relatedVideo.sys.id
          ) || [],
      };
    });
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
        isPublic: true, // Make some dummy videos public for testing
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
        isPublic: false, // Premium content
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
        isPublic: true, // Free content
        relatedVideoIds: [],
      },
    ];
  }
}

export async function getAuthors() {
  try {
    const entries = await client.getEntries({
      content_type: "author",
      order: "fields.name",
      include: 2, // Include linked assets
    });

    return entries.items.map((item) => {
      console.log(`👤 Processing author: ${item.fields.name}`);

      return {
        id: item.sys.id,
        name: item.fields.name,
        slug: item.fields.slug,
        bio: richTextToPlainText(item.fields.bio),
        avatar:
          item.fields.avatar?.fields?.file?.url || "/placeholder-user.jpg",
        email: item.fields.email || "",
        website: item.fields.website || "",
        socialLinks: item.fields.socialLinks || {},
        specialties:
          item.fields.specialties?.map((tag) => tag.fields?.label || tag) || [],
        isActive: item.fields.isActive !== false, // Default to true
        createdAt: item.sys.createdAt,
        updatedAt: item.sys.updatedAt,
      };
    });
  } catch (error) {
    console.error("Error fetching authors from Contentful:", error);
    // Return dummy data if Contentful fails
    return [
      {
        id: "author-1",
        name: "Sarah Johnson",
        slug: "sarah-johnson",
        bio: "Certified yoga instructor with 10+ years of experience in Hatha and Vinyasa yoga.",
        avatar: "/placeholder-user.jpg",
        email: "sarah@example.com",
        website: "https://sarahyoga.com",
        socialLinks: {
          instagram: "@sarahyoga",
          youtube: "SarahYogaChannel",
        },
        specialties: ["Hatha", "Vinyasa", "Meditation"],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "author-2",
        name: "Michael Chen",
        slug: "michael-chen",
        bio: "Power yoga specialist and mindfulness coach focusing on strength and flexibility.",
        avatar: "/placeholder-user.jpg",
        email: "michael@example.com",
        website: "https://michaelchen.yoga",
        socialLinks: {
          instagram: "@michaelchenyoga",
          linkedin: "michael-chen-yoga",
        },
        specialties: ["Power Yoga", "Mindfulness", "Strength"],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }
}

export async function getPlaylists() {
  try {
    const entries = await client.getEntries({
      content_type: "playlist",
      order: "-sys.createdAt",
      include: 10, // Maximum include level to get all linked assets
    });

    return entries.items.map((item) => {
      console.log(`🎵 Processing playlist: ${item.fields.title}`);
      console.log(`🎵 Playlist fields:`, Object.keys(item.fields));
      console.log(
        `🎵 Raw thumbnail field:`,
        JSON.stringify(item.fields.thumbnail, null, 2)
      );

      // Try different possible thumbnail field structures and names
      const thumbnailOptions = [
        item.fields.thumbnail?.fields?.file?.url,
        item.fields.thumbnail?.file?.url,
        item.fields.thumbnail?.url,
        item.fields.thumbnail,
        item.fields.image?.fields?.file?.url,
        item.fields.image?.file?.url,
        item.fields.image?.url,
        item.fields.image,
        item.fields.cover?.fields?.file?.url,
        item.fields.cover?.file?.url,
        item.fields.cover?.url,
        item.fields.cover,
      ];

      console.log(`🎵 Thumbnail options:`, thumbnailOptions);

      const finalThumbnail = thumbnailOptions.find(
        (option) => option && typeof option === "string"
      );
      console.log(`🎵 Final thumbnail:`, finalThumbnail);

      return {
        id: item.sys.id,
        title: item.fields.title || item.fields.name, // Try both title and name
        slug: item.fields.slug || item.sys.id, // Use ID as fallback slug
        description:
          richTextToPlainText(item.fields.description) ||
          `Playlist: ${item.fields.title || item.fields.name}`,
        thumbnail: finalThumbnail || "/placeholder.svg?height=200&width=300",
        tags: item.fields.tags?.map((tag) => tag.fields?.label || tag) || [],
        // Get video IDs from linked videos
        videoIds: item.fields.videos?.map((video) => video.sys.id) || [],
        // Calculate total duration from linked videos
        totalDuration:
          item.fields.videos?.reduce((total, video) => {
            return total + (video.fields?.duration || 0);
          }, 0) || 0,
        videoCount: item.fields.videos?.length || 0,
        isPublic: item.fields.isPublic === true,
        createdAt: item.sys.createdAt,
        updatedAt: item.sys.updatedAt,
      };
    });
  } catch (error) {
    console.error("Error fetching playlists from Contentful:", error);
    // Return dummy data if Contentful fails
    return [
      {
        id: "playlist-1",
        title: "Morning Yoga Flow",
        slug: "morning-yoga-flow",
        description:
          "Start your day with energizing yoga sequences perfect for morning practice.",
        thumbnail: "/placeholder.svg?height=200&width=300",
        tags: ["morning", "energizing", "flow"],
        videoIds: ["1", "2"],
        totalDuration: 65,
        videoCount: 2,
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "playlist-2",
        title: "Beginner's Journey",
        slug: "beginners-journey",
        description:
          "A comprehensive collection of beginner-friendly yoga practices to build your foundation.",
        thumbnail: "/placeholder.svg?height=200&width=300",
        tags: ["beginner", "foundation", "gentle"],
        videoIds: ["1", "3"],
        totalDuration: 50,
        videoCount: 2,
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "playlist-3",
        title: "Advanced Power Series",
        slug: "advanced-power-series",
        description:
          "Challenge yourself with this intensive power yoga series for experienced practitioners.",
        thumbnail: "/placeholder.svg?height=200&width=300",
        tags: ["advanced", "power", "strength"],
        videoIds: ["2"],
        totalDuration: 45,
        videoCount: 1,
        isPublic: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }
}
