'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { syncFromAirtable, getSyncStatus } from '@/lib/actions'

type SyncStatus = {
  lastSync: { createdAt: Date } | null
  pendingPushCount: number
}

export function NavSyncStatus() {
  const { data: session } = useSession()
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)

  const isAdmin = session?.user?.role === 'admin'

  // Fetch sync status on mount and periodically
  useEffect(() => {
    async function fetchStatus() {
      try {
        const status = await getSyncStatus()
        setSyncStatus(status)
        if (status.lastSync?.createdAt) {
          setLastSyncTime(new Date(status.lastSync.createdAt))
        }
      } catch (error) {
        console.error('Failed to fetch sync status:', error)
      }
    }

    fetchStatus()
    // Refresh status every minute
    const interval = setInterval(fetchStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  // Calculate freshness
  const now = new Date()
  const minutesAgo = lastSyncTime
    ? Math.floor((now.getTime() - lastSyncTime.getTime()) / 1000 / 60)
    : null

  const isStale = minutesAgo !== null && minutesAgo > 15
  const isFresh = minutesAgo !== null && minutesAgo <= 15
  const hasPendingChanges = syncStatus?.pendingPushCount && syncStatus.pendingPushCount > 0

  // Format time ago
  let timeAgoLabel = 'Never synced'
  if (minutesAgo !== null) {
    if (minutesAgo < 1) {
      timeAgoLabel = 'Just now'
    } else if (minutesAgo < 60) {
      timeAgoLabel = `${minutesAgo}m ago`
    } else {
      const hours = Math.floor(minutesAgo / 60)
      timeAgoLabel = `${hours}h ago`
    }
  }

  async function handleSync() {
    // Rate limit: don't allow re-sync within 30 seconds
    if (lastSyncTime && (now.getTime() - lastSyncTime.getTime()) < 30000) {
      setResult('Please wait before syncing again')
      setTimeout(() => setResult(null), 3000)
      return
    }

    setSyncing(true)
    setResult(null)

    try {
      const syncResult = await syncFromAirtable()

      if (syncResult.success) {
        const parts = []
        if (syncResult.created) parts.push(`${syncResult.created} new`)
        if (syncResult.updated) parts.push(`${syncResult.updated} updated`)
        if (syncResult.deleted) parts.push(`${syncResult.deleted} removed`)
        setResult(parts.length > 0 ? parts.join(', ') : 'No changes')
        setLastSyncTime(new Date())

        // Refresh the page to show new data
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        setResult(`Error: ${syncResult.error}`)
      }
    } catch (error) {
      setResult(`Error: ${String(error)}`)
    } finally {
      setSyncing(false)
      // Clear result after 5 seconds (unless it's an error)
      setTimeout(() => {
        setResult((prev) => (prev?.startsWith('Error') ? prev : null))
      }, 5000)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Sync status indicator - visible to all */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <div
          className={`w-2 h-2 rounded-full ${
            hasPendingChanges
              ? 'bg-amber-400 animate-pulse'
              : isFresh
              ? 'bg-green-400'
              : isStale
              ? 'bg-yellow-400'
              : 'bg-gray-300'
          }`}
          title={
            hasPendingChanges
              ? `${syncStatus?.pendingPushCount} pending change(s) - sync recommended`
              : isFresh
              ? 'Data is fresh'
              : isStale
              ? 'Data may be stale'
              : 'Unknown'
          }
        />
        <span className="hidden sm:inline">
          {hasPendingChanges ? (
            <span className="text-amber-600 font-medium">Sync needed</span>
          ) : (
            timeAgoLabel
          )}
        </span>
      </div>

      {/* Sync button - admin only */}
      {isAdmin && (
        <button
          onClick={handleSync}
          disabled={syncing}
          className={`relative p-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            hasPendingChanges
              ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
          title={
            syncing
              ? 'Syncing...'
              : hasPendingChanges
              ? `Sync to push ${syncStatus?.pendingPushCount} pending change(s)`
              : 'Sync from Airtable'
          }
        >
          {/* Pulse ring for pending changes */}
          {hasPendingChanges && !syncing && (
            <span className="absolute inset-0 rounded-lg animate-ping bg-amber-400 opacity-20" />
          )}
          <svg
            className={`w-4 h-4 relative ${syncing ? 'animate-spin' : ''}`}
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
        </button>
      )}

      {/* Result toast */}
      {result && (
        <div
          className={`absolute top-full right-0 mt-2 px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap ${
            result.startsWith('Error')
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}
        >
          {result}
        </div>
      )}
    </div>
  )
}
