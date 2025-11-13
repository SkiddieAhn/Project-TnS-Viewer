export interface Scene {
  scene_id: string
  start_time?: string
  end_time?: string
  odk_id?: string
  labels?: {
    emotions?: string[]
    themes?: string[]
    actions?: string[]
    objects?: string[]
    characters?: string[]
    weather?: string[]
    brands?: string[]
  }
  locations?: string[]
  genre?: string
  sensitivity?: string[]
  language?: string
  keywords?: string[]
  ad_marker_type?: string
  ad_marker_position?: string
  confidence_score?: number
  description?: string
  summary?: string
  [key: string]: any // Allow for unknown keys
}

export interface VideoData {
  scenes: Scene[]
  [key: string]: any // Allow for additional top-level keys
}
