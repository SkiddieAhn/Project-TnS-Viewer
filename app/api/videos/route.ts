import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

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

    // If no valid genres found, return "unknown"
    return "unknown"
  } catch (error) {
    console.error("[API] Error in getMostFrequentGenre:", error)
    return "unknown"
  }
}

export async function GET(request: Request) {
  console.log("[API] Starting video API request")

  try {
    const { searchParams } = new URL(request.url)
    const model = searchParams.get("model") || "model1"

    console.log(`[API] Loading videos for model: ${model}`)

    if (!["model1", "model2"].includes(model)) {
      console.log(`[API] Invalid model requested: ${model}`)
      return NextResponse.json({ error: "Invalid model. Must be 'model1' or 'model2'" }, { status: 400 })
    }

    let dataDirectory: string
    try {
      dataDirectory = path.join(process.cwd(), "public", "data", model)
      console.log(`[API] Data directory path: ${dataDirectory}`)
    } catch (error) {
      console.error("[API] Error constructing path:", error)
      return NextResponse.json({ error: "Internal path error" }, { status: 500 })
    }

    // Check if data directory exists
    try {
      await fs.access(dataDirectory)
      console.log(`[API] Directory exists: ${dataDirectory}`)
    } catch (error) {
      console.log(`[API] Directory not found: ${dataDirectory}`, error)
      return NextResponse.json(
        {
          error: `Data directory not found for ${model}`,
          details: `Directory ${dataDirectory} does not exist`,
        },
        { status: 404 },
      )
    }

    // Read all files in the data directory
    let files: string[]
    try {
      files = await fs.readdir(dataDirectory)
      console.log(`[API] Found ${files.length} files in directory:`, files)
    } catch (error) {
      console.error(`[API] Error reading directory ${dataDirectory}:`, error)
      return NextResponse.json(
        {
          error: `Cannot read data directory for ${model}`,
          details: error instanceof Error ? error.message : "Unknown directory read error",
        },
        { status: 500 },
      )
    }

    // Filter for JSON files and extract video info
    const jsonFiles = files.filter((file) => file.endsWith(".json"))
    console.log(`[API] Found ${jsonFiles.length} JSON files:`, jsonFiles)

    if (jsonFiles.length === 0) {
      console.log(`[API] No JSON files found in ${dataDirectory}`)
      return NextResponse.json({
        videos: [],
        model,
        message: `No JSON files found in data directory for ${model}`,
      })
    }

    const videos = []
    for (const file of jsonFiles) {
      const videoId = file.replace(".json", "")
      try {
        const filePath = path.join(dataDirectory, file)
        console.log(`[API] Processing file: ${filePath}`)

        let fileContent: string
        try {
          fileContent = await fs.readFile(filePath, "utf-8")
          console.log(`[API] Successfully read ${file}, size: ${fileContent.length} chars`)
        } catch (readError) {
          console.error(`[API] Error reading file ${file}:`, readError)
          videos.push({
            videoId,
            sceneCount: 0,
            genre: "unknown",
            error: "File read failed",
          })
          continue
        }

        let data: any
        try {
          data = JSON.parse(fileContent)
          console.log(`[API] Successfully parsed JSON for ${file}`)
        } catch (parseError) {
          console.error(`[API] JSON parsing error for ${file}:`, parseError)
          videos.push({
            videoId,
            sceneCount: 0,
            genre: "unknown",
            error: "JSON parsing failed",
          })
          continue
        }

        const sceneCount = Array.isArray(data) ? data.length : 0
        const genre = Array.isArray(data) ? getMostFrequentGenre(data) : "unknown"

        console.log(`[API] Successfully processed ${file}: ${sceneCount} scenes, genre: ${genre}`)

        videos.push({
          videoId,
          sceneCount,
          genre,
        })
      } catch (error) {
        console.error(`[API] Unexpected error processing ${file}:`, error)
        videos.push({
          videoId,
          sceneCount: 0,
          genre: "unknown",
          error: error instanceof Error ? error.message : "Unexpected processing error",
        })
      }
    }

    // Sort by videoId for consistent ordering
    videos.sort((a, b) => a.videoId.localeCompare(b.videoId))

    console.log(`[API] Successfully loaded ${videos.length} videos for ${model}`)
    return NextResponse.json({ videos, model })
  } catch (error) {
    console.error("[API] Critical error in videos API:", error)
    return NextResponse.json(
      {
        error: "Failed to load available videos",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
