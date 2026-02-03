import { notFound, redirect } from 'next/navigation'
import { getPostById, getRelatedPosts } from '@/lib/actions'
import { PARTNER_NAMES } from '@/lib/constants'
import { StatusBadge } from '@/components/status-badge'
import { PlatformBadge, PlatformLabel } from '@/components/platform-badge'
import { PostActions } from '@/components/post-actions'
import { ImageActions } from '@/components/image-actions'
import { FeedbackHistory } from '@/components/feedback-history'
import { ImageCarousel, ImageData } from '@/components/social-feed/image-carousel'
import { RelatedPostsSection } from '@/components/related-posts-section'
import { RepostIndicator } from '@/components/repost-indicator'
import { SourcePostSection } from '@/components/source-post-section'

// Parse images JSON safely
function parseImages(imagesJson: string | null, fallbackUrl: string | null, fallbackThumb: string | null): ImageData[] {
  if (imagesJson) {
    try {
      return JSON.parse(imagesJson)
    } catch {
      // Fall through to fallback
    }
  }
  // Fallback to deprecated single image fields
  if (fallbackUrl || fallbackThumb) {
    return [{ url: fallbackUrl || fallbackThumb || '', thumbnail: fallbackThumb || fallbackUrl || '' }]
  }
  return []
}

interface PostDetailPageProps {
  params: Promise<{ postId: string }>
  searchParams: Promise<{
    partner?: string
    view?: string
    channel?: string
    week?: string
    status?: string
  }>
}

export default async function PostDetailPage({
  params,
  searchParams,
}: PostDetailPageProps) {
  const { postId } = await params
  const { partner: partnerId, view, channel, week, status } = await searchParams

  if (!partnerId) {
    redirect('/')
  }

  // Build back URL preserving all filter state
  const backParams = new URLSearchParams()
  backParams.set('partner', partnerId)
  if (view) backParams.set('view', view)
  if (channel) backParams.set('channel', channel)
  if (week) backParams.set('week', week)
  if (status) backParams.set('status', status)
  const backUrl = `/review?${backParams.toString()}`

  const [post, relatedPosts] = await Promise.all([
    getPostById(postId),
    getRelatedPosts(postId),
  ])

  if (!post) {
    notFound()
  }

  const partnerName = PARTNER_NAMES[partnerId] || partnerId
  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Not scheduled'

  // Check if this is a repost
  const isRepost = post.postType === 'Repost' || !!post.sourcePost

  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
      {/* Back button */}
      <a
        href={backUrl}
        className="inline-flex items-center text-sm text-gray-600 hover:text-brand-primary"
      >
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to all posts
      </a>

      {/* Header Card */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        {/* Platform & Date Banner */}
        <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-100">
          <div className="flex items-start gap-4">
            <PlatformBadge platform={post.platform} size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <PlatformLabel platform={post.platform} />
                <StatusBadge status={post.copyStatus} />
                {isRepost && <RepostIndicator size="md" />}
              </div>
              <p className="text-lg sm:text-xl font-semibold text-gray-900">
                {formattedDate}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                {post.postingAccount}
              </p>
            </div>
          </div>
        </div>

        {/* Topic */}
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">
            {post.postTopic || 'Untitled Post'}
          </h1>
          {(post.contentPillar || post.focus) && (
            <div className="flex flex-wrap gap-2 mt-2">
              {post.contentPillar && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {post.contentPillar}
                </span>
              )}
              {post.focus && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {post.focus}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Copy */}
        <div className="p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Post Copy
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700 text-sm sm:text-base leading-relaxed">
            {post.copy || (
              <span className="text-gray-400 italic">No copy written yet</span>
            )}
          </div>
        </div>

        {/* Media (Video or Images) with Image Approval - Don't show for reposts */}
        {(() => {
          // Reposts share the original post's content, so no dedicated media
          if (isRepost) return null

          const images = parseImages(post.images, post.imageUrl, post.imageThumbnail)
          const hasVideo = !!post.videoUrl
          const hasImages = images.length > 0

          // Show section if there's media OR an image brief (pending image)
          if (!hasVideo && !hasImages && !post.imageBrief) return null

          return (
            <div className="p-4 sm:p-6 border-t border-gray-100">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Media
              </h2>
              {hasVideo ? (
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <video
                    src={post.videoUrl!}
                    poster={post.videoThumbnail || images[0]?.thumbnail || undefined}
                    controls
                    className="w-full h-full object-contain"
                    preload="metadata"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Video
                  </div>
                </div>
              ) : hasImages ? (
                <div className="rounded-lg overflow-hidden">
                  <ImageCarousel images={images} alt={post.postTopic || 'Post image'} aspectRatio="landscape" />
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
                  <svg className="w-10 h-10 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">Image pending generation</p>
                </div>
              )}

              {/* Image Brief */}
              {post.imageBrief && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs font-medium text-blue-600 mb-1">Image Brief</p>
                  <p className="text-sm text-blue-800">{post.imageBrief}</p>
                </div>
              )}

              {/* Image Approval Actions */}
              <ImageActions
                postId={post.id}
                postingAccount={post.postingAccount}
                assetStatus={post.assetStatus}
                hasImage={hasImages}
                imageBrief={post.imageBrief}
              />
            </div>
          )
        })()}

        {/* Notes */}
        {post.notes && (
          <div className="p-4 sm:p-6 border-t border-gray-100">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Notes
            </h2>
            <div className="bg-yellow-50 rounded-lg p-4 text-yellow-800 text-sm">
              {post.notes}
            </div>
          </div>
        )}
      </div>

      {/* Source Post for Reposts */}
      {post.sourcePost && (
        <SourcePostSection
          sourcePost={post.sourcePost}
          partnerId={partnerId}
        />
      )}

      {/* Related Cross-Platform Posts */}
      <RelatedPostsSection
        currentPostId={post.id}
        relatedPosts={relatedPosts}
        partnerId={partnerId}
      />

      {/* Copy Actions */}
      <PostActions
        postId={post.id}
        partnerId={partnerId}
        postingAccount={post.postingAccount}
        currentCopy={post.copy || ''}
        copyStatus={post.copyStatus}
        relatedPosts={relatedPosts}
      />

      {/* Feedback History */}
      {post.feedback.length > 0 && <FeedbackHistory feedback={post.feedback} />}
    </div>
  )
}
