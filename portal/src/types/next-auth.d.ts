import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      partnerId: string | null
    } & DefaultSession['user']
  }

  interface User {
    role: string
    partnerId: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    partnerId: string | null
  }
}
