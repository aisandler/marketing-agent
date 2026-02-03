import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getPostsForPartner, getSyncStatus, syncIfStale } from '@/lib/actions'
import { PARTNER_NAMES, PARTNER_ACCOUNTS } from '@/lib/constants'
import { ContentCard } from '@/components/content-card'
import { PartnerSelector } from '@/components/partner-selector'
import { FeedPost } from '@/components/social-feed/feed-post'
import { CalendarGrid } from '@/components/calendar'
import {
  getWeekRange,
  getPreviousWeek,
  getNextWeek,
  isCurrentWeek,
  getBusinessDays,
  formatDayHeader,
  isInWeek,
  parseLocalDate,
  formatDateParam,
} from '@/lib/week-utils'
import type { AirtablePost, PartnerFeedback } from '@prisma/client'

interface ReviewPageProps {
  searchParams: Promise<{
    partner?: string
    view?: string
    channel?: string
    week?: string
    status?: string  // Filter by status: draft, review, revision, approved
  }>
}

type PostWithFeedback = AirtablePost & { feedback: PartnerFeedback[] }

// Get unique platforms/channels from posts
function getChannels(posts: PostWithFeedback[]): string[] {
  const platforms = new Set(posts.map((p) => p.platform || 'LinkedIn'))
  return Array.from(platforms).sort()
}

