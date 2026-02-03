'use client'

interface RepostIndicatorProps {
  size?: 'sm' | 'md'
  className?: string
}

/**
 * Badge indicating a post is a repost of another post
 */
export function RepostIndicator({ size = 'sm', className = '' }: RepostIndicatorProps) {
  const sizeClasses = size === 'sm'
    ? 'text-[10px] px-1.5 py-0.5 gap-0.5'
    : 'text-xs px-2 py-1 gap-1'

  const iconSize = size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'

  return (
    <span
      className={`inline-flex items-center rounded font-medium bg-blue-100 text-blue-700 ${sizeClasses} ${className}`}
      title="This is a repost of another post"
    >
      <svg
        className={iconSize}
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
      Repost
    </span>
  )
}
