'use client'

import { CalendarPostCard, CalendarPostCardProps } from './calendar-post-card'
import { parseLocalDate } from '@/lib/week-utils'

interface CalendarDayColumnProps {
  date: string  // YYYY-MM-DD format - avoids timezone serialization issues
  posts: Omit<CalendarPostCardProps, 'onClick'>[]
  onPostClick: (postId: string) => void
}

export function CalendarDayColumn({ date, posts, onPostClick }: CalendarDayColumnProps) {
  // Parse the date string locally to avoid UTC conversion
  const dateObj = parseLocalDate(date)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const columnDate = new Date(dateObj)
  columnDate.setHours(0, 0, 0, 0)
  const isToday = columnDate.getTime() === today.getTime()

  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' })
  const dayNumber = dateObj.getDate()

  return (
    <div className="flex flex-col min-w-[160px]">
      {/* Day header */}
      <div
        className={`sticky top-0 z-10 p-2 text-center border-b ${
          isToday
            ? 'bg-blue-50 border-blue-200'
            : 'bg-soft-surface-100 border-soft-surface-300'
        }`}
      >
        <div
          className={`text-xs font-medium uppercase tracking-wide ${
            isToday ? 'text-blue-600' : 'text-soft-text-muted'
          }`}
        >
          {dayName}
        </div>
        <div
          className={`text-lg font-bold ${
            isToday ? 'text-blue-600' : 'text-soft-text-primary'
          }`}
        >
          {dayNumber}
        </div>
        {isToday && (
          <div className="text-[10px] text-blue-500 font-medium">Today</div>
        )}
      </div>

      {/* Posts stack */}
      <div className="flex-1 p-2 space-y-2 overflow-y-auto bg-soft-surface-100/50">
        {posts.length > 0 ? (
          posts.map((post) => (
            <CalendarPostCard
              key={post.id}
              {...post}
              onClick={() => onPostClick(post.id)}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-24 text-soft-text-muted text-xs">
            No posts
          </div>
        )}
      </div>
    </div>
  )
}
