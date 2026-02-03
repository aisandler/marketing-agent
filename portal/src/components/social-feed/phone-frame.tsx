'use client'

import { ReactNode } from 'react'

interface PhoneFrameProps {
  children: ReactNode
  platform?: 'linkedin' | 'instagram' | 'mixed'
}

export function PhoneFrame({ children, platform = 'mixed' }: PhoneFrameProps) {
  const platformColors = {
    linkedin: 'from-blue-600 to-blue-800',
    instagram: 'from-purple-600 via-pink-500 to-orange-400',
    mixed: 'from-slate-800 to-slate-900',
  }

  return (
    <div className="hidden lg:flex items-center justify-center py-8">
      <div className="relative">
        {/* Phone bezel */}
        <div
          className={`relative w-[375px] h-[812px] bg-gradient-to-b ${platformColors[platform]} rounded-[3rem] p-2 shadow-2xl`}
        >
          {/* Inner frame */}
          <div className="absolute inset-2 bg-black rounded-[2.5rem] overflow-hidden">
            {/* Dynamic Island / Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-8 bg-black rounded-b-3xl z-20 flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-800" />
              <div className="w-12 h-3 rounded-full bg-gray-800" />
            </div>

            {/* Status bar */}
            <div className="absolute top-0 left-0 right-0 h-12 px-6 flex items-center justify-between text-white text-xs font-medium z-10">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
                </svg>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 4h-3V2h-4v2H7v18h10V4zm-4 16h-2v-2h2v2zm0-4h-2V8h2v8z" />
                </svg>
              </div>
            </div>

            {/* Screen content */}
            <div className="absolute inset-0 top-12 bg-gray-100 overflow-y-auto scrollbar-hide">
              <div className="min-h-full pb-20">
                {children}
              </div>
            </div>

            {/* Home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
          </div>
        </div>

        {/* Reflection effect */}
        <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
      </div>
    </div>
  )
}
