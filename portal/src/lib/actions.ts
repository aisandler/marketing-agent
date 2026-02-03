'use server'

import { prisma } from './db'
import {
  fetchAirtableRecords,
  transformAirtableToLocal,
  updateAirtableRecord,
  transformLocalToAirtable,
} from './airtable'
import { revalidatePath } from 'next/cache'
import { PARTNER_ACCOUNTS, PARTNER_NAMES } from './constants'

/**
 * Sync posts from Airtable to local database
 * Handles creates, updates, AND deletions (full sync)
 * Uses two-pass approach: first sync records, then resolve source post relationships
 */
export async function syncFromAirtable() {
  try {
    const records = await fetchAirtableRecords()

    // Collect all Airtable record IDs from the fetch
    const airtableRecordIds = new Set(records.map((r) => r.id))

    let created = 0
    let updated = 0
    let deleted = 0

    // PASS 1: Create or update records from Airtable (with sourcePostAirtableId but not sourcePostId)
    for (const record of records) {
      const localData = transformAirtableToLocal(record)
      // Don't set sourcePostId in pass 1 - we'll resolve it in pass 2
      const { ...dataWithoutSourcePostId } = localData

      const existing = await prisma.airtablePost.findUnique({
        where: { airtableRecordId: record.id },
      })

      if (existing) {
        await prisma.airtablePost.update({
          where: { airtableRecordId: record.id },
          data: dataWithoutSourcePostId,
        })
        updated++
      } else {
        await prisma.airtablePost.create({
          data: dataWithoutSourcePostId,
        })
        created++
      }
    }

    // PASS 2: Resolve sourcePostId relationships by looking up local records
    const postsWithSourceAirtableId = await prisma.airtablePost.findMany({
      where: {
        sourcePostAirtableId: { not: null },
      },
      select: {
        id: true,
        sourcePostAirtableId: true,
        sourcePostId: true,
      },
    })

    for (const post of postsWithSourceAirtableId) {
      if (post.sourcePostAirtableId) {
        // Look up the local post by its Airtable record ID
        const sourcePost = await prisma.airtablePost.findUnique({
          where: { airtableRecordId: post.sourcePostAirtableId },
          select: { id: true },
        })

        // Only update if the relationship changed
        if (sourcePost && sourcePost.id !== post.sourcePostId) {
          await prisma.airtablePost.update({
            where: { id: post.id },
            data: { sourcePostId: sourcePost.id },
          })
        } else if (!sourcePost && post.sourcePostId) {
          // Source post doesn't exist (maybe deleted), clear the relationship
          await prisma.airtablePost.update({
            where: { id: post.id },
            data: { sourcePostId: null },
          })
        }
      }
    }

    // Delete local records that no longer exist in Airtable
    const localRecords = await prisma.airtablePost.findMany({
      select: { id: true, airtableRecordId: true },
    })

    for (const local of localRecords) {
      if (!airtableRecordIds.has(local.airtableRecordId)) {
        // First delete any associated feedback to maintain referential integrity
        await prisma.partnerFeedback.deleteMany({
          where: { postId: local.id },
        })
        // Then delete the post
        await prisma.airtablePost.delete({
          where: { id: local.id },
        })
        deleted++
      }
    }

    // Log the sync
    await prisma.syncLog.create({
      data: {
        syncType: 'pull',
        recordsAffected: created + updated + deleted,
        status: 'success',
        details: JSON.stringify({ created, updated, deleted }),
      },
    })

    // Revalidate paths (safe to fail outside Next.js context)
    try {
      revalidatePath('/')
      revalidatePath('/review')
      revalidatePath('/admin')
    } catch {
      // Ignore revalidation errors when running outside Next.js
    }

    return { success: true, created, updated, deleted }
  } catch (error) {
    console.error('Sync error:', error)

    await prisma.syncLog.create({
      data: {
        syncType: 'pull',
        recordsAffected: 0,
        status: 'error',
        details: JSON.stringify({ error: String(error) }),
      },
    })

    return { success: false, error: String(error) }
  }
}

