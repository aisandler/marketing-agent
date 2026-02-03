'use client'

import { StatusBadge } from './status-badge'

interface SourcePostData {
  id: string
  postTopic: string | null
  postingAccount: string
  platform: string | null
  copy: string | null
  copyStatus: string
  date: Date | null
}

interface SourcePostSectionProps {
  sourcePost: SourcePostData
  partnerId: string
}

/**
 * Displays the original post's content when viewing a repost
 * Partners can see what content will be "reposted" and navigate to the original for editing
 */
export function SourcePostSection({ sourcePost, partnerId }: SourcePostSectionProps) {
  const formattedDate = sourcePost.date
    ? new Date(sourcePost.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Not scheduled'

  return (
    <div className="bg-white shadow-sm rounded-xl border border-blue-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-blue-50 border-b border-blue-100">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <h2 className="text-sm font-semibold text-blue-800">Original Post Being Reposted</h2>
        </div>
        <p className="text-xs text-blue-600 mt-1">
          This repost will share the content from the original post below
        </p>
      </div>

      {/* Original Post Info */}
      <div className="p-4 space-y-3">
        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-medium text-gray-700">{sourcePost.postingAccount}</span>
          <span className="text-gray-400">&bull;</span>
          <span className="text-gray-500">{formattedDate}</span>
          <StatusBadge status={sourcePost.copyStatus} />
        </div>

        {/* Topic */}
        {sourcePost.postTopic && (
          <h3 className="font-medium text-gray-900">{sourcePost.postTopic}</h3>
        )}

        {/* Copy */}
        <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
          {sourcePost.copy || (
            <span className="text-gray-400 italic">No copy written yet</span>
          )}
        </div>

        {/* Link to original */}
        <a
          href={`/review/${sourcePost.id}?partner=${partnerId}`}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit Original Post
        </a>
      </div>
    </div>
  )
}
