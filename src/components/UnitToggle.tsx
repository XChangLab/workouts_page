import type { UnitSystem } from '../types/segment'

interface UnitToggleProps {
  system: UnitSystem
  onToggle: () => void
}

export function UnitToggle({ system, onToggle }: UnitToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={`Switch to ${system === 'metric' ? 'imperial' : 'metric'} units`}
      className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm hover:border-orange-400 transition-colors"
    >
      <span className={system === 'metric' ? 'text-orange-500 font-semibold' : ''}>km</span>
      <span className="text-gray-300">/</span>
      <span className={system === 'imperial' ? 'text-orange-500 font-semibold' : ''}>mi</span>
    </button>
  )
}
