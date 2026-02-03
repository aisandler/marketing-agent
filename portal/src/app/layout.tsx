import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { UserMenu } from '@/components/user-menu'
import { NavSyncStatus } from '@/components/nav-sync-status'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Partner Portal',
  description: 'Review and approve your social media content',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-soft-surface-100`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            {/* Premium Header with gradient */}
            <header className="sticky top-0 z-50 bg-white border-b border-soft-surface-300/60 shadow-soft-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 sm:h-16">
                  {/* Logo with gradient text */}
                  <a
                    href="/"
                    className="group flex items-center gap-2 font-bold text-lg sm:text-xl"
                  >
                    {/* Gradient accent bar */}
                    <span className="w-1 h-6 rounded-full bg-soft-gradient" />
                    <span className="soft-gradient-text transition-opacity duration-200 group-hover:opacity-80">
                      Portal
                    </span>
                  </a>

                  {/* Navigation and User Menu */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    <nav className="hidden sm:flex items-center gap-1">
                      <a
                        href="/"
                        className="soft-btn-ghost text-sm"
                      >
                        Home
                      </a>
                      <a
                        href="/admin"
                        className="soft-btn-ghost text-sm"
                      >
                        Admin
                      </a>
                    </nav>
                    <div className="relative">
                      <NavSyncStatus />
                    </div>
                    <UserMenu />
                  </div>
                </div>
              </div>
            </header>

          {/* Main content area */}
          <main className="flex-1 py-5 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            {children}
          </main>

            {/* Subtle footer */}
            <footer className="py-4 text-center text-xs text-soft-text-muted border-t border-soft-surface-300/40">
              <span className="soft-gradient-text font-medium">Partner Portal</span>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
