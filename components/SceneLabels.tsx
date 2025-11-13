"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Scene } from "@/lib/types"

interface SceneLabelsProps {
  scene: Scene
}

export function SceneLabels({ scene }: SceneLabelsProps) {
  const labels = scene.labels || {}

  const labelCategories = [
    { key: "emotions", label: "Emotions", color: "bg-red-100 text-red-800 border-red-200" },
    { key: "themes", label: "Themes", color: "bg-blue-100 text-blue-800 border-blue-200" },
    { key: "actions", label: "Actions", color: "bg-green-100 text-green-800 border-green-200" },
    { key: "objects", label: "Objects", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    { key: "characters", label: "Characters", color: "bg-purple-100 text-purple-800 border-purple-200" },
    { key: "weather", label: "Weather", color: "bg-cyan-100 text-cyan-800 border-cyan-200" },
    { key: "brands", label: "Brands", color: "bg-orange-100 text-orange-800 border-orange-200" },
  ]

  return (
    <div className="space-y-4">
      {labelCategories.map(({ key, label, color }) => {
        const items = labels[key as keyof typeof labels]
        const isEmpty = !items || !Array.isArray(items) || items.length === 0

        return (
          <Card key={key} className="border-l-4 border-l-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1">
                {isEmpty ? (
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-500 border-gray-200">
                    empty
                  </Badge>
                ) : (
                  items.map((item, index) => (
                    <Badge key={index} variant="secondary" className={`text-xs ${color}`}>
                      {item}
                    </Badge>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Summary */}
      {scene.summary && (
        <Card className="border-l-4 border-l-teal-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Summary</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm leading-relaxed">{scene.summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
