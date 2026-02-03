'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { syncFromAirtable, seedPartners } from '@/lib/actions'

export function SyncButton() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  // Only show for admin users
  if (session?.user?.role !== 'admin') {
    return null
  }

  async function handleSync() {
    setLoading(true)
    setResult(null)

    try {
      // Ensure partners are seeded
      await seedPartners()

      // Sync from Airtable
      const syncResult = await syncFromAirtable()

      if (syncResult.success) {
        const parts = []
        if (syncResult.created) parts.push(`${syncResult.created} new`)
        if (syncResult.updated) parts.push(`${syncResult.updated} updated`)
        if (syncResult.deleted) parts.push(`${syncResult.deleted} removed`)
        setResult(
          parts.length > 0
            ? `Synced: ${parts.join(', ')}`
            : 'Synced: No changes'
        )
      } else {
        setResult(`Error: ${syncResult.error}`)
      }
    } catch (error) {
      setResult(`Error: ${String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={handleSync}
        disabled={loading}
        className="soft-btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Syncing...
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4"
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
            Sync from Airtable
          </>
        )}
      </button>
      {result && (
        <span
          className={`text-sm font-medium flex items-center gap-1.5 ${
            result.startsWith('Error')
              ? 'text-soft-error'
              : 'text-soft-success'
          }`}
        >
          {result.startsWith('Error') ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
          {result}
        </span>
      )}
    </div>
  )
}
