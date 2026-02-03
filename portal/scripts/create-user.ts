/**
 * User Management Script for Partner Portal
 *
 * Usage:
 *   npx tsx scripts/create-user.ts create --email user@example.com --name "John Doe" --password "securepass" [--role admin]
 *   npx tsx scripts/create-user.ts list
 *   npx tsx scripts/create-user.ts reset-password --email user@example.com --password "newpassword"
 *   npx tsx scripts/create-user.ts deactivate --email user@example.com
 *   npx tsx scripts/create-user.ts activate --email user@example.com
 *
 * Environment:
 *   Requires DATABASE_URL to be set (or uses .env file)
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
const SALT_ROUNDS = 12

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

async function createUser(
  email: string,
  name: string,
  password: string,
  role: 'user' | 'admin' = 'user',
  partnerId?: string
) {
  const normalizedEmail = email.toLowerCase().trim()

  // Check if user already exists
  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  })

  if (existing) {
    console.error(`Error: User with email ${normalizedEmail} already exists`)
    process.exit(1)
  }

  const passwordHash = await hashPassword(password)

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      name,
      passwordHash,
      role,
      partnerId: partnerId || null,
    },
  })

  console.log(`✓ Created user:`)
  console.log(`  ID: ${user.id}`)
  console.log(`  Email: ${user.email}`)
  console.log(`  Name: ${user.name}`)
  console.log(`  Role: ${user.role}`)
  console.log(`  Partner ID: ${user.partnerId || '(none)'}`)
}

async function listUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      partnerId: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
  })

  if (users.length === 0) {
    console.log('No users found')
    return
  }

  console.log(`\nFound ${users.length} user(s):\n`)
  console.log('─'.repeat(115))
  console.log(
    'Email'.padEnd(30) +
    'Name'.padEnd(20) +
    'Role'.padEnd(8) +
    'Partner'.padEnd(15) +
    'Active'.padEnd(8) +
    'Last Login'
  )
  console.log('─'.repeat(115))

  for (const user of users) {
    const lastLogin = user.lastLoginAt
      ? new Date(user.lastLoginAt).toLocaleString()
      : 'Never'
    console.log(
      user.email.padEnd(30) +
      user.name.padEnd(20) +
      user.role.padEnd(8) +
      (user.partnerId || '-').padEnd(15) +
      (user.isActive ? 'Yes' : 'No').padEnd(8) +
      lastLogin
    )
  }
  console.log('─'.repeat(115))
}

async function resetPassword(email: string, newPassword: string) {
  const normalizedEmail = email.toLowerCase().trim()

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  })

  if (!user) {
    console.error(`Error: User with email ${normalizedEmail} not found`)
    process.exit(1)
  }

  const passwordHash = await hashPassword(newPassword)

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  })

  console.log(`✓ Password reset for ${user.email}`)
}

async function setUserActive(email: string, isActive: boolean) {
  const normalizedEmail = email.toLowerCase().trim()

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  })

  if (!user) {
    console.error(`Error: User with email ${normalizedEmail} not found`)
    process.exit(1)
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isActive },
  })

  console.log(
    `✓ User ${user.email} ${isActive ? 'activated' : 'deactivated'}`
  )
}

async function setUserPartner(email: string, partnerId: string | null) {
  const normalizedEmail = email.toLowerCase().trim()

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  })

  if (!user) {
    console.error(`Error: User with email ${normalizedEmail} not found`)
    process.exit(1)
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { partnerId },
  })

  console.log(
    `✓ User ${user.email} partner ID set to: ${partnerId || '(none)'}`
  )
}

function printUsage() {
  console.log(`
User Management Script for Partner Portal

Commands:
  create           Create a new user
    --email        User's email address (required)
    --name         User's display name (required)
    --password     User's password (required)
    --role         User role: 'user' or 'admin' (default: user)
    --partner      Partner ID from config/partners.json (optional)

  list             List all users

  reset-password   Reset a user's password
    --email        User's email address (required)
    --password     New password (required)

  deactivate       Deactivate a user (prevents login)
    --email        User's email address (required)

  activate         Reactivate a deactivated user
    --email        User's email address (required)

  set-partner      Set a user's partner ID
    --email        User's email address (required)
    --partner      Partner ID from config/partners.json

Examples:
  npx tsx scripts/create-user.ts create --email admin@example.com --name "Admin User" --password "secret123" --role admin
  npx tsx scripts/create-user.ts create --email partner@example.com --name "Partner Name" --password "secret123" --partner partner1
  npx tsx scripts/create-user.ts set-partner --email partner@example.com --partner partner1
  npx tsx scripts/create-user.ts list
  npx tsx scripts/create-user.ts reset-password --email admin@example.com --password "newpassword"
  `)
}

function parseArgs(args: string[]): Record<string, string> {
  const result: Record<string, string> = {}
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2)
      const value = args[i + 1]
      if (value && !value.startsWith('--')) {
        result[key] = value
        i++
      }
    }
  }
  return result
}

async function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  if (!command || command === '--help' || command === '-h') {
    printUsage()
    process.exit(0)
  }

  const options = parseArgs(args.slice(1))

  try {
    switch (command) {
      case 'create': {
        const { email, name, password, role, partner } = options
        if (!email || !name || !password) {
          console.error('Error: --email, --name, and --password are required')
          process.exit(1)
        }
        if (role && role !== 'user' && role !== 'admin') {
          console.error('Error: --role must be "user" or "admin"')
          process.exit(1)
        }
        await createUser(email, name, password, (role as 'user' | 'admin') || 'user', partner)
        break
      }

      case 'list':
        await listUsers()
        break

      case 'reset-password': {
        const { email, password } = options
        if (!email || !password) {
          console.error('Error: --email and --password are required')
          process.exit(1)
        }
        await resetPassword(email, password)
        break
      }

      case 'deactivate': {
        const { email } = options
        if (!email) {
          console.error('Error: --email is required')
          process.exit(1)
        }
        await setUserActive(email, false)
        break
      }

      case 'activate': {
        const { email } = options
        if (!email) {
          console.error('Error: --email is required')
          process.exit(1)
        }
        await setUserActive(email, true)
        break
      }

      case 'set-partner': {
        const { email, partner } = options
        if (!email) {
          console.error('Error: --email is required')
          process.exit(1)
        }
        await setUserPartner(email, partner || null)
        break
      }

      default:
        console.error(`Unknown command: ${command}`)
        printUsage()
        process.exit(1)
    }
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
