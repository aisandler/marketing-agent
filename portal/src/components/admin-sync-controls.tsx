'use client'

import { useSession } from 'next-auth/react'
import { SyncButton } from './sync-button'
import { formatDateTime } from '@/lib/date-utils'

interface AdminSyncControlsProps {
  lastSync: { createdAt: string | Date } | null
  pendingPushCount: number
}

export function AdminSyncControls({
  lastSync,
  pendingPushCount,
}: AdminSyncControlsProps) {
  const { data: session, status } = useSession()

  // Still loading
  if (status === 'loading') {
    return null
  }

  // Not admin - hide the entire section
  if (session?.user?.role !== 'admin') {
    return null
  }

  return (
    <details className="soft-card overflow-hidden group">
      <summary className="p-4 cursor-pointer hover:bg-soft-surface-100 transition-colors duration-150 flex items-center justify-between list-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-soft bg-soft-surface-200 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-soft-text-secondary"
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
          </div>
          <span className="font-medium text-soft-text-primary">
            Admin: Sync Controls
          </span>
        </div>
        <svg
          className="w-5 h-5 text-soft-text-muted transition-transform duration-200 group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>
      <div className="p-4 border-t border-soft-surface-300/60 space-y-4 bg-soft-surface-100/50">
        <SyncButton />
        <div className="text-sm text-soft-text-secondary">
          {lastSync ? (
            <div className="space-y-1">
              <p className="flex items-center gap-2">
                <span className="soft-status-dot soft-status-dot-active" />
                Last synced:{' '}
                <span className="font-medium text-soft-text-primary">
                  {formatDateTime(lastSync.createdAt)}
                </span>
              </p>
              {pendingPushCount > 0 && (
                <p className="flex items-center gap-2 text-soft-warning">
                  <span className="soft-status-dot soft-status-dot-warning" />
                  {pendingPushCount} changes pending upload
                </p>
              )}
            </div>
          ) : (
            <p className="text-soft-warning">
              No sync yet. Click the button above to load content from Airtable.
            </p>
          )}
        </div>
      </div>
    </details>
  )
}
