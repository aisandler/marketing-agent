import { Suspense } from 'react'
import { auth } from '@/auth'
import { PARTNER_NAMES, PARTNER_ACCOUNTS, PARTNER_INITIALS, PARTNER_COLORS } from '@/lib/constants'
import {
  getPartnerStats,
  getWeekPostsForPartner,
  getSyncStatus,
  syncIfStale,
} from '@/lib/actions'
import { parseLocalDate, getWeekRange } from '@/lib/week-utils'
import {
  DashboardLayout,
  DashboardSidebar,
  WeekPostsList,
  DashboardStatsBar,
} from '@/components/dashboard'
import { AdminSyncControls } from '@/components/admin-sync-controls'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface HomePageProps {
  searchParams: Promise<{
    partner?: string
    week?: string
    platform?: string
    status?: string
  }>
}

// Mobile header component - simplified 3-row layout
function MobileHeader({
  partnerId,
  partnerName,
  stats,
  weekLabel,
  weekParam,
  platform,
}: {
  partnerId: string
  partnerName: string
  stats: { draft: number; needsReview: number; needsRevision: number; approved: number }
  weekLabel: string
  weekParam: string
  platform: string
}) {
  const colors = PARTNER_COLORS[partnerId] || { bg: 'bg-soft-gradient', text: 'text-soft-primary' }
  const initials = PARTNER_INITIALS[partnerId] || partnerName.charAt(0)

  // Always include partner param to preserve selection
  const buildUrl = (params: Record<string, string>) => {
    const searchParams = new URLSearchParams(params)
    searchParams.set('partner', partnerId)
    return `/?${searchParams.toString()}`
  }

  return (
    <div className="lg:hidden space-y-3 mb-6">
      {/* Row 1: Partner selector dropdown */}
      <details className="relative group">
        <summary className="flex items-center gap-3 cursor-pointer list-none p-2 -m-2 rounded-lg hover:bg-gray-50 transition-colors">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${colors.bg}`}
          >
            {initials}
          </div>
          <h1 className="font-semibold text-gray-900 flex-1 truncate">{partnerName}</h1>
          <svg
            className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 max-h-64 overflow-y-auto">
          <a
            href={`/?partner=all&week=${weekParam}&platform=${platform}`}
            className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${
              partnerId === 'all' ? 'bg-gray-100' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-soft-gradient flex items-center justify-center text-white text-xs font-bold">
              ALL
            </div>
            <span className="text-sm font-medium text-gray-900">All Partners</span>
          </a>
          {Object.entries(PARTNER_NAMES)
            .filter(([id]) => id !== 'all')
            .map(([id, name]) => {
              const pColors = PARTNER_COLORS[id] || { bg: 'bg-gray-500' }
              const pInitials = PARTNER_INITIALS[id] || name.charAt(0)
              return (
                <a
                  key={id}
                  href={`/?partner=${id}&week=${weekParam}&platform=${platform}`}
                  className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                    partnerId === id ? 'bg-gray-100' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${pColors.bg}`}
                  >
                    {pInitials}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{name}</span>
                </a>
              )
            })}
        </div>
      </details>

      {/* Row 2: Week navigation + Platform tabs */}
      <div className="flex items-center gap-2">
        {/* Week nav (compact) */}
        <div className="flex items-center bg-gray-100 rounded-lg">
          <a
            href={buildUrl({ week: getPrevWeekParam(weekParam), platform })}
            className="p-1.5 hover:bg-gray-200 rounded-l-lg transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          <span className="px-2 text-xs font-medium text-gray-700 whitespace-nowrap">{weekLabel}</span>
          <a
            href={buildUrl({ week: getNextWeekParam(weekParam), platform })}
            className="p-1.5 hover:bg-gray-200 rounded-r-lg transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Platform tabs (compact) */}
        <div className="flex items-center gap-1 ml-auto">
          <a
            href={buildUrl({ week: weekParam, platform: 'all' })}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              platform === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </a>
          <a
            href={buildUrl({ week: weekParam, platform: 'linkedin' })}
            className={`p-1.5 rounded-lg transition-colors ${
              platform === 'linkedin'
                ? 'bg-[#0a66c2] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="LinkedIn"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
            </svg>
          </a>
          <a
            href={buildUrl({ week: weekParam, platform: 'instagram' })}
            className={`p-1.5 rounded-lg transition-colors ${
              platform === 'instagram'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Instagram"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Row 3: Stats bar */}
      <DashboardStatsBar
        draft={stats.draft}
        needsReview={stats.needsReview}
        needsRevision={stats.needsRevision}
        approved={stats.approved}
      />
    </div>
  )
}

