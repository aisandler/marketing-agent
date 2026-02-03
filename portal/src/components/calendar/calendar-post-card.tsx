'use client'

import { PARTNER_COLORS, PARTNER_INITIALS, getPartnerIdFromAccount } from '@/lib/constants'

interface ImageData {
  url: string
  thumbnail: string
}

export interface CalendarPostCardProps {
  id: string
  postTopic: string | null
  postingAccount: string
  platform: string
  copyStatus: string
  postType: string | null  // "Original", "Repost", "Link Share"
  images: string | null
  imageUrl: string | null
  imageThumbnail: string | null
  videoThumbnail: string | null
  onClick: () => void
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

// Platform icon component
function PlatformIcon({ platform }: { platform: string }) {
  const isLinkedIn = platform.toLowerCase() === 'linkedin'
  const isInstagram = platform.toLowerCase() === 'instagram'

  if (isLinkedIn) {
    return (
      <svg className="w-3.5 h-3.5 text-[#0a66c2]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
      </svg>
    )
  }

  if (isInstagram) {
    return (
      <svg className="w-3.5 h-3.5 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    )
  }

  return null
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const getStatusStyle = () => {
    switch (status) {
      case 'Draft':
      case 'Drafting':
        return 'bg-gray-100 text-gray-600'
      case 'Approved':
        return 'bg-emerald-100 text-emerald-700'
      case 'Ready for Review':
        return 'bg-amber-100 text-amber-700'
      case 'Needs Revision':
        return 'bg-red-100 text-red-700'
      case 'Scheduled':
        return 'bg-blue-100 text-blue-700'
      case 'Posted':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getDisplayStatus = () => {
    switch (status) {
      case 'Ready for Review':
        return 'Review'
      case 'Drafting':
        return 'Draft'
      default:
        return status
    }
  }

  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getStatusStyle()}`}>
      {getDisplayStatus()}
    </span>
  )
}

// Repost indicator badge
function RepostBadge() {
  return (
    <span
      className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700 flex items-center gap-0.5"
      title="Repost"
    >
      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    </span>
  )
}

export function CalendarPostCard({
  id,
  postTopic,
  postingAccount,
  platform,
  copyStatus,
  postType,
  images: imagesJson,
  imageUrl,
  imageThumbnail,
  videoThumbnail,
  onClick,
}: CalendarPostCardProps) {
  const images = parseImages(imagesJson, imageUrl, imageThumbnail)
  const isRepost = postType === 'Repost'
  // Don't show images for reposts - they share the original post's content
  const thumbnailUrl = isRepost ? null : (videoThumbnail || images[0]?.thumbnail || images[0]?.url)
  const partnerId = getPartnerIdFromAccount(postingAccount)
  const colors = PARTNER_COLORS[partnerId] || PARTNER_COLORS.company
  const initials = PARTNER_INITIALS[partnerId] || 'CO'

  return (
    <button
      onClick={onClick}
      className={`w-full text-left soft-card overflow-hidden border-l-4 ${colors.border} hover:shadow-soft transition-all duration-200 ease-soft-out hover:-translate-y-0.5`}
    >
      {/* Thumbnail */}
      {thumbnailUrl ? (
        <div className="aspect-[16/10] bg-soft-surface-200 overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={postTopic || 'Post thumbnail'}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-[16/10] bg-soft-gradient-subtle flex items-center justify-center">
          <svg
            className="w-6 h-6 text-soft-text-muted opacity-50"
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
        </div>
      )}

      {/* Content */}
      <div className="p-2">
        {/* Meta row: avatar, platform, status */}
        <div className="flex items-center gap-1.5 mb-1.5">
          {/* Partner avatar */}
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[7px] font-bold shrink-0 ${colors.bg}`}
          >
            {initials}
          </div>
          <PlatformIcon platform={platform} />
          <StatusBadge status={copyStatus} />
          {isRepost && <RepostBadge />}
        </div>

        {/* Topic */}
        <p className="text-xs text-soft-text-primary font-medium line-clamp-2 leading-tight">
          {postTopic || 'Untitled post'}
        </p>
      </div>
    </button>
  )
}
