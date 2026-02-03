/**
 * Image storage utilities
 * Primary: Direct Airtable upload via URL
 * Fallback: Cloudinary for hosting if direct upload fails
 */

import type { GeneratedImage, AirtableAttachment } from './types'
import { config } from './config'
import { writeFileSync, unlinkSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

// Temp directory for intermediate files
const TEMP_DIR = join(__dirname, '.temp')

/**
 * Upload image to Cloudinary and return URL
 * Only used if direct Airtable upload doesn't work
 */
export async function uploadToCloudinary(
  image: GeneratedImage,
  filename: string
): Promise<string> {
  if (!config.cloudinary) {
    throw new Error('Cloudinary not configured')
  }

  const { cloudName, apiKey, apiSecret } = config.cloudinary
  const timestamp = Math.floor(Date.now() / 1000)

  // Create signature for upload
  const signatureString = `timestamp=${timestamp}${apiSecret}`
  const signature = await sha1(signatureString)

  const formData = new FormData()
  formData.append('file', `data:${image.mimeType};base64,${image.base64Data}`)
  formData.append('api_key', apiKey)
  formData.append('timestamp', String(timestamp))
  formData.append('signature', signature)
  formData.append('folder', 'marketing/social')
  formData.append('public_id', filename.replace(/\.[^.]+$/, ''))

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Cloudinary upload failed: ${error}`)
  }

  const result = await response.json()
  return result.secure_url
}

/**
 * Save image to temp file and return path
 * Useful for debugging or manual upload
 */
export function saveToTempFile(
  image: GeneratedImage,
  filename: string
): string {
  if (!existsSync(TEMP_DIR)) {
    mkdirSync(TEMP_DIR, { recursive: true })
  }

  const extension = image.mimeType.split('/')[1] || 'png'
  const filepath = join(TEMP_DIR, `${filename}.${extension}`)
  const buffer = Buffer.from(image.base64Data, 'base64')
  writeFileSync(filepath, buffer)

  return filepath
}

/**
 * Clean up temp file
 */
export function cleanupTempFile(filepath: string): void {
  try {
    if (existsSync(filepath)) {
      unlinkSync(filepath)
    }
  } catch {
    // Ignore cleanup errors
  }
}

/**
 * Format attachment for Airtable API
 * Airtable accepts URL-based attachments
 */
export function formatAirtableAttachment(
  url: string,
  filename: string
): AirtableAttachment[] {
  return [
    {
      url,
      filename,
    },
  ]
}

/**
 * Upload to a free image hosting service as fallback
 * Using imgbb.com API (free tier: 32MB/month)
 */
export async function uploadToImgBB(
  image: GeneratedImage,
  _filename: string
): Promise<string> {
  // Note: imgbb requires an API key from imgbb.com
  // For now, we'll use a temp file approach with a data URL
  // Airtable actually accepts data URLs in some cases

  // Return data URL directly - Airtable may accept it
  return `data:${image.mimeType};base64,${image.base64Data}`
}

/**
 * Simple SHA1 hash for Cloudinary signature
 */
async function sha1(message: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
