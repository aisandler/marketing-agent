import type { AirtablePost, PartnerFeedback } from '@prisma/client'
import { PlatformBadge } from './platform-badge'
import { StatusBadge } from './status-badge'
import { PARTNER_INITIALS, PARTNER_COLORS, getPartnerIdFromAccount } from '@/lib/constants'

type PostWithFeedback = AirtablePost & { feedback: PartnerFeedback[] }

interface TodayAtGlanceProps {
  posts: PostWithFeedback[]
}

// Get first thumbnail from images JSON or fallback fields
function getFirstThumbnail(post: AirtablePost): string | null {
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
  return post.imageThumbnail || post.imageUrl || null
}

// Group posts by posting account
function groupByAccount(posts: PostWithFeedback[]): Record<string, PostWithFeedback[]> {
  return posts.reduce((acc, post) => {
    const account = post.postingAccount || 'Unknown'
    if (!acc[account]) {
      acc[account] = []
    }
    acc[account].push(post)
    return acc
  }, {} as Record<string, PostWithFeedback[]>)
}

// Get platform icon based on account name
function getPlatformFromAccount(account: string): string {
  if (account.toLowerCase().includes('instagram')) return 'Instagram'
  if (account.toLowerCase().includes('linkedin')) return 'LinkedIn'
  return 'LinkedIn' // Default
}

// Get initials and colors from account name using constants
function getPartnerStyle(account: string): { initials: string; bgClass: string } {
  const partnerId = getPartnerIdFromAccount(account)
  const initials = PARTNER_INITIALS[partnerId] || 'CO'
  const colors = PARTNER_COLORS[partnerId] || PARTNER_COLORS.company
  return { initials, bgClass: colors.bg }
}

export function TodayAtGlance({ posts }: TodayAtGlanceProps) {
  const groupedPosts = groupByAccount(posts)
  const accounts = Object.keys(groupedPosts).sort()

  if (posts.length === 0) {
    return (
      <div className="soft-card overflow-hidden">
        <div className="soft-section-header">
          <div className="w-8 h-8 rounded-soft bg-soft-gradient flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="font-semibold text-soft-text-primary">Today at a Glance</h2>
        </div>
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-soft-surface-200 flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-6 h-6 text-soft-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 12H4"
              />
            </svg>
          </div>
          <p className="text-soft-text-secondary text-sm">No posts scheduled for today</p>
        </div>
      </div>
    )
  }

  return (
    <div className="soft-card overflow-hidden">
      <div className="soft-section-header">
        <div className="w-8 h-8 rounded-soft bg-soft-gradient flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-soft-text-primary">Today at a Glance</h2>
          <p className="text-xs text-soft-text-muted">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <span className="soft-badge-primary">{posts.length} post{posts.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="divide-y divide-soft-surface-300/60">
        {accounts.map((account) => {
          const accountPosts = groupedPosts[account]
          const platform = getPlatformFromAccount(account)
          const { initials, bgClass } = getPartnerStyle(account)
          const displayName = account.replace(/\s*(LinkedIn|Instagram)\s*/gi, '').trim()

          return (
            <div key={account} className="p-3 sm:p-4">
              {/* Account Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${bgClass}`}>
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm text-soft-text-primary truncate block">
                    {displayName}
                  </span>
                </div>
                <PlatformBadge platform={platform} />
              </div>

              {/* Posts for this account */}
              <div className="space-y-2">
                {accountPosts.map((post) => {
                  const thumbnail = getFirstThumbnail(post)
                  const hasVideo = !!post.videoUrl

                  return (
                    <a
                      key={post.id}
                      href={`/review/${post.id}?partner=all`}
                      className="group flex items-center gap-3 p-2 -mx-2 rounded-soft hover:bg-soft-surface-100 transition-colors duration-150"
                    >
                      {/* Thumbnail */}
                      <div className="shrink-0 w-10 h-10 rounded-soft-sm overflow-hidden bg-soft-surface-200">
                        {thumbnail ? (
                          <img
                            src={thumbnail}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : hasVideo && post.videoThumbnail ? (
                          <div className="relative w-full h-full">
                            <img
                              src={post.videoThumbnail}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-soft-gradient-subtle">
                            <svg
                              className="w-4 h-4 text-soft-text-muted"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Post info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-soft-text-primary truncate group-hover:text-soft-primary transition-colors duration-150">
                          {post.postTopic || 'Untitled Post'}
                        </p>
                        {post.contentPillar && (
                          <span className="text-[10px] text-soft-text-muted">
                            {post.contentPillar}
                          </span>
                        )}
                      </div>

                      {/* Status */}
                      <div className="shrink-0">
                        <StatusBadge status={post.copyStatus} type="copy" size="sm" />
                      </div>

                      {/* Chevron */}
                      <svg
                        className="w-4 h-4 text-soft-surface-400 group-hover:text-soft-primary group-hover:translate-x-0.5 transition-all duration-150 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
