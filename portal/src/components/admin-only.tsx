'use client'

import { useSession } from 'next-auth/react'

interface AdminOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Only renders children if the current user has admin role
 */
export function AdminOnly({ children, fallback = null }: AdminOnlyProps) {
  const { data: session, status } = useSession()

  // Still loading
  if (status === 'loading') {
    return null
  }

  // Not admin
  if (session?.user?.role !== 'admin') {
    return <>{fallback}</>
  }

  return <>{children}</>
}
