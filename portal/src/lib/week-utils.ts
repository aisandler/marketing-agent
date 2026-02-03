/**
 * Week utilities for business week navigation (Monday-Friday)
 */

export interface WeekRange {
  start: Date // Monday
  end: Date // Friday
  label: string // "Jan 20 - 24"
  weekParam: string // "2026-01-20" (Monday's date)
}

/**
 * Parse a date string (YYYY-MM-DD) safely in local timezone
 * Avoids timezone issues that cause dates to shift
 */
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/**
 * Format a date as YYYY-MM-DD for URL params
 */
export function formatDateParam(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Get the Monday of the week containing the given date
 */
export function getMonday(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay()
  // Sunday = 0, Monday = 1, etc.
  // If Sunday (0), go back 6 days. Otherwise go back (day - 1) days.
  const diff = day === 0 ? 6 : day - 1
  d.setDate(d.getDate() - diff)
  return d
}

/**
 * Get the Friday of the week containing the given date
 */
export function getFriday(date: Date): Date {
  const monday = getMonday(date)
  const friday = new Date(monday)
  friday.setDate(friday.getDate() + 4)
  return friday
}

/**
 * Get the week range for a given date
 */
export function getWeekRange(date: Date): WeekRange {
  const start = getMonday(date)
  const end = getFriday(date)

  const formatOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  const startStr = start.toLocaleDateString('en-US', formatOptions)
  const endStr = end.toLocaleDateString('en-US', { day: 'numeric' })

  // If same month, show "Jan 20 - 24", otherwise "Jan 27 - Feb 1"
  const sameMonth = start.getMonth() === end.getMonth()
  const label = sameMonth
    ? `${startStr} - ${endStr}`
    : `${startStr} - ${end.toLocaleDateString('en-US', formatOptions)}`

  return {
    start,
    end,
    label,
    weekParam: formatDateParam(start),
  }
}

/**
 * Get the previous week's Monday
 */
export function getPreviousWeek(date: Date): Date {
  const monday = getMonday(date)
  const prevMonday = new Date(monday)
  prevMonday.setDate(prevMonday.getDate() - 7)
  return prevMonday
}

/**
 * Get the next week's Monday
 */
export function getNextWeek(date: Date): Date {
  const monday = getMonday(date)
  const nextMonday = new Date(monday)
  nextMonday.setDate(nextMonday.getDate() + 7)
  return nextMonday
}

/**
 * Check if a date falls within a business week (Mon-Fri)
 */
export function isInWeek(date: Date, weekStart: Date): boolean {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const start = getMonday(weekStart)
  const end = getFriday(weekStart)
  end.setHours(23, 59, 59, 999)
  return d >= start && d <= end
}

/**
 * Check if the given week is the current week
 */
export function isCurrentWeek(weekStart: Date): boolean {
  const today = new Date()
  const currentMonday = getMonday(today)
  const targetMonday = getMonday(weekStart)
  return currentMonday.getTime() === targetMonday.getTime()
}

/**
 * Get the day of week label (Monday, Tuesday, etc.)
 */
export function getDayLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' })
}

/**
 * Get business days (Mon-Fri) for a week
 */
export function getBusinessDays(weekStart: Date): Date[] {
  const monday = getMonday(weekStart)
  const days: Date[] = []
  for (let i = 0; i < 5; i++) {
    const day = new Date(monday)
    day.setDate(day.getDate() + i)
    days.push(day)
  }
  return days
}

/**
 * Format a date for display
 */
export function formatDayHeader(date: Date): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)

  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  if (d.getTime() === today.getTime()) {
    return `Today - ${dayName}, ${dateStr}`
  }

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (d.getTime() === tomorrow.getTime()) {
    return `Tomorrow - ${dayName}, ${dateStr}`
  }

  return `${dayName}, ${dateStr}`
}