// Compact stat pill component - now a clickable filter
function StatPill({
  count,
  label,
  color,
  href,
  isActive,
}: {
  count: number
  label: string
  color: 'gray' | 'yellow' | 'red' | 'green'
  href: string
  isActive?: boolean
}) {
  const colors = {
    gray: isActive
      ? 'bg-gray-700 text-white border-gray-700 shadow-sm'
      : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200',
    yellow: isActive
      ? 'bg-yellow-500 text-white border-yellow-500 shadow-sm'
      : 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200',
    red: isActive
      ? 'bg-red-500 text-white border-red-500 shadow-sm'
      : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200',
    green: isActive
      ? 'bg-green-600 text-white border-green-600 shadow-sm'
      : 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200',
  }

  return (
    <a
      href={href}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-medium transition-colors cursor-pointer ${colors[color]}`}
    >
      <span className="font-bold">{count}</span>
      <span className={isActive ? '' : 'opacity-75'}>{label}</span>
    </a>
  )
}

// Channel tab component
function ChannelTabs({
  channels,
  currentChannel,
  partnerId,
  viewMode,
  weekParam,
}: {
  channels: string[]
  currentChannel: string
  partnerId: string
  viewMode: string
  weekParam: string
}) {
  if (channels.length <= 1) return null

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      <a
        href={`/review?partner=${partnerId}&view=${viewMode}&channel=all&week=${weekParam}`}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
          currentChannel === 'all'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        All
      </a>
      {channels.map((channel) => {
        const isLinkedIn = channel.toLowerCase() === 'linkedin'
        const isInstagram = channel.toLowerCase() === 'instagram'
        const isActive = currentChannel === channel.toLowerCase()

        return (
          <a
            key={channel}
            href={`/review?partner=${partnerId}&view=${viewMode}&channel=${channel.toLowerCase()}&week=${weekParam}`}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              isActive
                ? isInstagram
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                  : 'bg-white text-[#0a66c2] shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {isLinkedIn && (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
              </svg>
            )}
            {isInstagram && (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            )}
            <span className="hidden sm:inline">{channel}</span>
          </a>
        )
      })}
    </div>
  )
}

// Week navigation component
function WeekNav({
  weekStart,
  partnerId,
  viewMode,
  channel,
}: {
  weekStart: Date
  partnerId: string
  viewMode: string
  channel: string
}) {
  const week = getWeekRange(weekStart)
  const prevWeek = getPreviousWeek(weekStart)
  const nextWeek = getNextWeek(weekStart)
  const isCurrent = isCurrentWeek(weekStart)

  const prevParam = formatDateParam(prevWeek)
  const nextParam = formatDateParam(nextWeek)
  const todayParam = formatDateParam(new Date())

  return (
    <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 shadow-sm">
      <a
        href={`/review?partner=${partnerId}&view=${viewMode}&channel=${channel}&week=${prevParam}`}
        className="p-2 hover:bg-gray-50 rounded-l-lg transition-colors"
        title="Previous week"
      >
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </a>
      <div className="px-3 py-1.5 text-sm font-medium text-gray-900 min-w-[120px] text-center">
        {week.label}
      </div>
      <a
        href={`/review?partner=${partnerId}&view=${viewMode}&channel=${channel}&week=${nextParam}`}
        className="p-2 hover:bg-gray-50 rounded-r-lg transition-colors"
        title="Next week"
      >
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </a>
      {!isCurrent && (
        <a
          href={`/review?partner=${partnerId}&view=${viewMode}&channel=${channel}&week=${todayParam}`}
          className="ml-1 px-2 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
        >
          This Week
        </a>
      )}
    </div>
  )
}

// Sync status indicator
function SyncIndicator({ lastSyncTime }: { lastSyncTime: Date | null }) {
  if (!lastSyncTime) return null

  const now = new Date()
  const diffMs = now.getTime() - lastSyncTime.getTime()
  const diffMin = Math.floor(diffMs / 1000 / 60)

  let label: string
  if (diffMin < 1) {
    label = 'Just now'
  } else if (diffMin < 60) {
    label = `${diffMin}m ago`
  } else {
    label = `${Math.floor(diffMin / 60)}h ago`
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-400">
      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
      <span>Synced {label}</span>
    </div>
  )
}

// View toggle component
function ViewToggle({
  currentView,
  partnerId,
  channel,
  weekParam,
}: {
  currentView: string
  partnerId: string
  channel: string
  weekParam: string
}) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      <a
        href={`/review?partner=${partnerId}&view=list&channel=${channel}&week=${weekParam}`}
        className={`p-2 rounded-md transition-colors ${
          currentView === 'list'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-900'
        }`}
        title="List view"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      </a>
      <a
        href={`/review?partner=${partnerId}&view=feed&channel=${channel}&week=${weekParam}`}
        className={`p-2 rounded-md transition-colors ${
          currentView === 'feed'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-900'
        }`}
        title="Feed view"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      </a>
      <a
        href={`/review?partner=${partnerId}&view=calendar&channel=${channel}&week=${weekParam}`}
        className={`p-2 rounded-md transition-colors ${
          currentView === 'calendar'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-900'
        }`}
        title="Calendar view"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </a>
    </div>
  )
}

// Day section for week view - past days are collapsed by default
function DaySection({
  date,
  posts,
  partnerId,
  viewMode,
  linkParams,
}: {
  date: string  // YYYY-MM-DD format - avoids timezone serialization issues
  posts: PostWithFeedback[]
  partnerId: string
  viewMode: string
  linkParams: string
}) {
  // Parse the date string locally to avoid UTC conversion
  const dateObj = parseLocalDate(date)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isToday = dateObj.toDateString() === today.toDateString()
  const isPast = dateObj < today

  // Past days are collapsed by default
  const dayContent = (
    <>
      {posts.length > 0 ? (
        <div className={`space-y-3 pt-2 ${viewMode === 'feed' ? 'max-w-lg mx-auto' : ''}`}>
          {viewMode === 'feed'
            ? posts.map((post) => (
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
                  linkParams={linkParams}
                />
              ))
            : posts.map((post) => (
                <ContentCard key={post.id} post={post} partnerId={partnerId} linkParams={linkParams} />
              ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-400 text-sm">No posts scheduled</div>
      )}
    </>
  )

  // For past days, use a collapsible details element
  if (isPast && !isToday) {
    return (
      <details className="group">
        <summary
          className={`sticky top-0 z-10 py-2 -mx-4 px-4 sm:mx-0 sm:px-0 bg-gray-50/95 backdrop-blur-sm cursor-pointer list-none`}
        >
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
              {formatDayHeader(dateObj)}
            </div>
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">{posts.length} posts</span>
            <span className="text-xs text-gray-300 group-open:hidden">(tap to expand)</span>
          </div>
        </summary>
        <div className="opacity-75">{dayContent}</div>
      </details>
    )
  }

  // Today and future days are shown expanded
  return (
    <div>
      {/* Day header */}
      <div
        className={`sticky top-0 z-10 py-2 -mx-4 px-4 sm:mx-0 sm:px-0 ${
          isToday ? 'bg-blue-50/95' : 'bg-gray-50/95'
        } backdrop-blur-sm`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`text-xs font-semibold uppercase tracking-wide ${
              isToday ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            {formatDayHeader(dateObj)}
          </div>
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">{posts.length} posts</span>
        </div>
      </div>
      {dayContent}
    </div>
  )
}

async function PostsList({
  partnerId,
  viewMode,
  channel,
  weekStart,
  statusFilter,
}: {
  partnerId: string
  viewMode: string
  channel: string
  weekStart: Date
  statusFilter: string
}) {
  // Trigger background sync if stale (non-blocking for UI)
  syncIfStale(5).catch(() => {}) // Fire and forget

  const posts = await getPostsForPartner(partnerId)
  const channels = getChannels(posts)
  const week = getWeekRange(weekStart)
  const businessDays = getBusinessDays(weekStart)

  // Filter by channel
  const channelFiltered =
    channel === 'all'
      ? posts
      : posts.filter((p) => (p.platform || 'LinkedIn').toLowerCase() === channel)

  // Filter to posts within this week
  const weekPosts = channelFiltered.filter((p) => {
    if (!p.date) return false
    return isInWeek(new Date(p.date), weekStart)
  })

  // Status filter functions
  const isDraft = (p: PostWithFeedback) =>
    (p.copyStatus === 'Draft' || p.postStatus === 'Drafting') &&
    p.copyStatus !== 'Ready for Review' &&
    p.postStatus !== 'Ready for Review' &&
    p.copyStatus !== 'Needs Revision' &&
    p.postStatus !== 'Needs Revision'

  const isReview = (p: PostWithFeedback) =>
    p.copyStatus === 'Ready for Review' || p.postStatus === 'Ready for Review'

  const isRevision = (p: PostWithFeedback) =>
    p.copyStatus === 'Needs Revision' || p.postStatus === 'Needs Revision'

  const isApproved = (p: PostWithFeedback) =>
    (p.copyStatus === 'Approved' ||
      p.postStatus === 'Approved' ||
      p.postStatus === 'Scheduled' ||
      p.postStatus === 'Posted') &&
    p.copyStatus !== 'Ready for Review' &&
    p.postStatus !== 'Ready for Review' &&
    p.copyStatus !== 'Needs Revision' &&
    p.postStatus !== 'Needs Revision'

  // Calculate stats from all posts (not filtered by week)
  const draft = posts.filter(isDraft)
  const needsReview = posts.filter(isReview)
  const needsRevision = posts.filter(isRevision)
  const approved = posts.filter(isApproved)

  // Apply status filter to week posts
  let filteredWeekPosts = weekPosts
  if (statusFilter === 'draft') {
    filteredWeekPosts = weekPosts.filter(isDraft)
  } else if (statusFilter === 'review') {
    filteredWeekPosts = weekPosts.filter(isReview)
  } else if (statusFilter === 'revision') {
    filteredWeekPosts = weekPosts.filter(isRevision)
  } else if (statusFilter === 'approved') {
    filteredWeekPosts = weekPosts.filter(isApproved)
  }

  // Group posts by day (using filtered posts)
  const postsByDay = businessDays.map((day) => {
    const dayPosts = filteredWeekPosts
      .filter((p) => {
        if (!p.date) return false
        const postDate = new Date(p.date)
        return postDate.toDateString() === day.toDateString()
      })
      .sort((a, b) => {
        if (!a.date || !b.date) return 0
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      })
    return { day: formatDateParam(day), posts: dayPosts }
  })

  // Build filter URLs
  const baseUrl = `/review?partner=${partnerId}&view=${viewMode}&channel=${channel}&week=${week.weekParam}`
  const filterUrl = (status: string) => status ? `${baseUrl}&status=${status}` : baseUrl

  // Build linkParams for detail page navigation (preserves filter state on back)
  const linkParamParts = [`&view=${viewMode}`, `&channel=${channel}`, `&week=${week.weekParam}`]
  if (statusFilter) linkParamParts.push(`&status=${statusFilter}`)
  const linkParams = linkParamParts.join('')

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="text-4xl mb-3">📭</div>
        <p className="text-gray-500 font-medium">No posts found</p>
        <p className="text-sm text-gray-400 mt-1">
          Try syncing from Airtable on the home page
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controls bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Stats/Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {draft.length > 0 && (
            <StatPill
              count={draft.length}
              label="Draft"
              color="gray"
              href={statusFilter === 'draft' ? baseUrl : filterUrl('draft')}
              isActive={statusFilter === 'draft'}
            />
          )}
          {needsReview.length > 0 && (
            <StatPill
              count={needsReview.length}
              label="Review"
              color="yellow"
              href={statusFilter === 'review' ? baseUrl : filterUrl('review')}
              isActive={statusFilter === 'review'}
            />
          )}
          {needsRevision.length > 0 && (
            <StatPill
              count={needsRevision.length}
              label="Revision"
              color="red"
              href={statusFilter === 'revision' ? baseUrl : filterUrl('revision')}
              isActive={statusFilter === 'revision'}
            />
          )}
          <StatPill
            count={approved.length}
            label="Approved"
            color="green"
            href={statusFilter === 'approved' ? baseUrl : filterUrl('approved')}
            isActive={statusFilter === 'approved'}
          />
          <span className="text-xs text-gray-400">
            {filteredWeekPosts.length} this week / {posts.length} total
          </span>
        </div>

        {/* Right: Channel tabs */}
        <ChannelTabs
          channels={channels}
          currentChannel={channel}
          partnerId={partnerId}
          viewMode={viewMode}
          weekParam={week.weekParam}
        />
      </div>

      {/* View-specific rendering */}
      {viewMode === 'calendar' ? (
        <CalendarGrid postsByDay={postsByDay} partnerId={partnerId} linkParams={linkParams} />
      ) : (
        <div className="space-y-6">
          {postsByDay.map(({ day, posts: dayPosts }) => (
            <DaySection
              key={day}
              date={day}
              posts={dayPosts}
              partnerId={partnerId}
              viewMode={viewMode}
              linkParams={linkParams}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default async function ReviewPage({ searchParams }: ReviewPageProps) {
  const params = await searchParams
  const partnerId = params.partner
  const viewMode = params.view || 'feed'
  const channel = params.channel || 'all'
  const statusFilter = params.status || ''

  // Parse week param, default to current week (use local date parsing to avoid timezone issues)
  const today = new Date()
  const weekStart = params.week ? parseLocalDate(params.week) : today
  const week = getWeekRange(weekStart)

  // Allow 'all' or any valid partner
  if (!partnerId || (partnerId !== 'all' && !PARTNER_ACCOUNTS[partnerId])) {
    redirect('/')
  }

  const partnerName = PARTNER_NAMES[partnerId] || 'All Partners'
  const accounts = partnerId === 'all' ? [] : PARTNER_ACCOUNTS[partnerId]

  // Get sync status for indicator
  const syncStatus = await getSyncStatus()

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="p-1.5 -ml-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Back to home"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </a>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{partnerName}</h1>
            <div className="flex items-center gap-3">
              <p className="text-gray-500 text-xs">
                {partnerId === 'all'
                  ? 'All scheduled content'
                  : accounts.length === 1
                  ? accounts[0]
                  : `${accounts.length} channels`}
              </p>
              <SyncIndicator lastSyncTime={syncStatus.lastSync?.createdAt || null} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <WeekNav
            weekStart={weekStart}
            partnerId={partnerId}
            viewMode={viewMode}
            channel={channel}
          />
          <ViewToggle
            currentView={viewMode}
            partnerId={partnerId}
            channel={channel}
            weekParam={week.weekParam}
          />
          <Suspense fallback={<div className="h-9 w-32 bg-gray-100 rounded animate-pulse" />}>
            <PartnerSelector compact />
          </Suspense>
        </div>
      </div>

      {/* Posts */}
      <Suspense
        fallback={
          <div className="space-y-6">
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 w-20 bg-gray-100 rounded-full animate-pulse" />
              ))}
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-6 w-32 bg-gray-100 rounded animate-pulse" />
                <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        }
      >
        <PostsList
          partnerId={partnerId}
          viewMode={viewMode}
          channel={channel}
          weekStart={weekStart}
          statusFilter={statusFilter}
        />
      </Suspense>
    </div>
  )
}
