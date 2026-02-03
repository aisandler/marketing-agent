import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * Public API endpoint for image feedback
 * Used by local image generation scripts to fetch live rejection themes
 *
 * Returns:
 * - themes: Common rejection patterns extracted from feedback
 * - stats: Approval rate and counts
 * - recentReasons: Raw rejection reasons for context
 */

// Simple auth via API key (optional - set IMAGE_FEEDBACK_API_KEY env var)
function validateRequest(request: Request): boolean {
  const apiKey = process.env.IMAGE_FEEDBACK_API_KEY
  if (!apiKey) return true // No key configured = open access

  const authHeader = request.headers.get('authorization')
  return authHeader === `Bearer ${apiKey}`
}

// Theme extraction keywords
const THEME_KEYWORDS: Record<string, string[]> = {
  'too generic': ['generic', 'stock', 'stock photo', 'boring', 'bland', 'basic'],
  'not modern': ['modern', 'dated', 'old', 'old-fashioned', 'outdated', 'traditional'],
  'wrong mood': ['mood', 'tone', 'feel', 'feeling', 'vibe', 'energy'],
  'colors off': ['color', 'colours', 'palette', 'brand colors', 'too dark', 'too bright'],
  'wrong concept': ['concept', 'topic', 'fit', 'match', 'relevant', 'doesn\'t match'],
  'too busy': ['busy', 'cluttered', 'too much', 'overwhelming', 'complex'],
  'not professional': ['professional', 'amateur', 'cheap', 'low quality'],
  'wrong style': ['style', 'aesthetic', 'look', 'design'],
}

function extractThemes(reasons: string[]): { theme: string; count: number; weight: number }[] {
  const counts: Record<string, number> = {}

  for (const reason of reasons) {
    const lower = reason.toLowerCase()
    for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
      if (keywords.some(keyword => lower.includes(keyword))) {
        counts[theme] = (counts[theme] || 0) + 1
      }
    }
  }

  // Calculate weights (frequency relative to total)
  const total = reasons.length || 1

  return Object.entries(counts)
    .map(([theme, count]) => ({
      theme,
      count,
      weight: Math.round((count / total) * 100) / 100,
    }))
    .sort((a, b) => b.count - a.count)
}

export async function GET(request: Request) {
  // Validate API key if configured
  if (!validateRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Fetch feedback stats
    const [approvals, rejections, recentRejections] = await Promise.all([
      prisma.partnerFeedback.count({
        where: { feedbackType: 'image_approval' },
      }),
      prisma.partnerFeedback.count({
        where: { feedbackType: 'image_rejection' },
      }),
      prisma.partnerFeedback.findMany({
        where: { feedbackType: 'image_rejection' },
        select: {
          revisionNotes: true,
          createdAt: true,
          post: {
            select: {
              postTopic: true,
              postingAccount: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 50, // Last 50 rejections for theme analysis
      }),
    ])

    // Extract rejection reasons
    const rejectionReasons = recentRejections
      .map(r => r.revisionNotes)
      .filter(Boolean) as string[]

    // Extract themes
    const themes = extractThemes(rejectionReasons)

    // Calculate approval rate
    const total = approvals + rejections
    const approvalRate = total > 0 ? Math.round((approvals / total) * 100) : 0

    return NextResponse.json({
      stats: {
        approvals,
        rejections,
        approvalRate,
        totalFeedback: total,
      },
      themes,
      recentReasons: rejectionReasons.slice(0, 10), // Last 10 for context
      // Negative prompts derived from themes (ready to use in generation)
      negativePrompts: themes
        .filter(t => t.count >= 2) // Only include if mentioned 2+ times
        .map(t => t.theme),
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching image feedback:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}
