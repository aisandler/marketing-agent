interface PlatformBadgeProps {
  platform: string | null
  size?: 'sm' | 'md'
}

const platformConfig: Record<string, { bg: string; text: string; icon: string }> = {
  LinkedIn: {
    bg: 'bg-blue-600',
    text: 'text-white',
    icon: 'in',
  },
  Instagram: {
    bg: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400',
    text: 'text-white',
    icon: 'IG',
  },
  Facebook: {
    bg: 'bg-blue-500',
    text: 'text-white',
    icon: 'fb',
  },
  TikTok: {
    bg: 'bg-black',
    text: 'text-white',
    icon: 'TT',
  },
  X: {
    bg: 'bg-black',
    text: 'text-white',
    icon: 'X',
  },
}

export function PlatformBadge({ platform, size = 'md' }: PlatformBadgeProps) {
  const p = platform || 'LinkedIn'
  const config = platformConfig[p] || platformConfig.LinkedIn

  const sizeClasses = size === 'sm'
    ? 'w-8 h-8 text-xs'
    : 'w-10 h-10 text-sm'

  return (
    <div
      className={`${sizeClasses} ${config.bg} ${config.text} rounded-lg flex items-center justify-center font-bold shrink-0`}
      title={p}
    >
      {config.icon}
    </div>
  )
}

export function PlatformLabel({ platform }: { platform: string | null }) {
  const p = platform || 'LinkedIn'
  const config = platformConfig[p] || platformConfig.LinkedIn

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${config.bg} ${config.text}`}
    >
      {p}
    </span>
  )
}
