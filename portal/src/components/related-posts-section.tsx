import Link from 'next/link'
import { PlatformBadge } from './platform-badge'
import { StatusBadge } from './status-badge'

interface RelatedPost {
  id: string
  postingAccount: string
  platform: string | null
  copyStatus: string | null
  postStatus: string | null
  postTopic: string | null
}

interface RelatedPostsSectionProps {
  currentPostId: string
  relatedPosts: RelatedPost[]
  partnerId: string
}

export function RelatedPostsSection({
  currentPostId,
  relatedPosts,
  partnerId,
}: RelatedPostsSectionProps) {
  if (relatedPosts.length === 0) {
    return null
  }

  // Check if any related posts have mismatched approval status
  const hasApprovalMismatch = relatedPosts.some(
    (p) => p.copyStatus !== 'Approved'
  ) && relatedPosts.some(
    (p) => p.copyStatus === 'Approved'
  )

  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-brand-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900">
            Cross-Platform Posts
          </h2>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          This content is also scheduled for other platforms. Copy is shared, images differ.
        </p>
      </div>

      {/* Related posts list */}
      <div className="divide-y divide-gray-100">
        {relatedPosts.map((post) => (
          <Link
            key={post.id}
            href={`/review/${post.id}?partner=${partnerId}`}
            className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
          >
            <PlatformBadge platform={post.platform} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {post.postingAccount}
              </p>
              {post.postTopic && (
                <p className="text-xs text-gray-500 truncate">
                  {post.postTopic}
                </p>
              )}
            </div>
            <StatusBadge status={post.copyStatus} size="sm" />
            <svg
              className="w-4 h-4 text-gray-400"
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
          </Link>
        ))}
      </div>

      {/* Warning for mismatched approval status */}
      {hasApprovalMismatch && (
        <div className="p-4 bg-amber-50 border-t border-amber-100">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-amber-500 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-sm text-amber-700">
              Copy has been approved on some platforms but not others. Consider approving all platforms together.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
