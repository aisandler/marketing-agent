'use client'

import { useState } from 'react'
import { FeedPost } from './feed-post'
import { PhoneFrame } from './phone-frame'

interface Post {
  id: string
  date: Date | null
  postTopic: string | null
  postingAccount: string
  platform: string | null
  copy: string | null
  copyStatus: string
  images: string | null
  imageUrl: string | null
  imageThumbnail: string | null
  videoUrl: string | null
  videoThumbnail: string | null
  postType: string | null
}

interface SocialFeedProps {
  posts: Post[]
  partnerId: string
  partnerName: string
}

export function SocialFeed({ posts, partnerId, partnerName }: SocialFeedProps) {
  const [viewMode, setViewMode] = useState<'feed' | 'list'>('feed')
  const [platformFilter, setPlatformFilter] = useState<'all' | 'linkedin' | 'instagram'>('all')

  const filteredPosts = posts.filter((post) => {
    if (platformFilter === 'all') return true
    const postPlatform = post.platform?.toLowerCase() || 'linkedin'
    return postPlatform === platformFilter
  })

  // Sort by date
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (!a.date && !b.date) return 0
    if (!a.date) return 1
    if (!b.date) return -1
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  const hasInstagram = posts.some((p) => p.platform?.toLowerCase() === 'instagram')
  const hasLinkedIn = posts.some((p) => !p.platform || p.platform?.toLowerCase() === 'linkedin')

  // Determine dominant platform for phone frame color
  const dominantPlatform = platformFilter !== 'all'
    ? platformFilter
    : hasInstagram && !hasLinkedIn
    ? 'instagram'
    : hasLinkedIn && !hasInstagram
    ? 'linkedin'
    : 'mixed'

  const FeedContent = () => (
    <div className="space-y-4 p-4">
      {/* Feed header */}
      <div className="sticky top-0 bg-gray-100 py-3 -mx-4 px-4 z-10">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg text-gray-900">{partnerName}&apos;s Feed</h2>
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm">
            {sortedPosts.length} posts
          </span>
        </div>
      </div>

      {/* Posts */}
      {sortedPosts.length > 0 ? (
        sortedPosts.map((post) => (
          <FeedPost
            key={post.id}
            postId={post.id}
            partnerId={partnerId}
            platform={post.platform || 'LinkedIn'}
            postingAccount={post.postingAccount}
            date={post.date}
            copy={post.copy}
            images={post.images}
            imageUrl={post.imageUrl}
            imageThumbnail={post.imageThumbnail}
            videoUrl={post.videoUrl}
            videoThumbnail={post.videoThumbnail}
            postTopic={post.postTopic}
            copyStatus={post.copyStatus}
            postType={post.postType}
          />
        ))
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>No posts to display</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        {/* Platform Filter */}
        {hasInstagram && hasLinkedIn && (
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setPlatformFilter('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                platformFilter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setPlatformFilter('linkedin')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                platformFilter === 'linkedin'
                  ? 'bg-white text-[#0a66c2] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
              </svg>
              LinkedIn
            </button>
            <button
              onClick={() => setPlatformFilter('instagram')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                platformFilter === 'instagram'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              Instagram
            </button>
          </div>
        )}

        {/* View Toggle - Only show on larger screens */}
        <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('feed')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'feed'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Feed view"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="List view"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'feed' ? (
        <>
          {/* Mobile: Full-width feed */}
          <div className="lg:hidden">
            <div className="space-y-4">
              {sortedPosts.map((post) => (
                <FeedPost
                  key={post.id}
                  postId={post.id}
                  partnerId={partnerId}
                  platform={post.platform || 'LinkedIn'}
                  postingAccount={post.postingAccount}
                  date={post.date}
                  copy={post.copy}
                  images={post.images}
                  imageUrl={post.imageUrl}
                  imageThumbnail={post.imageThumbnail}
                  videoUrl={post.videoUrl}
                  videoThumbnail={post.videoThumbnail}
                  postTopic={post.postTopic}
                  copyStatus={post.copyStatus}
                  postType={post.postType}
                />
              ))}
            </div>
          </div>

          {/* Desktop: Phone frame mockup */}
          <PhoneFrame platform={dominantPlatform}>
            <FeedContent />
          </PhoneFrame>
        </>
      ) : (
        /* List view */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedPosts.map((post) => (
            <a
              key={post.id}
              href={`/review/${post.id}?partner=${partnerId}`}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-gray-200 hover:shadow transition-all"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                {post.imageUrl || post.imageThumbnail ? (
                  <img
                    src={post.imageThumbnail || post.imageUrl || ''}
                    alt={post.postTopic || 'Post'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded ${
                      post.platform?.toLowerCase() === 'instagram'
                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-pink-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {post.platform || 'LinkedIn'}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      post.copyStatus === 'Approved'
                        ? 'bg-green-100 text-green-700'
                        : post.copyStatus === 'Ready for Review'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {post.copyStatus}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                  {post.postTopic || 'Untitled'}
                </h3>
                <p className="text-xs text-gray-500">
                  {post.date
                    ? new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Not scheduled'}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
