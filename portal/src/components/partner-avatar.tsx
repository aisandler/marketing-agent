import { PARTNER_INITIALS, PARTNER_COLORS, getPartnerIdFromAccount } from '@/lib/constants'

interface PartnerAvatarProps {
  postingAccount: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  xs: 'w-5 h-5 text-[8px]',
  sm: 'w-6 h-6 text-[9px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
}

export function PartnerAvatar({ postingAccount, size = 'sm', className = '' }: PartnerAvatarProps) {
  const partnerId = getPartnerIdFromAccount(postingAccount)
  const initials = PARTNER_INITIALS[partnerId] || postingAccount.charAt(0).toUpperCase()
  const colors = PARTNER_COLORS[partnerId] || { bg: 'bg-gray-500' }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-bold shrink-0 ${colors.bg} ${className}`}
      title={postingAccount}
    >
      {initials}
    </div>
  )
}
