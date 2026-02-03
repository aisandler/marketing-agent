/**
 * Airtable API client for Content Calendar
 * Handles pull/push synchronization with the local SQLite database
 */

// Helper to get config at runtime (not module load time)
function getConfig() {
  const apiKey = process.env.AIRTABLE_API_KEY
  const baseId = process.env.AIRTABLE_BASE_ID
  const tableId = process.env.AIRTABLE_CONTENT_CALENDAR_TABLE_ID

  if (!apiKey || !baseId || !tableId) {
    throw new Error(
      `Missing Airtable config: API_KEY=${!!apiKey}, BASE_ID=${!!baseId}, TABLE_ID=${!!tableId}`
    )
  }

  return {
    baseUrl: `https://api.airtable.com/v0/${baseId}/${tableId}`,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  }
}

// Types for Airtable attachment
interface AirtableAttachment {
  id: string
  url: string
  filename: string
  size: number
  type: string
  thumbnails?: {
    small?: { url: string; width: number; height: number }
    large?: { url: string; width: number; height: number }
    full?: { url: string; width: number; height: number }
  }
}

// Types for Airtable records
export interface AirtableRecord {
  id: string
  fields: {
    Date?: string
    'Post Topic'?: string
    'Posting Account'?: string
    Platform?: string
    'Post Type'?: string
    'Content Pillar'?: string
    Focus?: string
    Copy?: string
    'Copy With Disclaimer'?: string  // Formula field - copy with legal disclaimer appended
    'Copy Status'?: string
    'Asset Status'?: string
    'Post Status'?: string
    'Image Brief'?: string
    Image?: AirtableAttachment[]
    Video?: AirtableAttachment[]
    Notes?: string
    'Source Post'?: string[]  // Linked record IDs for reposts
  }
  createdTime: string
}

export interface AirtableResponse {
  records: AirtableRecord[]
  offset?: string
}

/**
 * Fetch all records from the Content Calendar table
 * Optionally filter by posting accounts
 */
export async function fetchAirtableRecords(
  postingAccounts?: string[]
): Promise<AirtableRecord[]> {
  const { baseUrl, headers } = getConfig()
  const records: AirtableRecord[] = []
  let offset: string | undefined

  do {
    const params = new URLSearchParams({
      pageSize: '100',
    })

    if (offset) {
      params.append('offset', offset)
    }

    // Build filter formula for specific posting accounts
    if (postingAccounts && postingAccounts.length > 0) {
      const accountFilters = postingAccounts
        .map(account => `{Posting Account}='${account}'`)
        .join(',')
      params.append('filterByFormula', `OR(${accountFilters})`)
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
 * Update a single record in Airtable
 */
export async function updateAirtableRecord(
  recordId: string,
  fields: Partial<AirtableRecord['fields']>
): Promise<AirtableRecord> {
  const { baseUrl, headers } = getConfig()

  const response = await fetch(`${baseUrl}/${recordId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ fields }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Airtable API error: ${JSON.stringify(errorData)}`)
  }

  return response.json()
}

/**
 * Batch update multiple records in Airtable (max 10 per request)
 */
export async function batchUpdateAirtableRecords(
  updates: Array<{ id: string; fields: Partial<AirtableRecord['fields']> }>
): Promise<AirtableRecord[]> {
  const { baseUrl, headers } = getConfig()
  const results: AirtableRecord[] = []

  // Airtable allows max 10 records per batch
  for (let i = 0; i < updates.length; i += 10) {
    const batch = updates.slice(i, i + 10)

    const response = await fetch(baseUrl, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        records: batch.map(({ id, fields }) => ({ id, fields })),
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Airtable API error: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    results.push(...data.records)
  }

  return results
}

/**
 * Parse a date string (YYYY-MM-DD) in local timezone to avoid UTC shifting
 * e.g., "2026-01-20" becomes Jan 20 at midnight local time, not UTC
 */
function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/**
 * Transform an Airtable record to our local schema format
 */
export function transformAirtableToLocal(record: AirtableRecord) {
  // Extract ALL images from attachments (for carousel support)
  const imageAttachments = record.fields.Image || []
  const images = imageAttachments.map(img => ({
    url: img.url,
    thumbnail: img.thumbnails?.large?.url || img.thumbnails?.small?.url || img.url,
  }))

  // Keep first image for backwards compatibility
  const firstImage = images[0]
  const imageUrl = firstImage?.url || null
  const imageThumbnail = firstImage?.thumbnail || imageUrl

  // Extract video URL from attachment
  const videoAttachment = record.fields.Video?.[0]
  const videoUrl = videoAttachment?.url || null
  const videoThumbnail = videoAttachment?.thumbnails?.large?.url ||
                         videoAttachment?.thumbnails?.small?.url ||
                         null

  // Smart disclaimer handling: use Copy if it already has disclaimer, otherwise use formula field
  const rawCopy = record.fields.Copy || null
  const hasDisclaimer = rawCopy?.includes('Attorney Advertising')
  const copy = hasDisclaimer ? rawCopy : (record.fields['Copy With Disclaimer'] || rawCopy)

  // Extract source post Airtable ID for reposts
  const sourcePostIds = record.fields['Source Post']
  const sourcePostAirtableId = sourcePostIds?.[0] || null

  return {
    airtableRecordId: record.id,
    // Parse date in local timezone to prevent UTC shift (e.g., Jan 20 staying Jan 20)
    date: record.fields.Date ? parseLocalDate(record.fields.Date) : null,
    postTopic: record.fields['Post Topic'] || null,
    postingAccount: record.fields['Posting Account'] || 'Company LinkedIn',
    platform: record.fields.Platform || null,
    postType: record.fields['Post Type'] || null,
    contentPillar: record.fields['Content Pillar'] || null,
    focus: record.fields.Focus || null,
    copy,
    copyStatus: record.fields['Copy Status'] || 'Draft',
    assetStatus: record.fields['Asset Status'] || null,
    postStatus: record.fields['Post Status'] || 'Drafting',
    imageBrief: record.fields['Image Brief'] || null,
    // Store all images as JSON array
    images: images.length > 0 ? JSON.stringify(images) : null,
    imageUrl,       // DEPRECATED: kept for backwards compat
    imageThumbnail, // DEPRECATED: kept for backwards compat
    videoUrl,
    videoThumbnail,
    notes: record.fields.Notes || null,
    sourcePostAirtableId,  // For repost relationship resolution
    lastSyncedAt: new Date(),
    syncStatus: 'synced',
  }
}

/**
 * Transform local record back to Airtable format
 */
export function transformLocalToAirtable(localRecord: {
  copy?: string | null
  copyStatus?: string | null
  postStatus?: string | null
  assetStatus?: string | null
  notes?: string | null
}): Partial<AirtableRecord['fields']> {
  const fields: Partial<AirtableRecord['fields']> = {}

  if (localRecord.copy !== undefined) {
    fields.Copy = localRecord.copy || undefined
  }
  if (localRecord.copyStatus !== undefined) {
    fields['Copy Status'] = localRecord.copyStatus || undefined
  }
  if (localRecord.postStatus !== undefined) {
    fields['Post Status'] = localRecord.postStatus || undefined
  }
  if (localRecord.assetStatus !== undefined) {
    fields['Asset Status'] = localRecord.assetStatus || undefined
  }
  if (localRecord.notes !== undefined) {
    fields.Notes = localRecord.notes || undefined
  }

  return fields
}