/**
 * Get posts for a specific partner, or all posts if partnerId is 'all'
 */
export async function getPostsForPartner(partnerId: string) {
  // Return all posts if 'all' is specified
  if (partnerId === 'all') {
    return prisma.airtablePost.findMany({
      orderBy: { date: 'asc' },
      include: {
        feedback: {
          orderBy: { createdAt: 'desc' },
        },
        sourcePost: true,  // Include source post for reposts
      },
    })
  }

  const accounts = PARTNER_ACCOUNTS[partnerId]
  if (!accounts) {
    return []
  }

  return prisma.airtablePost.findMany({
    where: {
      postingAccount: { in: accounts },
    },
    orderBy: { date: 'asc' },
    include: {
      feedback: {
        orderBy: { createdAt: 'desc' },
      },
      sourcePost: true,  // Include source post for reposts
    },
  })
}

/**
 * Get a single post by ID
 */
export async function getPostById(postId: string) {
  return prisma.airtablePost.findUnique({
    where: { id: postId },
    include: {
      feedback: {
        orderBy: { createdAt: 'desc' },
      },
      sourcePost: true,  // Include the source post for reposts
    },
  })
}

/**
 * Get the source post for a repost by post ID
 * Returns null if the post is not a repost or source post not found
 */
export async function getSourcePost(postId: string) {
  const post = await prisma.airtablePost.findUnique({
    where: { id: postId },
    include: {
      sourcePost: {
        include: {
          feedback: {
            orderBy: { createdAt: 'desc' },
          },
        },
      },
    },
  })

  return post?.sourcePost || null
}

/**
 * Get all posts (for admin view)
 */
export async function getAllPosts() {
  return prisma.airtablePost.findMany({
    orderBy: { date: 'asc' },
    include: {
      feedback: {
        orderBy: { createdAt: 'desc' },
      },
      sourcePost: true,  // Include source post for reposts
    },
  })
}

/**
 * Approve a post (partner action)
 */
export async function approvePost(postId: string, partnerAccount: string) {
  const post = await prisma.airtablePost.findUnique({
    where: { id: postId },
  })

  if (!post) {
    return { success: false, error: 'Post not found' }
  }

  // Create approval feedback
  await prisma.partnerFeedback.create({
    data: {
      postId,
      partnerAccount,
      feedbackType: 'approval',
      originalCopy: post.copy,
      status: 'applied',
      appliedAt: new Date(),
    },
  })

  // Update the post status
  await prisma.airtablePost.update({
    where: { id: postId },
    data: {
      copyStatus: 'Approved',
      postStatus: 'Approved',
      syncStatus: 'pending_push',
    },
  })

  // Push to Airtable
  try {
    await updateAirtableRecord(
      post.airtableRecordId,
      transformLocalToAirtable({
        copyStatus: 'Approved',
        postStatus: 'Approved',
      })
    )

    await prisma.airtablePost.update({
      where: { id: postId },
      data: { syncStatus: 'synced', lastSyncedAt: new Date() },
    })
  } catch (error) {
    console.error('Failed to push approval to Airtable:', error)
    return { success: false, error: 'Failed to sync to Airtable. Please try again.' }
  }

  revalidatePath('/review')
  revalidatePath('/admin')

  return { success: true }
}

/**
 * Submit an edit (partner action) - pushes directly to Airtable
 */
