"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface JsonTreeProps {
  data: any
  level?: number
}

function isEmptyValue(data: any): boolean {
  if (data === null || data === undefined) return true
  if (Array.isArray(data) && data.length === 0) return true
  if (typeof data === "string") {
    const trimmed = data.trim().toLowerCase()
    return trimmed === "" || trimmed === "none" || trimmed === "null" || trimmed === "undefined"
  }
  if (typeof data === "object" && Object.keys(data).length === 0) return true
  return false
}

export function JsonTree({ data, level = 0 }: JsonTreeProps) {
  if (isEmptyValue(data)) {
    return <span className="text-muted-foreground italic">none</span>
  }

  if (typeof data === "string") {
    return <span className="text-foreground">{data}</span>
  }

  if (typeof data === "number" || typeof data === "boolean") {
    return <span className="text-blue-600 font-mono">{String(data)}</span>
  }

  if (Array.isArray(data)) {
    // For small arrays, show as badges
    if (data.length <= 10 && data.every((item) => typeof item === "string")) {
      return (
        <div className="flex flex-wrap gap-1">
          {data.map((item, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {item}
            </Badge>
          ))}
        </div>
      )
    }

    // For larger arrays or complex items, show as list
    return (
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="border-l-2 border-muted pl-3">
            <div className="text-xs text-muted-foreground mb-1">[{index}]</div>
            <JsonTree data={item} level={level + 1} />
          </div>
        ))}
      </div>
    )
  }

  if (typeof data === "object") {
    const entries = Object.entries(data)

    // Group known categories
    const knownCategories = {
      Labels: ["labels", "emotions", "themes", "actions", "objects", "characters", "weather", "brands"],
      "Location & Context": ["locations", "genre", "language"],
      "Keywords & Sensitivity": ["keywords", "sensitivity"],
      "Ad Markers": ["ad_marker_type", "ad_marker_position"],
      Description: ["description", "summary"],
      Metadata: ["scene_id", "start_time", "end_time", "odk_id", "confidence_score"],
    }

    const categorized: Record<string, [string, any][]> = {}
    const other: [string, any][] = []

    entries.forEach(([key, value]) => {
      let found = false
      for (const [category, keys] of Object.entries(knownCategories)) {
        if (keys.includes(key)) {
          if (!categorized[category]) categorized[category] = []
          categorized[category].push([key, value])
          found = true
          break
        }
      }
      if (!found) {
        other.push([key, value])
      }
    })

    return (
      <div className="space-y-4">
        {Object.entries(categorized).map(([category, items]) => (
          <Card key={category} className="border-l-4 border-l-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{category}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {items.map(([key, value]) => (
                <div key={key}>
                  <div className="text-xs font-medium text-muted-foreground mb-1">{key}</div>
                  <JsonTree data={value} level={level + 1} />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {other.length > 0 && (
          <Card className="border-l-4 border-l-muted">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Other</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {other.map(([key, value]) => (
                <div key={key}>
                  <div className="text-xs font-medium text-muted-foreground mb-1">{key}</div>
                  <JsonTree data={value} level={level + 1} />
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return <span className="text-foreground">{String(data)}</span>
}
