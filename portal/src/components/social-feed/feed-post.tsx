'use client'

import { useState } from 'react'
import { ImageCarousel, ImageData } from './image-carousel'
import { PARTNER_ACCOUNTS, PARTNER_NAMES, PARTNER_INITIALS, PARTNER_COLORS, getPartnerIdFromAccount } from '@/lib/constants'

interface FeedPostProps {
  platform: string
  postingAccount: string
  date: Date | null
  copy: string | null
  images: string | null // JSON array of {url, thumbnail}
  imageUrl: string | null // DEPRECATED: kept for backwards compat
  imageThumbnail: string | null // DEPRECATED: kept for backwards compat
  videoUrl: string | null
  videoThumbnail: string | null
  postTopic: string | null
  copyStatus: string
  postId: string
  partnerId: string
  postType: string | null // "Original", "Repost", "Link Share"
  linkParams?: string // Additional URL params to preserve state (e.g., "&view=feed&channel=all")
}

// Parse images JSON safely
function parseImages(imagesJson: string | null, fallbackUrl: string | null, fallbackThumb: string | null): ImageData[] {
  if (imagesJson) {
    try {
      return JSON.parse(imagesJson)
    } catch {
      // Fall through to fallback
    }
  }
  // Fallback to deprecated single image fields
  if (fallbackUrl || fallbackThumb) {
    return [{ url: fallbackUrl || fallbackThumb || '', thumbnail: fallbackThumb || fallbackUrl || '' }]
  }
  return []
}

// LinkedIn-style post component with Soft UI
function LinkedInPost({
  postingAccount,
  date,
  copy,
  images: imagesJson,
  imageUrl,
  imageThumbnail,
  videoUrl,
  videoThumbnail,
  postTopic,
  postType,
}: Omit<FeedPostProps, 'platform' | 'copyStatus' | 'postId' | 'partnerId'>) {
  const images = parseImages(imagesJson, imageUrl, imageThumbnail)
  const isRepost = postType === 'Repost'
  // Don't show media for reposts - they share the original post's content
  const hasVideo = isRepost ? false : !!videoUrl
  const hasImages = isRepost ? false : images.length > 0
  const accountName = postingAccount.replace(' LinkedIn', '').replace(' Instagram', '')
  const companyPartnerIds = Object.keys(PARTNER_ACCOUNTS).filter(id => id === 'company' || id === 'firm')
  const isCompany = companyPartnerIds.some(id => partnerId === id)
  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'Scheduled'

  // Get partner colors and initials
  const partnerId = getPartnerIdFromAccount(postingAccount)
  const initials = PARTNER_INITIALS[partnerId] || accountName.charAt(0).toUpperCase()
  const colors = PARTNER_COLORS[partnerId] || { bg: 'bg-soft-gradient' }

  return (
    <article className="soft-card overflow-hidden">
      {/* Header */}
      <div className="p-3 sm:p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-white shrink-0 shadow-soft-sm ${colors.bg}`}
          >
            <span className={initials.length > 2 ? 'text-[10px] tracking-tight' : 'text-sm'}>{initials}</span>
          </div>

          {/* Name & Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-soft-text-primary text-sm truncate">
                {isCompany ? (PARTNER_NAMES['company'] || accountName) : accountName}
              </span>
              {isCompany && (
                <svg className="w-4 h-4 text-soft-secondary shrink-0" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                </svg>
              )}
            </div>
            <p className="text-xs text-soft-text-muted truncate">
              {isCompany ? (PARTNER_NAMES['company'] || 'Company') : `Partner`}
            </p>
            <div className="flex items-center gap-1 text-xs text-soft-text-muted mt-0.5">
              <span>{formattedDate}</span>
              <span>•</span>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z" />
              </svg>
            </div>
          </div>

          {/* LinkedIn Logo */}
          <div className="shrink-0">
            <svg className="w-5 h-5 text-[#0a66c2]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-3 sm:px-4 pb-3">
        <p className="text-sm text-soft-text-primary whitespace-pre-wrap leading-relaxed line-clamp-4">
          {copy || (
            <span className="text-soft-text-muted italic">Copy pending...</span>
          )}
        </p>
        {copy && copy.length > 280 && (
          <button className="text-sm text-soft-text-muted hover:text-soft-primary mt-1 transition-colors duration-150">
            ...see more
          </button>
        )}
      </div>

      {/* Media (Video or Images with carousel) */}
      {isRepost ? (
        <div className="relative aspect-video bg-blue-50 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-10 h-10 mx-auto mb-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm text-blue-600 font-medium">Repost</span>
          </div>
        </div>
      ) : hasVideo ? (
        <div className="relative aspect-video bg-soft-surface-200">
          <video
            src={videoUrl!}
            poster={videoThumbnail || images[0]?.thumbnail || undefined}
            controls
            className="w-full h-full object-contain"
            preload="metadata"
          />
          {/* Video badge */}
          <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Video
          </div>
        </div>
      ) : hasImages ? (
        <ImageCarousel images={images} alt={postTopic || 'Post image'} aspectRatio="landscape" />
      ) : null}

      {/* Engagement Bar */}
      <div className="px-3 sm:px-4 py-2 border-t border-soft-surface-300/60">
        <div className="flex items-center justify-between text-xs text-soft-text-muted">
          <div className="flex items-center gap-1">
            <span className="flex -space-x-1">
              <span className="w-4 h-4 rounded-full bg-soft-secondary border-2 border-white flex items-center justify-center">
                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
                </svg>
              </span>
            </span>
            <span className="ml-1">—</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-2 py-1 border-t border-soft-surface-300/60 flex justify-between">
        {['Like', 'Comment', 'Repost', 'Send'].map((action) => (
          <button
            key={action}
            className="flex-1 flex items-center justify-center gap-1 py-2 text-xs text-soft-text-secondary hover:bg-soft-surface-100 rounded-soft-sm transition-colors duration-150"
          >
            {action === 'Like' && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            )}
            <span className="hidden sm:inline">{action}</span>
          </button>
        ))}
      </div>
    </article>
  )
}