export async function submitEdit(
  postId: string,
  partnerAccount: string,
  editedCopy: string
) {
  const post = await prisma.airtablePost.findUnique({
    where: { id: postId },
  })

  if (!post) {
    return { success: false, error: 'Post not found' }
  }

  // Create edit feedback record (for history)
  await prisma.partnerFeedback.create({
    data: {
      postId,
      partnerAccount,
      feedbackType: 'edit',
      originalCopy: post.copy,
      editedCopy,
      status: 'applied',
      appliedAt: new Date(),
      appliedBy: partnerAccount,
    },
  })

  // Update local database
  await prisma.airtablePost.update({
    where: { id: postId },
    data: {
      copy: editedCopy,
      syncStatus: 'pending_push',
    },
  })

  // Push to Airtable immediately
  try {
    await updateAirtableRecord(
      post.airtableRecordId,
      transformLocalToAirtable({
        copy: editedCopy,
      })
    )

    await prisma.airtablePost.update({
      where: { id: postId },
      data: { syncStatus: 'synced', lastSyncedAt: new Date() },
    })
  } catch (error) {
    console.error('Failed to push edit to Airtable:', error)
    return { success: false, error: 'Failed to sync to Airtable. Please try again.' }
  }

  revalidatePath('/review')
  revalidatePath('/admin')

  return { success: true }
}

/**
 * Request a revision (partner action) - pushes status to Airtable
 */
export async function requestRevision(
  postId: string,
  partnerAccount: string,
  revisionNotes: string
) {
  const post = await prisma.airtablePost.findUnique({
    where: { id: postId },
  })

  if (!post) {
    return { success: false, error: 'Post not found' }
  }

  // Create revision request feedback
  await prisma.partnerFeedback.create({
    data: {
      postId,
      partnerAccount,
      feedbackType: 'revision_request',
      originalCopy: post.copy,
      revisionNotes,
      status: 'pending',
    },
  })

  // Update local status
  await prisma.airtablePost.update({
    where: { id: postId },
    data: {
      copyStatus: 'Needs Revision',
      postStatus: 'Needs Revision',
      syncStatus: 'pending_push',
    },
  })

  // Push status change to Airtable
  try {
    await updateAirtableRecord(
      post.airtableRecordId,
      transformLocalToAirtable({
        copyStatus: 'Needs Revision',
        postStatus: 'Needs Revision',
      })
    )

    await prisma.airtablePost.update({
      where: { id: postId },
      data: { syncStatus: 'synced', lastSyncedAt: new Date() },
    })
  } catch (error) {
    console.error('Failed to push revision request to Airtable:', error)
    return { success: false, error: 'Failed to sync to Airtable. Please try again.' }
  }

  revalidatePath('/review')
  revalidatePath('/admin')

  return { success: true }
}

/**
 * Apply an edit (admin action)
 */
export async function applyEdit(feedbackId: string) {
  const feedback = await prisma.partnerFeedback.findUnique({
    where: { id: feedbackId },
    include: { post: true },
  })

  if (!feedback || feedback.feedbackType !== 'edit') {
    return { success: false, error: 'Feedback not found or not an edit' }
  }

  // Update the post with the edited copy
  await prisma.airtablePost.update({
    where: { id: feedback.postId },
    data: {
      copy: feedback.editedCopy,
      copyStatus: 'Approved',
      postStatus: 'Approved',
      syncStatus: 'pending_push',
    },
  })

  // Mark feedback as applied
  await prisma.partnerFeedback.update({
    where: { id: feedbackId },
    data: {
      status: 'applied',
      appliedAt: new Date(),
      appliedBy: 'admin',
    },
  })

  // Push to Airtable
  try {
    await updateAirtableRecord(
      feedback.post.airtableRecordId,
      transformLocalToAirtable({
        copy: feedback.editedCopy,
        copyStatus: 'Approved',
        postStatus: 'Approved',
      })
    )

    await prisma.airtablePost.update({
      where: { id: feedback.postId },
      data: { syncStatus: 'synced', lastSyncedAt: new Date() },
    })
  } catch (error) {
    console.error('Failed to push edit to Airtable:', error)
  }

  revalidatePath('/review')
  revalidatePath('/admin')

  return { success: true }
}

/**
 * Dismiss feedback (admin action)
 */
export async function dismissFeedback(feedbackId: string) {
  await prisma.partnerFeedback.update({
    where: { id: feedbackId },
    data: {
      status: 'dismissed',
      appliedAt: new Date(),
      appliedBy: 'admin',
    },
  })

  revalidatePath('/admin')

  return { success: true }
}

