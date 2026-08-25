interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className}`} aria-hidden="true" />
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 border-b border-gray-100 py-3">
      <Skeleton className="h-4 w-2/5" />
      <Skeleton className="h-4 w-1/6" />
      <Skeleton className="h-4 w-1/6" />
      <Skeleton className="h-4 w-1/6" />
    </div>
  )
}
