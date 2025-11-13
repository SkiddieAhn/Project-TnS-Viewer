"use client"

import { Accordion } from "@/components/ui/accordion"
import { VideoAccordionItem } from "./VideoAccordionItem"

interface VideoInfo {
  videoId: string
  title: string // Added title field to match updated interface
  sceneCount: number
  genre: string
}

interface VideoAccordionProps {
  videos: VideoInfo[]
  selectedModel: "model1" | "model2"
}

export function VideoAccordion({ videos, selectedModel }: VideoAccordionProps) {
  return (
    <Accordion type="multiple" className="space-y-4">
      {videos.map((video, index) => (
        <VideoAccordionItem key={video.videoId} videoInfo={video} index={index} selectedModel={selectedModel} />
      ))}
    </Accordion>
  )
}
