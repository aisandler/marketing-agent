'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { PARTNER_NAMES } from '@/lib/constants'

interface PartnerSelectorProps {
  compact?: boolean
}

export function PartnerSelector({ compact = false }: PartnerSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPartner = searchParams.get('partner') || ''

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const partnerId = e.target.value
    if (partnerId) {
      // Preserve existing search params when changing partner
      const week = searchParams.get('week') || ''
      const view = searchParams.get('view') || ''
      const channel = searchParams.get('channel') || ''

      const params = new URLSearchParams()
      params.set('partner', partnerId)
      if (week) params.set('week', week)
      if (view) params.set('view', view)
      if (channel) params.set('channel', channel)

      router.push(`/review?${params.toString()}`)
    } else {
      router.push('/')
    }
  }

  if (compact) {
    return (
      <select
        value={currentPartner}
        onChange={handleChange}
        className="px-2 py-1.5 text-sm border border-gray-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
      >
        {Object.entries(PARTNER_NAMES).map(([id, name]) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
    )
  }

  return (
    <select
      value={currentPartner}
      onChange={handleChange}
      className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent text-sm"
    >
      <option value="">Select partner...</option>
      {Object.entries(PARTNER_NAMES).map(([id, name]) => (
        <option key={id} value={id}>
          {name}
        </option>
      ))}
    </select>
  )
}
