import { ContentCard } from '@/components/content-card'
import { FeedPost } from '@/components/social-feed/feed-post'
import { PartnerAvatar } from '@/components/partner-avatar'
import { formatDayHeader } from '@/lib/week-utils'
import type { AirtablePost, PartnerFeedback } from '@prisma/client'

type PostWithFeedback = AirtablePost & { feedback: PartnerFeedback[] }

interface WeekPostsListProps {
  postsByDay: { day: Date; posts: PostWithFeedback[] }[]
  partnerId: string
  platform?: string
  statusFilter?: string
}

// Helper to check if a post matches a status filter
function matchesStatusFilter(post: PostWithFeedback, filter: string): boolean {
  if (filter === 'all') return true

  const copyStatus = post.copyStatus || ''
  const postStatus = post.postStatus || ''

  switch (filter) {
    case 'draft':
      return (
        (copyStatus === 'Draft' || postStatus === 'Drafting') &&
        copyStatus !== 'Ready for Review' &&
        postStatus !== 'Ready for Review'
      )
    case 'review':
      return copyStatus === 'Ready for Review' || postStatus === 'Ready for Review'
    case 'revision':
      return copyStatus === 'Needs Revision' || postStatus === 'Needs Revision'
    case 'approved':
      return (
        (copyStatus === 'Approved' ||
          postStatus === 'Approved' ||
          postStatus === 'Scheduled' ||
          postStatus === 'Posted') &&
        copyStatus !== 'Ready for Review' &&
        postStatus !== 'Ready for Review' &&
        copyStatus !== 'Needs Revision' &&
        postStatus !== 'Needs Revision'
      )
    default:
      return true
  }
}

// Grid card for gallery view
function GridCard({ post, partnerId }: { post: PostWithFeedback; partnerId: string }) {
  // Parse images
  let thumbnail: string | null = null
  if (post.images) {
    try {
      const images = JSON.parse(post.images)
      if (images.length > 0) {
        thumbnail = images[0].thumbnail || images[0].url
      }
    } catch {
      // Fall through
    }
  }
  if (!thumbnail) {
    thumbnail = post.imageThumbnail || post.imageUrl || null
  }

  const hasVideo = !!post.videoUrl
  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    : 'No date'

  // Status badge colors
  const getStatusStyle = () => {
    switch (post.copyStatus) {
      case 'Approved':
        return 'bg-green-500 text-white'
      case 'Ready for Review':
        return 'bg-yellow-500 text-white'
      case 'Needs Revision':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-400 text-white'
    }
  }

  return (
    <a
      href={`/review/${post.id}?partner=${partnerId}`}
      className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Image/Video area */}
      <div className="relative aspect-square bg-gray-100">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={post.postTopic || 'Post thumbnail'}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : hasVideo && post.videoThumbnail ? (
          <div className="relative w-full h-full">
            <img
              src={post.videoThumbnail}
              alt="Video thumbnail"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <svg className="w-12 h-12 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Status badge */}
        {post.copyStatus && post.copyStatus !== 'Draft' && (
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle()}`}>
            {post.copyStatus === 'Ready for Review' ? 'Review' : post.copyStatus}
          </div>
        )}

        {/* Partner avatar + Platform badge */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
          <PartnerAvatar postingAccount={post.postingAccount} size="sm" />
          {(post.platform || 'LinkedIn').toLowerCase() === 'instagram' ? (
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-[#0a66c2] flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <p className="text-xs text-gray-500 mb-1">{formattedDate}</p>
        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
          {post.postTopic || 'Untitled Post'}
        </h3>
      </div>
    </a>
  )
}

// Day section with posts - supports different view modes
function DaySection({
  date,
  posts,
  partnerId,
}: {
  date: Date
  posts: PostWithFeedback[]
  partnerId: string
}) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const isToday = d.getTime() === today.getTime()
  const isPast = d < today

  // For past days, show collapsed by default
  if (isPast && !isToday) {
    return (
      <details className="group">
        <summary className="sticky top-0 z-10 py-2 bg-gray-50/95 backdrop-blur-sm cursor-pointer list-none">
          <div className="flex items-center gap-3">
            <svg
              className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {formatDayHeader(date)}
            </div>
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">{posts.length} posts</span>
            <span className="text-xs text-gray-300 group-open:hidden">(tap to expand)</span>
          </div>
        </summary>
        <div className="opacity-75 pt-2 space-y-3">
          {posts.length > 0 ? (
            posts.map((post) => <ContentCard key={post.id} post={post} partnerId={partnerId} />)
          ) : (
            <div className="text-center py-4 text-gray-400 text-sm">No posts scheduled</div>
          )}
        </div>
      </details>
    )
  }

  // Today and future days are shown expanded
  return (
    <div>
      <div
        className={`sticky top-0 z-10 py-2 ${
          isToday ? 'bg-blue-50/95' : 'bg-gray-50/95'
        } backdrop-blur-sm`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`text-xs font-semibold uppercase tracking-wide ${
              isToday ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            {formatDayHeader(date)}
          </div>
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">{posts.length} posts</span>
        </div>
      </div>
      <div className="pt-2 space-y-3">
        {posts.length > 0 ? (
          posts.map((post) => <ContentCard key={post.id} post={post} partnerId={partnerId} />)
        ) : (
          <div className="text-center py-4 text-gray-400 text-sm">No posts scheduled</div>
        )}
      </div>
    </div>
  )
}

export function WeekPostsList({ postsByDay, partnerId, platform = 'all', statusFilter = 'all' }: WeekPostsListProps) {
  // Filter posts by platform and status
  const filteredPostsByDay = postsByDay.map(({ day, posts }) => ({
    day,
    posts: posts
      .filter((p) => platform === 'all' || (p.platform || 'LinkedIn').toLowerCase() === platform)
      .filter((p) => matchesStatusFilter(p, statusFilter)),
  }))

  // Check if there are any posts this week
  const totalPosts = filteredPostsByDay.reduce((sum, d) => sum + d.posts.length, 0)

  if (totalPosts === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="text-4xl mb-3">📭</div>
        <p className="text-gray-500 font-medium">No posts this week</p>
        <p className="text-sm text-gray-400 mt-1">
          {platform !== 'all' ? `Try viewing all platforms` : 'Check back later for new content'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {filteredPostsByDay.map(({ day, posts }) => (
        <DaySection key={day.toISOString()} date={day} posts={posts} partnerId={partnerId} />
      ))}
    </div>
  )
}
