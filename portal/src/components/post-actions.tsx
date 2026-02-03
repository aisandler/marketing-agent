'use client'

import { useState } from 'react'
import { approvePost, submitEdit, requestRevision, approveCopyForAllPlatforms } from '@/lib/actions'
import { useRouter } from 'next/navigation'

interface RelatedPost {
  id: string
  postingAccount: string
  platform: string | null
  copyStatus: string | null
}

interface PostActionsProps {
  postId: string
  partnerId: string
  postingAccount: string
  currentCopy: string
  copyStatus: string | null
  relatedPosts?: RelatedPost[]
}

export function PostActions({
  postId,
  partnerId,
  postingAccount,
  currentCopy,
  copyStatus,
  relatedPosts = [],
}: PostActionsProps) {
  const router = useRouter()
  const [activeModal, setActiveModal] = useState<
    'edit' | 'revision' | 'batch-approve' | null
  >(null)
  const [editedCopy, setEditedCopy] = useState(currentCopy)
  const [revisionNotes, setRevisionNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isApproved = copyStatus === 'Approved'

  // Count unapproved related posts (including current post if not approved)
  const unapprovedRelatedPosts = relatedPosts.filter(p => p.copyStatus !== 'Approved')
  const hasUnapprovedRelated = unapprovedRelatedPosts.length > 0
  const totalPostsToApprove = (isApproved ? 0 : 1) + unapprovedRelatedPosts.length
  const showBatchApprove = relatedPosts.length > 0 && totalPostsToApprove > 1

  async function handleApprove() {
    setLoading(true)
    setError(null)

    try {
      const result = await approvePost(postId, postingAccount)
      if (result.success) {
        router.refresh()
      } else {
        setError(result.error || 'Failed to approve')
      }
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmitEdit() {
    if (!editedCopy.trim()) {
      setError('Copy cannot be empty')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await submitEdit(postId, postingAccount, editedCopy)
      if (result.success) {
        setActiveModal(null)
        router.refresh()
      } else {
        setError(result.error || 'Failed to submit edit')
      }
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  async function handleRequestRevision() {
    if (!revisionNotes.trim()) {
      setError('Please provide revision notes')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await requestRevision(postId, postingAccount, revisionNotes)
      if (result.success) {
        setActiveModal(null)
        setRevisionNotes('')
        router.refresh()
      } else {
        setError(result.error || 'Failed to request revision')
      }
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  async function handleBatchApprove() {
    setLoading(true)
    setError(null)

    try {
      const result = await approveCopyForAllPlatforms(postId, postingAccount)
      if (result.success) {
        setActiveModal(null)
        router.refresh()
      } else {
        setError(result.error || 'Failed to approve all platforms')
      }
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {isApproved ? (
          <div className="bg-green-50 border border-green-200 rounded p-4 text-green-700">
            This post has been approved. Changes can still be made through the
            edit function.
          </div>
        ) : (
          <p className="text-gray-600 text-sm mb-4">
            Review the content above and take action:
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleApprove}
            disabled={loading || isApproved}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {isApproved ? 'Already Approved' : 'Approve'}
          </button>

          <button
            onClick={() => {
              setEditedCopy(currentCopy)
              setActiveModal('edit')
            }}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:opacity-50"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Copy
          </button>

          <button
            onClick={() => setActiveModal('revision')}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md shadow-sm text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Request Revision
          </button>
        </div>

        {/* Batch Approval Section */}
        {showBatchApprove && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setActiveModal('batch-approve')}
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-4 py-3 border-2 border-brand-primary text-sm font-medium rounded-md text-brand-primary bg-white hover:bg-brand-primary/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              Approve Copy for All Platforms ({totalPostsToApprove})
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Approves copy on this post and {relatedPosts.length} related {relatedPosts.length === 1 ? 'post' : 'posts'}
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {activeModal === 'edit' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Edit Post Copy</h3>
              <p className="text-sm text-gray-500 mt-1">
                Make your changes below. The admin will review and apply the edit.
              </p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Copy
              </label>
              <textarea
                value={editedCopy}
                onChange={(e) => setEditedCopy(e.target.value)}
                rows={10}
                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-brand-accent focus:border-brand-accent"
                placeholder="Enter your edited copy..."
              />
              {editedCopy !== currentCopy && (
                <p className="mt-2 text-sm text-yellow-600">
                  You have made changes to the original copy.
                </p>
              )}
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitEdit}
                disabled={loading || editedCopy === currentCopy}
                className="px-4 py-2 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 rounded-md disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Edit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revision Request Modal */}
      {activeModal === 'revision' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Request Revision</h3>
              <p className="text-sm text-gray-500 mt-1">
                Describe what changes you&apos;d like made to this post.
              </p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Revision Notes
              </label>
              <textarea
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                rows={6}
                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-brand-accent focus:border-brand-accent"
                placeholder="Describe the changes you'd like to see..."
              />
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setActiveModal(null)
                  setRevisionNotes('')
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestRevision}
                disabled={loading || !revisionNotes.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Approval Confirmation Modal */}
      {activeModal === 'batch-approve' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Approve All Platforms</h3>
              <p className="text-sm text-gray-500 mt-1">
                This will approve the copy for all linked posts.
              </p>
            </div>
            <div className="p-6">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>{totalPostsToApprove} {totalPostsToApprove === 1 ? 'post' : 'posts'}</strong> will be approved:
                </p>
                <ul className="mt-2 text-sm text-blue-700 space-y-1">
                  {!isApproved && (
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      {postingAccount} (current)
                    </li>
                  )}
                  {relatedPosts
                    .filter(p => p.copyStatus !== 'Approved')
                    .map(p => (
                      <li key={p.id} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        {p.postingAccount}
                      </li>
                    ))}
                </ul>
              </div>
              <p className="text-sm text-gray-600">
                Images and other platform-specific content will remain unchanged.
              </p>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleBatchApprove}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 rounded-md disabled:opacity-50"
              >
                {loading ? 'Approving...' : `Approve All (${totalPostsToApprove})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
