interface YouTubeVideoResponse {
  items: {
    snippet: {
      title: string
    }
  }[]
}

export async function fetchVideoTitle(videoId: string): Promise<string> {
  try {
    // Using a public YouTube API endpoint that doesn't require authentication
    // This is a fallback approach - in production, you'd want to use the official API with a key
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch video data")
    }

    const data = await response.json()
    return data.title || "Untitled Video"
  } catch (error) {
    console.warn(`Failed to fetch title for video ${videoId}:`, error)
    return "Untitled Video"
  }
}
