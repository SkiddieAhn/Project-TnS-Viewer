"use client"

import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react"
import { AspectRatio } from "@/components/ui/aspect-ratio"

interface YouTubePlayerProps {
  videoId: string
  startTime?: string
  onPlayerReady?: () => void
}

export interface YouTubePlayerRef {
  seekTo: (seconds: number) => void
  getCurrentTime: () => number
  getPlayerState: () => number
}

export const YouTubePlayer = forwardRef<YouTubePlayerRef, YouTubePlayerProps>(
  ({ videoId, startTime, onPlayerReady }, ref) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [isAPIReady, setIsAPIReady] = useState(false)
    const playerRef = useRef<any>(null)
    const containerRef = useRef<HTMLDivElement>(null)

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

    useImperativeHandle(ref, () => ({
      seekTo: (seconds: number) => {
        if (playerRef.current && playerRef.current.seekTo) {
          playerRef.current.seekTo(seconds, true)
        }
      },
      getCurrentTime: () => {
        if (playerRef.current && playerRef.current.getCurrentTime) {
          return playerRef.current.getCurrentTime()
        }
        return 0
      },
      getPlayerState: () => {
        if (playerRef.current && playerRef.current.getPlayerState) {
          return playerRef.current.getPlayerState()
        }
        return -1
      },
    }))

    useEffect(() => {
      if (typeof window !== "undefined" && !window.YT) {
        const script = document.createElement("script")
        script.src = "https://www.youtube.com/iframe_api"
        script.async = true
        document.body.appendChild(script)

        window.onYouTubeIframeAPIReady = () => {
          setIsAPIReady(true)
        }
      } else if (window.YT && window.YT.Player) {
        setIsAPIReady(true)
      }

      return () => {
        if (window.onYouTubeIframeAPIReady) {
          delete window.onYouTubeIframeAPIReady
        }
      }
    }, [])

    useEffect(() => {
      if (!isAPIReady || !videoId || !containerRef.current) return

      const startSeconds = startTime ? convertTimeToSeconds(startTime) : 0

      if (playerRef.current) {
        playerRef.current.destroy()
      }

      playerRef.current = new window.YT.Player(containerRef.current, {
        height: "100%",
        width: "100%",
        videoId: videoId,
        playerVars: {
          start: startSeconds,
          rel: 0,
          modestbranding: 1,
          controls: 1,
          showinfo: 0,
        },
        events: {
          onReady: (event: any) => {
            setIsLoaded(true)
            if (onPlayerReady) {
              onPlayerReady()
            }
          },
          onStateChange: (event: any) => {
            // Handle state changes if needed
          },
        },
      })

      return () => {
        if (playerRef.current) {
          playerRef.current.destroy()
        }
      }
    }, [isAPIReady, videoId, onPlayerReady])

    return (
      <div className="w-full h-full">
        <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg overflow-hidden h-full">
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
              <div className="text-muted-foreground">Loading video...</div>
            </div>
          )}
          <div ref={containerRef} className="w-full h-full" />
        </AspectRatio>
      </div>
    )
  },
)

YouTubePlayer.displayName = "YouTubePlayer"

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}
