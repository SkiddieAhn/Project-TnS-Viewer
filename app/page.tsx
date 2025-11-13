"use client"

import { useState, useEffect } from "react"
import { VideoAccordion } from "@/components/VideoAccordion"
import { Youtube } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

interface VideoInfo {
  videoId: string
  title: string
  sceneCount: number
  genre: string
}

function getMostFrequentGenre(scenes: any[]): string {
  try {
    if (!scenes || scenes.length === 0) return "unknown"

    const validGenreCounts: { [key: string]: number } = {}

    // Count all genres, excluding "none", "None", empty values, and "unknown"
    scenes.forEach((scene) => {
      if (
        scene.genre &&
        typeof scene.genre === "string" &&
        scene.genre.toLowerCase().trim() !== "none" &&
        scene.genre.trim() !== "" &&
        scene.genre.toLowerCase().trim() !== "unknown"
      ) {
        const genre = scene.genre.toLowerCase().trim()
        validGenreCounts[genre] = (validGenreCounts[genre] || 0) + 1
      }
    })

    // If there are valid (non-unknown, non-none) genres, return the most frequent one
    if (Object.keys(validGenreCounts).length > 0) {
      let mostFrequentGenre = "unknown"
      let maxCount = 0

      for (const [genre, count] of Object.entries(validGenreCounts)) {
        if (count > maxCount) {
          maxCount = count
          mostFrequentGenre = genre
        }
      }

      return mostFrequentGenre
    }

    return "unknown"
  } catch (error) {
    console.error("[Frontend] Error in getMostFrequentGenre:", error)
    return "unknown"
  }
}

export default function HomePage() {
  const [videos, setVideos] = useState<VideoInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<"model1">("model1")

  const modelDisplayNames = {
    model1: "PYLER_scene",
  }

  const videoIds = [
    "3ZlSmwixYrc", 
    "79Aqv6JizNI", 
    "AuygcvvtZjM", 
    "HBoqmbs9m-g", 
    "P_lub-iLEyQ", 
    "qr-UgUA92XmIww",
    "UgUA92XmIww",
    "xZ6GtjsIgoE",
    "ylupN7ZNnFA",
    "ysyudIAjvUg",
    "zrfOdLJn46M"
  ]

  useEffect(() => {
    const loadAvailableVideos = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log(`[Frontend] Loading videos for model: ${selectedModel}`)

        const videoPromises = videoIds.map(async (videoId) => {
          try {
            const response = await fetch(`/data/${selectedModel}/${videoId}.json`)
            if (!response.ok) {
              console.log(`[Frontend] File not found: ${videoId}.json for ${selectedModel}`)
              return null
            }

            const data = await response.json()
            const sceneCount = Array.isArray(data) ? data.length : 0
            const genre = Array.isArray(data) ? getMostFrequentGenre(data) : "unknown"

            console.log(`[Frontend] Successfully loaded ${videoId}: ${sceneCount} scenes, genre: ${genre}`)

            return {
              videoId,
              title: "Untitled Video",
              sceneCount,
              genre,
            }
          } catch (error) {
            console.error(`[Frontend] Error loading ${videoId}:`, error)
            return null
          }
        })

        const results = await Promise.all(videoPromises)
        const validVideos = results.filter((video): video is VideoInfo => video !== null)

        // validVideos.sort((a, b) => a.videoId.localeCompare(b.videoId))

        setVideos(validVideos)
        console.log(`[Frontend] Successfully loaded ${validVideos.length} videos for ${selectedModel}`)

        if (validVideos.length === 0) {
          setError(`No video data files found for ${modelDisplayNames[selectedModel]}`)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load videos"
        console.error(`[Frontend] Error loading videos:`, err)
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    loadAvailableVideos()
  }, [selectedModel])

  const handleModelChange = (model: "model1") => {
    setSelectedModel(model)
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-slate-900 shadow-md flex-shrink-0">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between h-14">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white hover:text-red-400 transition-colors"
            >
              <Youtube className="w-8 h-8 text-red-500" />
              <span className="text-xl font-semibold">T&S Viewer</span>
            </a>

            <div className="flex items-center gap-2">
              {/* <Button
                size="sm"
                onClick={() => handleModelChange("model1")}
                className={`text-sm transition-colors ${
                  selectedModel === "model2"
                    ? "bg-white text-black hover:bg-gray-100"
                    : "bg-black text-white border border-gray-600 hover:bg-gray-800"
                }`}
              >
                PYLER_scene
              </Button> */}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Scroll */}
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="container mx-auto max-w-6xl px-4 py-8">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-muted-foreground">Loading available videos...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200">
                <p className="font-medium">Failed to load videos</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}

            {!loading && !error && videos.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No video data files found for {modelDisplayNames[selectedModel]}.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Check if JSON files exist in the public/data/{selectedModel}/ directory.
                </p>
              </div>
            )}

            {!loading && !error && videos.length > 0 && (
              <div className="space-y-6 pb-8">
                <div className="text-center">
                  <h1 className="text-3xl font-bold mb-2">Video Analysis Dashboard</h1>
                  <p className="text-muted-foreground">
                    Found {videos.length} video{videos.length !== 1 ? "s" : ""} with analysis data 
                    {/* Found {videos.length} video{videos.length !== 1 ? "s" : ""} with analysis data from{" "}
                    <span className="text-red-500 text-lg font-bold">{modelDisplayNames[selectedModel]}</span> */}
                  </p>
                </div>
                <VideoAccordion videos={videos} selectedModel={selectedModel} />
              </div>
            )}
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}
