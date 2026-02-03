/**
 * TypeScript interfaces for image generation automation
 */

// Airtable attachment structure
export interface AirtableAttachment {
  id?: string
  url: string
  filename?: string
  size?: number
  type?: string
  thumbnails?: {
    small?: { url: string; width: number; height: number }
    large?: { url: string; width: number; height: number }
    full?: { url: string; width: number; height: number }
  }
}

// Airtable record from Content Calendar
export interface AirtableRecord {
  id: string
  fields: {
    Date?: string
    'Post Topic'?: string
    'Posting Account'?: string
    Platform?: string
    'Post Type'?: string  // Original, Repost, Link Share
    'Content Pillar'?: string
    Focus?: string
    Copy?: string
    'Image Brief'?: string
    Image?: AirtableAttachment[]
    'Image Source'?: string  // AI Generated, Requires Real Video, Received, Manual Upload
    'Asset Status'?: string
    'Post Status'?: string
    'Copy Status'?: string
    Notes?: string
  }
  createdTime: string
}

// Response from Airtable API
export interface AirtableResponse {
  records: AirtableRecord[]
  offset?: string
}

// Generated image from Gemini
export interface GeneratedImage {
  base64Data: string
  mimeType: string
}

// Result of processing a single record
export interface ProcessResult {
  recordId: string
  postTopic: string
  success: boolean
  imageUrl?: string
  error?: string
}

// Batch processing summary
export interface BatchSummary {
  total: number
  successful: number
  failed: number
  skipped: number
  results: ProcessResult[]
}

// OpenRouter API response structure
export interface OpenRouterResponse {
  id: string
  choices: Array<{
    message: {
      content: string | Array<{
        type: string
        text?: string
        image_url?: {
          url: string  // data:image/png;base64,... format
        }
      }>
      images?: Array<{
        type: string
        image_url?: {
          url: string
        }
      }>
    }
    finish_reason: string
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// Configuration structure
export interface Config {
  openrouter: {
    apiKey: string
    model: string
    endpoint: string
  }
  airtable: {
    apiKey: string
    baseId: string
    tableId: string
    baseUrl: string
  }
  cloudinary?: {
    cloudName: string
    apiKey: string
    apiSecret: string
  }
}

// Brand configuration (loaded from config/brand.json)
export interface BrandConfig {
  name: string
  tagline?: string
  colors: {
    primary: string
    secondary: string
    accent?: string
    _names?: {
      primary: string
      secondary: string
    }
  }
  imageStyleDirective: string
  contentPillars?: string[]
  focusAreas?: string[]
  industry?: string
  location?: string
}
