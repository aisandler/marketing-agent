'use client'

interface DashboardStatsProps {
  draft: number
  needsReview: number
  needsRevision: number
  approved: number
  onFilterChange?: (filter: 'all' | 'draft' | 'review' | 'revision' | 'approved') => void
  activeFilter?: 'all' | 'draft' | 'review' | 'revision' | 'approved'
}

export function DashboardStats({
  draft,
  needsReview,
  needsRevision,
  approved,
  onFilterChange,
  activeFilter = 'all',
}: DashboardStatsProps) {
  const stats = [
    {
      key: 'draft' as const,
      count: draft,
      label: 'Draft',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-600',
      activeBg: 'bg-gray-100',
    },
    {
      key: 'review' as const,
      count: needsReview,
      label: 'Review',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700',
      activeBg: 'bg-yellow-100',
    },
    {
      key: 'revision' as const,
      count: needsRevision,
      label: 'Revision',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      activeBg: 'bg-red-100',
    },
    {
      key: 'approved' as const,
      count: approved,
      label: 'Approved',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      activeBg: 'bg-green-100',
    },
  ]

  return (
    <div className="space-y-2">
      {stats.map((stat) => (
        <button
          key={stat.key}
          onClick={() => onFilterChange?.(activeFilter === stat.key ? 'all' : stat.key)}
          className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-150
            ${activeFilter === stat.key ? stat.activeBg : stat.bgColor}
            ${stat.borderColor}
            ${onFilterChange ? 'hover:shadow-sm cursor-pointer' : ''}
          `}
        >
          <span className={`text-sm font-medium ${stat.textColor}`}>{stat.label}</span>
          <span className={`text-lg font-bold ${stat.textColor}`}>{stat.count}</span>
        </button>
      ))}
    </div>
  )
}

// Horizontal stats bar for mobile - always shows all 4 statuses
export function DashboardStatsBar({
  draft,
  needsReview,
  needsRevision,
  approved,
}: Omit<DashboardStatsProps, 'onFilterChange' | 'activeFilter'>) {
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-xs">
      <div className="flex items-center gap-1">
        <span className="font-bold text-gray-600">{draft}</span>
        <span className="text-gray-500">Draft</span>
      </div>
      <div className="w-px h-4 bg-gray-200" />
      <div className="flex items-center gap-1">
        <span className="font-bold text-yellow-600">{needsReview}</span>
        <span className="text-yellow-600">Review</span>
      </div>
      <div className="w-px h-4 bg-gray-200" />
      <div className="flex items-center gap-1">
        <span className="font-bold text-red-600">{needsRevision}</span>
        <span className="text-red-600">Revision</span>
      </div>
      <div className="w-px h-4 bg-gray-200" />
      <div className="flex items-center gap-1">
        <span className="font-bold text-green-600">{approved}</span>
        <span className="text-green-600">✓</span>
      </div>
    </div>
  )
}

// Legacy compact version (kept for backwards compat)
export function DashboardStatsCompact({
  draft,
  needsReview,
  needsRevision,
  approved,
}: Omit<DashboardStatsProps, 'onFilterChange' | 'activeFilter'>) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {draft > 0 && (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border bg-gray-50 border-gray-200">
          <span className="text-xs font-bold text-gray-600">{draft}</span>
          <span className="text-xs text-gray-500">Draft</span>
        </div>
      )}
      {needsReview > 0 && (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border bg-yellow-50 border-yellow-200">
          <span className="text-xs font-bold text-yellow-700">{needsReview}</span>
          <span className="text-xs text-yellow-600">Review</span>
        </div>
      )}
      {needsRevision > 0 && (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border bg-red-50 border-red-200">
          <span className="text-xs font-bold text-red-700">{needsRevision}</span>
          <span className="text-xs text-red-600">Revision</span>
        </div>
      )}
      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border bg-green-50 border-green-200">
        <span className="text-xs font-bold text-green-700">{approved}</span>
        <span className="text-xs text-green-600">✓</span>
      </div>
    </div>
  )
}
