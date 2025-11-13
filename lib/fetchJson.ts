import type { VideoData } from "./types"

export async function fetchVideoJson(videoId: string, model = "model1"): Promise<VideoData> {
  try {
    const response = await fetch(`/data/${model}/${videoId}.json`)

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`No data found for video ID: ${videoId} in ${model}`)
      }
      throw new Error(`Failed to fetch data: ${response.statusText}`)
    }

    const data = await response.json()

    if (Array.isArray(data)) {
      // New format: JSON file is directly an array of scenes
      return { scenes: data }
    }

    // Legacy format: JSON file has scenes property
    if (!data.scenes || !Array.isArray(data.scenes)) {
      console.warn(`Invalid data structure for ${videoId}: missing or invalid scenes array`)
      return { scenes: [], ...data }
    }

    return data as VideoData
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error(`Unexpected error fetching data for ${videoId}`)
  }
}
