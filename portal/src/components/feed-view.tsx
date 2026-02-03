'use client'

import { FeedPost } from './social-feed/feed-post'

interface Post {
  id: string
  date: Date | null
  postTopic: string | null
  postingAccount: string
  platform: string | null
  copy: string | null
  copyStatus: string
  images: string | null
  imageUrl: string | null
  imageThumbnail: string | null
  videoUrl: string | null
  videoThumbnail: string | null
  postType: string | null
}

interface FeedViewProps {
  posts: Post[]
  partnerId: string
  partnerName: string
  channel: string
}

export function FeedView({ posts, partnerId, partnerName, channel }: FeedViewProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-4xl mb-3">📱</div>
        <p className="font-medium">No upcoming posts</p>
        <p className="text-sm text-gray-400 mt-1">
          Posts scheduled from this date will appear here
        </p>
      </div>
    )
  }

  // Group posts by date
  const groupedByDate = posts.reduce((groups, post) => {
    const dateKey = post.date
      ? new Date(post.date).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        })
      : 'Unscheduled'
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(post)
    return groups
  }, {} as Record<string, Post[]>)

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {Object.entries(groupedByDate).map(([dateLabel, datePosts]) => (
        <div key={dateLabel}>
          {/* Date header */}
          <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm py-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {dateLabel}
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
          </div>

          {/* Posts for this date */}
          <div className="space-y-4">
            {datePosts.map((post) => (
              <FeedPost
                key={post.id}
                postId={post.id}
                partnerId={partnerId}
                platform={post.platform || 'LinkedIn'}
                postingAccount={post.postingAccount}
                date={post.date}
                copy={post.copy}
                images={post.images}
                imageUrl={post.imageUrl}
                imageThumbnail={post.imageThumbnail}
                videoUrl={post.videoUrl}
                videoThumbnail={post.videoThumbnail}
                postTopic={post.postTopic}
                copyStatus={post.copyStatus}
                postType={post.postType}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
