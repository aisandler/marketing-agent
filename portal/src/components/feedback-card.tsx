'use client'

import { useState } from 'react'
import { applyEdit, dismissFeedback } from '@/lib/actions'
import { useRouter } from 'next/navigation'
import type { PartnerFeedback, AirtablePost } from '@prisma/client'
import { formatDateTime, formatDate } from '@/lib/date-utils'

interface FeedbackCardProps {
  feedback: PartnerFeedback & { post: AirtablePost }
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showDiff, setShowDiff] = useState(false)

  async function handleApply() {
    setLoading(true)
    try {
      await applyEdit(feedback.id)
      router.refresh()
    } catch (error) {
      console.error('Failed to apply edit:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDismiss() {
    setLoading(true)
    try {
      await dismissFeedback(feedback.id)
      router.refresh()
    } catch (error) {
      console.error('Failed to dismiss feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  const isEdit = feedback.feedbackType === 'edit'
  const isRevisionRequest = feedback.feedbackType === 'revision_request'

  return (
    <div
      className={`border rounded-lg p-4 ${
        isEdit ? 'border-blue-200 bg-blue-50/50' : 'border-red-200 bg-red-50/50'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                isEdit
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {isEdit ? 'Edit Submitted' : 'Revision Requested'}
            </span>
            <span className="text-xs text-gray-500">
              {formatDateTime(feedback.createdAt)}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            From: <span className="font-medium">{feedback.partnerAccount}</span>
          </p>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-sm font-medium text-gray-700 mb-1">Post:</p>
        <p className="text-sm text-gray-600">
          {feedback.post.postTopic || 'Untitled'} -{' '}
          {feedback.post.date
            ? formatDate(feedback.post.date)
            : 'No date'}
        </p>
      </div>

      {isRevisionRequest && feedback.revisionNotes && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">
            Revision Notes:
          </p>
          <div className="bg-white rounded p-3 text-sm whitespace-pre-wrap border border-red-200">
            {feedback.revisionNotes}
          </div>
        </div>
      )}

      {isEdit && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">Copy Changes:</p>
            <button
              onClick={() => setShowDiff(!showDiff)}
              className="text-xs text-brand-primary hover:underline"
            >
              {showDiff ? 'Hide original' : 'Show original'}
            </button>
          </div>

          {showDiff && feedback.originalCopy && (
            <div className="mb-2">
              <p className="text-xs text-gray-500 mb-1">Original:</p>
              <div className="bg-red-50 rounded p-3 text-sm whitespace-pre-wrap border border-red-200 line-through text-gray-500">
                {feedback.originalCopy}
              </div>
            </div>
          )}

          <div>
            {showDiff && <p className="text-xs text-gray-500 mb-1">Edited:</p>}
            <div className="bg-green-50 rounded p-3 text-sm whitespace-pre-wrap border border-green-200">
              {feedback.editedCopy}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-3 border-t border-gray-200">
        {isEdit && (
          <button
            onClick={handleApply}
            disabled={loading}
            className="flex-1 inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50"
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
            Apply Edit
          </button>
        )}

        <button
          onClick={handleDismiss}
          disabled={loading}
          className={`${
            isEdit ? 'flex-1' : 'w-full'
          } inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md disabled:opacity-50`}
        >
          {isRevisionRequest ? 'Mark as Addressed' : 'Dismiss'}
        </button>
      </div>
    </div>
  )
}
