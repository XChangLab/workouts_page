interface BadgeProps {
  children: string | number
  variant?: 'default' | 'orange'
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const styles = {
    default: 'bg-gray-100 text-gray-600',
    orange: 'bg-orange-100 text-orange-700',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  )
}
