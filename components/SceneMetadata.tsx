"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Scene } from "@/lib/types"

interface SceneMetadataProps {
  scene: Scene
  selectedModel?: "model1" | "model2" // Added selectedModel prop to conditionally show Shot ID vs Scene ID
  videoId?: string // Added videoId prop to display Video ID in Basic Information
}

function isEmptyValue(value: any): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === "string") {
    const trimmed = value.trim().toLowerCase()
    return trimmed === "" || trimmed === "none"
  }
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === "object") return Object.keys(value).length === 0
  return false
}

function displayValue(value: any): string {
  if (isEmptyValue(value)) return "None"
  return String(value)
}

export function SceneMetadata({ scene, selectedModel, videoId }: SceneMetadataProps) {
  const sceneIdLabel = selectedModel === "model1" ? "Scene ID" : "Shot ID"

  const metadataFields = [
    ...(videoId ? [{ key: "video_id", label: "Video ID", value: videoId }] : []),
    { key: "scene_id", label: sceneIdLabel, value: scene.scene_id },
    { key: "start_time", label: "Start Time", value: scene.start_time },
    { key: "end_time", label: "End Time", value: scene.end_time },
    { key: "odk_id", label: "ODK ID", value: scene.odk_id },
    { key: "genre", label: "Genre", value: scene.genre },
    { key: "language", label: "Language", value: scene.language },
    {
      key: "confidence_score",
      label: "Confidence Score",
      value: scene.confidence_score ? `${Math.round(scene.confidence_score * 100)}%` : null,
    },
    { key: "ad_marker_type", label: "Ad Marker Type", value: scene.ad_marker_type },
    { key: "ad_marker_position", label: "Ad Marker Position", value: scene.ad_marker_position },
  ]

  const otherFields = Object.entries(scene).filter(
    ([key]) =>
      ![
        "scene_id",
        "start_time",
        "end_time",
        "odk_id",
        "genre",
        "language",
        "confidence_score",
        "ad_marker_type",
        "ad_marker_position",
        "labels",
        "locations",
        "keywords",
        "sensitivity",
        "description",
        "summary",
      ].includes(key),
  )

  return (
    <div className="space-y-4">
      {/* Basic Metadata */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {metadataFields.map(({ key, label, value }) => (
            <div key={key} className="flex flex-col gap-1">
              <div className="text-xs font-medium text-muted-foreground">{label}</div>
              <div className={`text-sm break-words ${isEmptyValue(value) ? "text-muted-foreground italic" : ""}`}>
                {displayValue(value)}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sensitivity */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Sensitivity</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {scene.sensitivity && scene.sensitivity.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {scene.sensitivity.map((category, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
          ) : (
            <Badge variant="secondary" className="text-xs text-muted-foreground">
              empty
            </Badge>
          )}
        </CardContent>
      </Card>


      {/* Locations */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Locations</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {scene.locations && scene.locations.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {scene.locations.map((location, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {location}
                </Badge>
              ))}
            </div>
          ) : (
            <Badge variant="secondary" className="text-xs text-muted-foreground">
              empty
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Keywords */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Keywords</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {scene.keywords && scene.keywords.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {scene.keywords.map((keyword, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          ) : (
            <Badge variant="secondary" className="text-xs text-muted-foreground">
              empty
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Other Fields */}
      {otherFields.length > 0 && (
        <Card className="border-l-4 border-l-gray-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Other</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {otherFields.map(([key, value]) => (
              <div key={key} className="flex flex-col gap-1">
                <div className="text-xs font-medium text-muted-foreground">{key}</div>
                <div className="text-sm break-words">
                  {typeof value === "object" ? (
                    <pre className="text-xs bg-muted p-2 rounded whitespace-pre-wrap">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  ) : (
                    <span className={isEmptyValue(value) ? "text-muted-foreground italic" : ""}>
                      {displayValue(value)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
