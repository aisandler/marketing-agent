'use client'

import { useEffect } from 'react'
import { ImageCarousel, ImageData } from '@/components/social-feed/image-carousel'
import { PARTNER_COLORS, PARTNER_INITIALS, getPartnerIdFromAccount } from '@/lib/constants'

interface SourcePostData {
  id: string
  postTopic: string | null
  postingAccount: string
  copy: string | null
  copyStatus: string
  date: Date | null
}

export interface CalendarPostPanelProps {
  post: {
    id: string
    postTopic: string | null
    postingAccount: string
    platform: string | null
    copyStatus: string
    postType: string | null  // "Original", "Repost", "Link Share"
    copy: string | null
    date: Date | null
    images: string | null
    imageUrl: string | null
    imageThumbnail: string | null
    videoUrl: string | null
    videoThumbnail: string | null
    sourcePost?: SourcePostData | null
  }
  partnerId: string
  onClose: () => void
  linkParams?: string
}

// Parse images JSON safely
function parseImages(
  imagesJson: string | null,
  fallbackUrl: string | null,
  fallbackThumb: string | null
): ImageData[] {
  if (imagesJson) {
    try {
      return JSON.parse(imagesJson)
    } catch {
      // Fall through to fallback
    }
  }
  if (fallbackUrl || fallbackThumb) {
    return [{ url: fallbackUrl || fallbackThumb || '', thumbnail: fallbackThumb || fallbackUrl || '' }]
  }
  return []
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const getStatusStyle = () => {
    switch (status) {
      case 'Approved':
        return 'bg-soft-success text-white'
      case 'Ready for Review':
        return 'bg-soft-warning text-white'
      case 'Needs Revision':
        return 'bg-soft-error text-white'
      case 'Scheduled':
        return 'bg-blue-500 text-white'
      case 'Posted':
        return 'bg-purple-500 text-white'
      default:
        return 'bg-gray-400 text-white'
    }
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle()}`}>
      {status}
    </span>
  )
}

// Repost badge component
function RepostBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
      title="This is a repost of another post"
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      Repost
    </span>
  )
}

// Platform badge component
function PlatformBadge({ platform }: { platform: string | null }) {
  const platformName = platform || 'LinkedIn'
  const isLinkedIn = platformName.toLowerCase() === 'linkedin'
  const isInstagram = platformName.toLowerCase() === 'instagram'

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        isInstagram
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
          : 'bg-[#0a66c2] text-white'
      }`}
    >
      {isLinkedIn && (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
        </svg>
      )}
      {isInstagram && (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      )}
      {platformName}
    </span>
  )
}

export function CalendarPostPanel({ post, partnerId, onClose, linkParams }: CalendarPostPanelProps) {
  const images = parseImages(post.images, post.imageUrl, post.imageThumbnail)
  const isRepost = post.postType === 'Repost' || !!post.sourcePost
  // Don't show media for reposts - they share the original post's content
  const hasVideo = isRepost ? false : !!post.videoUrl
  const hasImages = isRepost ? false : images.length > 0
  const postPartnerId = getPartnerIdFromAccount(post.postingAccount)
  const colors = PARTNER_COLORS[postPartnerId] || PARTNER_COLORS.company
  const initials = PARTNER_INITIALS[postPartnerId] || 'CO'
  const accountName = post.postingAccount.replace(' LinkedIn', '').replace(' Instagram', '')

  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Date not set'

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-soft-xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-soft-surface-300">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${colors.bg}`}
            >
              {initials}
            </div>
            <div>
              <div className="font-semibold text-soft-text-primary">{accountName}</div>
              <div className="text-xs text-soft-text-muted">{formattedDate}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-soft-surface-200 rounded-soft transition-colors"
            aria-label="Close panel"
          >
            <svg className="w-5 h-5 text-soft-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Media */}
          {hasVideo ? (
            <div className="relative aspect-video bg-soft-surface-200">
              <video
                src={post.videoUrl!}
                poster={post.videoThumbnail || images[0]?.thumbnail || undefined}
                controls
                className="w-full h-full object-contain"
                preload="metadata"
              />
            </div>
          ) : hasImages ? (
            <ImageCarousel images={images} alt={post.postTopic || 'Post image'} aspectRatio="landscape" />
          ) : (
            <div className="aspect-video bg-soft-gradient-subtle flex items-center justify-center">
              <div className="text-center text-soft-text-muted">
                <svg
                  className="w-12 h-12 mx-auto mb-2 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm">No media attached</span>
              </div>
            </div>
          )}

          {/* Details */}
          <div className="p-4 space-y-4">
            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-2">
              <PlatformBadge platform={post.platform} />
              <StatusBadge status={post.copyStatus} />
              {isRepost && <RepostBadge />}
            </div>

            {/* Topic */}
            <div>
              <div className="text-xs font-medium text-soft-text-muted uppercase tracking-wide mb-1">
                Topic
              </div>
              <h2 className="text-lg font-semibold text-soft-text-primary">
                {post.postTopic || 'Untitled post'}
              </h2>
            </div>

            {/* Copy */}
            <div>
              <div className="text-xs font-medium text-soft-text-muted uppercase tracking-wide mb-1">
                Copy
              </div>
              {post.copy ? (
                <div className="text-sm text-soft-text-secondary whitespace-pre-wrap leading-relaxed bg-soft-surface-100 rounded-soft p-3">
                  {post.copy}
                </div>
              ) : (
                <div className="text-sm text-soft-text-muted italic">Copy pending...</div>
              )}
            </div>

            {/* Source Post for Reposts */}
            {post.sourcePost && (
              <div className="border border-blue-200 rounded-soft overflow-hidden">
                <div className="px-3 py-2 bg-blue-50 border-b border-blue-100">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-blue-800">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Original Post Being Reposted
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="text-xs text-soft-text-muted">
                    <span className="font-medium text-soft-text-secondary">{post.sourcePost.postingAccount}</span>
                    {post.sourcePost.date && (
                      <>
                        <span className="mx-1">&bull;</span>
                        {new Date(post.sourcePost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </>
                    )}
                  </div>
                  {post.sourcePost.postTopic && (
                    <div className="text-sm font-medium text-soft-text-primary">{post.sourcePost.postTopic}</div>
                  )}
                  <div className="text-sm text-soft-text-secondary whitespace-pre-wrap line-clamp-4 bg-soft-surface-100 rounded p-2">
                    {post.sourcePost.copy || <span className="italic text-soft-text-muted">No copy yet</span>}
                  </div>
                  <a
                    href={`/review/${post.sourcePost.id}?partner=${partnerId}${linkParams || ''}`}
                    className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Original
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-soft-surface-300 bg-soft-surface-100">
          <a
            href={`/review/${post.id}?partner=${partnerId}${linkParams || ''}`}
            className="soft-btn-primary w-full justify-center"
          >
            View Full Details
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </>
  )
}
