/**
 * Partner & Brand Constants
 *
 * Loads partner configuration from config/partners.json
 * Loads brand configuration from config/brand.json
 * This file provides runtime-loaded constants for the partner portal
 */

import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

// Type definitions for partner config
interface PartnerConfig {
  accounts: Record<string, string[]>
  names: Record<string, string>
  initials: Record<string, string>
  colors: Record<string, { border: string; bg: string; text: string }>
  emails?: Record<string, string>
}

// Type definitions for brand config
interface BrandConfig {
  name: string
  tagline: string
  industry?: string
  location?: string
}

// Default config if file not found (for development)
const defaultConfig: PartnerConfig = {
  accounts: {
    partner1: ['Partner1 LinkedIn'],
    company: ['Company LinkedIn'],
  },
  names: {
    all: 'All Partners',
    partner1: 'Partner One',
    company: 'Company',
  },
  initials: {
    partner1: 'P1',
    company: 'CO',
  },
  colors: {
    partner1: { border: 'border-l-blue-500', bg: 'bg-blue-500', text: 'text-blue-600' },
    company: { border: 'border-l-emerald-500', bg: 'bg-emerald-500', text: 'text-emerald-600' },
  },
}

/**
 * Load partner configuration from config/partners.json
 */
function loadPartnerConfig(): PartnerConfig {
  // Try multiple paths - portal can be run from different locations
  const possiblePaths = [
    resolve(__dirname, '../../../../config/partners.json'),  // From src/lib
    resolve(process.cwd(), 'config/partners.json'),          // From project root
    resolve(process.cwd(), '../config/partners.json'),       // From portal dir
  ]

  for (const configPath of possiblePaths) {
    if (existsSync(configPath)) {
      try {
        const content = readFileSync(configPath, 'utf-8')
        const parsed = JSON.parse(content) as PartnerConfig

        // Ensure 'all' is in names
        if (!parsed.names.all) {
          parsed.names.all = 'All Partners'
        }

        // Ensure colors have all required properties
        for (const [key, color] of Object.entries(parsed.colors)) {
          if (!color.bg) {
            parsed.colors[key].bg = color.border.replace('border-l-', 'bg-')
          }
          if (!color.text) {
            parsed.colors[key].text = color.border.replace('border-l-', 'text-').replace('-500', '-600')
          }
        }

        return parsed
      } catch (error) {
        console.warn(`Warning: Could not parse ${configPath}, using defaults`)
      }
    }
  }

  console.warn('Warning: config/partners.json not found, using default partner config')
  return defaultConfig
}

/**
 * Load brand configuration from config/brand.json
 */
function loadBrandConfig(): BrandConfig {
  const defaultBrand: BrandConfig = {
    name: 'Partner Portal',
    tagline: '',
  }

  const possiblePaths = [
    resolve(__dirname, '../../../../config/brand.json'),
    resolve(process.cwd(), 'config/brand.json'),
    resolve(process.cwd(), '../config/brand.json'),
  ]

  for (const configPath of possiblePaths) {
    if (existsSync(configPath)) {
      try {
        const content = readFileSync(configPath, 'utf-8')
        const parsed = JSON.parse(content)
        return {
          name: parsed.name && !parsed.name.startsWith('{{') ? parsed.name : defaultBrand.name,
          tagline: parsed.tagline && !parsed.tagline.startsWith('{{') ? parsed.tagline : '',
          industry: parsed.industry && !parsed.industry.startsWith('{{') ? parsed.industry : undefined,
          location: parsed.location && !parsed.location.startsWith('{{') ? parsed.location : undefined,
        }
      } catch {
        // Fall through to default
      }
    }
  }

  return defaultBrand
}

// Load config at module initialization
const partnerConfig = loadPartnerConfig()
const brandConfig = loadBrandConfig()

// Export brand constants
export const BRAND_NAME = brandConfig.name
export const BRAND_TAGLINE = brandConfig.tagline
export const BRAND_INDUSTRY = brandConfig.industry || ''
export const BRAND_LOCATION = brandConfig.location || ''
export const PORTAL_NAME = BRAND_NAME ? `${BRAND_NAME} Portal` : 'Partner Portal'

// Export partner constants
export const PARTNER_ACCOUNTS: Record<string, string[]> = partnerConfig.accounts

export const PARTNER_NAMES: Record<string, string> = partnerConfig.names

export const PARTNER_INITIALS: Record<string, string> = partnerConfig.initials

export const PARTNER_COLORS: Record<string, { border: string; bg: string; text: string }> = partnerConfig.colors

/**
 * Get partner ID from posting account name
 */
export function getPartnerIdFromAccount(postingAccount: string): string {
  const accountLower = postingAccount.toLowerCase()

  // First, try exact match
  for (const [partnerId, accounts] of Object.entries(PARTNER_ACCOUNTS)) {
    if (accounts.some(account => account.toLowerCase() === accountLower)) {
      return partnerId
    }
  }

  // Fallback: try partial match on partner ID
  for (const partnerId of Object.keys(PARTNER_ACCOUNTS)) {
    if (accountLower.includes(partnerId.toLowerCase())) {
      return partnerId
    }
  }

  // Final fallback: return first non-partner account (likely company)
  const partnerIds = Object.keys(PARTNER_ACCOUNTS)
  return partnerIds[partnerIds.length - 1] || 'company'
}

/**
 * Get all partner IDs
 */
export function getAllPartnerIds(): string[] {
  return Object.keys(PARTNER_ACCOUNTS)
}

/**
 * Check if a partner ID is valid
 */
export function isValidPartnerId(partnerId: string): boolean {
  return partnerId === 'all' || partnerId in PARTNER_ACCOUNTS
}
