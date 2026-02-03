'use client'

import { useState } from 'react'
import { approveImage, rejectImage } from '@/lib/actions'
import { useRouter } from 'next/navigation'

interface ImageActionsProps {
  postId: string
  postingAccount: string
  assetStatus: string | null
  hasImage: boolean
  imageBrief: string | null
}

export function ImageActions({
  postId,
  postingAccount,
  assetStatus,
  hasImage,
  imageBrief,
}: ImageActionsProps) {
  const router = useRouter()
  const [activeModal, setActiveModal] = useState<'reject' | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isApproved = assetStatus === 'Approved'
  const needsRevision = assetStatus === 'Needs Revision'

  // Don't show anything if no image and no brief
  if (!hasImage && !imageBrief) {
    return null
  }

  // Show pending state if no image but has brief
  if (!hasImage) {
    return (
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-500">Image pending generation</p>
        {imageBrief && (
          <p className="text-xs text-gray-400 mt-1 italic">Brief: {imageBrief.slice(0, 100)}...</p>
        )}
      </div>
    )
  }

  async function handleApprove() {
    setLoading(true)
    setError(null)

    try {
      const result = await approveImage(postId, postingAccount)
      if (result.success) {
        router.refresh()
      } else {
        setError(result.error || 'Failed to approve image')
      }
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  async function handleReject() {
    if (!rejectionReason.trim()) {
      setError('Please provide feedback on why this image needs revision')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await rejectImage(postId, postingAccount, rejectionReason)
      if (result.success) {
        setActiveModal(null)
        setRejectionReason('')
        router.refresh()
      } else {
        setError(result.error || 'Failed to submit feedback')
      }
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Status & Actions */}
      <div className="mt-4">
        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {isApproved ? (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">Image Approved</span>
          </div>
        ) : needsRevision ? (
          <div className="flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm font-medium">New image requested</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleApprove}
              disabled={loading}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Approve Image
            </button>

            <button
              onClick={() => setActiveModal('reject')}
              disabled={loading}
              className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Request New Image
            </button>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {activeModal === 'reject' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Request New Image</h3>
              <p className="text-sm text-gray-500 mt-1">
                Help us understand what changes you&apos;d like to see.
              </p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What&apos;s wrong with this image?
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-brand-accent focus:border-brand-accent"
                placeholder="e.g., Too generic, doesn't match our brand, needs more modern feel, wrong color palette..."
              />
              <div className="mt-3 text-xs text-gray-500">
                <p className="font-medium mb-1">Common feedback:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Too generic/stock photo',
                    'Doesn\'t feel modern',
                    'Wrong tone/mood',
                    'Colors don\'t match brand',
                    'Concept doesn\'t fit topic',
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setRejectionReason(prev =>
                        prev ? `${prev}, ${suggestion.toLowerCase()}` : suggestion
                      )}
                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setActiveModal(null)
                  setRejectionReason('')
                  setError(null)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={loading || !rejectionReason.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
