import { StatusBadge } from './status-badge'
import { PlatformBadge } from './platform-badge'
import { PartnerAvatar } from './partner-avatar'
import { RepostIndicator } from './repost-indicator'
import type { AirtablePost, PartnerFeedback } from '@prisma/client'

interface ContentCardProps {
  post: AirtablePost & { feedback: PartnerFeedback[] }
  partnerId: string
  linkParams?: string // Additional URL params to preserve state
}

// Parse images JSON safely to get first thumbnail
function getFirstThumbnail(post: AirtablePost): string | null {
  // Try the images JSON array first
  if (post.images) {
    try {
      const images = JSON.parse(post.images)
      if (images.length > 0) {
        return images[0].thumbnail || images[0].url
      }
    } catch {
      // Fall through
    }
  }
  // Fallback to legacy fields
  return post.imageThumbnail || post.imageUrl || null
}

export function ContentCard({ post, partnerId, linkParams }: ContentCardProps) {
  const hasPendingFeedback = post.feedback.some((f) => f.status === 'pending')
  const isRepost = post.postType === 'Repost'
  // Don't show images for reposts
  const thumbnail = isRepost ? null : getFirstThumbnail(post)
  const hasVideo = isRepost ? false : !!post.videoUrl

  // Format date nicely
  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : 'No date'

  return (
    <a
      href={`/review/${post.id}?partner=${partnerId}${linkParams || ''}`}
      className="group block soft-card-hover p-3 sm:p-4"
    >
      <div className="flex gap-3">
        {/* Thumbnail */}
        <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-soft overflow-hidden bg-soft-surface-200">
          {isRepost ? (
            // Repost indicator in thumbnail area
            <div className="w-full h-full flex items-center justify-center bg-blue-50">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          ) : thumbnail ? (
            <img
              src={thumbnail}
              alt={post.postTopic || 'Post thumbnail'}
              className="w-full h-full object-cover transition-transform duration-300 ease-soft-out group-hover:scale-105"
            />
          ) : hasVideo && post.videoThumbnail ? (
            <div className="relative w-full h-full">
              <img
                src={post.videoThumbnail}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-soft-gradient-subtle">
              <svg className="w-6 h-6 text-soft-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Top row: Partner + Platform + Date + Repost + Status */}
          <div className="flex items-center gap-2 mb-1">
            <PartnerAvatar postingAccount={post.postingAccount} size="sm" />
            <PlatformBadge platform={post.platform} />
            <span className="text-xs text-soft-text-muted">{formattedDate}</span>
            <div className="ml-auto flex items-center gap-1.5">
              {isRepost && <RepostIndicator size="sm" />}
              <StatusBadge status={post.copyStatus} type="copy" />
            </div>
          </div>

          {/* Title */}
          <h3 className="font-medium text-soft-text-primary text-sm line-clamp-1 group-hover:text-soft-primary transition-colors duration-150">
            {post.postTopic || 'Untitled Post'}
          </h3>

          {/* Copy preview */}
          <p className="text-xs text-soft-text-secondary line-clamp-2 mt-1">
            {post.copy || 'No copy yet'}
          </p>

          {/* Bottom row: metadata */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {post.contentPillar && (
              <span className="text-[10px] text-soft-text-muted bg-soft-surface-200 px-1.5 py-0.5 rounded-soft-sm">
                {post.contentPillar}
              </span>
            )}
            {hasPendingFeedback && (
              <span className="text-[10px] bg-soft-warning-muted text-amber-700 px-1.5 py-0.5 rounded-soft-sm font-medium">
                Feedback pending
              </span>
            )}
            {post.postingAccount && (
              <span className="text-[10px] text-soft-text-muted">
                {post.postingAccount}
              </span>
            )}
          </div>
        </div>

        {/* Chevron */}
        <div className="shrink-0 self-center">
          <svg
            className="w-4 h-4 text-soft-surface-400 group-hover:text-soft-primary group-hover:translate-x-0.5 transition-all duration-150 ease-soft-out"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </a>
  )
}
