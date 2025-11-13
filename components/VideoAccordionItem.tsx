"use client"

import { useState, useEffect, useRef } from "react"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { YouTubePlayer, type YouTubePlayerRef } from "./YouTubePlayer"
import { SceneButtonList } from "./SceneButtonList"
import { SceneDetailView } from "./SceneDetailView"
import { fetchVideoJson } from "@/lib/fetchJson"
import { fetchVideoTitle } from "@/lib/youtube-api"
import type { VideoData } from "@/lib/types"

interface VideoInfo {
  videoId: string
  title: string
  sceneCount: number
  genre: string
}

interface VideoAccordionItemProps {
  videoInfo: VideoInfo
  index: number
  selectedModel: "model1" | "model2"
}

export function VideoAccordionItem({ videoInfo, index, selectedModel }: VideoAccordionItemProps) {
  const [videoData, setVideoData] = useState<VideoData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [currentScene, setCurrentScene] = useState(0)
  const [youtubeTitle, setYoutubeTitle] = useState<string>("")
  const playerRef = useRef<YouTubePlayerRef>(null)

  useEffect(() => {
    const loadVideoTitle = async () => {
      const title = await fetchVideoTitle(videoInfo.videoId)
      setYoutubeTitle(title)
    }
    loadVideoTitle()
  }, [videoInfo.videoId])

  const handleValueChange = async (value: string) => {
    const isExpanding = value === videoInfo.videoId
    setIsOpen(isExpanding)

    if (isExpanding && !videoData && !loading) {
      setLoading(true)
      setError(null)

      try {
        const data = await fetchVideoJson(videoInfo.videoId, selectedModel)
        setVideoData(data)
        setCurrentScene(0)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load video data")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSceneSelect = (sceneIndex: number) => {
    setCurrentScene(sceneIndex)

    if (playerRef.current && videoData?.scenes[sceneIndex]) {
      const scene = videoData.scenes[sceneIndex]
      const startTime = scene.start_time

      if (startTime) {
        const convertTimeToSeconds = (timeStr: string): number => {
          if (!timeStr) return 0
          const parts = timeStr.split(":").map(Number)
          if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2] // HH:MM:SS
          } else if (parts.length === 2) {
            return parts[0] * 60 + parts[1] // MM:SS
          }
          return parts[0] || 0 // SS
        }

        const seconds = convertTimeToSeconds(startTime)
        playerRef.current.seekTo(seconds)

        // Auto-play after seeking to the new scene
        setTimeout(() => {
          if (playerRef.current && playerRef.current.playVideo) {
            playerRef.current.playVideo()
          }
        }, 100)
      }
    }
  }

  useEffect(() => {
    setVideoData(null)
    setCurrentScene(0)
  }, [selectedModel])

  return (
    <AccordionItem value={videoInfo.videoId} className="border rounded-2xl shadow-sm">
      <AccordionTrigger
        className="px-6 py-4 hover:no-underline hover:bg-muted/50 rounded-t-2xl data-[state=open]:rounded-b-none"
        onClick={() => handleValueChange(isOpen ? "" : videoInfo.videoId)}
      >
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold text-primary">#{index + 1}</span>
            </div>
            <div className="min-w-0 flex-1">
              {youtubeTitle && (
                <div className="text-base font-medium text-gray-900 leading-relaxed line-clamp-2">
                  {youtubeTitle.length > 75 ? `${youtubeTitle.slice(0, 75)}...` : youtubeTitle}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 flex-shrink-0 text-right">
            <span className="text-sm font-medium text-gray-600">{videoInfo.genre}</span>
            <span className="text-xs text-gray-500">
              {videoInfo.sceneCount} {selectedModel === "model1" ? "scene" : "shot"}
              {videoInfo.sceneCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
            <p className="font-medium">Failed to load video data</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {videoData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-[400px]">
                <YouTubePlayer ref={playerRef} videoId={videoInfo.videoId} />
              </div>

              <div className="h-[400px]">
                <SceneButtonList
                  scenes={videoData.scenes}
                  currentScene={currentScene}
                  onSceneSelect={handleSceneSelect}
                  selectedModel={selectedModel}
                />
              </div>
            </div>

            <div className="w-full">
              <SceneDetailView
                scene={videoData.scenes[currentScene]}
                sceneIndex={currentScene}
                totalScenes={videoData.scenes.length}
                onSceneChange={handleSceneSelect}
                selectedModel={selectedModel}
                videoId={videoInfo.videoId} // Pass videoId to SceneDetailView
              />
            </div>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  )
}
