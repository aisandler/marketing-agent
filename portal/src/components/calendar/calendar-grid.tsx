'use client'

import { useState } from 'react'
import { CalendarDayColumn } from './calendar-day-column'
import { CalendarPostPanel } from './calendar-post-panel'
import type { CalendarPostCardProps } from './calendar-post-card'

interface SourcePostData {
  id: string
  postTopic: string | null
  postingAccount: string
  copy: string | null
  copyStatus: string
  date: Date | null
}

interface PostData {
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

interface DayData {
  day: string  // YYYY-MM-DD format - avoids timezone serialization issues
  posts: PostData[]
}

interface CalendarGridProps {
  postsByDay: DayData[]
  partnerId: string
  linkParams?: string
}

export function CalendarGrid({ postsByDay, partnerId, linkParams }: CalendarGridProps) {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)

  // Find the selected post
  const selectedPost = selectedPostId
    ? postsByDay
        .flatMap((d) => d.posts)
        .find((p) => p.id === selectedPostId)
    : null

  const handlePostClick = (postId: string) => {
    setSelectedPostId(postId)
  }

  const handleClosePanel = () => {
    setSelectedPostId(null)
  }

  return (
    <>
      {/* Calendar grid */}
      <div className="soft-card overflow-hidden">
        <div className="overflow-x-auto">
          <div className="grid grid-cols-5 min-w-[800px] divide-x divide-soft-surface-300">
            {postsByDay.map(({ day, posts }) => (
              <CalendarDayColumn
                key={day}
                date={day}
                posts={posts.map((p) => ({
                  id: p.id,
                  postTopic: p.postTopic,
                  postingAccount: p.postingAccount,
                  platform: p.platform || 'LinkedIn',
                  copyStatus: p.copyStatus,
                  postType: p.postType,
                  images: p.images,
                  imageUrl: p.imageUrl,
                  imageThumbnail: p.imageThumbnail,
                  videoThumbnail: p.videoThumbnail,
                }))}
                onPostClick={handlePostClick}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Slide-out panel */}
      {selectedPost && (
        <CalendarPostPanel
          post={selectedPost}
          partnerId={partnerId}
          onClose={handleClosePanel}
          linkParams={linkParams}
        />
      )}
    </>
  )
}
