"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { SceneMetadata } from "./SceneMetadata"
import { SceneLabels } from "./SceneLabels"
import type { Scene } from "@/lib/types"

interface SceneDetailViewProps {
  scene: Scene
  sceneIndex: number
  totalScenes: number
  onSceneChange: (index: number) => void
  selectedModel?: "model1" | "model2"
  videoId?: string // Added videoId prop to pass to SceneMetadata
}

export function SceneDetailView({
  scene,
  sceneIndex,
  totalScenes,
  onSceneChange,
  selectedModel,
  videoId, // Added videoId parameter
}: SceneDetailViewProps) {
  if (!scene) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No scene selected</p>
        </CardContent>
      </Card>
    )
  }

  const handlePrevScene = () => {
    if (sceneIndex > 0) {
      onSceneChange(sceneIndex - 1)
    }
  }

  const handleNextScene = () => {
    if (sceneIndex < totalScenes - 1) {
      onSceneChange(sceneIndex + 1)
    }
  }

  const sceneLabel = selectedModel === "model1" ? "Scene" : "Shot"

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            {sceneLabel} {sceneIndex + 1}
          </CardTitle>

          {/* Scene Navigation Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevScene}
              disabled={sceneIndex === 0}
              aria-label={`Previous ${sceneLabel.toLowerCase()}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[60px] text-center">
              {sceneIndex + 1} / {totalScenes}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextScene}
              disabled={sceneIndex === totalScenes - 1}
              aria-label={`Next ${sceneLabel.toLowerCase()}`}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Summary chips */}
        <div className="flex flex-wrap gap-2 text-sm">
          {scene.start_time && scene.end_time && (
            <Badge variant="outline">
              {scene.start_time} → {scene.end_time}
            </Badge>
          )}
          {scene.genre && <Badge variant="outline">{scene.genre}</Badge>}
          {scene.language && <Badge variant="outline">{scene.language}</Badge>}
          {scene.confidence_score && (
            <Badge variant="outline">{Math.round(scene.confidence_score * 100)}% confidence</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Description Section - Moved to Top */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Description</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-[120px]">
              {scene.description ? (
                <p className="text-sm leading-relaxed pr-4">{scene.description}</p>
              ) : (
                <p className="text-sm leading-relaxed pr-4 text-muted-foreground italic">None</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Metadata and Labels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Metadata */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Metadata</h3>
            <ScrollArea className="h-[400px]">
              <div className="pr-4">
                <SceneMetadata scene={scene} selectedModel={selectedModel} videoId={videoId} />
              </div>
            </ScrollArea>
          </div>

          {/* Right Column - Labels */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Labels</h3>
            <ScrollArea className="h-[400px]">
              <div className="pr-4">
                <SceneLabels scene={scene} />
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
