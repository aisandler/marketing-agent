'use client'

import { DashboardStats } from './dashboard-stats'
import { PARTNER_NAMES, PARTNER_ACCOUNTS, PARTNER_INITIALS, PARTNER_COLORS } from '@/lib/constants'
import {
  getWeekRange,
  getPreviousWeek,
  getNextWeek,
  isCurrentWeek,
  formatDateParam,
} from '@/lib/week-utils'

interface DashboardSidebarProps {
  partnerId: string
  partnerName: string
  weekParam: string // Pass the week param string directly to avoid timezone issues
  stats: {
    draft: number
    needsReview: number
    needsRevision: number
    approved: number
  }
  platform: string
  statusFilter?: string
  isPreview?: boolean
}

// Parse date string safely without timezone conversion
function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function DashboardSidebar({
  partnerId,
  partnerName,
  weekParam,
  stats,
  platform,
  statusFilter = 'all',
  isPreview = false,
}: DashboardSidebarProps) {
  const accounts = PARTNER_ACCOUNTS[partnerId] || []
  // Parse the week param string directly to avoid timezone serialization issues
  const weekStart = parseLocalDate(weekParam)
  const week = getWeekRange(weekStart)
  const prevWeek = getPreviousWeek(weekStart)
  const nextWeek = getNextWeek(weekStart)
  const isCurrent = isCurrentWeek(weekStart)

  const prevParam = formatDateParam(prevWeek)
  const nextParam = formatDateParam(nextWeek)
  const todayParam = formatDateParam(new Date())

  const colors = PARTNER_COLORS[partnerId] || { bg: 'bg-soft-gradient', text: 'text-soft-primary' }
  const initials = PARTNER_INITIALS[partnerId] || (partnerId === 'all' ? 'ALL' : partnerName.charAt(0))

  // Build URL helper - always include partner param to preserve selection
  const buildUrl = (params: Record<string, string>) => {
    const searchParams = new URLSearchParams(params)
    searchParams.set('partner', partnerId)
    return `/?${searchParams.toString()}`
  }

  return (
    <aside className="space-y-6">
      {/* Partner Profile with dropdown */}
      <div className="text-center">
        <div
          className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white text-xl font-bold ${colors.bg}`}
        >
          {initials}
        </div>

        {/* Partner name with dropdown */}
        <details className="relative mt-3 group">
          <summary className="flex items-center justify-center gap-2 cursor-pointer list-none">
            <h2 className="text-lg font-semibold text-gray-900">{partnerName}</h2>
            <svg
              className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 max-h-64 overflow-y-auto">
            <a
              href={`/?partner=all&week=${week.weekParam}&platform=${platform}`}
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
                    href={`/?partner=${id}&week=${week.weekParam}&platform=${platform}`}
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

        <p className="text-sm text-gray-500 mt-1">
          {partnerId === 'all'
            ? 'All posting accounts'
            : accounts.length === 1
            ? accounts[0]
            : `${accounts.length} accounts`}
        </p>

        {/* Preview indicator */}
        {isPreview && (
          <div className="mt-2 inline-block bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
            <span className="text-xs text-blue-700 font-medium">Preview mode</span>
          </div>
        )}
      </div>

      {/* Stats - clickable to filter */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
          Post Status
        </h3>
        <DashboardStats
          draft={stats.draft}
          needsReview={stats.needsReview}
          needsRevision={stats.needsRevision}
          approved={stats.approved}
          activeFilter={statusFilter as 'all' | 'draft' | 'review' | 'revision' | 'approved'}
          onFilterChange={(filter) => {
            const url = buildUrl({ week: week.weekParam, platform, status: filter })
            window.location.href = url
          }}
        />
      </div>

      {/* Week Navigation */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
          Week
        </h3>
        <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 shadow-sm">
          <a
            href={buildUrl({ week: prevParam, platform })}
            className="p-2 hover:bg-gray-50 rounded-l-lg transition-colors"
            title="Previous week"
          >
            <svg
              className="w-4 h-4 text-gray-500"
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
          </a>
          <div className="flex-1 px-2 py-1.5 text-sm font-medium text-gray-900 text-center">
            {week.label}
          </div>
          <a
            href={buildUrl({ week: nextParam, platform })}
            className="p-2 hover:bg-gray-50 rounded-r-lg transition-colors"
            title="Next week"
          >
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
        {!isCurrent && (
          <a
            href={buildUrl({ week: todayParam, platform })}
            className="block mt-2 text-center text-xs font-medium text-blue-600 hover:text-blue-800"
          >
            This Week
          </a>
        )}
      </div>

      {/* Platform Filter */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
          Platform
        </h3>
        <div className="flex flex-wrap gap-1">
          <a
            href={buildUrl({ week: week.weekParam, platform: 'all' })}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              platform === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </a>
          <a
            href={buildUrl({ week: week.weekParam, platform: 'linkedin' })}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              platform === 'linkedin'
                ? 'bg-[#0a66c2] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
            </svg>
            LI
          </a>
          <a
            href={buildUrl({ week: week.weekParam, platform: 'instagram' })}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              platform === 'instagram'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            IG
          </a>
        </div>
      </div>

      {/* Quick Links */}
      <div className="space-y-2 pt-4 border-t border-gray-200">
        <a
          href={`/review?partner=${partnerId}&view=calendar&week=${week.weekParam}`}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          View Calendar
        </a>
      </div>
    </aside>
  )
}