/**
 * Get all pending feedback (for admin)
 */
export async function getPendingFeedback() {
  return prisma.partnerFeedback.findMany({
    where: { status: 'pending' },
    include: { post: true },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Get today's posts across all accounts
 */
export async function getTodaysPosts() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return prisma.airtablePost.findMany({
    where: {
      date: {
        gte: today,
        lt: tomorrow,
      },
    },
    orderBy: [
      { postingAccount: 'asc' },
      { date: 'asc' },
    ],
    include: {
      feedback: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })
}

/**
 * Get sync status
 */
export async function getSyncStatus() {
  const lastSync = await prisma.syncLog.findFirst({
    where: { syncType: 'pull' },
    orderBy: { createdAt: 'desc' },
  })

  const pendingPushCount = await prisma.airtablePost.count({
    where: { syncStatus: 'pending_push' },
  })

  return {
    lastSync,
    pendingPushCount,
  }
}

/**
 * Check if sync is stale (older than X minutes)
 */
export async function isSyncStale(maxAgeMinutes: number = 5): Promise<boolean> {
  const lastSync = await prisma.syncLog.findFirst({
    where: { syncType: 'pull', status: 'success' },
    orderBy: { createdAt: 'desc' },
  })

  if (!lastSync) return true

  const ageMs = Date.now() - new Date(lastSync.createdAt).getTime()
  const ageMinutes = ageMs / 1000 / 60

  return ageMinutes > maxAgeMinutes
}

/**
 * Sync from Airtable only if data is stale
 * Returns sync result or null if not needed
 */
export async function syncIfStale(maxAgeMinutes: number = 5) {
  const stale = await isSyncStale(maxAgeMinutes)

  if (!stale) {
    return { synced: false, reason: 'Data is fresh' }
  }

  const result = await syncFromAirtable()
  return { synced: true, ...result }
}

/**
 * Seed partner data from config/partners.json
 * Reads partner configuration dynamically instead of using hardcoded values
 */
export async function seedPartners() {
  const partners = Object.entries(PARTNER_ACCOUNTS).map(([id, accounts]) => ({
    id,
    name: PARTNER_NAMES[id] || id,
    postingAccounts: JSON.stringify(accounts),
  }))

  for (const partner of partners) {
    await prisma.partner.upsert({
      where: { id: partner.id },
      update: partner,
      create: partner,
    })
  }

  return { success: true }
}

/**
 * Get stats for a partner's posts
 */
export async function getPartnerStats(partnerId: string) {
  const accounts = PARTNER_ACCOUNTS[partnerId]
  if (!accounts && partnerId !== 'all') {
    return { draft: 0, needsReview: 0, needsRevision: 0, approved: 0, total: 0 }
  }

  const where = partnerId === 'all' ? {} : { postingAccount: { in: accounts } }

  const posts = await prisma.airtablePost.findMany({
    where,
    select: {
      copyStatus: true,
      postStatus: true,
    },
  })

  // Draft: posts still being written (not yet ready for review)
  const draft = posts.filter(
    (p) =>
      (p.copyStatus === 'Draft' || p.postStatus === 'Drafting') &&
      p.copyStatus !== 'Ready for Review' &&
      p.postStatus !== 'Ready for Review' &&
      p.copyStatus !== 'Needs Revision' &&
      p.postStatus !== 'Needs Revision'
  ).length

  const needsReview = posts.filter(
    (p) => p.copyStatus === 'Ready for Review' || p.postStatus === 'Ready for Review'
  ).length

  const needsRevision = posts.filter(
    (p) => p.copyStatus === 'Needs Revision' || p.postStatus === 'Needs Revision'
  ).length

  const approved = posts.filter(
    (p) =>
      (p.copyStatus === 'Approved' ||
        p.postStatus === 'Approved' ||
        p.postStatus === 'Scheduled' ||
        p.postStatus === 'Posted') &&
      p.copyStatus !== 'Ready for Review' &&
      p.postStatus !== 'Ready for Review' &&
      p.copyStatus !== 'Needs Revision' &&
      p.postStatus !== 'Needs Revision'
  ).length

  return {
    draft,
    needsReview,
    needsRevision,
    approved,
    total: posts.length,
  }
}

/**
 * Get posts for a partner grouped by day for a specific week
 */
export async function getWeekPostsForPartner(
  partnerId: string,
  weekStart: Date
) {
  const accounts = PARTNER_ACCOUNTS[partnerId]
  if (!accounts && partnerId !== 'all') {
    return []
  }

  const where = partnerId === 'all' ? {} : { postingAccount: { in: accounts } }

  const posts = await prisma.airtablePost.findMany({
    where,
    orderBy: { date: 'asc' },
    include: {
      feedback: {
        orderBy: { createdAt: 'desc' },
      },
      sourcePost: true,  // Include source post for reposts
    },
  })

  // Import week utilities inline to avoid circular dependencies
  const { getBusinessDays, isInWeek } = await import('./week-utils')

  const businessDays = getBusinessDays(weekStart)

  // Filter to posts within this week and group by day
  return businessDays.map((day) => {
    const dayPosts = posts
      .filter((p) => {
        if (!p.date) return false
        const postDate = new Date(p.date)
        return isInWeek(postDate, weekStart) && postDate.toDateString() === day.toDateString()
      })
      .sort((a, b) => {
        if (!a.date || !b.date) return 0
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      })
    return { day, posts: dayPosts }
  })
}

/**
 * Get current user's partner from session
 */
export async function getCurrentPartner() {
  const { auth } = await import('@/auth')
  const session = await auth()
  return session?.user?.partnerId || null
}

// ============================================================================
// Cross-Platform Post Detection (Internal Helpers)
// ============================================================================

/**
 * Extract base account name from posting account
 * e.g., "Andrew LinkedIn" -> "Andrew", "Andrew Instagram" -> "Andrew"
 * (Not exported because 'use server' requires async for exports)
 */
function extractBaseAccount(postingAccount: string): string {
  // Remove common platform suffixes
  const platforms = ['LinkedIn', 'Instagram', 'Facebook', 'TikTok', 'X', 'Twitter']
  let base = postingAccount.trim()
  for (const platform of platforms) {
    if (base.toLowerCase().endsWith(platform.toLowerCase())) {
      base = base.slice(0, -platform.length).trim()
      break
    }
  }
  return base
}

/**
 * Extract platform from posting account
 * e.g., "Andrew LinkedIn" -> "LinkedIn"
 * (Not exported because 'use server' requires async for exports)
 */
function extractPlatform(postingAccount: string): string | null {
  const platforms = ['LinkedIn', 'Instagram', 'Facebook', 'TikTok', 'X', 'Twitter']
  const accountLower = postingAccount.toLowerCase()
  for (const platform of platforms) {
    if (accountLower.endsWith(platform.toLowerCase())) {
      return platform
    }
  }
  return null
}

/**
 * Check if two copy strings are similar (exact match or >85% word overlap)
 * (Not exported because 'use server' requires async for exports)
 */
function isCopySimilar(copy1: string | null, copy2: string | null): boolean {
  if (!copy1 || !copy2) return false

  // Exact match
  if (copy1 === copy2) return true

  // Normalize: lowercase, remove extra whitespace
  const normalize = (s: string) => s.toLowerCase().trim().replace(/\s+/g, ' ')
  const norm1 = normalize(copy1)
  const norm2 = normalize(copy2)

  if (norm1 === norm2) return true

  // Word overlap calculation
  const wordsArr1 = norm1.split(' ').filter(w => w.length > 0)
  const wordsArr2 = norm2.split(' ').filter(w => w.length > 0)
  const words1 = new Set(wordsArr1)
  const words2 = new Set(wordsArr2)

  if (words1.size === 0 || words2.size === 0) return false

  // Count overlapping words using Array.from to avoid Set iteration issue
  const overlap = Array.from(words1).filter(word => words2.has(word)).length

  // Calculate overlap percentage based on smaller set
  const minSize = Math.min(words1.size, words2.size)
  const overlapPct = overlap / minSize

  return overlapPct >= 0.85
}

/**
 * Get related cross-platform posts for a given post
 * Posts are related when they share:
 * - Same date
 * - Same base account (e.g., "Andrew" from "Andrew LinkedIn" and "Andrew Instagram")
 * - Same or highly similar copy (>85% word overlap)
 * - Different platforms
 */
export async function getRelatedPosts(postId: string) {
  const post = await prisma.airtablePost.findUnique({
    where: { id: postId },
  })

  if (!post || !post.date || !post.postingAccount) {
    return []
  }

  const baseAccount = extractBaseAccount(post.postingAccount)
  const postPlatform = extractPlatform(post.postingAccount)

  // Get posts on the same date with same base account
  const startOfDay = new Date(post.date)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(post.date)
  endOfDay.setHours(23, 59, 59, 999)

  const candidates = await prisma.airtablePost.findMany({
    where: {
      id: { not: postId },
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      feedback: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  // Filter to posts with same base account, similar copy, different platform
  return candidates.filter(candidate => {
    const candidateBase = extractBaseAccount(candidate.postingAccount)
    const candidatePlatform = extractPlatform(candidate.postingAccount)

    // Must be same person/account
    if (candidateBase.toLowerCase() !== baseAccount.toLowerCase()) return false

    // Must be different platform
    if (postPlatform && candidatePlatform && postPlatform === candidatePlatform) return false

    // Must have similar copy
    return isCopySimilar(post.copy, candidate.copy)
  })
}

/**
 * Approve copy for a post and all its related cross-platform posts
 */
export async function approveCopyForAllPlatforms(postId: string, partnerAccount: string) {
  const post = await prisma.airtablePost.findUnique({
    where: { id: postId },
  })

  if (!post) {
    return { success: false, error: 'Post not found' }
  }

  // Get all related posts
  const relatedPosts = await getRelatedPosts(postId)
  const allPosts = [post, ...relatedPosts]

  // Approve each post
  const results: { postId: string; success: boolean; error?: string }[] = []

  for (const p of allPosts) {
    // Skip already approved posts
    if (p.copyStatus === 'Approved') {
      results.push({ postId: p.id, success: true })
      continue
    }

    // Create approval feedback
    await prisma.partnerFeedback.create({
      data: {
        postId: p.id,
        partnerAccount,
        feedbackType: 'approval',
        originalCopy: p.copy,
        status: 'applied',
        appliedAt: new Date(),
      },
    })

    // Update the post status
    await prisma.airtablePost.update({
      where: { id: p.id },
      data: {
        copyStatus: 'Approved',
        postStatus: 'Approved',
        syncStatus: 'pending_push',
      },
    })

    // Push to Airtable
    try {
      await updateAirtableRecord(
        p.airtableRecordId,
        transformLocalToAirtable({
          copyStatus: 'Approved',
          postStatus: 'Approved',
        })
      )

      await prisma.airtablePost.update({
        where: { id: p.id },
        data: { syncStatus: 'synced', lastSyncedAt: new Date() },
      })

      results.push({ postId: p.id, success: true })
    } catch (error) {
      console.error(`Failed to push approval to Airtable for post ${p.id}:`, error)
      results.push({ postId: p.id, success: false, error: 'Failed to sync to Airtable' })
    }
  }

  revalidatePath('/review')
  revalidatePath('/admin')

  const failed = results.filter(r => !r.success)
  if (failed.length > 0) {
    return {
      success: false,
      error: `Failed to approve ${failed.length} of ${results.length} posts`,
      results,
    }
  }

  return { success: true, approvedCount: results.length, results }
}
// ============================================================================
// Image Approval Actions
// ============================================================================

/**
 * Approve an image (partner action)
 */
export async function approveImage(postId: string, partnerAccount: string) {
  const post = await prisma.airtablePost.findUnique({
    where: { id: postId },
  })

  if (!post) {
    return { success: false, error: 'Post not found' }
  }

  // Create image approval feedback
  await prisma.partnerFeedback.create({
    data: {
      postId,
      partnerAccount,
      feedbackType: 'image_approval',
      status: 'applied',
      appliedAt: new Date(),
    },
  })

  // Update the post asset status
  await prisma.airtablePost.update({
    where: { id: postId },
    data: {
      assetStatus: 'Approved',
      syncStatus: 'pending_push',
    },
  })

  // Push to Airtable
  try {
    await updateAirtableRecord(
      post.airtableRecordId,
      transformLocalToAirtable({
        assetStatus: 'Approved',
      })
    )

    await prisma.airtablePost.update({
      where: { id: postId },
      data: { syncStatus: 'synced', lastSyncedAt: new Date() },
    })
  } catch (error) {
    console.error('Failed to push image approval to Airtable:', error)
    return { success: false, error: 'Failed to sync to Airtable. Please try again.' }
  }

  revalidatePath('/review')
  revalidatePath('/admin')

  return { success: true }
}

/**
 * Reject an image with feedback (partner action)
 */
export async function rejectImage(
  postId: string,
  partnerAccount: string,
  rejectionReason: string
) {
  const post = await prisma.airtablePost.findUnique({
    where: { id: postId },
  })

  if (!post) {
    return { success: false, error: 'Post not found' }
  }

  // Create image rejection feedback with reason
  await prisma.partnerFeedback.create({
    data: {
      postId,
      partnerAccount,
      feedbackType: 'image_rejection',
      revisionNotes: rejectionReason,
      status: 'pending',
    },
  })

  // Update the post asset status
  await prisma.airtablePost.update({
    where: { id: postId },
    data: {
      assetStatus: 'Needs Revision',
      syncStatus: 'pending_push',
    },
  })

  // Push to Airtable
  try {
    await updateAirtableRecord(
      post.airtableRecordId,
      transformLocalToAirtable({
        assetStatus: 'Needs Revision',
      })
    )

    await prisma.airtablePost.update({
      where: { id: postId },
      data: { syncStatus: 'synced', lastSyncedAt: new Date() },
    })
  } catch (error) {
    console.error('Failed to push image rejection to Airtable:', error)
    return { success: false, error: 'Failed to sync to Airtable. Please try again.' }
  }

  revalidatePath('/review')
  revalidatePath('/admin')

  return { success: true }
}

/**
 * Get all image feedback (approvals and rejections)
 * Used to surface patterns for improving image generation prompts
 */
export async function getImageFeedback() {
  const feedback = await prisma.partnerFeedback.findMany({
    where: {
      feedbackType: {
        in: ['image_approval', 'image_rejection'],
      },
    },
    include: {
      post: {
        select: {
          postTopic: true,
          imageBrief: true,
          postingAccount: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 50, // Last 50 feedback items
  })

  return feedback
}

/**
 * Get aggregated image feedback stats
 */
export async function getImageFeedbackStats() {
  const [approvals, rejections, recentRejections] = await Promise.all([
    prisma.partnerFeedback.count({
      where: { feedbackType: 'image_approval' },
    }),
    prisma.partnerFeedback.count({
      where: { feedbackType: 'image_rejection' },
    }),
    prisma.partnerFeedback.findMany({
      where: { feedbackType: 'image_rejection' },
      select: { revisionNotes: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
  ])

  // Extract common themes from rejection notes
  const rejectionReasons = recentRejections
    .map((r) => r.revisionNotes)
    .filter(Boolean) as string[]

  return {
    approvals,
    rejections,
    approvalRate: approvals + rejections > 0
      ? Math.round((approvals / (approvals + rejections)) * 100)
      : 0,
    recentRejectionReasons: rejectionReasons,
  }
}

// Redeploy trigger Thu Jan 22 18:08:16 EST 2026
