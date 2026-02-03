/**
 * Airtable client for image generation automation
 * Fetch records needing images, update with generated attachments
 */

import type { AirtableRecord, AirtableResponse, AirtableAttachment } from './types'
import { config } from './config'

const { baseUrl, apiKey } = config.airtable

const headers = {
  Authorization: `Bearer ${apiKey}`,
  'Content-Type': 'application/json',
}

/**
 * Fetch records that need image generation:
 * - Has Image Brief field populated
 * - No Image attachment
 * - Image Source is not "Requires Real Video" or "Received"
 */
export async function fetchRecordsNeedingImages(): Promise<AirtableRecord[]> {
  const records: AirtableRecord[] = []
  let offset: string | undefined

  // Filter formula:
  // Has Image Brief AND (Image is empty) AND Image Source is not excluded AND not a repost
  const filterFormula = `AND(
    {Image Brief} != '',
    OR({Image} = '', {Image} = BLANK()),
    {Image Source} != 'Requires Real Video',
    {Image Source} != 'Received',
    {Image Source} != 'Manual Upload',
    {Post Type} != 'Repost',
    {Post Type} != 'Link Share'
  )`.replace(/\s+/g, ' ')

  do {
    const params = new URLSearchParams({
      pageSize: '100',
      filterByFormula: filterFormula,
    })

    if (offset) {
      params.append('offset', offset)
    }

    const response = await fetch(`${baseUrl}?${params.toString()}`, {
      headers,
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Airtable API error: ${JSON.stringify(errorData)}`)
    }

    const data: AirtableResponse = await response.json()
    records.push(...data.records)
    offset = data.offset
  } while (offset)

  return records
}

/**
 * Fetch a single record by ID
 */
export async function fetchRecord(recordId: string): Promise<AirtableRecord> {
  const response = await fetch(`${baseUrl}/${recordId}`, {
    headers,
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Airtable API error: ${JSON.stringify(errorData)}`)
  }

  return response.json()
}

/**
 * Upload image directly to Airtable using the content upload endpoint
 * This bypasses the need for a public URL
 * URL format: https://content.airtable.com/v0/{baseId}/{recordId}/{fieldName}/uploadAttachment
 * Body format: JSON with base64-encoded file content
 */
export async function uploadImageDirectly(
  recordId: string,
  imageData: Buffer,
  mimeType: string,
  filename: string
): Promise<void> {
  const { baseId } = config.airtable
  const uploadUrl = `https://content.airtable.com/v0/${baseId}/${recordId}/Image/uploadAttachment`

  const payload = {
    contentType: mimeType,
    filename: filename,
    file: imageData.toString('base64'),
  }

  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Airtable upload error (${response.status}): ${errorText.substring(0, 500)}`)
  }
}

/**
 * Update a record's metadata after image upload
 */
export async function updateImageMetadata(
  recordId: string,
  imageSource: string = 'AI Generated'
): Promise<AirtableRecord> {
  const response = await fetch(`${baseUrl}/${recordId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      fields: {
        'Image Source': imageSource,
        'Asset Status': 'Ready for Review',
      },
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Airtable API error: ${JSON.stringify(errorData)}`)
  }

  return response.json()
}

/**
 * Update a record with generated image attachment (URL-based, requires public URL)
 * @deprecated Use uploadImageDirectly instead for base64 images
 */
export async function updateRecordWithImage(
  recordId: string,
  attachment: AirtableAttachment[],
  imageSource: string = 'AI Generated'
): Promise<AirtableRecord> {
  const response = await fetch(`${baseUrl}/${recordId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      fields: {
        Image: attachment,
        'Image Source': imageSource,
        'Asset Status': 'Ready for Review',
      },
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Airtable API error: ${JSON.stringify(errorData)}`)
  }

  return response.json()
}

/**
 * Update only the Image Source field (for marking records)
 */
export async function updateImageSource(
  recordId: string,
  imageSource: string
): Promise<AirtableRecord> {
  const response = await fetch(`${baseUrl}/${recordId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      fields: {
        'Image Source': imageSource,
      },
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Airtable API error: ${JSON.stringify(errorData)}`)
  }

  return response.json()
}

/**
 * List records with their image generation status
 */
export async function listRecordsWithImageStatus(): Promise<void> {
  const records: AirtableRecord[] = []
  let offset: string | undefined

  do {
    const params = new URLSearchParams({
      pageSize: '100',
    })

    // Airtable requires each field as separate parameter
    const fields = ['Post Topic', 'Image Brief', 'Image', 'Image Source', 'Date']
    fields.forEach(f => params.append('fields[]', f))

    if (offset) {
      params.append('offset', offset)
    }

    const response = await fetch(`${baseUrl}?${params.toString()}`, {
      headers,
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Airtable API error: ${JSON.stringify(errorData)}`)
    }

    const data: AirtableResponse = await response.json()
    records.push(...data.records)
    offset = data.offset
  } while (offset)

  // Group by status
  const withImage = records.filter(r => r.fields.Image && r.fields.Image.length > 0)
  const needsImage = records.filter(r =>
    r.fields['Image Brief'] &&
    (!r.fields.Image || r.fields.Image.length === 0)
  )
  const nobrief = records.filter(r => !r.fields['Image Brief'])

  console.log('\n=== Image Generation Status ===\n')
  console.log(`Total records: ${records.length}`)
  console.log(`With image: ${withImage.length}`)
  console.log(`Needs image (has brief): ${needsImage.length}`)
  console.log(`No image brief: ${nobrief.length}`)

  if (needsImage.length > 0) {
    console.log('\n--- Records Needing Images ---')
    needsImage.forEach(r => {
      console.log(`  [${r.id}] ${r.fields['Post Topic'] || '(no topic)'} (${r.fields.Date || 'no date'})`)
    })
  }
}
