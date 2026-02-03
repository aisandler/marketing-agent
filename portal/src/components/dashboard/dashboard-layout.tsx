import { ReactNode } from 'react'

interface DashboardLayoutProps {
  sidebar: ReactNode
  children: ReactNode
}

export function DashboardLayout({ sidebar, children }: DashboardLayoutProps) {
  return (
    <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
      {/* Sidebar - hidden on mobile, sticky on desktop */}
      <div className="hidden lg:block">
        <div className="sticky top-4 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          {sidebar}
        </div>
      </div>

      {/* Main content */}
      <main className="min-w-0">{children}</main>
    </div>
  )
}
