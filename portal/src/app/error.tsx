'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">Something went wrong</h1>
        <p className="mt-4 text-gray-600">
          An error occurred while loading this page.
        </p>
        <div className="mt-6 flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-brand-primary text-white rounded-md hover:bg-brand-primary/90 transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  )
}
