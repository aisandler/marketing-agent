import type { PartnerFeedback } from '@prisma/client'
import { formatDateTime } from '@/lib/date-utils'

interface FeedbackHistoryProps {
  feedback: PartnerFeedback[]
}

const feedbackTypeLabels: Record<string, string> = {
  approval: 'Approved',
  edit: 'Edit Submitted',
  revision_request: 'Revision Requested',
}

const feedbackTypeStyles: Record<string, string> = {
  approval: 'bg-green-100 text-green-800',
  edit: 'bg-blue-100 text-blue-800',
  revision_request: 'bg-red-100 text-red-800',
}

const statusLabels: Record<string, string> = {
  pending: 'Pending Review',
  applied: 'Applied',
  dismissed: 'Dismissed',
}

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  applied: 'bg-green-100 text-green-800',
  dismissed: 'bg-gray-100 text-gray-800',
}

export function FeedbackHistory({ feedback }: FeedbackHistoryProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Feedback History
      </h2>
      <div className="space-y-4">
        {feedback.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    feedbackTypeStyles[item.feedbackType] || 'bg-gray-100'
                  }`}
                >
                  {feedbackTypeLabels[item.feedbackType] || item.feedbackType}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    statusStyles[item.status] || 'bg-gray-100'
                  }`}
                >
                  {statusLabels[item.status] || item.status}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {formatDateTime(item.createdAt)}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-2">
              From: {item.partnerAccount}
            </p>

            {item.feedbackType === 'edit' && item.editedCopy && (
              <div className="mt-3">
                <p className="text-xs font-medium text-gray-500 mb-1">
                  Edited Copy:
                </p>
                <div className="bg-blue-50 rounded p-3 text-sm whitespace-pre-wrap">
                  {item.editedCopy}
                </div>
              </div>
            )}

            {item.feedbackType === 'revision_request' && item.revisionNotes && (
              <div className="mt-3">
                <p className="text-xs font-medium text-gray-500 mb-1">
                  Revision Notes:
                </p>
                <div className="bg-red-50 rounded p-3 text-sm whitespace-pre-wrap">
                  {item.revisionNotes}
                </div>
              </div>
            )}

            {item.appliedAt && (
              <p className="text-xs text-gray-400 mt-2">
                {item.status === 'applied' ? 'Applied' : 'Dismissed'} on{' '}
                {formatDateTime(item.appliedAt)}
                {item.appliedBy && ` by ${item.appliedBy}`}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
