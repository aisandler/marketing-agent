'use client'

import { useState } from 'react'

interface ImageFeedbackStats {
  approvals: number
  rejections: number
  approvalRate: number
  recentRejectionReasons: string[]
}

interface ImageFeedbackPanelProps {
  stats: ImageFeedbackStats
}

export function ImageFeedbackPanel({ stats }: ImageFeedbackPanelProps) {
  const [expanded, setExpanded] = useState(false)

  // Group similar feedback themes
  const themes = analyzeThemes(stats.recentRejectionReasons)

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Image Feedback</h3>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <span className="text-2xl font-bold text-green-600">{stats.approvalRate}%</span>
              <p className="text-xs text-gray-500">Approval Rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Stats row */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 bg-green-50 rounded-lg p-3 text-center">
            <span className="text-xl font-bold text-green-700">{stats.approvals}</span>
            <p className="text-xs text-green-600">Approved</p>
          </div>
          <div className="flex-1 bg-red-50 rounded-lg p-3 text-center">
            <span className="text-xl font-bold text-red-700">{stats.rejections}</span>
            <p className="text-xs text-red-600">Rejected</p>
          </div>
        </div>

        {/* Common themes */}
        {themes.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Common Rejection Themes</h4>
            <div className="flex flex-wrap gap-2">
              {themes.map((theme, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full"
                >
                  {theme.label} ({theme.count})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recent rejection reasons */}
        {stats.recentRejectionReasons.length > 0 && (
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
            >
              <svg
                className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Recent feedback ({stats.recentRejectionReasons.length})
            </button>

            {expanded && (
              <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                {stats.recentRejectionReasons.map((reason, i) => (
                  <div
                    key={i}
                    className="p-2 bg-gray-50 rounded text-sm text-gray-700 border-l-2 border-amber-400"
                  >
                    "{reason}"
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {stats.recentRejectionReasons.length === 0 && stats.rejections === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No image feedback yet. Partners will provide feedback when reviewing posts.
          </p>
        )}
      </div>

      {/* Action hint */}
      {themes.length > 0 && (
        <div className="px-4 py-3 bg-blue-50 border-t border-blue-100">
          <p className="text-xs text-blue-700">
            <strong>Tip:</strong> Use these themes to refine prompts in{' '}
            <code className="bg-blue-100 px-1 rounded">automation/image-generation/rules.ts</code>
          </p>
        </div>
      )}
    </div>
  )
}

// Simple theme extraction
function analyzeThemes(reasons: string[]): { label: string; count: number }[] {
  const keywords: Record<string, string[]> = {
    'Too generic': ['generic', 'stock', 'stock photo', 'boring', 'bland'],
    'Not modern': ['modern', 'dated', 'old', 'old-fashioned', 'outdated'],
    'Wrong mood': ['mood', 'tone', 'feel', 'feeling', 'vibe'],
    'Colors off': ['color', 'colours', 'palette', 'brand'],
    'Wrong concept': ['concept', 'topic', 'fit', 'match', 'relevant'],
  }

  const counts: Record<string, number> = {}

  for (const reason of reasons) {
    const lower = reason.toLowerCase()
    for (const [theme, words] of Object.entries(keywords)) {
      if (words.some((word) => lower.includes(word))) {
        counts[theme] = (counts[theme] || 0) + 1
      }
    }
  }

  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}
