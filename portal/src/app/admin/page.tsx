import { Suspense } from 'react'
import { getPendingFeedback, getAllPosts, getSyncStatus, getImageFeedbackStats } from '@/lib/actions'
import { formatDateTime } from '@/lib/date-utils'

// Force dynamic rendering (don't try to query DB at build time)
export const dynamic = 'force-dynamic'
import { SyncButton } from '@/components/sync-button'
import { FeedbackCard } from '@/components/feedback-card'
import { StatusBadge } from '@/components/status-badge'
import { ImageFeedbackPanel } from '@/components/image-feedback-panel'

async function PendingFeedbackList() {
  const feedback = await getPendingFeedback()

  if (feedback.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No pending feedback</p>
        <p className="text-sm text-gray-400 mt-1">
          Partners haven&apos;t submitted any edits or revision requests yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {feedback.map((item) => (
        <FeedbackCard key={item.id} feedback={item} />
      ))}
    </div>
  )
}

async function PostsSummary() {
  const posts = await getAllPosts()

  const stats = {
    total: posts.length,
    drafting: posts.filter((p) => p.postStatus === 'Drafting').length,
    readyForReview: posts.filter((p) => p.postStatus === 'Ready for Review')
      .length,
    approved: posts.filter((p) => p.postStatus === 'Approved').length,
    scheduled: posts.filter((p) => p.postStatus === 'Scheduled').length,
    posted: posts.filter((p) => p.postStatus === 'Posted').length,
    needsRevision: posts.filter((p) => p.postStatus === 'Needs Revision').length,
    pendingPush: posts.filter((p) => p.syncStatus === 'pending_push').length,
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        <div className="text-sm text-gray-500">Total Posts</div>
      </div>
      <div className="bg-yellow-50 rounded-lg shadow p-4">
        <div className="text-2xl font-bold text-yellow-700">
          {stats.readyForReview}
        </div>
        <div className="text-sm text-yellow-600">Ready for Review</div>
      </div>
      <div className="bg-green-50 rounded-lg shadow p-4">
        <div className="text-2xl font-bold text-green-700">{stats.approved}</div>
        <div className="text-sm text-green-600">Approved</div>
      </div>
      <div className="bg-red-50 rounded-lg shadow p-4">
        <div className="text-2xl font-bold text-red-700">
          {stats.needsRevision}
        </div>
        <div className="text-sm text-red-600">Needs Revision</div>
      </div>
      <div className="bg-gray-50 rounded-lg shadow p-4">
        <div className="text-2xl font-bold text-gray-700">{stats.drafting}</div>
        <div className="text-sm text-gray-600">Drafting</div>
      </div>
      <div className="bg-blue-50 rounded-lg shadow p-4">
        <div className="text-2xl font-bold text-blue-700">{stats.scheduled}</div>
        <div className="text-sm text-blue-600">Scheduled</div>
      </div>
      <div className="bg-purple-50 rounded-lg shadow p-4">
        <div className="text-2xl font-bold text-purple-700">{stats.posted}</div>
        <div className="text-sm text-purple-600">Posted</div>
      </div>
      <div className="bg-orange-50 rounded-lg shadow p-4">
        <div className="text-2xl font-bold text-orange-700">
          {stats.pendingPush}
        </div>
        <div className="text-sm text-orange-600">Pending Push</div>
      </div>
    </div>
  )
}

async function ImageFeedbackSection() {
  const stats = await getImageFeedbackStats()
  return <ImageFeedbackPanel stats={stats} />
}

async function RecentPostsTable() {
  const posts = await getAllPosts()

  // Get posts that need attention (ready for review or needs revision)
  const needsAttention = posts.filter(
    (p) =>
      p.postStatus === 'Ready for Review' || p.postStatus === 'Needs Revision'
  )

  if (needsAttention.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No posts need attention</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Topic
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Account
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Feedback
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {needsAttention.slice(0, 20).map((post) => (
            <tr key={post.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {post.date
                  ? new Date(post.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  : '-'}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                {post.postTopic || 'Untitled'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {post.postingAccount}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <StatusBadge status={post.postStatus} />
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                {post.feedback.filter((f) => f.status === 'pending').length > 0 ? (
                  <span className="text-yellow-600">
                    {post.feedback.filter((f) => f.status === 'pending').length}{' '}
                    pending
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default async function AdminPage() {
  const syncStatus = await getSyncStatus()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">
            Manage partner feedback and sync with Airtable
          </p>
        </div>
        <SyncButton />
      </div>

      {syncStatus.lastSync && (
        <div className="bg-white shadow rounded-lg p-4">
          <div className="text-sm text-gray-600">
            Last sync:{' '}
            {formatDateTime(syncStatus.lastSync.createdAt)}
            {syncStatus.pendingPushCount > 0 && (
              <span className="ml-4 text-orange-600 font-medium">
                {syncStatus.pendingPushCount} changes pending push to Airtable
              </span>
            )}
          </div>
        </div>
      )}

      <Suspense
        fallback={
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 animate-pulse rounded-lg h-20"
              />
            ))}
          </div>
        }
      >
        <PostsSummary />
      </Suspense>

      {/* Image Feedback Stats */}
      <Suspense
        fallback={
          <div className="bg-gray-100 animate-pulse rounded-lg h-48" />
        }
      >
        <ImageFeedbackSection />
      </Suspense>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Pending Partner Feedback
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Review and apply partner edits or address revision requests
          </p>
        </div>
        <div className="p-6">
          <Suspense
            fallback={
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded h-32" />
                ))}
              </div>
            }
          >
            <PendingFeedbackList />
          </Suspense>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Posts Needing Attention
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Posts that are ready for review or need revision
          </p>
        </div>
        <Suspense
          fallback={
            <div className="p-6">
              <div className="animate-pulse bg-gray-100 rounded h-40" />
            </div>
          }
        >
          <RecentPostsTable />
        </Suspense>
      </div>
    </div>
  )
}