// Instagram-style post component with Soft UI
function InstagramPost({
  postingAccount,
  date,
  copy,
  images: imagesJson,
  imageUrl,
  imageThumbnail,
  videoUrl,
  videoThumbnail,
  postTopic,
  postType,
}: Omit<FeedPostProps, 'platform' | 'copyStatus' | 'postId' | 'partnerId'>) {
  const [liked, setLiked] = useState(false)
  const images = parseImages(imagesJson, imageUrl, imageThumbnail)
  const isRepost = postType === 'Repost'
  // Don't show media for reposts - they share the original post's content
  const hasVideo = isRepost ? false : !!videoUrl
  const hasImages = isRepost ? false : images.length > 0
  const accountName = postingAccount.replace(' Instagram', '').replace(' LinkedIn', '').toLowerCase()
  const handle = `@${accountName.replace(/\s+/g, '')}`
  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'Scheduled'

  // Get partner colors and initials
  const partnerId = getPartnerIdFromAccount(postingAccount)
  const initials = PARTNER_INITIALS[partnerId] || accountName.charAt(0).toUpperCase()
  const colors = PARTNER_COLORS[partnerId] || { bg: 'bg-purple-500' }

  return (
    <article className="soft-card overflow-hidden">
      {/* Header */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Avatar with gradient ring */}
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 via-pink-500 to-purple-600 p-0.5">
              <div className="w-full h-full rounded-full bg-white p-0.5">
                <div className={`w-full h-full rounded-full flex items-center justify-center text-white font-bold ${colors.bg}`}>
                  <span className={initials.length > 2 ? 'text-[8px] tracking-tight' : 'text-xs'}>{initials}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm text-soft-text-primary">{handle}</span>
              <svg className="w-3.5 h-3.5 text-[#3b82f6]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <span className="text-xs text-soft-text-muted">{formattedDate}</span>
          </div>
        </div>

        {/* More button */}
        <button className="p-1 hover:bg-soft-surface-100 rounded-full transition-colors duration-150">
          <svg className="w-5 h-5 text-soft-text-primary" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>
      </div>

      {/* Media (Video, Images with carousel, or Placeholder) */}
      {isRepost ? (
        <div className="relative aspect-[4/5] bg-blue-50 overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm text-blue-600 font-medium">Repost</span>
            </div>
          </div>
        </div>
      ) : hasVideo ? (
        <div className="relative aspect-[4/5] bg-soft-surface-200 overflow-hidden">
          <video
            src={videoUrl!}
            poster={videoThumbnail || images[0]?.thumbnail || undefined}
            controls
            className="w-full h-full object-cover"
            preload="metadata"
          />
          {/* Reels/Video indicator */}
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Reel
          </div>
        </div>
      ) : hasImages ? (
        <ImageCarousel images={images} alt={postTopic || 'Post image'} aspectRatio="square" />
      ) : (
        <div className="relative aspect-[4/5] bg-soft-gradient-subtle overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-soft-text-muted">
              <svg className="w-10 h-10 mx-auto mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs">Image pending</span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLiked(!liked)}
              className="hover:opacity-70 transition-all duration-150 active:scale-90"
            >
              {liked ? (
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-soft-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>
            <button className="hover:opacity-70 transition-opacity">
              <svg className="w-6 h-6 text-soft-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
            <button className="hover:opacity-70 transition-opacity">
              <svg className="w-6 h-6 text-soft-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
          <button className="hover:opacity-70 transition-opacity">
            <svg className="w-6 h-6 text-soft-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        {/* Caption */}
        <div className="text-sm">
          <span className="font-semibold text-soft-text-primary mr-1.5">{handle}</span>
          <span className="text-soft-text-primary whitespace-pre-wrap">
            {copy ? (
              copy.length > 150 ? (
                <>
                  {copy.slice(0, 150)}...
                  <button className="text-soft-text-muted ml-1 hover:text-soft-primary transition-colors duration-150">more</button>
                </>
              ) : (
                copy
              )
            ) : (
              <span className="text-soft-text-muted italic">Caption pending...</span>
            )}
          </span>
        </div>
      </div>
    </article>
  )
}

export function FeedPost(props: FeedPostProps) {
  const { platform, partnerId, postId, copyStatus, postType, linkParams } = props
  const isInstagram = platform?.toLowerCase() === 'instagram'
  const isRepost = postType === 'Repost'

  // Status badge colors
  const getStatusStyle = () => {
    switch (copyStatus) {
      case 'Approved':
        return 'bg-soft-success text-white shadow-[0_0_12px_-2px_rgba(16,185,129,0.4)]'
      case 'Ready for Review':
        return 'bg-soft-warning text-white shadow-[0_0_12px_-2px_rgba(245,158,11,0.4)]'
      case 'Needs Revision':
        return 'bg-soft-error text-white shadow-[0_0_12px_-2px_rgba(239,68,68,0.4)]'
      default:
        return 'bg-soft-surface-400 text-white'
    }
  }

  return (
    <a
      href={`/review/${postId}?partner=${partnerId}${linkParams || ''}`}
      className="block transition-all duration-200 ease-soft-out hover:-translate-y-0.5 hover:shadow-soft-lg rounded-soft-lg"
    >
      <div className="relative">
        {isInstagram ? (
          <InstagramPost {...props} />
        ) : (
          <LinkedInPost {...props} />
        )}

        {/* Repost indicator badge - positioned after avatar to avoid overlap */}
        {isRepost && (
          <div className="absolute top-3.5 left-[60px] sm:left-[68px] px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500 text-white backdrop-blur-sm flex items-center gap-1 shadow-[0_0_12px_-2px_rgba(59,130,246,0.4)]">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Repost
          </div>
        )}

        {/* Status overlay with glow */}
        {copyStatus && copyStatus !== 'Draft' && (
          <div
            className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${getStatusStyle()}`}
          >
            {copyStatus === 'Ready for Review' ? 'Review' : copyStatus}
          </div>
        )}
      </div>
    </a>
  )
}
