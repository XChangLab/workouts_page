import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export function Card({ children, onClick, className = '' }: CardProps) {
  const base = 'rounded-xl border border-gray-200 bg-white p-4 shadow-sm'
  const interactive = onClick ? 'cursor-pointer hover:border-orange-400 hover:shadow-md transition-all' : ''
  return (
    <div className={`${base} ${interactive} ${className}`} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}>
      {children}
    </div>
  )
}
