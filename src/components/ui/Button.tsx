import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline'
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const styles = {
    primary: 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-400',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-300',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-300',
  }
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
