/**
 * OpenRouter API client for Gemini image generation
 * Uses OpenAI-compatible API format
 */

import type { GeneratedImage, OpenRouterResponse } from './types'
import { config } from './config'
import { getBrandConfig } from './rules'

// Build system prompt based on brand config
function getSystemPrompt(): string {
  const brandConfig = getBrandConfig()
  const industry = brandConfig.industry || 'business'

  return `You are an expert image generator for professional social media content.

Generate images that are:
- Professional and polished
- Suitable for LinkedIn and business social media
- Clean, modern design aesthetic
- Appropriate for a ${industry} brand (sophisticated, trustworthy)

Important guidelines:
- NO text in the images unless specifically requested
- Use professional color palettes matching brand colors
- Avoid generic stock photo aesthetics
- Create unique, eye-catching visuals that stand out in a feed`
}

export async function generateImage(imageBrief: string): Promise<GeneratedImage> {
  const brandConfig = getBrandConfig()

  const response = await fetch(config.openrouter.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.openrouter.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/marketing-agent',
      'X-Title': `${brandConfig.name} Marketing Image Generator`,
    },
    body: JSON.stringify({
      model: config.openrouter.model,
      messages: [
        {
          role: 'system',
          content: getSystemPrompt(),
        },
        {
          role: 'user',
          content: `Generate an image based on this brief:\n\n${imageBrief}`,
        },
      ],
      // Request image output
      response_format: { type: 'text' },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenRouter API error (${response.status}): ${errorText}`)
  }

  const data: OpenRouterResponse = await response.json()
  const message = data.choices[0]?.message

  // Check for images array (Gemini format)
  if (message?.images && Array.isArray(message.images) && message.images.length > 0) {
    const imageItem = message.images[0]
    if (imageItem?.type === 'image_url' && imageItem?.image_url?.url) {
      return parseDataUrl(imageItem.image_url.url)
    }
  }

  // Extract image from content
  const content = message?.content

  if (!content) {
    throw new Error('No content in OpenRouter response')
  }

  // Handle array content (multimodal response)
  if (Array.isArray(content)) {
    for (const part of content) {
      if (part.type === 'image_url' && part.image_url?.url) {
        return parseDataUrl(part.image_url.url)
      }
    }
    throw new Error('No image found in multimodal response')
  }

  // Handle string content - check for base64 data URL
  if (typeof content === 'string') {
    if (content.startsWith('data:image/')) {
      return parseDataUrl(content)
    }
    // Some models return the image inline differently
    const base64Match = content.match(/data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)/)
    if (base64Match) {
      return {
        mimeType: `image/${base64Match[1]}`,
        base64Data: base64Match[2],
      }
    }
    throw new Error(`Unexpected string response (no image): ${content.substring(0, 100)}...`)
  }

  throw new Error('Unable to extract image from response')
}

function parseDataUrl(dataUrl: string): GeneratedImage {
  const match = dataUrl.match(/^data:image\/(png|jpeg|webp|gif);base64,(.+)$/)
  if (!match) {
    throw new Error(`Invalid data URL format: ${dataUrl.substring(0, 50)}...`)
  }
  return {
    mimeType: `image/${match[1]}`,
    base64Data: match[2],
  }
}

/**
 * Sleep utility for rate limiting
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Retry wrapper with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 2000
): Promise<T> {
  let lastError: Error | undefined

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Check for rate limit (429) or server error (5xx)
      const isRetryable =
        lastError.message.includes('429') ||
        lastError.message.includes('500') ||
        lastError.message.includes('502') ||
        lastError.message.includes('503')

      if (!isRetryable || attempt === maxRetries) {
        throw lastError
      }

      const delay = baseDelay * Math.pow(2, attempt)
      console.log(`  Retry ${attempt + 1}/${maxRetries} after ${delay}ms...`)
      await sleep(delay)
    }
  }

  throw lastError
}
