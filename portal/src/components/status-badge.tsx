interface StatusBadgeProps {
  status: string | null
  type?: 'copy' | 'post'
  size?: 'sm' | 'default'
}

const statusConfig: Record<string, { bg: string; text: string; label?: string }> = {
  Draft: {
    bg: 'bg-soft-surface-200',
    text: 'text-soft-text-secondary',
  },
  Drafting: {
    bg: 'bg-soft-surface-200',
    text: 'text-soft-text-secondary',
    label: 'Draft',
  },
  'Ready for Review': {
    bg: 'bg-soft-warning-muted',
    text: 'text-amber-700',
    label: 'Review',
  },
  Approved: {
    bg: 'bg-soft-success-muted',
    text: 'text-emerald-700',
  },
  'Needs Revision': {
    bg: 'bg-soft-error-muted',
    text: 'text-red-600',
    label: 'Revision',
  },
  Scheduled: {
    bg: 'bg-soft-secondary-muted',
    text: 'text-cyan-700',
  },
  Posted: {
    bg: 'bg-soft-primary-muted',
    text: 'text-soft-primary',
  },
}

export function StatusBadge({ status, type = 'post', size = 'default' }: StatusBadgeProps) {
  const displayStatus = status || 'Draft'
  const config = statusConfig[displayStatus] || statusConfig.Draft
  const label = config.label || displayStatus

  const sizeClasses = size === 'sm'
    ? 'px-1.5 py-0.5 text-[10px]'
    : 'px-2 py-0.5 text-xs'

  return (
    <span
      className={`inline-flex items-center rounded-soft-sm font-medium ${config.bg} ${config.text} ${sizeClasses}`}
    >
      {label}
    </span>
  )
}