// Helper to get prev/next week params
function getPrevWeekParam(weekParam: string): string {
  const date = parseLocalDate(weekParam)
  date.setDate(date.getDate() - 7)
  return formatDateParam(date)
}

function getNextWeekParam(weekParam: string): string {
  const date = parseLocalDate(weekParam)
  date.setDate(date.getDate() + 7)
  return formatDateParam(date)
}

function formatDateParam(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Main dashboard content
async function DashboardContent({
  partnerId,
  weekParam,
  platform,
  statusFilter,
  isPreview,
}: {
  partnerId: string
  weekParam: string
  platform: string
  statusFilter: string
  isPreview: boolean
}) {
  // Trigger background sync if stale
  syncIfStale(5).catch(() => {})

  const weekStart = parseLocalDate(weekParam)
  const week = getWeekRange(weekStart)

  const [stats, postsByDay, syncStatus] = await Promise.all([
    getPartnerStats(partnerId),
    getWeekPostsForPartner(partnerId, weekStart),
    getSyncStatus(),
  ])

  const partnerName = PARTNER_NAMES[partnerId] || 'All Partners'

  return (
    <>
      {/* Mobile header */}
      <MobileHeader
        partnerId={partnerId}
        partnerName={partnerName}
        stats={stats}
        weekLabel={week.label}
        weekParam={week.weekParam}
        platform={platform}
      />

      {/* Desktop title */}
      <div className="hidden lg:block mb-6">
        <h1 className="text-2xl font-bold text-gray-900">This Week: {week.label}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {postsByDay.reduce((sum, d) => sum + d.posts.length, 0)} posts scheduled
        </p>
      </div>

      <DashboardLayout
        sidebar={
          <DashboardSidebar
            partnerId={partnerId}
            partnerName={partnerName}
            weekParam={week.weekParam}
            stats={stats}
            platform={platform}
            statusFilter={statusFilter}
            isPreview={isPreview}
          />
        }
      >
        <WeekPostsList postsByDay={postsByDay} partnerId={partnerId} platform={platform} statusFilter={statusFilter} />

        {/* Sync status (admin only) */}
        <div className="mt-8">
          <AdminSyncControls
            lastSync={syncStatus.lastSync}
            pendingPushCount={syncStatus.pendingPushCount}
          />
        </div>
      </DashboardLayout>
    </>
  )
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const session = await auth()
  const params = await searchParams

  // Get partner from: 1) query param, 2) session, 3) default to 'all'
  const sessionPartnerId = session?.user?.partnerId
  const queryPartnerId = params.partner

  // Priority: query param > session partnerId > default 'all'
  let partnerId: string
  let isPreview = false

  if (queryPartnerId && (queryPartnerId === 'all' || PARTNER_ACCOUNTS[queryPartnerId])) {
    // Query param takes precedence (for previewing other partners)
    partnerId = queryPartnerId
    isPreview = queryPartnerId !== sessionPartnerId
  } else if (sessionPartnerId && PARTNER_ACCOUNTS[sessionPartnerId]) {
    // User's assigned partner
    partnerId = sessionPartnerId
  } else {
    // Default to 'all' for users without an assigned partner
    partnerId = 'all'
    isPreview = true
  }

  // Parse params
  const today = new Date()
  const weekParam = params.week || formatDateParam(today)
  const platform = params.platform || 'all'
  const statusFilter = params.status || 'all'

  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
            <div className="hidden lg:block h-96 bg-gray-100 rounded-xl animate-pulse" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <DashboardContent
        partnerId={partnerId}
        weekParam={weekParam}
        platform={platform}
        statusFilter={statusFilter}
        isPreview={isPreview}
      />
    </Suspense>
  )
}
