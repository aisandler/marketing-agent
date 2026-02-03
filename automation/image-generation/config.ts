/**
 * Configuration loader for image generation automation
 * Loads from root .env file
 */

import { resolve } from 'path'
import { config as dotenvConfig } from 'dotenv'
import type { Config } from './types'

// Load .env from project root (override existing env vars)
const envPath = resolve(__dirname, '../../.env')
dotenvConfig({ path: envPath, override: true })

function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

function getEnv(key: string, defaultValue?: string): string | undefined {
  return process.env[key] || defaultValue
}

export function loadConfig(): Config {
  const airtableBaseId = requireEnv('AIRTABLE_BASE_ID')
  const airtableTableId = getEnv('AIRTABLE_CONTENT_CALENDAR_TABLE_ID')!

  return {
    openrouter: {
      apiKey: requireEnv('OPENROUTER_API_KEY'),
      // Gemini 3 Pro with image generation via OpenRouter
      model: getEnv('OPENROUTER_MODEL', 'google/gemini-3-pro-image-preview'),
      endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    },
    airtable: {
      apiKey: requireEnv('AIRTABLE_API_KEY'),
      baseId: airtableBaseId,
      tableId: airtableTableId,
      baseUrl: `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableId}`,
    },
    cloudinary: process.env.CLOUDINARY_URL
      ? parseCloudinaryUrl(process.env.CLOUDINARY_URL)
      : undefined,
  }
}

function parseCloudinaryUrl(url: string): Config['cloudinary'] {
  // Format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
  const match = url.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/)
  if (!match) {
    console.warn('Invalid CLOUDINARY_URL format, Cloudinary disabled')
    return undefined
  }
  return {
    apiKey: match[1],
    apiSecret: match[2],
    cloudName: match[3],
  }
}

// Export singleton config
export const config = loadConfig()
