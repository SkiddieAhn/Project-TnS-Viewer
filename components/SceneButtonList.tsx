"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import type { Scene } from "@/lib/types"

interface SceneButtonListProps {
  scenes: Scene[]
  currentScene: number
  onSceneSelect: (index: number) => void
  selectedModel?: "model1" | "model2"
}

export function SceneButtonList({ scenes, currentScene, onSceneSelect, selectedModel }: SceneButtonListProps) {
  if (!scenes || scenes.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="p-6">
          <p className="text-muted-foreground">No scenes available</p>
        </CardContent>
      </Card>
    )
  }

  const label = selectedModel === "model1" ? "Scenes" : "Shots"

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0 pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {label}
          <Badge variant="secondary">{scenes.length} total</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-2 pr-4">
            {scenes.map((scene, index) => (
              <Button
                key={scene.scene_id}
                variant={currentScene === index ? "default" : "outline"}
                className="w-full justify-start text-left h-auto p-3"
                onClick={() => onSceneSelect(index)}
              >
                <div className="flex flex-col items-start gap-1 w-full">
                  <div className="font-medium text-sm">
                    {label.slice(0, -1)} {index + 1}
                  </div>
                  <div className="text-xs text-muted-foreground flex flex-wrap gap-1">
                    {scene.start_time && scene.end_time && (
                      <span>
                        {scene.start_time} → {scene.end_time}
                      </span>
                    )}
                    {scene.genre && <span>• {scene.genre}</span>}
                    {scene.language && <span>• {scene.language}</span>}
                  </div>
                  {scene.description && (
                    <div className="text-xs text-muted-foreground text-left w-full line-clamp-2">
                      {scene.description}
                    </div>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
